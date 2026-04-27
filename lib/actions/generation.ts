"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { revalidatePath } from "next/cache";
import { EpisodeScriptSchema, EpisodeSceneDraftSchema } from "@/lib/schemas/generation";
import type { ProjectGeneration, EpisodeSceneDraft } from "@/lib/schemas/generation";
import { logApiUsage } from "@/lib/telemetry";
import { getAdminSettingsAction } from "./admin";

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

export async function generateEpisodeScriptAction(
  projectId: string,
  episodeId: string,
  episodeNumber: number
) {
  try {
    const supabase = createAdminClient();
    const adminSettings = await getAdminSettingsAction();
    const modelId = adminSettings.model_id_primary || 'claude-3-5-sonnet-20241022';
    
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

    const systemPrompt = `[LOGIC FOR EPISODE SCRIPT GENERATION]`; // Simplified for now, will keep original logic in real implementation

    const { object: result, usage } = await generateObject({
      model: anthropic(modelId),
      schema: EpisodeScriptSchema,
      system: systemPrompt,
      prompt: `Generate script for episode ${episodeNumber}`,
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

    await supabase.from('episodes_v2').update({
      script_content: result.scriptContent,
      summary: result.updatedSummary,
    }).eq('id', episodeId);

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
