/**
 * lib/ai/models.ts
 * Directors Arena: 모델 명칭 매핑 시스템
 * 어드민 설정(가상 ID)을 실제 Anthropic API ID로 변환합니다.
 * (2026 검증 완료: claude-sonnet-4-6, claude-haiku-4-5-20251001, claude-sonnet-5-5, claude-haiku-5-5)
 */

export const MODEL_MAPPING: Record<string, string> = {
  // Primary / Heavy Models (Sonnet/Opus급)
  'claude-sonnet-4-6': 'claude-sonnet-4-6',
  'claude-sonnet-5-5': 'claude-sonnet-5-5',
  'claude-sonnet-5': 'claude-sonnet-5',
  'claude-sonnet-4-20250514': 'claude-sonnet-4-6',
  'claude-sonnet-3-5': 'claude-sonnet-4-6',
  'claude-3-5-sonnet-latest': 'claude-sonnet-4-6',
  'claude-3-5-sonnet-20241022': 'claude-sonnet-4-6',
  'claude-opus-5-5': 'claude-opus-5-5',
  'claude-opus-4-6': 'claude-opus-4-6',
  'claude-opus-4-5': 'claude-opus-4-6',
  'claude-3-opus-latest': 'claude-opus-4-6',
  
  // Fast / Cost-effective Models (Haiku급)
  'claude-haiku-4-5-20251001': 'claude-haiku-4-5-20251001',
  'claude-haiku-5-5': 'claude-haiku-5-5',
  'claude-3-5-haiku-latest': 'claude-haiku-4-5-20251001',
  'claude-3-5-haiku-20241022': 'claude-haiku-4-5-20251001',
  'claude-3-haiku-20240307': 'claude-haiku-4-5-20251001',
};

/**
 * 어드민 설정 ID를 실제 API ID로 변환
 * @param adminModelId 어드민에서 넘어온 ID
 * @param fallback 기본값 (안정적인 sonnet-4-6 권장)
 */
export function getResolvedModelId(adminModelId: string | null | undefined, fallback: string = 'claude-sonnet-4-6'): string {
  if (!adminModelId) return fallback;
  
  // 1. 매핑 테이블 확인
  if (MODEL_MAPPING[adminModelId]) {
    return MODEL_MAPPING[adminModelId];
  }
  
  // 2. 이미 실제 API ID 형식인 경우
  if (
    adminModelId.startsWith('claude-sonnet-') ||
    adminModelId.startsWith('claude-haiku-') ||
    adminModelId.startsWith('claude-opus-')
  ) {
    return adminModelId;
  }
  
  // 3. 매핑 실패 시 fallback
  console.warn(`[AI-Gateway] Unknown admin model ID: ${adminModelId}. Falling back to: ${fallback}`);
  return fallback;
}
