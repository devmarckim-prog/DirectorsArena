/**
 * lib/ai/models.ts
 * Directors Arena: 모델 명칭 매핑 시스템
 * 어드민 설정(가상 ID)을 실제 Anthropic API ID로 변환합니다.
 */

export const MODEL_MAPPING: Record<string, string> = {
  // Primary / Heavy Models (Sonnet/Opus급)
  'claude-sonnet-4-6': 'claude-sonnet-4-20250514',
  'claude-sonnet-4-20250514': 'claude-sonnet-4-20250514',
  'claude-sonnet-3-5': 'claude-sonnet-4-20250514',
  'claude-3-5-sonnet-latest': 'claude-sonnet-4-20250514',
  'claude-opus-4-5': 'claude-3-opus-latest',
  
  // Fast / Cost-effective Models (Haiku급)
  'claude-haiku-4-5-20251001': 'claude-3-5-haiku-latest',
  'claude-3-5-haiku-20241022': 'claude-3-5-haiku-latest',
};

/**
 * 어드민 설정 ID를 실제 API ID로 변환
 * @param adminModelId 어드민에서 넘어온 ID
 * @param fallback 기본값 (보통 비용 절감을 위해 haiku 권장)
 */
export function getResolvedModelId(adminModelId: string | null | undefined, fallback: string = 'claude-sonnet-4-20250514'): string {
  if (!adminModelId) return fallback;
  
  // 1. 매핑 테이블 확인
  if (MODEL_MAPPING[adminModelId]) {
    return MODEL_MAPPING[adminModelId];
  }
  
  // 2. 이미 실제 API ID 형식인 경우 그대로 반환 (2026년 기준 sonnet/haiku 패턴 허용)
  if (adminModelId.startsWith('claude-3-') || adminModelId.startsWith('claude-sonnet-') || adminModelId.startsWith('claude-haiku-')) {
    return adminModelId;
  }
  
  // 3. 매핑 실패 시 fallback (비용 절감 모드)
  console.warn(`[AI-Gateway] Unknown admin model ID: ${adminModelId}. Falling back to: ${fallback}`);
  return fallback;
}
