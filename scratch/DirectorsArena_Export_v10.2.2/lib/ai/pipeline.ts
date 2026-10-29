import { anthropic } from '@ai-sdk/anthropic';
import { generateObject, streamObject } from 'ai';
import { SceneSchema, BlockSchema } from '../schemas/project';
import { getResolvedModelId } from './models';
import { getAdminSettingsAction } from '../actions/admin';

/**
 * Stage 1: Writing (Draft Generation)
 */
export async function generateDraft(sceneInfo: any) {
  const adminSettings = await getAdminSettingsAction();
  const modelId = getResolvedModelId(adminSettings.model_id_primary, 'claude-3-haiku-20240307');

  return streamObject({
    model: anthropic(modelId),
    schema: SceneSchema,
    prompt: `Write a scene based on: ${JSON.stringify(sceneInfo)}`,
  });
}

/**
 * Stage 2: QC (Quality Control / Audit)
 * This runs automatically after Stage 1
 */
export async function auditScene(sceneData: any) {
  const adminSettings = await getAdminSettingsAction();
  const modelId = getResolvedModelId(adminSettings.model_id_fast, 'claude-3-haiku-20240307');

  const auditResult = await generateObject({
    model: anthropic(modelId),
    schema: SceneSchema.pick({ qc_report: true, status: true }),
    prompt: `Audit this scene for consistency and quality: ${JSON.stringify(sceneData)}`,
  });
  
  return auditResult.object;
}

/**
 * Core Pipeline Orchestrator
 */
export async function runPipeline(sceneId: string) {
    // 1. Fetch scene from Supabase
    // 2. Run Writing Phase
    // 3. (Automatic) Run QC Phase
    // 4. Update Supabase with final status
}
