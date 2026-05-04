"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { DEFAULT_SCRIPT_PROMPT, DEFAULT_REWRITE_PROMPT, ELITE_SAMPLES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

// ─── Claude 프롬프트 주입 필드 ─────────────────────────────────────────────
// enabled: true → Claude userPrompt에 해당 값이 구조화된 형태로 포함됨
// promptKey: 프롬프트에 삽입될 레이블 (한국어)
// sourceKey: project 레코드 또는 synopsis.formData에서 값을 가져오는 키
const DEFAULT_SCHEMA_FIELDS = {
  // ── 프로젝트 기본 ──────────────────────────────────────────────
  logline:             { category: 'project',   enabled: true,  label: '로그라인',           type: 'textarea', promptKey: '로그라인',         sourceKey: 'logline',            options: [] },
  genre:               { category: 'project',   enabled: true,  label: '장르',               type: 'select',   promptKey: '장르',             sourceKey: 'genre',              options: ['Noir', 'Romance', 'Fantasy', 'Thriller', 'Business', 'Historical', 'Action', 'Comedy', 'Horror', 'Sci-Fi'] },
  episode_count:       { category: 'project',   enabled: true,  label: '에피소드 수',        type: 'number',   promptKey: '에피소드 수',      sourceKey: 'episodes',           options: [] },
  platform:            { category: 'project',   enabled: true,  label: '타겟 플랫폼',        type: 'select',   promptKey: '타겟 플랫폼',      sourceKey: 'platform',           options: ['tvN', 'Netflix', 'Disney+', 'Watcha', 'JTBC', 'KBS', 'MBC', '기타'] },
  setting:             { category: 'project',   enabled: false, label: '시대적 배경',        type: 'text',     promptKey: '시대적 배경',      sourceKey: 'setting',            options: [] },
  tone:                { category: 'project',   enabled: false, label: '톤 / 분위기',        type: 'text',     promptKey: '톤과 분위기',      sourceKey: 'tone',               options: [] },
  target_audience:     { category: 'project',   enabled: false, label: '타겟 시청층',        type: 'text',     promptKey: '타겟 시청층',      sourceKey: 'target_audience',    options: [] },
  reference_works:     { category: 'project',   enabled: false, label: '레퍼런스 작품',      type: 'text',     promptKey: '레퍼런스 작품',    sourceKey: 'reference_works',    options: [] },
  world_setting:       { category: 'project',   enabled: false, label: '세계관 설정',        type: 'textarea', promptKey: '세계관',           sourceKey: 'world_setting',      options: [] },
  special_request:     { category: 'project',   enabled: false, label: '특별 요청 사항',     type: 'textarea', promptKey: '특별 요청 사항',   sourceKey: 'special_request',    options: [] },
  budget_tier:         { category: 'project',   enabled: false, label: '제작 규모',          type: 'select',   promptKey: '제작 규모',        sourceKey: 'budget_tier',        options: ['미니 시리즈', '중편', '대작', '블록버스터'] },
  // ── 주인공 설정 ──────────────────────────────────────────────
  protagonist_name:    { category: 'character', enabled: false, label: '주인공 이름',        type: 'text',     promptKey: '주인공 이름',      sourceKey: 'protagonist_name',   options: [] },
  protagonist_age:     { category: 'character', enabled: false, label: '주인공 나이',        type: 'text',     promptKey: '주인공 나이',      sourceKey: 'protagonist_age',    options: [] },
  protagonist_gender:  { category: 'character', enabled: false, label: '주인공 성별',        type: 'select',   promptKey: '주인공 성별',      sourceKey: 'protagonist_gender', options: ['남성', '여성', '논바이너리'] },
  protagonist_job:     { category: 'character', enabled: false, label: '주인공 직업',        type: 'text',     promptKey: '주인공 직업',      sourceKey: 'protagonist_job',    options: [] },
  protagonist_desire:  { category: 'character', enabled: false, label: '주인공 욕망 / 동기', type: 'textarea', promptKey: '주인공이 원하는 것', sourceKey: 'protagonist_desire', options: [] },
  protagonist_trait:   { category: 'character', enabled: false, label: '주인공 성격 특징',   type: 'text',     promptKey: '주인공 성격',      sourceKey: 'protagonist_trait',  options: [] },
  // ── 주요 인물 관계 ─────────────────────────────────────────────
  antagonist_name:     { category: 'relationship', enabled: false, label: '안타고니스트 이름', type: 'text',     promptKey: '안타고니스트',     sourceKey: 'antagonist_name',    options: [] },
  antagonist_job:      { category: 'relationship', enabled: false, label: '안타고니스트 직업', type: 'text',     promptKey: '안타고니스트 직업', sourceKey: 'antagonist_job',    options: [] },
  key_relationship:    { category: 'relationship', enabled: false, label: '핵심 인물 관계',   type: 'textarea', promptKey: '핵심 인물 관계 구도', sourceKey: 'key_relationship',  options: [] },
  love_interest_name:  { category: 'relationship', enabled: false, label: '로맨스 상대 이름', type: 'text',     promptKey: '로맨스 상대',      sourceKey: 'love_interest_name', options: [] },
};
export async function getAdminSettingsAction() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('admin_settings').select('*').limit(1).single();
  
  if (!data) {
    const defaults = {
      model_id_primary: 'claude-3-5-sonnet-20241022',
      model_id_fast: 'claude-3-5-haiku-20241022',
      prompt_scenario_init: '당신은 엘리트 쇼러너입니다.',
      prompt_episode_outline: '각 회차별 아웃라인을 작성하십시오.',
      prompt_episode_script: DEFAULT_SCRIPT_PROMPT,
      prompt_scenario_rewrite: DEFAULT_REWRITE_PROMPT,
      schema_fields: DEFAULT_SCHEMA_FIELDS,
      cost_generate: 10,
      cost_rewrite: 3,
      cost_similar: 5,
    };
    await supabase.from('admin_settings').insert(defaults);
    return defaults;
  }
  // Merge: DB에 schema_fields 없으면 기본값 주입
  return {
    ...data,
    schema_fields: data.schema_fields ?? DEFAULT_SCHEMA_FIELDS,
  };
}

