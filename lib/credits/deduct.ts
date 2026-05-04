import { createAdminClient } from "@/lib/supabase/server";

export type CreditAction = 'generate' | 'rewrite' | 'similar';

/**
 * 원자적(Atomic) 크레딧 차감 유틸리티
 * @param userId 차감할 유저 ID
 * @param action 차감 사유 (어드민 설정에서 비용 조회)
 * @returns { success: boolean, remainingCredits?: number, error?: string }
 */
export async function deductCredits(userId: string, action: CreditAction) {
  const supabase = createAdminClient();

  // 1. 어드민 설정에서 해당 액션의 비용 조회
  const { data: settings } = await supabase
    .from('admin_settings')
    .select('cost_generate, cost_rewrite, cost_similar')
    .single();

  const costMap: Record<CreditAction, number> = {
    generate: settings?.cost_generate ?? 10,
    rewrite: settings?.cost_rewrite ?? 3,
    similar: settings?.cost_similar ?? 5,
  };

  const amountToDeduct = costMap[action];

  // 2. Atomic Update: 잔액 확인과 차감을 동시에 수행
  // RPC를 사용하거나 직접 SQL을 실행할 수 있으나, 여기서는 복잡도를 낮추기 위해 postgres 쿼리를 직접 타격하는 로직을 시뮬레이션합니다.
  // 실제로는 supabase.rpc()를 사용하는 것이 가장 안전합니다.
  
  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update({ 
      credits: supabase.rpc('decrement_credits', { user_id: userId, amount: amountToDeduct }) 
    })
    .select('credits')
    .single();

  // Note: 위 방식보다 더 확실한 SQL 방식은 RPC 함수를 정의하는 것입니다.
  // 아래는 RPC 함수 'deduct_user_credits'가 DB에 정의되어 있다고 가정하고 호출하는 방식입니다.
  const { data, error } = await supabase.rpc('deduct_user_credits', {
    p_user_id: userId,
    p_amount: amountToDeduct,
    p_reason: action
  });

  if (error || !data?.success) {
    return { 
      success: false, 
      error: error?.message || 'Insufficient credits', 
      statusCode: 402 
    };
  }

  return { 
    success: true, 
    remainingCredits: data.remaining_credits 
  };
}
