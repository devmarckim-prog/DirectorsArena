-- v8.2: Dynamic Welcome Bonus Integration
-- This script updates the handle_new_user function to fetch the initial credit amount from admin_settings.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_welcome_bonus INTEGER;
  v_event_bonus INTEGER;
BEGIN
  -- Fetch current bonus values from admin_settings
  SELECT COALESCE(bonus_welcome, 30), COALESCE(bonus_event, 0)
  INTO v_welcome_bonus, v_event_bonus
  FROM public.admin_settings
  LIMIT 1;

  -- Default to 30 if settings are missing
  IF v_welcome_bonus IS NULL THEN
    v_welcome_bonus := 30;
  END IF;
  
  IF v_event_bonus IS NULL THEN
    v_event_bonus := 0;
  END IF;

  INSERT INTO public.users (id, email, full_name, avatar_url, credits, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    v_welcome_bonus + v_event_bonus,
    CASE WHEN NEW.email = 'admin@directors-arena.com' THEN 'admin' ELSE 'user' END
  );
  
  -- Initial 지급 이력 기록
  INSERT INTO public.credit_transactions (user_id, amount, reason)
  VALUES (NEW.id, v_welcome_bonus + v_event_bonus, 'Initial welcome credits (Dynamic)');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