export async function updateAdminSettingsAction(settings: any) {
  const supabase = createAdminClient();
  const { data: existing } = await supabase.from('admin_settings').select('id').limit(1).single();
  
  if (existing) {
    await supabase.from('admin_settings').update({ ...settings, updated_at: new Date().toISOString() }).eq('id', existing.id);
  } else {
    await supabase.from('admin_settings').insert(settings);
  }
  return { success: true };
}

// Schema Fields 전용 저장 액션
export async function updateSchemaFieldsAction(fields: Record<string, any>) {
  const supabase = createAdminClient();
  const { data: existing } = await supabase.from('admin_settings').select('id').limit(1).single();
  const payload = { schema_fields: fields, updated_at: new Date().toISOString() };
  if (existing) {
    await supabase.from('admin_settings').update(payload).eq('id', existing.id);
  } else {
    await supabase.from('admin_settings').insert({ ...payload, ...DEFAULT_SCHEMA_FIELDS });
  }
  return { success: true };
}

export async function fetchAdminStatsAction() {
  const supabase = createAdminClient();
  const { data: projects } = await supabase.from('projects_v2').select('id, created_at, status');
  const { count: episodeCount } = await supabase.from('episodes_v2').select('*', { count: 'exact', head: true }).not('script_content', 'is', null);
  const { data: usageLogs } = await supabase.from('api_usage_logs').select('cost_usd, created_at');

  const totalCost = usageLogs?.reduce((sum, log) => sum + Number(log.cost_usd || 0), 0) || 0;
  
  // v7.5: Enhanced Daily Aggregation
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const dailyCosts = last7Days.map(date => {
    const dayTotal = usageLogs
      ?.filter(log => log.created_at.startsWith(date))
      .reduce((sum, log) => sum + Number(log.cost_usd || 0), 0) || 0;
    return { date, cost: dayTotal };
  });
  
  return { 
    total: projects?.length || 0, 
    today: projects?.filter(p => new Date(p.created_at).getTime() > Date.now() - 86400000).length || 0,
    completed: projects?.filter(p => p.status === 'READY' || p.status === 'COMPLETED').length || 0,
    costUsd: totalCost.toFixed(2),
    episodeCount: episodeCount || 0,
    dailyCosts
  };
}

