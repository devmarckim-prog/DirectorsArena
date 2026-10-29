import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { PPLLocationSchema } from '@/lib/schemas/generation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PPLLocationListSchema = z.object({
  locations: z.array(PPLLocationSchema).describe("List of PPL and Location search suggestions mapped to specific scene numbers.")
});

export async function POST(
  request: Request
) {
  try {
    const { episodeId } = await request.json();
    if (!episodeId) return new Response("Missing episodeId", { status: 400 });

    // 1. Fetch Admin Settings
    const { data: adminSettings } = await supabase
      .from('admin_settings')
      .select('model_id_fast, prompt_prod_ppl_location')
      .limit(1)
      .single();

    const modelId = adminSettings?.model_id_fast || 'claude-3-5-haiku-20241022';
    const systemPrompt = adminSettings?.prompt_prod_ppl_location || 'Identify PPL opportunities and recommend location queries.';

    // 2. Fetch Script Content
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
Identify scenes that are perfect for Product Placement (PPL) and suggest real-world Location Search Queries (generic Google Maps search strings like "Coffee shop in Seoul").

<script_content>
${episode.script_content}
</script_content>
`;

    // 3. AI Generation
    const { object } = await generateObject({
      model: anthropic(modelId),
      schema: PPLLocationListSchema,
      system: systemPrompt,
      prompt: userPrompt,
    });

    // 4. Persistence into strictly relational table
    const inserts = object.locations.map(loc => ({
      episode_id: episodeId,
      scene_number: loc.scene_number,
      ppl_category: loc.ppl_category,
      location_query: loc.location_query
    }));

    if (inserts.length === 0) {
      throw new Error("No PPL/Location data extracted.");
    }

    const { data: savedLocations, error: dbErr } = await supabase
      .from('production_ppl_locations')
      .insert(inserts)
      .select();

    if (dbErr) throw new Error(`DB Insert Error: ${dbErr.message}`);

    return new Response(JSON.stringify({ success: true, data: savedLocations }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('[API] PPL/Location Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
