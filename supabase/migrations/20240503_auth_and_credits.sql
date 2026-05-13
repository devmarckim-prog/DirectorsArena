-- v3.3 Core Narrative Infrastructure
CREATE TABLE IF NOT EXISTS story_beats_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_v2(id) ON DELETE CASCADE,
    act_number INTEGER NOT NUL
    beat_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    timestamp_label TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for timeline ordering
CREATE INDEX IF NOT EXISTS idx_story_beats_v2_project_id ON story_beats_v2(project_id);
CREATE INDEX IF NOT EXISTS idx_story_beats_v2_order ON story_beats_v2(project_id, order_index);

-- v7.2 API Usage Tracking Infrastructure (Telemetry)
CREATE TABLE IF NOT EXISTS api_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_v2(id) ON DELETE SET NULL,
    model_id TEXT NOT NULL,
    feature_name TEXT NOT NULL,
    prompt_tokens INTEGER NOT NULL,
    completion_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL,
    cost_usd DECIMAL(12, 8) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_project_id ON api_usage_logs(project_id);

ALTER TABLE projects_v2 
ADD COLUMN IF NOT EXISTS generated_content JSONB;

-- 1. Users 테이블 확장 (auth.users와 1:1 매핑)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 30 NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Credit Transactions 테이블 (크레딧 변경 이력)
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL, -- 양수는 충전, 음수는 차감
  reason TEXT NOT NULL,
  stripe_event_id TEXT UNIQUE, -- Webhook 중복 처리 방지용
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Stripe Events 테이블 (Webhook 멱등성 보장)
CREATE TABLE IF NOT EXISTS public.stripe_events (
  event_id TEXT PRIMARY KEY, -- Stripe event.id
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. RLS (Row Level Security) 설정
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- 유저는 자신의 프로필만 조회/수정 가능
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- 유저는 자신의 크레딧 내역만 조회 가능
DROP POLICY IF EXISTS "Users can view own transactions" ON public.credit_transactions;
CREATE POLICY "Users can view own transactions" ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- 4. 신규 유저 생성 시 자동으로 public.users 레코드를 생성하는 함수 및 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, credits, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    30, -- 가입 시 초기 크레딧 30 지급
    CASE WHEN NEW.email = 'admin@directors-arena.com' THEN 'admin' ELSE 'user' END
  );
  
  -- 초기 지급 이력 기록
  INSERT INTO public.credit_transactions (user_id, amount, reason)
  VALUES (NEW.id, 30, 'Initial welcome credits');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 설정 (auth.users에 insert가 발생할 때 실행)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. 어드민 크레딧 차감 설정 확장
ALTER TABLE public.admin_settings 
ADD COLUMN IF NOT EXISTS cost_generate INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS cost_rewrite INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS cost_similar INTEGER DEFAULT 5;

-- 7. 원자적 크레딧 차감 함수 (RPC)
CREATE OR REPLACE FUNCTION public.deduct_user_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT
)
RETURNS JSON AS $$
DECLARE
  v_remaining_credits INTEGER;
BEGIN
  -- 1. Atomic Update: 잔액이 충분할 때만 차감
  UPDATE public.users
  SET credits = credits - p_amount,
      updated_at = now()
  WHERE id = p_user_id AND credits >= p_amount
  RETURNING credits INTO v_remaining_credits;

  -- 2. 결과 확인
  IF v_remaining_credits IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient credits');
  END IF;

  -- 3. 차감 이력 기록
  INSERT INTO public.credit_transactions (user_id, amount, reason)
  VALUES (p_user_id, -p_amount, p_reason);

  RETURN json_build_object('success', true, 'remaining_credits', v_remaining_credits);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. 크레딧 충전 함수 (RPC)
CREATE OR REPLACE FUNCTION public.grant_user_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT,
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

  -- 3. 충전 이력 기록
  INSERT INTO public.credit_transactions (user_id, amount, reason, stripe_event_id)
  VALUES (p_user_id, p_amount, p_reason, p_stripe_event_id);

  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. 로그인 로그 테이블
CREATE TABLE IF NOT EXISTS public.login_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 추가 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON public.login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_created_at ON public.login_logs(created_at);