export async function seedSystemAssetsAction() {
  const supabase = createAdminClient();
  const CINEMATIC_ASSETS: any[] = [];
  await supabase.from('system_assets').upsert(CINEMATIC_ASSETS, { onConflict: 'url' });
  return { success: true };
}

export async function fetchSystemAssetsAction(type: string = 'dummy_image') {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('system_assets')
    .select('*')
    .eq('type', type);
    
  if (error) return [];
  return data || [];
}

export async function fetchGenreImagesAction(): Promise<Record<string, string[]>> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('system_settings')
    .select('prompts')
    .eq('id', 'genre_images')
    .single();

  if (error || !data?.prompts) return {};
  return data.prompts as Record<string, string[]>;
}

export async function resetPromptsToDefaultAction() {
  const defaults = {
    model_id_primary: 'claude-3-5-sonnet-20241022',
    model_id_fast: 'claude-3-5-haiku-20241022',
    prompt_scenario_init: '당신은 엘리트 쇼러너입니다.',
    prompt_episode_outline: '각 회차별 아웃라인을 작성하십시오.',
    prompt_episode_script: DEFAULT_SCRIPT_PROMPT,
    prompt_scenario_rewrite: DEFAULT_REWRITE_PROMPT,
  };
  return await updateAdminSettingsAction(defaults);
}

export async function fetchAdminSettings() {
  return await getAdminSettingsAction();
}

export async function fetchAdminDashboardStats() {
  const supabase = createAdminClient();
  
  const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const { count: todayJoiners } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());

  const { count: paidSubscribers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .neq('plan', 'free');

  const { data: recentUsers } = await supabase
    .from('users')
    .select('id, email, full_name, plan, credits, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: usageLogs } = await supabase
    .from('credit_transactions')
    .select('amount')
    .lt('amount', 0)
    .gte('created_at', today.toISOString());
  
  const todayCreditUsage = Math.abs(usageLogs?.reduce((sum, log) => sum + log.amount, 0) || 0);

  return {
    totalUsers: totalUsers || 0,
    todayJoiners: todayJoiners || 0,
    paidSubscribers: paidSubscribers || 0,
    todayCreditUsage,
    recentUsers: recentUsers || []
  };
}

export async function fetchUserListAction(page: number = 1, search?: string) {
  const supabase = createAdminClient();
  const PAGE_SIZE = 20;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('users')
    .select('id, email, full_name, plan, role, credits, created_at, status', { count: 'exact' });

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  return { users: data || [], totalCount: count || 0, error };
}

export async function toggleUserStatusAction(userId: string, currentStatus: string) {
  const supabase = createAdminClient();
  const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
  const { error } = await supabase
    .from('users')
    .update({ status: newStatus })
    .eq('id', userId);
  
  revalidatePath('/admin/users');
  return { success: !error, error };
}

export async function manualCreditGrantAction(email: string, amount: number, memo: string) {
  const supabase = createAdminClient();
  
  // 1. 유저 조회
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();
    
  if (!user) return { success: false, error: 'User not found' };

  // 2. RPC 호출 (충전)
  const { error } = await supabase.rpc('grant_user_credits', {
    p_user_id: user.id,
    p_amount: amount,
    p_reason: 'manual_grant',
    p_memo: memo // SQL 함수에 메모 필드 추가 필요 시 반영
  });

  revalidatePath('/admin/credits');
  return { success: !error, error };
}

export async function fetchLoginLogsAction() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('login_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  return data || [];
}
