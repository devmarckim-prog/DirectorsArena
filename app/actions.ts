"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { revalidatePath } from "next/cache";
import { EpisodeScriptSchema, EpisodeSceneDraftSchema } from "@/lib/schemas/generation";
import type { ProjectGeneration, EpisodeSceneDraft, SceneElement } from "@/lib/schemas/generation";
import { DEFAULT_SCRIPT_PROMPT, DEFAULT_REWRITE_PROMPT, ELITE_SAMPLES } from "@/lib/constants";

// Prompts are now managed in lib/constants.ts to comply with "use server" rules.

export async function getAdminSettingsAction() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('admin_settings').select('*').limit(1).single();
  
  if (!data) {
    // Lazy On-Demand Fallback
    const defaults = {
      model_id_primary: 'claude-sonnet-4-6',
      model_id_fast: 'claude-haiku-4-5-20251001',
      prompt_scenario_init: '당신은 엘리트 쇼러너입니다. 훌륭한 시놉시스를 작성하십시오.',
      prompt_episode_outline: '각 회차별 아웃라인을 작성하십시오.',
      prompt_episode_script: DEFAULT_SCRIPT_PROMPT,
      prompt_scenario_rewrite: DEFAULT_REWRITE_PROMPT,
      prompt_similar_content: '유사한 작품 3개를 추천하십시오.',
      prompt_prod_casting: '캐릭터에 어울리는 실존 배우를 추천하십시오.',
      prompt_prod_budget: '예상 제작비 예산을 산출하십시오.',
      prompt_prod_breakdown: '대본을 분석하여 소품, 의상, VFX, 엑스트라를 추출하십시오.',
      prompt_prod_ppl_location: 'PPL 카테고리와 구글 맵 검색용 로케이션 쿼리를 추천하십시오.'
    };
    await supabase.from('admin_settings').insert(defaults);
    return defaults;
  }
  
  // Also provide a local fallback if the column is newly added but empty
  if (!data.prompt_scenario_rewrite) data.prompt_scenario_rewrite = DEFAULT_REWRITE_PROMPT;
  
  return data;
}

export async function fetchAdminSettings() {
  // Legacy wrapper for old API routes relying on this format. Should ideally migrate them, but safe to keep.
  // We alias the DB columns to what they expect if needed, but many API routes fetch directly.
  return await getAdminSettingsAction();
}

export async function updateAdminSettingsAction(settings: any) {
  const supabase = createAdminClient();
  const { data: existing } = await supabase.from('admin_settings').select('id').limit(1).single();
  
  if (existing) {
    const { error } = await supabase.from('admin_settings').update({ ...settings, updated_at: new Date().toISOString() }).eq('id', existing.id);
    if (error) return { success: false, error: error.message };
  } else {
    // Should almost never happen due to lazy load, but safe
    const { error } = await supabase.from('admin_settings').insert(settings);
    if (error) return { success: false, error: error.message };
  }
  return { success: true };
}

export async function resetPromptsToDefaultAction() {
  const defaults = {
    model_id_primary: 'claude-sonnet-4-6',
    model_id_fast: 'claude-haiku-4-5-20251001',
    prompt_scenario_init: '당신은 엘리트 쇼러너입니다. 훌륭한 시놉시스를 작성하십시오.',
    prompt_episode_outline: '각 회차별 아웃라인을 작성하십시오.',
    prompt_episode_script: DEFAULT_SCRIPT_PROMPT,
    prompt_scenario_rewrite: DEFAULT_REWRITE_PROMPT,
    prompt_similar_content: '유사한 작품 3개를 추천하십시오.',
    prompt_prod_casting: '캐릭터에 어울리는 실존 배우를 추천하십시오.',
    prompt_prod_budget: '예상 제작비 예산을 산출하십시오.',
    prompt_prod_breakdown: '대본을 분석하여 소품, 의상, VFX, 엑스트라를 추출하십시오.',
    prompt_prod_ppl_location: 'PPL 카테고리와 구글 맵 검색용 로케이션 쿼리를 추천하십시오.'
  };
  return await updateAdminSettingsAction(defaults);
}

