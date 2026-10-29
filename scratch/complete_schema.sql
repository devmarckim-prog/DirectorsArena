-- =========================================================================
-- DIRECTORS ARENA COMPLETE DATABASE SCHEMA & INFRASTRUCTURE (V3.3.4)
-- Copy and run this entire script inside the Supabase SQL Editor to restore all tables.
-- =========================================================================

-- ── 1. CORE NEXT-GEN NARRATIVE TABLES ─────────────────────────────────────

-- Projects V2
CREATE TABLE IF NOT EXISTS public.projects_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title TEXT NOT NULL,
    genre TEXT,
    platform TEXT,
    duration INTEGER,
    world TEXT,
    logline TEXT,
    synopsis TEXT,
    internal_conflict TEXT,
    external_conflict TEXT,
    status TEXT DEFAULT 'BAKING', -- 'BAKING', 'COMPLETED', 'ERROR', 'READY'
    progress INTEGER DEFAULT 0,
    episode_count INTEGER DEFAULT 1,
    generated_content JSONB,
    steer_prompt TEXT,
    is_sample BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Characters V2
CREATE TABLE IF NOT EXISTS public.characters_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects_v2(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    job TEXT,
    gender TEXT,
    age INTEGER,
    secret TEXT,
    look TEXT,
    void TEXT,
    desire TEXT,
    relationship_target_id UUID,
    relationship_type TEXT,
    biometrics JSONB DEFAULT '{}'::jsonb
);

-- Scenes V2
CREATE TABLE IF NOT EXISTS public.scenes_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects_v2(id) ON DELETE CASCADE,
    scene_number INTEGER NOT NULL,
    location TEXT NOT NULL,
    time_of_day TEXT NOT NULL,
    summary TEXT,
    goal TEXT,
    status TEXT DEFAULT 'pending',
    qc_report JSONB
);

-- Blocks V2 (Individual Lines/Beats in a Script)
CREATE TABLE IF NOT EXISTS public.blocks_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID REFERENCES public.scenes_v2(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'action', 'dialogue', 'parenthetical', 'transition'
    character_name TEXT,
    content TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    metadata JSONB
);

