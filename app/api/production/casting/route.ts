import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { ProductionCastingSchema } from '@/lib/schemas/generation';
import { isRateLimited, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_MODELS = ['claude-sonnet-4-6', 'claude-sonnet-3-5', 'claude-opus-4-5', 'claude-haiku-4-5-20251001'];
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CastingOutputListSchema = z.object({
  castings: z.array(
    ProductionCastingSchema.extend({
      character_name: z.string().describe("Exact name of the character from the provided list")
    })
  ).describe("Array of actor recommendations mapped to character names.")
});

export async function POST(
  request: Request
) {
  // [SECURITY] Rate limiting
  const ip = getClientIp(request);
  if (isRateLimited(ip, RATE_LIMITS.PRODUCTION)) {
    return new Response(JSON.stringify({ error: '요청 한도 초과. 1분 후 재시도.' }), { status: 429 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body?.projectId) return new Response("Missing projectId", { status: 400 });
    // [SECURITY] Validate UUID format to prevent injection-style attacks
    if (!UUID_REGEX.test(body.projectId)) return new Response("Invalid projectId format", { status: 400 });
    const { projectId } = body;

    // 1. Fetch Admin Settings
    const { data: adminSettings } = await supabase
      .from('admin_settings')
      .select('model_id_fast, prompt_prod_casting')
      .limit(1)
      .single();

    const rawModel = adminSettings?.model_id_fast || 'claude-haiku-4-5-20251001';
    const modelId = ALLOWED_MODELS.includes(rawModel) ? rawModel : 'claude-haiku-4-5-20251001';
    const systemPrompt = adminSettings?.prompt_prod_casting || 'Recommend real-world actors for the given characters.';

    // 2. Fetch Project Context & Characters
    const { data: project } = await supabase
      .from('projects_v2')
      .select('id, title, synopsis, logline')
      .eq('id', projectId)
      .single();

    const { data: characters } = await supabase
      .from('characters_v2')
      .select('*')
      .eq('project_id', projectId);

    if (!project || !characters || characters.length === 0) {
      return new Response("Project or characters not found", { status: 404 });
    }

    const charactersContext = characters.map(c => `- ${c.name} (${c.job}, ${c.gender}, ${c.look}): ${c.secret || c.desire || ''}`).join('\n');

    const userPrompt = `
Here is the project synopsis:
${project.synopsis}

Here are the characters:
${charactersContext}

For EVERY character listed above, recommend a highly suitable real-world actor and explain why.
`;

    // 3. AI Generation
    const { object } = await generateObject({
      model: anthropic(modelId),
      schema: CastingOutputListSchema,
      system: systemPrompt,
      prompt: userPrompt,
    });

    // 4. Persistence into strictly relational table
    // We must map the character_name back to the character_id
    const inserts: any[] = [];
    
    for (const cast of object.castings) {
      // Find the character by name (case insensitive / fuzzy match)
      const matchedChar = characters.find(c => 
        c.name.toLowerCase().includes(cast.character_name.toLowerCase()) || 
        cast.character_name.toLowerCase().includes(c.name.toLowerCase())
      );

      if (matchedChar) {
        inserts.push({
          project_id: projectId,
          character_id: matchedChar.id,
          recommended_actor: cast.recommended_actor,
          reason: cast.reason
        });
      }
    }

    if (inserts.length === 0) {
      throw new Error("Could not map AI recommended casting back to valid character IDs.");
    }

    const { data: savedCasting, error: dbErr } = await supabase
      .from('production_casting')
      .insert(inserts)
      .select();

    if (dbErr) throw new Error(`DB Insert Error: ${dbErr.message}`);

    // Return the inserted data
    return new Response(JSON.stringify({ success: true, data: savedCasting }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('[API] Casting Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