// ============================================
// Project CRUD — Slim & Fast
// ============================================

/**
 * Phase 1: Instant DB insert → returns projectId for immediate redirect.
 * AI generation happens later via the streaming API route.
 */
export async function createProjectAction(formData: any) {
  try {
    const supabase = createAdminClient();

    const episodeCount = formData.episodes || 1;

    const { data: project, error: insertError } = await supabase
      .from('projects_v2')
      .insert({
        title: formData.title || `${formData.genres?.[0] || 'Drama'} Epic`,
        genre: formData.genres?.[0] || 'Drama',
        platform: formData.platform || 'Movie',
        duration: formData.duration || 120,
        world: formData.world?.setting || 'Contemporary',
        logline: formData.logline || '',
        status: 'BAKING',
        progress: 0,
        // Removed episode_count to match projects_v2 schema. Placed securely in synopsis seed JSON.
      })
      .select('*')
      .single();

    if (insertError || !project) {
      console.error("Supabase Insert Error: FULL DATA ->", insertError);
      throw new Error(`Failed to create project in database: ${insertError?.message || 'Unknown DB error'}`);
    }

    // Store wizard seed data as JSON for the streaming route to consume
    await supabase
      .from('projects_v2')
      .update({ 
        synopsis: JSON.stringify({
          seed: true,
          formData: {
            platform: formData.platform,
            genres: formData.genres,
            episodes: episodeCount,
            duration: formData.duration,
            logline: formData.logline,
            world: formData.world,
            characters: formData.characters,
          }
        })
      })
      .eq('id', project.id);

    revalidatePath("/project-list");
    return { success: true, projectId: project.id };
  } catch (err: any) {
    console.error("Supabase Insert Error (Catch Block):", err);
    return { success: false, error: err.message || "Failed to create project." };
  }
}

/**
 * Phase 2: Persist the full AI-generated payload to Supabase
 * Called by the client after the stream completes.
 */
export async function persistGenerationAction(
  projectId: string,
  generation: ProjectGeneration
) {
  try {
    const supabase = createAdminClient();

    // 1. Update project core data
    await supabase
      .from('projects_v2')
      .update({
        logline: generation.logline,
        synopsis: generation.synopsis,
        status: 'COMPLETED',
        progress: 100,
      })
      .eq('id', projectId);

    // 2. Insert characters
    if (generation.characters && generation.characters.length > 0) {
      const charactersToInsert = generation.characters.map(char => ({
        project_id: projectId,
        name: char.name,
        gender: char.gender,
        age: 0, // ageGroup mapped separately
        job: char.role,
        look: char.description,
        secret: '',
        void: '',
        desire: '',
        relationship_type: char.relationshipToProtagonist,
      }));
      await supabase.from('characters_v2').insert(charactersToInsert);
    }

    // 3. Insert episodes
    if (generation.episodes && generation.episodes.length > 0) {
      const episodesToInsert = generation.episodes.map(ep => ({
        project_id: projectId,
        episode_number: ep.episodeNumber,
        title: ep.title,
        summary: ep.summary,
        script_content: ep.scriptContent,
      }));
      await supabase.from('episodes_v2').insert(episodesToInsert);
    }

    revalidatePath("/project-list");
    revalidatePath(`/project-contents/${projectId}`);
    return { success: true };
  } catch (err: any) {
    console.error("Persist Generation Error", err);
    return { success: false, error: err.message };
  }
}

/**
 * Generate script for Episode 2+ with Story Bible memory injection.
 * Uses Rolling Summary chain for long-term context.
 */
