"use server";

import { stripe } from "@/lib/stripe/server";
import { authGuard } from "@/lib/auth/guard";
import { headers } from "next/headers";

export async function createCheckoutSession(priceId: string, credits: number) {
  const { user, response } = await authGuard();
  if (!user) return { error: "Unauthorized" };

  const origin = (await headers()).get("origin");

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/project-list?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        credits: credits.toString(),
      },
      customer_email: user.email,
    });

    return { url: session.url };
  } catch (error: any) {
    console.error("[Stripe] Session Creation Failed:", error);
    return { error: error.message };
  }
}
