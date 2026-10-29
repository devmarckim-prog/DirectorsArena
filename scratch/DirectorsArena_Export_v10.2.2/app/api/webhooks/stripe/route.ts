import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!signature || !webhookSecret) {
      throw new Error('Missing signature or webhook secret');
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`[Stripe Webhook] Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  // 1. 중복 처리 방지 (Idempotency Check)
  const { data: existingEvent } = await supabase
    .from('stripe_events')
    .select('event_id')
    .eq('event_id', event.id)
    .single();

  if (existingEvent) {
    return NextResponse.json({ received: true, message: 'Already processed' });
  }

  // 2. 이벤트 처리
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const userId = session.metadata?.userId;
    const amountStr = session.metadata?.credits;

    if (userId && amountStr) {
      const amount = parseInt(amountStr);
      
      // Atomic Update & Transaction Log via SQL function
      // (기존에 만든 deduct_user_credits와 유사하지만 충전용이므로 직접 update 하거나 충전용 RPC를 사용)
      const { error: updateError } = await supabase.rpc('grant_user_credits', {
        p_user_id: userId,
        p_amount: amount,
        p_reason: 'purchase',
        p_stripe_event_id: event.id
      });

      if (updateError) {
        console.error('[Stripe Webhook] DB Update Failed:', updateError);
        return NextResponse.json({ error: 'DB Update Failed' }, { status: 500 });
      }

      // 처리된 이벤트 기록
      await supabase.from('stripe_events').insert({ event_id: event.id });
    }
  }

  return NextResponse.json({ received: true });
}
