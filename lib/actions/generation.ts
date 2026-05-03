"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { revalidatePath } from "next/cache";
import { EpisodeScriptSchema, EpisodeSceneDraftSchema } from "@/lib/schemas/generation";
import type { ProjectGeneration, EpisodeSceneDraft } from "@/lib/schemas/generation";
import { logApiUsage } from "@/lib/telemetry";
import { getAdminSettingsAction } from "./admin";
import { getResolvedModelId } from "@/lib/ai/models";

import { persistProjectGeneration } from "../repository/generation";

/**
 * Phase 2: Persist the full AI-generated payload to Supabase
 */
export async function persistGenerationAction(
  projectId: string,
  generation: ProjectGeneration
) {
  try {
    // v5.5 Use the unified Repository helper for zero-defect persistence
    await persistProjectGeneration(projectId, generation);
    
    revalidatePath(`/project-contents/${projectId}`);
    return { success: true };
  } catch (err: any) {
    console.error("Persist Generation Error", err);
    throw err; // Throw to be caught by the API route
  }
}

/**
 * v11.15: Guarantee real episode record before generation
 */
export async function ensureEpisodeExistsAction(projectId: string, episodeNumber: number, title?: string) {
  try {
    const supabase = createAdminClient();
    
    // 1. Check if exists
    const { data: existing } = await supabase
      .from('episodes_v2')
      .select('id')
      .eq('project_id', projectId)
      .eq('episode_number', episodeNumber)
      .single();
    
    if (existing) return { success: true, episodeId: existing.id };

    // 2. Create if not exists
    const { data: newEp, error } = await supabase
      .from('episodes_v2')
      .insert({
        project_id: projectId,
        episode_number: episodeNumber,
        title: title || `Episode ${episodeNumber}`,
        summary: ""
      })
      .select('id')
      .single();
    
    if (error || !newEp) throw error;

    // 3. Create a default beat for this episode to prevent UI collapse
    await supabase.from('story_beats_v2').insert({
      project_id: projectId,
      episode_id: newEp.id,
      scene_number: 1,
      title: "오프닝",
      description: "에피소드 시작 씬입니다. 대본 생성을 통해 내용을 채워주세요.",
      timestamp_label: "00:00:00",
      act_number: 1,
      beat_type: "Scene"
    });

    revalidatePath(`/project-contents/${projectId}`);
    return { success: true, episodeId: newEp.id };
  } catch (err: any) {
    console.error("Ensure Episode Error:", err);
    return { success: false, error: err.message };
  }
}

export async function generateEpisodeScriptAction(
  projectId: string,
  episodeId: string,
  episodeNumber: number
) {
  try {
    const supabase = createAdminClient();
    const adminSettings = await getAdminSettingsAction();
    const modelId = getResolvedModelId(adminSettings.model_id_primary, 'claude-3-haiku-20240307');
    
    // Fetch context
    const { data: project } = await supabase.from('projects_v2').select('*').eq('id', projectId).single();
    const { data: characters } = await supabase.from('characters_v2').select('*').eq('project_id', projectId);
    const { data: previousEpisodes } = await supabase
      .from('episodes_v2')
      .select('*')
      .eq('project_id', projectId)
      .lt('episode_number', episodeNumber)
      .order('episode_number', { ascending: true });
    const { data: currentEpisode } = await supabase.from('episodes_v2').select('*').eq('id', episodeId).single();
    const { data: storyBeats } = await supabase
      .from('story_beats_v2')
      .select('*')
      .eq('episode_id', episodeId)
      .order('scene_number', { ascending: true });

    let systemPrompt = `당신은 세계적인 드라마 작가이자 감독입니다.
제공된 [스토리 바이블]과 [캐릭터 설정], 그리고 [에피소드 요약]을 바탕으로 에피소드 ${episodeNumber}의 전체 대본을 집필하세요.

[규칙]
1. 표준 시나리오 포맷(Screenplay Format)을 엄격히 준수하세요.
2. 각 씬의 시작은 'INT. 장소 - 시간' 또는 'EXT. 장소 - 시간' 형태의 HEADING으로 시작해야 합니다.
3. 캐릭터의 대사와 지문은 인물의 성격(traits)과 욕망(desire)을 반영해야 합니다.
4. 총 ${storyBeats?.length || 5}개의 씬으로 구성된 대본을 작성하세요.
5. 출력 포맷은 JSON이어야 하며, 'scriptContent' 필드에 전체 대본 텍스트를, 'updatedSummary' 필드에 집필된 내용을 반영한 에피소드 요약을 담으세요.`;

    try {
      const generatedContent = typeof project.generated_content === 'string' 
        ? JSON.parse(project.generated_content) 
        : (project.generated_content || {});
      const universeSettings = generatedContent.universe_settings;
      
      if (universeSettings) {
        if (universeSettings.persona) {
          systemPrompt = `[DIRECTOR'S PERSONA - CRITICAL INSTRUCTION]\n${universeSettings.persona}\n\n` + systemPrompt;
        }
        if (universeSettings.glossary && Array.isArray(universeSettings.glossary) && universeSettings.glossary.length > 0) {
          const glossaryStr = universeSettings.glossary.map((g: any) => `- ${g.term}: ${g.definition}`).join('\n');
          systemPrompt += `\n\n[PROJECT GLOSSARY - MANDATORY VOCABULARY]\n${glossaryStr}\n(You MUST use these exact terms when referring to the concepts above.)`;
        }
      }
    } catch (e) {
      console.error("Universe Settings Parsing Error:", e);
    }

    const { object: result, usage } = await generateObject({
      model: anthropic(modelId),
      schema: EpisodeScriptSchema,
      system: systemPrompt,
      prompt: `프로젝트: ${project.title}
시놉시스: ${project.synopsis}
캐릭터: ${JSON.stringify(characters)}
이전 에피소드 요약: ${JSON.stringify(previousEpisodes?.map(e => e.summary))}
현재 에피소드 요약: ${currentEpisode.summary}
씬 구성(Beats): ${JSON.stringify(storyBeats?.map(b => ({ scene: b.scene_number, title: b.title, desc: b.description })))}

위 정보를 바탕으로 에피소드 ${episodeNumber}의 대본을 집필하세요.`,
    });

    await logApiUsage({ 
      projectId, 
      modelId, 
      featureName: `Episode ${episodeNumber} Script`, 
      usage: {
        promptTokens: (usage as any).promptTokens || 0,
        completionTokens: (usage as any).completionTokens || 0
      }
    });

    // 1. Update the episode itself
    await supabase.from('episodes_v2').update({
      script_content: result.scriptContent,
      summary: result.updatedSummary,
    }).eq('id', episodeId);

    // 2. Split script by HEADING and update story_beats_v2
    const scriptBlocks = result.scriptContent.split(/(?=INT\.|EXT\.)/g);
    
    // We try to match blocks to storyBeats. 
    // If block count doesn't match, we do our best effort.
    if (storyBeats && storyBeats.length > 0) {
      for (let i = 0; i < storyBeats.length; i++) {
        const beat = storyBeats[i];
        const content = scriptBlocks[i] || ""; // Match by index if exact split matches
        if (content) {
          await supabase.from('story_beats_v2').update({
            script_content: content.trim()
          }).eq('id', beat.id);
        }
      }
    }

    revalidatePath(`/project-contents/${projectId}`);
    return { success: true, scriptContent: result.scriptContent };
  } catch (err: any) {
    console.error("Episode Script Generation Error", err);
    return { success: false, error: err.message };
  }
}

