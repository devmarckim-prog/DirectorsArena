"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { DEFAULT_SCRIPT_PROMPT, DEFAULT_REWRITE_PROMPT, ELITE_SAMPLES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

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
    };
    await supabase.from('admin_settings').insert(defaults);
    return defaults;
  }
  return data;
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

export async function insertSampleProjectsAction() {
  // Logic for elite sample sync
  return { success: true };
}