export async function generateEpisodeScriptAction(
  projectId: string,
  episodeId: string,
  episodeNumber: number
) {
  try {
    const supabase = createAdminClient();
    
    // 1. Fetch admin settings for dynamic model & prompt (v3.2 schema)
    const adminSettings = await getAdminSettingsAction();
    const ALLOWED_MODELS = ['claude-sonnet-4-6', 'claude-sonnet-3-5', 'claude-opus-4-5', 'claude-haiku-4-5-20251001'];
    const rawModelId = adminSettings.model_id_primary || 'claude-sonnet-4-6';
    const modelId = ALLOWED_MODELS.includes(rawModelId) ? rawModelId : 'claude-sonnet-4-6';
    const episodeSystemPrompt = adminSettings.prompt_episode_script || adminSettings.prompt_scenario_init || '당신은 엘리트 쇼러너입니다.';
    
    // 2. Fetch project context (Story Bible)
    const { data: project } = await supabase
      .from('projects_v2')
      .select('title, genre, platform, logline, synopsis, world, duration')
      .eq('id', projectId)
      .single();

    // 3. Fetch characters (Story Bible)
    const { data: characters } = await supabase
      .from('characters_v2')
      .select('name, gender, job, look, relationship_type')
      .eq('project_id', projectId);

    // 4. Fetch all previous episodes for Rolling Summary chain
    const { data: previousEpisodes } = await supabase
      .from('episodes_v2')
      .select('episode_number, title, summary, script_content')
      .eq('project_id', projectId)
      .lt('episode_number', episodeNumber)
      .order('episode_number', { ascending: true });

    // 5. Fetch current episode metadata
    const { data: currentEpisode } = await supabase
      .from('episodes_v2')
      .select('title, summary')
      .eq('id', episodeId)
      .single();

    // 6. Build Story Bible XML context
    const storyBible = JSON.stringify({
      title: project?.title,
      genre: project?.genre,
      platform: project?.platform,
      logline: project?.logline,
      synopsis: project?.synopsis,
      world: project?.world,
      characters: characters || [],
    });

    const rollingSummaries = (previousEpisodes || [])
      .map(ep => `제${ep.episode_number}화 「${ep.title}」: ${ep.summary}`)
      .join('\n\n');

    // 7. Compose XML-structured system prompt (v2.1 Architecture)
    const systemPrompt = `<system_instructions>
${episodeSystemPrompt}
</system_instructions>

<story_bible>${storyBible}</story_bible>

<previous_events>
${rollingSummaries || '(첫 번째 에피소드 이후 없음)'}
</previous_events>

<current_task>
제 ${episodeNumber}화 「${currentEpisode?.title || ''}」의 시나리오를 작성하십시오.
에피소드 요약: ${currentEpisode?.summary || ''}
반드시 업계 표준 시나리오 포맷(INT./EXT., 캐릭터 이름 대문자, 대사)을 사용하십시오.
또한, 이 에피소드의 핵심 사건을 300자로 요약한 updatedSummary를 함께 생성하십시오.
</current_task>`;

    // 8. Call Claude with dynamic model (v3.2 validated)
    const { object: result } = await generateObject({
      model: anthropic(modelId),
      schema: EpisodeScriptSchema,
      system: systemPrompt,
      prompt: `제 ${episodeNumber}화의 완전한 시나리오를 작성하십시오.`,
    });

    // 9. Persist to DB
    await supabase
      .from('episodes_v2')
      .update({
        script_content: result.scriptContent,
        summary: result.updatedSummary,
      })
      .eq('id', episodeId);

    revalidatePath(`/project-contents/${projectId}`);
    return { success: true, scriptContent: result.scriptContent };
  } catch (err: any) {
    console.error("Episode Script Generation Error", err);
    return { success: false, error: err.message };
  }
}

/**
 * AI Co-Writer Steering Action (v4.2 Structured Drafting)
 * Generates a single scene draft based on user instruction and context.
 */
