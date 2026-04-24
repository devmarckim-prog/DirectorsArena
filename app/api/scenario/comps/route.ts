import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { SimilarContentSchema } from '@/lib/schemas/generation';
import { logApiUsage } from '@/lib/telemetry';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CompsOutputSchema = z.object({
  contents: z.array(SimilarContentSchema.extend({
    poster_path: z.string().optional().describe("A high-fidelity TMDB poster URL or a cinematic unsplash placeholder matching the mood."),
    vote_average: z.number().optional().describe("Average rating out of 10."),
    release_date: z.string().optional().describe("Release year or full date."),
    genres: z.array(z.string()).optional().describe("Main genres of the work."),
    media_type: z.enum(["movie", "tv"]).optional().describe("Specifies if it is a movie or a TV show.")
  })).min(1).describe("Generate 3 to 5 similar contents/comps.")
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

    // synopsis에서 실제 서사 텍스트 추출 (날것 JSON 전달 방지)
    let epicNarrative = '';
    let englishTitle = '';
    try {
      const synObj = typeof project.synopsis === 'string' 
        ? JSON.parse(project.synopsis) 
        : project.synopsis;
      epicNarrative = synObj?.story?.epicNarrative || synObj?.synopsis || '';
      englishTitle = synObj?.englishTitle || '';
    } catch {
      epicNarrative = typeof project.synopsis === 'string' ? project.synopsis : '';
    }

    const userPrompt = `
Here is the project data:
Title: ${project.title || 'Untitled'}${englishTitle ? ` (${englishTitle})` : ''}
Genre: ${project.genre}
World Setting: ${project.world}
Logline: ${project.logline}
Story Synopsis: ${epicNarrative ? epicNarrative.substring(0, 800) : '(No synopsis yet)'}

Based on the GENRE, WORLD SETTING, and STORY SYNOPSIS above, recommend 3-5 GENUINELY SIMILAR existing movies or TV shows.
Focus on thematic, tonal, and narrative similarity — not just genre.
`;


    // 3. AI Generation
    const { object, usage } = await generateObject({
      model: anthropic(modelId),
      schema: CompsOutputSchema,
      system: systemPrompt,
      prompt: `${userPrompt}\n\nIMPORTANT: For each recommendation, provide an accurate 'title' that I can use to search TMDB. You do not need to provide exact IDs or poster paths, as I will search for them dynamically.`,
    });

    // Log Usage (v7.2 Telemetry)
    await logApiUsage({
      projectId,
      modelId,
      featureName: 'Similar Works Recommendation',
      usage: {
        promptTokens: (usage as any).promptTokens || 0,
        completionTokens: (usage as any).completionTokens || 0
      }
    });

    // 4. TMDB Enrichment Logic (v7.1 Query Param Auth)
    const tmdbKey = process.env.TMDB_API_KEY;
    const enrichedResults = [];

    for (const comp of object.contents) {
      let tmdbData: any = null;
      
      if (tmdbKey) {
        try {
          const searchRes = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${tmdbKey}&query=${encodeURIComponent(comp.title)}&include_adult=false&language=ko-KR`
          );
          const searchJson = await searchRes.json();
          if (searchJson.results && searchJson.results.length > 0) {
            tmdbData = searchJson.results[0]; // Take top match
          }
        } catch (e) {
          console.error(`[API] TMDB Search Error for "${comp.title}":`, e);
        }
      }

      // Merge AI recommendation with Real TMDB data
      enrichedResults.push({
        id: tmdbData?.id || Math.floor(Math.random() * 100000),
        tmdb_id: tmdbData?.id || null,
        title: tmdbData?.title || tmdbData?.name || comp.title,
        viewer_stats: comp.viewer_stats,
        similarity_reason: comp.similarity_reason,
        poster_path: tmdbData?.poster_path 
          ? `https://image.tmdb.org/t/p/w780${tmdbData.poster_path}` 
          : comp.poster_path || `https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=780`,
        vote_average: tmdbData?.vote_average || comp.vote_average || 8.0,
        release_date: tmdbData?.release_date || tmdbData?.first_air_date || comp.release_date || "2024",
        genres: comp.genres || [], // AI genres generally more descriptive of 'similarity'
        media_type: tmdbData?.media_type || comp.media_type || "movie"
      });
    }

    const compsData = enrichedResults;

    // [PRIMARY STORAGE] Integrated Synopsis Update (Redundancy for DB schema gaps)
    let updatedSynopsis = project.synopsis;
    try {
      const synObj = typeof project.synopsis === 'string' ? JSON.parse(project.synopsis) : project.synopsis;
      synObj.similarWorks = compsData;
      updatedSynopsis = JSON.stringify(synObj);
    } catch (e) {
      console.warn('[API] Synopsis Parse Error during persistence:', e);
    }

    await supabase
      .from('projects_v2')
      .update({ synopsis: updatedSynopsis })
      .eq('id', projectId);

    // [SECONDARY STORAGE] Legacy table insert (Soft attempt)
    try {
      await supabase.from('similar_contents').delete().eq('project_id', projectId);
      await supabase.from('similar_contents').insert(compsData.map(c => ({
         project_id: projectId,
         title: c.title,
         viewer_stats: c.viewer_stats,
         similarity_reason: c.similarity_reason
      })));
    } catch (e) {
      console.warn('[API] Soft table insert failed, but synopsis storage succeeded.');
    }

    // Return the generated data
    return new Response(JSON.stringify({ success: true, data: compsData }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('[API] Comps Critical Error:', err);
    return new Response(JSON.stringify({ error: (err as any).message, success: false }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