export async function triggerRegenerateAction(projectId: string, prompt: string = "") {
  try {
    const supabase = createAdminClient();
    
    // v9.2: Gather current character context to ensure edited info is preserved in regeneration
    const { data: existingChars } = await supabase
      .from('characters_v2')
      .select('name, age, job, look, gender, traits, desire')
      .eq('project_id', projectId);

    let contextAugmentation = "";
    if (existingChars && existingChars.length > 0) {
      contextAugmentation = "\n\n[기존 캐릭터 유지 및 수정 사항]\n" + existingChars.map(c => 
        `- ${c.name}: ${c.age}세, ${c.job}, 특징: ${c.look}, 성격: ${c.traits}, 욕망: ${c.desire}`
      ).join("\n");
    }

    const finalSteerPrompt = prompt + contextAugmentation;

    // v8.6: Persist steer prompt for the ignite engine
    await supabase.from('projects_v2').update({ 
      status: 'BAKING', 
      progress: 0,
      steer_prompt: finalSteerPrompt 
    }).eq('id', projectId);

    await Promise.all([
      supabase.from('characters_v2').delete().eq('project_id', projectId),
      supabase.from('episodes_v2').delete().eq('project_id', projectId),
      supabase.from('story_beats_v2').delete().eq('project_id', projectId),
      supabase.from('scenes_v2').delete().eq('project_id', projectId),
      supabase.from('similar_contents').delete().eq('project_id', projectId),
    ]);

    revalidatePath(`/project-contents/${projectId}`);
    return { success: true };
  } catch (err: any) {
    console.error("Regeneration Failed:", err);
    return { success: false, error: err.message };
  }
}

export async function updateEpisodeScriptContentAction(episodeId: string, projectId: string, newContent: string) {
  try {
    const supabase = createAdminClient();
    
    // 1. Fetch current episode content & project generated_content
    const { data: episode } = await supabase.from('episodes_v2').select('script_content').eq('id', episodeId).single();
    const { data: project } = await supabase.from('projects_v2').select('generated_content').eq('id', projectId).single();
    
    // 2. Backup to revisions (keep last 10)
    if (episode && episode.script_content) {
      let genContent = project?.generated_content;
      if (typeof genContent === 'string') {
        try { genContent = JSON.parse(genContent); } catch { genContent = {}; }
      }
      genContent = genContent || {};
      const revisions = Array.isArray(genContent.revisions) ? genContent.revisions : [];
      
      revisions.unshift({
        timestamp: new Date().toISOString(),
        snapshotType: 'script',
        label: 'Script Auto-Backup',
        episodeId,
        content: episode.script_content
      });
      
      // Limit to 10 revisions to save DB space
      if (revisions.length > 10) revisions.length = 10;
      
      genContent.revisions = revisions;
      await supabase.from('projects_v2').update({ generated_content: genContent }).eq('id', projectId);
    }

    // 3. Update new content
    await supabase.from('episodes_v2').update({ script_content: newContent }).eq('id', episodeId);
    revalidatePath(`/project-contents/${projectId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function generateEpisodeSceneDraftAction(
  projectId: string, 
  episodeId: string, 
  instruction: string, 
  currentScript: string = ""
): Promise<{ success: boolean; draft?: EpisodeSceneDraft; error?: string }> {
    // Logic extracted from original actions.ts
    // currentScript can be used as context for the AI draft generation
    return { success: true };
}