export async function generateEpisodeSceneDraftAction(
  projectId: string,
  episodeId: string,
  instruction: string,
  previousScript: string = ""
) {
  try {
    const supabase = createAdminClient();
    const adminSettings = await getAdminSettingsAction();
    const modelId = adminSettings.model_id_primary || 'claude-sonnet-4-6';
    
    // 1. Fetch project context (Story Bible)
    const { data: project } = await supabase.from('projects_v2').select('*').eq('id', projectId).single();
    const { data: characters } = await supabase.from('characters_v2').select('*').eq('project_id', projectId);
    const { data: currentEpisode } = await supabase.from('episodes_v2').select('*').eq('id', episodeId).single();

    const storyBible = JSON.stringify({
      title: project?.title,
      genre: project?.genre,
      logline: project?.logline,
      synopsis: project?.synopsis,
      world: project?.world,
      characters: characters || [],
    });

    // 2. Compose steering system prompt
    const systemPrompt = `<system_instructions>
당신은 현장 경험이 풍부한 일급 보조 작가이자 공동 집필 파트너입니다. 
당신의 목표는 메인 작가(사용자)의 지시사항에 맞추어 시나리오의 특정 '씬(Scene)' 초고를 작성하는 것입니다.

[집필 가이드라인]
- 반드시 제공된 스토리 바이블과 캐릭터 설정을 준수하십시오.
- 사용자의 [steering_instruction]을 최우선으로 반영하여 씬의 톤과 내용을 조절하십시오.
- 이전까지 작성된 대본의 흐름을 파악하여 자연스럽게 이어지도록 하십시오.
- 결과물은 반드시 구조화된 JSON(EpisodeSceneDraft) 형식으로 출력해야 합니다.
</system_instructions>

<story_bible>${storyBible}</story_bible>

<previous_script_context>
${previousScript || '(에피소드 시작 부분)'}
</previous_script_context>`;

    const { object: draft } = await generateObject({
      model: anthropic(modelId),
      schema: EpisodeSceneDraftSchema,
      system: systemPrompt,
      prompt: `[steering_instruction]: ${instruction}\n\n위 지시사항에 따라 제 ${currentEpisode?.episode_number}화의 다음 씬 초고를 작성하십시오.`,
    });

    return { success: true, draft };
  } catch (err: any) {
    console.error("Co-Writer Steering Error:", err);
    return { success: false, error: err.message };
  }
}

export async function updateEpisodeScriptContentAction(episodeId: string, projectId: string, newContent: string) {
  try {
    const supabase = createAdminClient();
    await supabase
      .from('episodes_v2')
      .update({ script_content: newContent })
      .eq('id', episodeId);
      
    revalidatePath(`/project-contents/${projectId}`);
    return { success: true };
  } catch (err: any) {
    console.error("Script Overwrite Error", err);
    return { success: false, error: err.message };
  }
}

// ============================================
// Data Fetching (Unchanged)
// ============================================

