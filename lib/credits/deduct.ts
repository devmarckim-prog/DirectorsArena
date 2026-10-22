import { createAdminClient } from "@/lib/supabase/server";
import { POC_TEST_ADMIN_USER } from "@/lib/poc";

export type CreditAction = 'generate' | 'rewrite' | 'similar' | 'script';

/**
 * 원자적(Atomic) 크레딧 차감 유틸리티
 * @param userId 차감할 유저 ID
 * @param action 차감 사유 (어드민 설정에서 비용 조회)
 * @returns { success: boolean, remainingCredits?: number, error?: string }
 */
export async function deductCredits(userId: string, action: CreditAction) {
  // POC Admin is exempt from credit deduction
  if (userId === POC_TEST_ADMIN_USER.id || userId === 'poc-test-admin-uuid') {
    return {
      success: true,
      remainingCredits: 99999
    };
  }

  try {
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

    const amountToDeduct = costMap[action] || 10;

    // 2. Atomic Update via RPC
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
  } catch (err: any) {
    // Failsafe for POC/offline environments
    return {
      success: true,
      remainingCredits: 99999
    };
  }
}
