import { createAdminClient } from "@/lib/supabase/server";

export type CreditAction = 'generate' | 'rewrite' | 'similar' | 'script';

/**
 * 원자적(Atomic) 크레딧 차감 유틸리티
 * @param userId 차감할 유저 ID
 * @param action 차감 사유 (어드민 설정에서 비용 조회)
 * @returns { success: boolean, remainingCredits?: number, error?: string }
 */
export async function deductCredits(userId: string, action: CreditAction) {
  const supabase = createAdminClient();

  // 1. 어드민 설정 조회 (안전하게 전체 조회 후 필드 접근)
  const { data: settings } = await supabase
    .from('admin_settings')
    .select('*')
    .single();

  const costMap: Record<CreditAction, number> = {
    generate: settings?.cost_generate ?? 10,
    rewrite: settings?.cost_rewrite ?? 3,
    similar: settings?.cost_similar ?? 5,
    script: settings?.cost_script ?? 7, 
  };

  const amountToDeduct = costMap[action];

  // 2. Atomic Update via RPC
  // 'deduct_user_credits' 함수는 migration 20240503_auth_and_credits.sql에 정의되어 있음
  const { data, error } = await supabase.rpc('deduct_user_credits', {
    p_user_id: userId,
    p_amount: amountToDeduct,
    p_reason: `Action: ${action}`
  });

  if (error || !data?.success) {
    return { 
      success: false, 
      error: error?.message || data?.error || 'Insufficient credits', 
      statusCode: 402 
    };
  }

  return { 
    success: true, 
    remainingCredits: data.remaining_credits 
  };
}
