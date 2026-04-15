import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isRateLimited, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// [SECURITY] Input validation schema
const RewriteRequestSchema = z.object({
  originalText: z.string().min(1, "originalText cannot be empty").max(2000, "Selection too large (max 2000 chars)"),
  contextBefore: z.string().max(300).optional().default(''),
  contextAfter: z.string().max(300).optional().default(''),
  userInstruction: z.string().min(1, "Instruction required").max(500, "Instruction too long"),
});

// [SECURITY] Allowed model IDs whitelist
const ALLOWED_MODELS = ['claude-sonnet-4-6', 'claude-sonnet-3-5', 'claude-opus-4-5', 'claude-haiku-4-5-20251001'];

export async function POST(req: Request) {
  // [SECURITY] IP-based rate limiting: 10 rewrites per minute per IP
  const ip = getClientIp(req);
  if (isRateLimited(ip, RATE_LIMITS.REWRITE)) {
    return NextResponse.json(
      { success: false, error: '요청 한도를 초과했습니다. 1분 후 다시 시도하세요.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  try {
    // [SECURITY] Strict Zod validation — rejects oversized payloads early
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    const validation = RewriteRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { originalText, contextBefore, contextAfter, userInstruction } = validation.data;

    const settingsResult = await supabase.from('admin_settings').select('model_id_primary, prompt_scenario_rewrite').limit(1).single();
    const settings = settingsResult.data;

    // [SECURITY] Validate model ID before passing to Anthropic SDK
    const rawModel = settings?.model_id_primary ?? 'claude-sonnet-4-6';
    const modelId = ALLOWED_MODELS.includes(rawModel) ? rawModel : 'claude-sonnet-4-6';
    const rewritePrompt = settings?.prompt_scenario_rewrite ?? '당신은 메인 작가를 보조하는 뛰어난 보조 작가입니다. 주어진 원본 텍스트와 주변 문맥을 파악한 뒤, 작가의 [요구사항]에 맞게 원본 텍스트를 정확히 재작성하십시오. 다른 부연 설명이나 인사말 없이 오직 수정된 텍스트만 출력하십시오.';

    const systemPrompt = [
      '<system_instructions>',
      rewritePrompt,
      '</system_instructions>',
      '',
      '<context>',
      `[이전 문맥]: ${contextBefore || '(없음)'}`,
      '',
      `[AI가 수정해야 할 대상 텍스트]:\n${originalText}`,
      '',
      `[이후 문맥]: ${contextAfter || '(없음)'}`,
      '</context>',
      '',
      `<user_instruction>\n${userInstruction}\n</user_instruction>`,
    ].join('\n');

    // [SECURITY] 30 second timeout for rewrite (cheap model, fast)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const { text } = await generateText({
        model: anthropic(modelId),
        system: systemPrompt,
        prompt: '위 <context>의 대상 텍스트를 파악하고, <user_instruction>의 지시사항에 맞게 완전히 새롭게 다시 작성하여 최종 텍스트만 리턴하십시오.',
        abortSignal: controller.signal,
      });
      clearTimeout(timeoutId);
      return NextResponse.json({ success: true, text });
    } catch (aiErr: any) {
      clearTimeout(timeoutId);
      if (aiErr?.name === 'AbortError') {
        return NextResponse.json({ success: false, error: '재작성 타임아웃 (30초). 더 짧은 텍스트로 시도해보세요.' }, { status: 504 });
      }
      throw aiErr;
    }

  } catch (error: any) {
    console.error("Rewrite Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
