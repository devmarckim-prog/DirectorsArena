-- v10.5: Enhanced Credit Granting with Expiration Support
-- This migration updates the grant_user_credits function to support an optional expiration date.

CREATE OR REPLACE FUNCTION public.grant_user_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT,
  p_memo TEXT DEFAULT NULL,
  p_expires_at TIMESTAMPTZ DEFAULT NULL,
  p_stripe_event_id TEXT DEFAULT NULL
)
RETURNS JSON AS $$
BEGIN
  -- 1. 중복 처리 방지 (stripe_event_id가 있을 경우)
  IF p_stripe_event_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.credit_transactions WHERE stripe_event_id = p_stripe_event_id
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Duplicate event');
  END IF;

  -- 2. 크레딧 업데이트
  UPDATE public.users
  SET credits = credits + p_amount,
      updated_at = now()
  WHERE id = p_user_id;

  -- 3. 충전 이력 기록 (유효기간 포함)
  INSERT INTO public.credit_transactions (user_id, amount, reason, stripe_event_id, expires_at)
  VALUES (p_user_id, p_amount, COALESCE(p_memo, p_reason), p_stripe_event_id, p_expires_at);

  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