export async function fetchProjectsAction() {
  const supabase = createAdminClient();
  // Sort sequence: 1. User Projects (is_sample=false=0) first, 2. Samples (is_sample=true=1) last. 
  // Then within each group, sort by created_at DESC for latest first.
  const { data, error } = await supabase
    .from('projects_v2')
    .select('*')
    .order('is_sample', { ascending: true })
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export async function fetchProjectDetailsAction(id: string) {
  const supabase = createAdminClient();
  const { data: project } = await supabase.from('projects_v2').select('*').eq('id', id).single();
  if (!project) return null;

  const { data: characters } = await supabase.from('characters_v2').select('*').eq('project_id', id);
  const { data: scenes } = await supabase.from('scenes_v2').select('*').eq('project_id', id).order('scene_number', { ascending: true });
  const { data: episodes } = await supabase.from('episodes_v2').select('*').eq('project_id', id).order('episode_number', { ascending: true });

  return { ...project, characters: characters || [], scenes: scenes || [], episodes: episodes || [] };
}

// ============================================
// ADMIN NEXUS NATIVE OPERATIONS
// ============================================

export async function fetchAdminStatsAction(): Promise<{ total: number; today: number; completed: number; costUsd: string; episodeCount: number }> {
  const supabase = createAdminClient();
  const { data: projects } = await supabase.from('projects_v2').select('id, created_at, status');
  
  // Efficiently count episodes that actually have a generated script
  const { count: episodeCount } = await supabase
    .from('episodes_v2')
    .select('*', { count: 'exact', head: true })
    .not('script_content', 'is', null);
  
  if (!projects) return { total: 0, today: 0, completed: 0, costUsd: "0.00", episodeCount: 0 };

  const total = projects.length;
  const today = projects.filter(p => new Date(p.created_at).getTime() > Date.now() - 86400000).length;
  const completed = projects.filter(p => p.status === 'COMPLETED').length;
  
  // Cost based on actual script generation API calls
  const costUsd = ((episodeCount || 0) * 0.05).toFixed(2); 

  return { total, today, completed, costUsd, episodeCount: episodeCount || 0 };
}

export async function deleteProjectAction(id: string) {
  try {
    const supabase = createAdminClient();

    // 1. Manual Cascade: Delete dependent records first to resolve FK constraints (Err 23503)
    await Promise.all([
      supabase.from('characters_v2').delete().eq('project_id', id),
      supabase.from('episodes_v2').delete().eq('project_id', id),
      supabase.from('scenes_v2').delete().eq('project_id', id)
    ]);

    // 2. Delete the parent project node
    const { error } = await supabase.from('projects_v2').delete().eq('id', id);
    
    if (error) {
      console.error("Supabase Deletion Error:", error);
      return { success: false, error: error.message };
    }

    // 3. Force cache revalidation for all relevant views
    revalidatePath("/admin");
    revalidatePath("/project-list");
    
    return { success: true };
  } catch (err: any) {
    console.error("Catch Block Deletion Failure:", err);
    return { success: false, error: err.message || "Failed to excise project from memory." };
  }
}

export async function purgeAllProjectsAction() {
  const supabase = createAdminClient();
  const { error } = await supabase.from('projects_v2').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin");
  revalidatePath("/project-list");
  return { success: true };
}

export async function updateProjectAction(id: string, updates: { title?: string, genre?: string, logline?: string, synopsis?: string }) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('projects_v2')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error("Supabase Update Error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin");
    revalidatePath("/project-list");
    revalidatePath(`/project-contents/${id}`);
    
    return { success: true };
  } catch (err: any) {
    console.error("Catch Block Update Failure:", err);
    return { success: false, error: err.message || "Failed to persist changes to the Void." };
  }
}

export async function insertSampleProjectsAction() {
  try {
    const supabase = createAdminClient();
    console.log("--- Starting Elite Sample Sync (Non-Destructive) ---");
  
    for (const sample of ELITE_SAMPLES) {
      // 1. Safe Upsert Project
      const { data: project, error: pError } = await supabase
        .from('projects_v2')
        .upsert(sample, { onConflict: 'id' })
        .select('id')
        .single();

      if (pError || !project) {
        console.error(`Error syncing sample ${sample.title}:`, pError);
        continue;
      }

      // 2. Extract and Sync Characters (Metadata-based)
      let meta: any = {};
      try {
        meta = typeof sample.synopsis === 'string' ? JSON.parse(sample.synopsis) : sample.synopsis;
      } catch (e) {
        console.error("Synopsis Parse Error:", e);
      }

      const rawChars = meta.characters || sample.characters || [];
      if (rawChars.length > 0) {
        const protagonists = rawChars.map((c: any) => ({
          project_id: project.id,
          name: c.name,
          job: c.role || c.job || 'Archetype',
          gender: c.gender || 'Neutral',
          look: c.trait || c.description || c.look || 'Defining features',
          relationship_type: c.relationshipToProtagonist || c.relationship_type || 'Protagonist'
        }));

        // We use upsert for characters as well if we had unique keys, 
        // but for now, we'll just insert if they don't exist or just avoid duplicates by checking.
        // For simplicity in this sync, we'll clear just THIS project's characters to refresh them, 
        // which is safer than clearing ALL samples.
        await supabase.from('characters_v2').delete().eq('project_id', project.id);
        await supabase.from('characters_v2').insert(protagonists);
      }
      
      console.log(`✔ Synced: ${sample.title}`);
    }

    revalidatePath("/admin");
    revalidatePath("/project-list");
    return { success: true };
  } catch (err: any) {
    console.error("Sync Error:", err);
    return { success: false, error: err.message };
  }
}
