import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { ScriptBreakdownSchema } from '@/lib/schemas/generation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BreakdownOutputListSchema = z.object({
  scenes: z.array(ScriptBreakdownSchema).describe("List of script breakdowns mapped to their specific scene_number.")
});

export async function POST(
  request: Request
) {
  try {
    const { episodeId } = await request.json();
    if (!episodeId) return new Response("Missing episodeId", { status: 400 });

    // 1. Fetch Admin Settings (MANDATORY per rule 1)
    const { data: adminSettings } = await supabase
      .from('admin_settings')
      .select('model_id_primary, prompt_prod_breakdown')
      .limit(1)
      .single();

    const modelId = adminSettings?.model_id_primary || 'claude-3-5-sonnet-20241022';
    const systemPrompt = adminSettings?.prompt_prod_breakdown || 'Extract production breakdown per scene from the given script.';

    // 2. Fetch Script Content from Episodes
    const { data: episode } = await supabase
      .from('episodes_v2')
      .select('id, episode_number, script_content')
      .eq('id', episodeId)
      .single();

    if (!episode || !episode.script_content) {
      return new Response("Episode or script_content not found", { status: 404 });
    }

    const userPrompt = `
Analyze the following script content for Episode ${episode.episode_number}.
For each scene identified in the text, extract the script breakdown requirements (props, wardrobe, vfx, extras).

<script_content>
${episode.script_content}
</script_content>
`;

    // 3. AI Generation
    const { object } = await generateObject({
      model: anthropic(modelId),
      schema: BreakdownOutputListSchema,
      system: systemPrompt,
      prompt: userPrompt,
    });

    // 4. Persistence into strictly relational table
    // The DB schema specifies TEXT so we serialize the arrays/objects.
    const inserts = object.scenes.map(scene => ({
      episode_id: episodeId,
      scene_number: scene.scene_number,
      props: JSON.stringify(scene.props),
      wardrobe: JSON.stringify(scene.wardrobe),
      vfx: JSON.stringify(scene.vfx),
      extras: String(scene.extras)
    }));

    if (inserts.length === 0) {
      throw new Error("No scenes extracted.");
    }

    const { data: savedBreakdowns, error: dbErr } = await supabase
      .from('production_script_breakdowns')
      .insert(inserts)
      .select();

    if (dbErr) throw new Error(`DB Insert Error: ${dbErr.message}`);

    return new Response(JSON.stringify({ success: true, data: savedBreakdowns }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('[API] Breakdown Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
