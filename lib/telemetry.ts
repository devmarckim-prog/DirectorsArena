import { createAdminClient } from "./supabase/server";

/**
 * Anthropic Model Pricing (USD per 1M tokens)
 * As of 2024 Pricing Guidelines
 */
const PRICING_MAP: Record<string, { prompt: number; completion: number }> = {
  'claude-sonnet-4-6': { prompt: 3.0, completion: 15.0 },
  'claude-sonnet-3-5': { prompt: 3.0, completion: 15.0 },
  'claude-haiku-4-5-20251001': { prompt: 0.25, completion: 1.25 },
  'claude-3-5-haiku-20241022': { prompt: 0.25, completion: 1.25 },
  'claude-3-haiku-20240307': { prompt: 0.25, completion: 1.25 },
};

interface UsageParams {
  projectId?: string;
  modelId: string;
  featureName: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
  };
}

/**
 * Logs API usage to api_usage_logs table for real-time cost analytics.
 * (v7.2 Telemetry Engine)
 */
export async function logApiUsage({ projectId, modelId, featureName, usage }: UsageParams) {
  try {
    const pricing = PRICING_MAP[modelId] || PRICING_MAP['claude-3-5-haiku-20241022'];
    
    const promptCost = (usage.promptTokens / 1000000) * pricing.prompt;
    const completionCost = (usage.completionTokens / 1000000) * pricing.completion;
    const totalCost = promptCost + completionCost;

    console.log(`[Telemetry] Logging ${featureName} usage: ${totalCost.toFixed(6)} USD`);

    const supabase = createAdminClient();
    const { error } = await supabase.from('api_usage_logs').insert({
      project_id: projectId,
      model_id: modelId,
      feature_name: featureName,
      prompt_tokens: usage.promptTokens,
      completion_tokens: usage.completionTokens,
      total_tokens: usage.promptTokens + usage.completionTokens,
      cost_usd: totalCost,
    });

    if (error) {
       console.error("[Telemetry] DB Insert Failed:", error.message);
    }
  } catch (err) {
    console.error("[Telemetry] Critical Logging Failure:", err);
  }
}