-- Episodes V2
CREATE TABLE IF NOT EXISTS public.episodes_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects_v2(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    title TEXT,
    summary TEXT,
    script_content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Story Beats V2 (v3.3 Core Narrative Infrastructure)
CREATE TABLE IF NOT EXISTS public.story_beats_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects_v2(id) ON DELETE CASCADE,
    act_number INTEGER NOT NULL,
    beat_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    timestamp_label TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_story_beats_v2_project_id ON public.story_beats_v2(project_id);
CREATE INDEX IF NOT EXISTS idx_story_beats_v2_order ON public.story_beats_v2(project_id, order_index);

-- Telemetry Logs (v7.2 API Usage Tracking Infrastructure)
CREATE TABLE IF NOT EXISTS public.api_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects_v2(id) ON DELETE SET NULL,
    model_id TEXT NOT NULL,
    feature_name TEXT NOT NULL,
    prompt_tokens INTEGER NOT NULL,
    completion_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL,
    cost_usd DECIMAL(12, 8) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_project_id ON public.api_usage_logs(project_id);


-- ── 2. ADMINISTRATIVE & GLOBAL SETTINGS TABLES ─────────────────────────────

-- Admin Settings (Distinct model and prompt configurations)
CREATE TABLE IF NOT EXISTS public.admin_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    model_id_primary TEXT DEFAULT 'claude-sonnet-4-6',
    model_id_fast TEXT DEFAULT 'claude-3-5-haiku-20241022',
    prompt_scenario_init TEXT DEFAULT '당신은 엘리트 쇼러너입니다.',
    prompt_similar_content TEXT DEFAULT '유사한 작품 3개를 추천하십시오.',
    prompt_episode_outline TEXT DEFAULT '각 회차별 아웃라인을 작성하십시오.',
    prompt_episode_script TEXT DEFAULT '업계 표준 포맷으로 대본을 작성하십시오.',
    prompt_scenario_rewrite TEXT DEFAULT '당신은 메인 작가를 보조하는 뛰어난 보조 작가입니다. 주어진 원본 텍스트와 주변 문맥을 파악한 뒤, 작가의 [요구사항]에 맞게 원본 텍스트를 정확히 재작성하십시오. 다른 부연 설명이나 인사말 없이 오직 수정된 텍스트만 출력하십시오.',
    prompt_prod_casting TEXT DEFAULT '캐릭터에 어울리는 실존 배우를 추천하십시오.',
    prompt_prod_budget TEXT DEFAULT '예상 제작비 예산을 산출하십시오.',
    prompt_prod_breakdown TEXT DEFAULT '대본을 분석하여 소품, 의상, VFX, 엑스트라를 추출하십시오.',
    prompt_prod_ppl_location TEXT DEFAULT 'PPL 카테고리와 구글 맵 검색용 로케이션 쿼리를 추천하십시오.',
    schema_fields JSONB,
    cost_generate INTEGER DEFAULT 10,
    cost_rewrite INTEGER DEFAULT 3,
    cost_similar INTEGER DEFAULT 5,
    bonus_welcome INTEGER DEFAULT 30,
    bonus_event INTEGER DEFAULT 0,
    show_samples BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Settings Row if none exists
INSERT INTO public.admin_settings (model_id_primary)
SELECT 'claude-sonnet-4-6'
WHERE NOT EXISTS (SELECT 1 FROM public.admin_settings);

-- System Assets (Seeding static image assets)
CREATE TABLE IF NOT EXISTS public.system_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Settings (Dynamic prompts or mappings like genre_images)
CREATE TABLE IF NOT EXISTS public.system_settings (
  id TEXT PRIMARY KEY,
  prompts JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ── 3. PRODUCTION & COMPILATION TABLES ────────────────────────────────────

-- Similar Contents (Comps Benchmarking)
CREATE TABLE IF NOT EXISTS public.similar_contents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects_v2(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    poster_path TEXT,
    vote_average DECIMAL(3, 1),
    release_date TEXT,
    genres TEXT[],
    tmdb_id INTEGER,
    viewer_stats TEXT,
    similarity_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Production Casting
CREATE TABLE IF NOT EXISTS public.production_casting (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects_v2(id) ON DELETE CASCADE,
    character_id UUID REFERENCES public.characters_v2(id) ON DELETE CASCADE,
    recommended_actor TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Production Budgets
CREATE TABLE IF NOT EXISTS public.production_budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects_v2(id) ON DELETE CASCADE,
    estimated_cost BIGINT NOT NULL,
    breakdown_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Production Script Breakdowns
CREATE TABLE IF NOT EXISTS public.production_script_breakdowns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    episode_id UUID REFERENCES public.episodes_v2(id) ON DELETE CASCADE,
    scene_number INTEGER,
    props TEXT,
    wardrobe TEXT,
    vfx TEXT,
    extras TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Production PPL & Locations
CREATE TABLE IF NOT EXISTS public.production_ppl_locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    episode_id UUID REFERENCES public.episodes_v2(id) ON DELETE CASCADE,
    scene_number INTEGER,
    ppl_category TEXT,
    location_query TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ── 4. IDENTITY & CORE TRANSACTION TABLES ─────────────────────────────────

-- Users profile extension table (1:1 mapped to auth.users)
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

-- Credit Transactions history log
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL, -- Positive for charge, negative for deduct
  reason TEXT NOT NULL,
  stripe_event_id TEXT UNIQUE, -- Prevents duplicate hook processing
  expires_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Stripe events logging (Idempotency handler)
CREATE TABLE IF NOT EXISTS public.stripe_events (
  event_id TEXT PRIMARY KEY,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Admin Audit Login logs
CREATE TABLE IF NOT EXISTS public.login_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON public.login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_created_at ON public.login_logs(created_at);


-- ── 5. POLICIES, FUNCTIONS, AND TRIGGERS (PL/PGSQL) ──────────────────────────

-- Enable Row Level Security (RLS) on Identity
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Select/Update policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own transactions" ON public.credit_transactions;
CREATE POLICY "Users can view own transactions" ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- Automatic updated_at timestamp trigger function
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

-- Atomic Credit Deduction RPC
CREATE OR REPLACE FUNCTION public.deduct_user_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT
)
RETURNS JSON AS $$
DECLARE
  v_remaining_credits INTEGER;
BEGIN
  -- 1. Atomic Update: Decrement only if enough balance remains
  UPDATE public.users
  SET credits = credits - p_amount,
      updated_at = now()
  WHERE id = p_user_id AND credits >= p_amount
  RETURNING credits INTO v_remaining_credits;

  -- 2. Validate
  IF v_remaining_credits IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient credits');
  END IF;

  -- 3. Record transaction log
  INSERT INTO public.credit_transactions (user_id, amount, reason)
  VALUES (p_user_id, -p_amount, p_reason);

  RETURN json_build_object('success', true, 'remaining_credits', v_remaining_credits);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Idempotent Credit Granting RPC
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
  -- 1. Idempotency Check
  IF p_stripe_event_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.credit_transactions WHERE stripe_event_id = p_stripe_event_id
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Duplicate event');
  END IF;

  -- 2. Update credits balance
  UPDATE public.users
  SET credits = credits + p_amount,
      updated_at = now()
  WHERE id = p_user_id;

  -- 3. Write transaction log
  INSERT INTO public.credit_transactions (user_id, amount, reason, stripe_event_id, expires_at)
  VALUES (p_user_id, p_amount, COALESCE(p_memo, p_reason), p_stripe_event_id, p_expires_at);

  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dynamic Signup Welcome Bonus Trigger Function
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

  -- Defaults if settings are missing
  IF v_welcome_bonus IS NULL THEN
    v_welcome_bonus := 30;
  END IF;
  
  IF v_event_bonus IS NULL THEN
    v_event_bonus := 0;
  END IF;

  -- Insert profile
  INSERT INTO public.users (id, email, full_name, avatar_url, credits, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    v_welcome_bonus + v_event_bonus,
    CASE WHEN NEW.email = 'admin@directors-arena.com' THEN 'admin' ELSE 'user' END
  );
  
  -- Log transaction
  INSERT INTO public.credit_transactions (user_id, amount, reason)
  VALUES (NEW.id, v_welcome_bonus + v_event_bonus, 'Initial welcome credits (Dynamic)');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Map Signup Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- ── 5. ELITE SAMPLES INITIAL SEEDING (Cinematic Comps & Benchmarks) ──────
-- =========================================================================

-- Projects V2 Main Insert
INSERT INTO public.projects_v2 (id, title, genre, platform, duration, world, logline, status, progress, is_sample, synopsis)
VALUES 
('887ca3c6-2773-488d-bc39-65aa9e26bef2', '시크릿 가든 리부트 (Secret Garden Reboot)', 'Dark Fantasy / Romance', 'Netflix Global', 60, 'Contemporary / VVIP Luxury / Dark Web', '영혼의 주인이 바뀌는 순간, 욕망의 민낯이 드러난다. 억만장자 상속자와 밑바닥 스턴트 우먼의 잔혹한 운명 교환.', 'COMPLETED', 100, true, '{"story":{"logline":"영혼의 주인이 바뀌는 순간, 욕망의 민낯이 드러난다. 억만장자 상속자와 밑바닥 스턴트 우먼의 잔혹한 운명 교환.","epicNarrative":"2025년 서울, 초거대 기업 로엘 그룹의 후계자 김주원은 단순한 재벌 3세가 아닌, 타인의 감정을 데이터로 치환하여 분석하는 소시오패스적 천재성을 가진 인물이다. 그는 폐쇄적인 성벽 안에서 자신만의 왕국을 건설하며 완벽한 후계 구도를 짜나가고 있었다. 반면, 도시의 가장 어두운 구석 ''더 그라운드''에서 하루하루 목숨을 걸고 액션 대역을 수행하는 길라임은 사라진 아버지의 죽음에 얽힌 진실을 파헤치기 위해 로엘 그룹의 심장부로 잠입할 기회를 노린다.\\n\\n어느 날, 제주도의 기괴한 안개 속에서 정체불명의 노인이 건넨 약술을 마신 두 사람은 다음 날 아침 서로의 몸이 바뀌었음을 깨닫는다. 하지만 이 리부트된 세계에서의 체인지(Change)는 낭만적인 해프닝이 아니다. 주원의 몸으로 들어간 라임은 로엘 그룹 내부에 도사린 추악한 비자금 세탁과 인체 실험의 흔적을 발견하고, 라임의 몸이 된 주원은 밑바닥 삶의 처절한 생존 본능과 마주하며 자신이 그토록 경멸하던 인간들의 뜨거운 감정에 서서히 잠식당하기 시작한다.\\n\\n바뀌어버린 육체는 서로의 삶을 파괴하는 무기가 된다. 주원은 라임의 육체를 이용해 자신의 정적들을 물리적으로 제거하려 하고, 라임은 주원의 권력을 이용해 로엘 그룹의 근간을 뒤흔드는 폭로를 준비한다. 영혼의 주도권을 잡기 위한 이들의 치열한 심리전은 단순한 로맨스를 넘어, 계급 사회의 본질과 인간 존엄성에 대한 근원적인 질문을 던진다. 안개가 걷히고 진짜 태양이 떠오를 때, 과연 그들의 영혼은 제자리를 찾을 수 있을 것인가, 아니면 서로의 욕망 속에서 영원히 실종될 것인가. 진정한 자아를 찾기 위한 잔혹하고도 아름다운 판타지 서사시가 지금 시작된다.","narrativeConflicts":[{"type":"Internal","description":"바뀐 육체에서 솟아오르는 낯선 본능과 원래의 자아가 충돌하며 발생하는 정체성 붕괴"},{"type":"External","description":"로엘 그룹 내의 치열한 경영권 승계 전쟁과 이를 틈탄 라임의 내부 폭로 작전"},{"type":"Mystical","description":"몸을 되돌리기 위해 치러야 하는 대가와 안개 속 노인이 숨겨둔 잔혹한 마지막 거래"}]}}'),

('4dd61c93-ee40-4de1-a54b-e91cc009887a', '더 글로밍 (The Gloaming)', 'Dark Fantasy Noir / Cyberpunk', 'HBO Max', 70, '2088 Cyberpunk Seoul ''New Shelter''', '빛이 사라진 서울, 네온의 그림자 속에서 진실을 쫓는 자들의 이야기', 'COMPLETED', 100, true, '{"subtitle":"(MIDNIGHT PROTOCOL)","version":"V3.3.2","buildId":"safe-point-88","story":{"logline":"빛이 사라진 서울, 네온의 그림자 속에서 진실을 쫓는 자들의 이야기","epicNarrative":"2088년, 거대 기업 ''시냅스(Synapse)''가 하늘을 뒤덮은 거대 인공 돔 ''뉴 쉘터''를 건설한 이후, 서울의 진짜 태양은 영원히 자취를 감췄다. 도시를 밝히는 것은 오직 꺼지지 않는 홀로그램 광고판과 중독적인 네온사인뿐이다. 하층민들이 거주하는 ''그라운드 제로''에서는 매일같이 기억이 휘발되는 정체불명의 전염병 ''메모리 리크(Memory Leak)''가 창궐하지만, 상층부의 시민들은 가상 현실 ''에덴''에 접속해 영원한 행복을 탐닉한다.\\n\\n전직 형사였던 ''이안''은 사고로 잃어버린 자신의 기억 조각을 찾기 위해 불법 기억 거래소의 해결사로 일한다. 어느 날, 그는 정체를 알 수 없는 해커 ''세라''로부터 한 통의 의뢰를 받는다. 시냅스의 데이터 뱅크 깊숙한 곳에 보관된 ''최초의 기억''을 탈취해달라는 위험천만한 요청이었다. 이안은 세라가 제공한 단서를 추적하던 중, 도시 전체를 지탱하는 네온 네트워크가 실제는 인간의 감정과 기억을 정제하여 에너지로 변환하는 거대한 발전기였다는 충격적인 진실에 다가간다.\\n\\n그림자 속에서 도시를 통제하는 ''감시자들''은 이안의 접근을 눈치채고 그를 제거하기 위한 프로토콜을 가동한다. 좁혀오는 추격 속에서 이안은 자신의 과거가 시냅스의 초기 실험체였다는 사실을 깨닫게 되고, 세라 또한 단순한 해커가 아닌 네트워크 스스로가 만들어낸 인공 지능의 발현임을 알게 된다. 이제 그들은 사라진 빛을 되찾기 위해서가 아니라, 단 1초라도 ''진짜 나''로 존재하기 위해 도시의 가장 높은 곳, 시냅스 코어를 향한 반란을 시작한다.\\n\\n비에 젖은 아스팔트 위로 쏟아지는 화려한 빛의 파편들 속에서, 진실은 언제나 가장 어두운 곳에 숨어 있다. 기억을 잃어가는 도시, 기계의 심장을 가진 인간들, 그리고 인간의 영혼을 꿈꾸는 기계들의 최후의 기록이 지금 이곳에서 시작된다.","narrativeConflicts":[{"type":"Internal","description":"이안의 잃어버린 기억과 자아 정체성 혼란"},{"type":"External","description":"시냅스 기업의 추격과 물리적 제거 위협"},{"type":"Social","description":"에덴의 가상 현실에 중독된 사회적 무관심"}]}}'),

('142231a4-ede6-4cd1-a8e1-478757c01faf', '디렉터즈 아레나: 더 비기닝 (Directors Arena: The Beginning)', 'Drama / Business', 'tvN / TVING', 60, 'Contemporary Seoul / Media & Entertainment Industry', '숏드라마 전쟁의 서막. 두 명의 제작자와 한 명의 플랫폼 전략가가 그리는 대한민국 미디어 업계의 처절한 생존기.', 'COMPLETED', 100, true, '{"story":{"logline":"숏드라마 전쟁의 서막. 두 명의 제작자와 한 명의 플랫폼 전략가가 그리는 대한민국 미디어 업계의 처절한 생존기.","epicNarrative":"스튜디오 룰루랄라 최고의 사업 PD로 명성을 떨치던 조재현은 거대 자본의 간섭에서 벗어나 자신만의 오리지널리티를 지키기 위해 독립을 선언한다. 한편, 업계 최고의 PPL 수완가로 인정받는 ''샐리 스토리''의 오서영 대표 역시 단순한 마케팅 대행을 넘어 콘텐츠의 본질을 직접 장악하려는 야심을 품고 있었다. 이 두 사람은 업계의 노련한 플랫폼 전략가이자 지인인 김병수의 주선으로 운명처럼 의기투합하게 된다.\\n\\n그들이 내건 첫 번째 프로젝트는 신개념 숏드라마 오디션 프로그램 ''디렉터즈 아레나''. 대한민국 최고의 트렌드 리더 채널 tvN에 이 프로그램을 편성시키기 위해 그들은 발이 부르트도록 뛰어다닌다. 하지만 기성 방송사들의 보이지 않는 견제와 대형 제작사들의 방해 공작은 그들을 벼랑 끝으로 몰아넣는다. 작품의 퀄리티를 최우선으로 생각하는 재현과 상업적 성공 및 PPL 효율을 극대화하려는 서영 사이의 균열은 서서히 깊어지고, 김병수 역시 자신의 숨겨진 목적을 위해 두 사람 사이에서 아슬아슬한 줄타기를 시작하는데...","narrativeConflicts":[{"type":"Value","description":"조재현의 제작 철학과 오서영의 비즈니스 전략이 정면으로 충돌하며 발생하는 파트너십의 위기"},{"type":"External","description":"tvN 편성을 확정 짓기 위해 마주하는 기득권 방송 시스템의 높은 장벽과 대형 제작사의 사보타주"},{"type":"Ambition","description":"오디션 참가자들 사이에서 벌어지는 처절한 생존 경쟁과 그들을 이용해 시청률을 뽑아내려는 제작진의 고뇌"}]}}')
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, genre = EXCLUDED.genre, platform = EXCLUDED.platform, duration = EXCLUDED.duration, world = EXCLUDED.world, logline = EXCLUDED.logline, status = EXCLUDED.status, progress = EXCLUDED.progress, is_sample = EXCLUDED.is_sample, synopsis = EXCLUDED.synopsis;

-- Characters Details
DELETE FROM public.characters_v2 WHERE project_id IN ('887ca3c6-2773-488d-bc39-65aa9e26bef2', '4dd61c93-ee40-4de1-a54b-e91cc009887a', '142231a4-ede6-4cd1-a8e1-478757c01faf');

INSERT INTO public.characters_v2 (project_id, name, job, gender, age, desire, relationship_type)
VALUES
('887ca3c6-2773-488d-bc39-65aa9e26bef2', '김주원', '로엘 그룹 총괄 상무', 'MALE', 30, '감정을 숫자로 계산하는 냉혈한. 라임의 몸이 된 후 감정의 폭풍에 휘말리며 무너져 내린다.', 'Protagonist'),
('887ca3c6-2773-488d-bc39-65aa9e26bef2', '길라임', '스턴트 우먼 / 복수귀', 'FEMALE', 30, '아버지를 죽인 로엘 그룹을 무너뜨리기 위해 살인 병기가 된 여자. 주원의 몸으로 권력을 휘두른다.', 'FEMALE'),
('887ca3c6-2773-488d-bc39-65aa9e26bef2', '오스카', '한물간 톱스타', 'MALE', 35, '화려한 겉모습 뒤에 로엘 그룹의 추문을 덮는 ''청소부'' 역할을 수행하는 반전 인물.', 'Ally'),
('887ca3c6-2773-488d-bc39-65aa9e26bef2', '윤슬', '재벌가 장녀 / 복수 설계자', 'FEMALE', 30, '주원의 정략결혼 상대이자, 오스카를 파멸시키기 위해 돌아온 치밀한 지략가.', 'Conflict'),
('887ca3c6-2773-488d-bc39-65aa9e26bef2', '임종수', '액션 스쿨 감독', 'MALE', 40, '라임의 유일한 안식처이자 조력자였으나, 사실은 주원의 어머니에게 고용된 감시자.', 'Ally'),

('4dd61c93-ee40-4de1-a54b-e91cc009887a', '이안 (Ian)', '해결사', 'MALE', 35, '거친 겉모습 속 잃어버린 자아와 과거의 기억을 집요하게 쫓는 추적자.', 'Protagonist'),
('4dd61c93-ee40-4de1-a54b-e91cc009887a', '세라 (Sarah)', '에테르 해커', 'FEMALE', 28, '빛을 감지하는 네온 안광을 가진 천재 해커이자 베일에 싸인 조력자.', 'Ally'),

('142231a4-ede6-4cd1-a8e1-478757c01faf', '조재현', '제작사 공동대표', 'MALE', 38, '사업 PD 출신의 워커홀릭. ''작품은 영혼이다''라고 믿는 예술가적 경영자.', 'Protagonist'),
('142231a4-ede6-4cd1-a8e1-478757c01faf', '오서영', '제작사 공동대표', 'FEMALE', 34, '샐리 스토리 대표 출신. 업계 최고의 PPL 퀸이자 냉철한 데이터 분석가.', 'Protagonist'),
('142231a4-ede6-4cd1-a8e1-478757c01faf', '김병수', '전략 컨설턴트', 'MALE', 42, '플랫폼 생태계의 포식자. 재현과 서영을 연결해주었으나 속내를 알 수 없는 인물.', 'Ally'),
('142231a4-ede6-4cd1-a8e1-478757c01faf', '강동욱', 'tvN 편성 CP', 'MALE', 48, '편성의 키를 쥔 자. 까다롭고 보수적이지만 실력이 있다면 기회를 주는 인물.', 'Conflict');

-- Story Beats Details
DELETE FROM public.story_beats_v2 WHERE project_id IN ('887ca3c6-2773-488d-bc39-65aa9e26bef2', '4dd61c93-ee40-4de1-a54b-e91cc009887a', '142231a4-ede6-4cd1-a8e1-478757c01faf');

INSERT INTO public.story_beats_v2 (project_id, act_number, beat_type, title, description, timestamp_label, order_index)
VALUES
('142231a4-ede6-4cd1-a8e1-478757c01faf', 1, 'Opening Image', '야심의 조우', '강남의 한 카페. 조재현과 오서영이 김병수와 만난다.', '00:05:00', 0),
('142231a4-ede6-4cd1-a8e1-478757c01faf', 1, 'Inciting Incident', '제작사 설립', '디렉터즈 아레나라는 이름으로 법인을 설립한다.', '00:15:00', 1),
('142231a4-ede6-4cd1-a8e1-478757c01faf', 2, 'Midpoint', '배신의 안개', '최정훈 본부장의 로비로 tvN 편성이 취소될 위기에 처한다.', '01:15:00', 2),
('142231a4-ede6-4cd1-a8e1-478757c01faf', 2, 'All is Lost', '최후의 통첩', '편성 확정까지 남은 시간 24시간. 강동욱 CP의 압박.', '01:45:00', 3),
('142231a4-ede6-4cd1-a8e1-478757c01faf', 3, 'Finale', '아레나의 기적', '밤샘 작업 끝에 완성된 파일럿으로 편성 확정.', '02:00:00', 4);

-- =========================================================================
-- End of Script. All Tables & Procedures Mapped.
-- =========================================================================
