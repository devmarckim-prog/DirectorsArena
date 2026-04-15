import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { SimilarContentSchema } from '@/lib/schemas/generation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CompsOutputSchema = z.object({
  contents: z.array(SimilarContentSchema).min(1).describe("Generate 3 to 5 similar contents/comps.")
});

export async function POST(
  request: Request
) {
  try {
    const { projectId } = await request.json();
    if (!projectId) return new Response("Missing projectId", { status: 400 });

    // 1. Fetch Admin Settings
    const { data: adminSettings } = await supabase
      .from('admin_settings')
      .select('model_id_fast, prompt_similar_content')
      .limit(1)
      .single();

    const modelId = adminSettings?.model_id_fast || 'claude-3-5-haiku-20241022';
    const systemPrompt = adminSettings?.prompt_similar_content || 'You are an elite showrunner. Recommend 3 to 5 similar contents.';

    // 2. Fetch Project Context
    const { data: project } = await supabase
      .from('projects_v2')
      .select('title, logline, synopsis, genre, world')
      .eq('id', projectId)
      .single();

    if (!project) return new Response("Project not found", { status: 404 });

    const userPrompt = `
Here is the project data:
Title: ${project.title || 'Untitled'}
Genre: ${project.genre}
World: ${project.world}
Logline: ${project.logline}
Synopsis: ${project.synopsis}

Please recommend 3-5 similar existing box office hits, TV shows, or critically acclaimed content.
`;

    // 3. AI Generation
    const { object } = await generateObject({
      model: anthropic(modelId),
      schema: CompsOutputSchema,
      system: systemPrompt,
      prompt: userPrompt,
    });

    // 4. Persistence into strictly relational table
    const inserts = object.contents.map((comp) => ({
      project_id: projectId,
      title: comp.title,
      viewer_stats: comp.viewer_stats,
      similarity_reason: comp.similarity_reason
    }));

    const { data: savedComps, error: dbErr } = await supabase
      .from('similar_contents')
      .insert(inserts)
      .select();

    if (dbErr) throw new Error(`DB Insert Error: ${dbErr.message}`);

    // Return the inserted data
    return new Response(JSON.stringify({ success: true, data: savedComps }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('[API] Comps Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
