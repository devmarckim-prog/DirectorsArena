import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { ProductionBudgetSchema } from '@/lib/schemas/generation';
import { isRateLimited, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_MODELS = ['claude-sonnet-4-6', 'claude-sonnet-3-5', 'claude-opus-4-5', 'claude-haiku-4-5-20251001'];
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const BudgetOutputSchema = z.object({
  budget: ProductionBudgetSchema
});

export async function POST(
  request: Request
) {
  const ip = getClientIp(request);
  if (isRateLimited(ip, RATE_LIMITS.PRODUCTION)) {
    return new Response(JSON.stringify({ error: '요청 한도 초과. 1분 후 재시도.' }), { status: 429 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body?.projectId) return new Response("Missing projectId", { status: 400 });
    if (!UUID_REGEX.test(body.projectId)) return new Response("Invalid projectId format", { status: 400 });
    const { projectId } = body;

    // 1. Fetch Admin Settings
    const { data: adminSettings } = await supabase
      .from('admin_settings')
      .select('model_id_fast, prompt_prod_budget')
      .limit(1)
      .single();

    const rawModel = adminSettings?.model_id_fast || 'claude-haiku-4-5-20251001';
    const modelId = ALLOWED_MODELS.includes(rawModel) ? rawModel : 'claude-haiku-4-5-20251001';
    const systemPrompt = adminSettings?.prompt_prod_budget || 'Calculate the estimated production budget.';

    // 2. Fetch Project Context
    const { data: project } = await supabase
      .from('projects_v2')
      .select('title, synopsis, logline, platform, episode_count, duration, genre')
      .eq('id', projectId)
      .single();

    if (!project) return new Response("Project not found", { status: 404 });

    const userPrompt = `
Analyze the following project to generate a standard film/TV estimated top-sheet budget.
Title: ${project.title || 'Untitled'}
Genre: ${project.genre}
Format/Platform: ${project.platform}
Episode Count: ${project.episode_count || 1}
Duration per Episode: ${project.duration} mins
Synopsis: ${project.synopsis}
`;

    // 3. AI Generation
    const { object } = await generateObject({
      model: anthropic(modelId),
      schema: BudgetOutputSchema,
      system: systemPrompt,
      prompt: userPrompt,
    });

    // 4. Persistence into strictly relational table
    const insertData = {
      project_id: projectId,
      estimated_cost: object.budget.estimated_cost,
      breakdown_json: object.budget.breakdown_json
    };

    const { data: savedBudget, error: dbErr } = await supabase
      .from('production_budgets')
      .insert([insertData])
      .select();

    if (dbErr) throw new Error(`DB Insert Error: ${dbErr.message}`);

    return new Response(JSON.stringify({ success: true, data: savedBudget[0] }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('[API] Budget Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
