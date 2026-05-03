import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { logApiUsage } from '@/lib/telemetry';
import { getResolvedModelId } from '@/lib/ai/models';
import { SimilarContentSchema } from '@/lib/schemas/generation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CompsOutputSchema = z.object({
  contents: z.array(SimilarContentSchema.extend({
    poster_path: z.string().optional(),
    vote_average: z.number().optional(),
    release_date: z.string().optional(),
    genres: z.array(z.string()).optional(),
    media_type: z.enum(["movie", "tv"]).optional(),
    original_title: z.string().optional(),
  })).min(1).describe("Generate a diverse list of 12 to 16 genuinely similar contents.")
});

// (Simplified: Moved model validation to lib/ai/models.ts)

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();
    if (!projectId) return new Response("Missing projectId", { status: 400 });

    // 1. Admin Settings
    const { data: adminSettings } = await supabase
      .from('admin_settings')
      .select('model_id_fast, prompt_similar_content')
      .limit(1)
      .single();

    // v12.3: Use dynamic mapping gateway with Haiku as default for cost-saving
    const modelId = getResolvedModelId(adminSettings?.model_id_fast, 'claude-3-5-sonnet-latest');

    const systemPrompt = adminSettings?.prompt_similar_content ||
      `You are an elite cinematic strategist. Identify 12-16 existing movies or TV shows that share a deep "Cinematic Genome" with the given project.
      Focus on: 1) Narrative Stakes, 2) Visual/Tonal Identity, 3) Archetypal Synergy. 
      IMPORTANT: Respond ONLY with a valid JSON object containing a "contents" array.`;

    // 2. Fetch Project
    const { data: project } = await supabase
      .from('projects_v2')
      .select('title, logline, synopsis, genre, world')
      .eq('id', projectId)
      .single();

    if (!project) return new Response("Project not found", { status: 404 });

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
CRITICAL ANALYSIS TASK:
Identify the unique "Cinematic Genome" of the following project:
Title: ${project.title || 'Untitled'}${englishTitle ? ` (${englishTitle})` : ''}
Genre: ${project.genre}
World Setting: ${project.world}
Logline: ${project.logline}
Story Synopsis: ${epicNarrative ? epicNarrative.substring(0, 1200) : '(No synopsis yet)'}

Provide exactly 12-16 recommendations. Include 'original_title' (English) for TMDB accuracy.
Return JSON format: { "contents": [ { "title": "...", "original_title": "...", "similarity_reason": "..." } ] }
`;

    // 3. AI Generation (VIBE Raw Fetch Protocol)
    console.log(`[CompsAPI] Generating for project: ${project.title} (${projectId}) using ${modelId}`);
    
    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: modelId,
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }]
      })
    });

    if (!aiRes.ok) {
      const errorText = await aiRes.text();
      console.error(`[CompsAPI] Anthropic Error: ${errorText}`);
      throw new Error(`AI Provider Error: ${aiRes.status}`);
    }

    const aiJson = await aiRes.json();
    const rawContent = aiJson.content?.[0]?.text || "";
    
    // Parse JSON safely
    let object: any = { contents: [] };
    try {
      const cleanJson = rawContent.replace(/```json\n?|```/g, "").trim();
      object = JSON.parse(cleanJson);
    } catch (e) {
      console.error("[CompsAPI] JSON Parse Error:", e, rawContent);
      throw new Error("Failed to parse AI response as JSON");
    }

    if (!object.contents?.length) {
      return new Response(JSON.stringify({ success: false, error: "AI generated empty results" }), { status: 500 });
    }

    // 4. Telemetry
    await logApiUsage({
      projectId,
      modelId,
      featureName: 'Similar Works',
      usage: {
        promptTokens: aiJson.usage?.input_tokens || 0,
        completionTokens: aiJson.usage?.output_tokens || 0,
      }
    });

    // 5. TMDB Enrichment (Parallelized Optimization)
    const tmdbKey = process.env.TMDB_API_KEY;
    
    const enrichmentPromises = object.contents.map(async (comp: any) => {
      let tmdbData: any = null;
      const searchQuery = comp.original_title || comp.title;

      if (tmdbKey && searchQuery) {
        try {
          const searchRes = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${tmdbKey}&query=${encodeURIComponent(searchQuery)}&include_adult=false&language=ko-KR`
          );
          const searchJson = await searchRes.json();
          if (searchJson.results?.length > 0) tmdbData = searchJson.results[0];
        } catch (e) {
          console.error(`[CompsAPI] TMDB Error for "${searchQuery}":`, e);
        }
      }

      // Pack extras into viewer_stats
      const packedViewerStats = JSON.stringify({
        tmdb_id: tmdbData?.id || null,
        poster_path: tmdbData?.poster_path
          ? `https://image.tmdb.org/t/p/w780${tmdbData.poster_path}`
          : comp.poster_path || `https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=780`,
        vote_average: tmdbData?.vote_average || comp.vote_average || 8.0,
        release_date: tmdbData?.release_date || tmdbData?.first_air_date || comp.release_date || '2024',
        genres: comp.genres || [],
        media_type: tmdbData?.media_type || comp.media_type || 'movie',
        original_stats: comp.viewer_stats || null
      });

      return {
        project_id: projectId,
        title: tmdbData?.title || tmdbData?.name || comp.title,
        similarity_reason: comp.similarity_reason,
        viewer_stats: packedViewerStats
      };
    });

    const enrichedResults = await Promise.all(enrichmentPromises);

    // 6. ★ DB 저장: similar_contents 테이블 (기존 데이터 교체)
    await supabase.from('similar_contents').delete().eq('project_id', projectId);
    const { error: insertError } = await supabase.from('similar_contents').insert(enrichedResults);

    if (insertError) {
      console.error('[CompsAPI] DB insert error:', insertError.message);
      // Fallback to project record
      try {
        const synObj = typeof project.synopsis === 'string' ? JSON.parse(project.synopsis) : (project.synopsis || {});
        synObj.similarWorks = enrichedResults;
        await supabase.from('projects_v2').update({ synopsis: JSON.stringify(synObj) }).eq('id', projectId);
      } catch {}
    } else {
      console.log(`[CompsAPI] ✅ Saved ${enrichedResults.length} comps to similar_contents`);
    }

    // 7. ★ 브라우저에는 개수만 반환
    return new Response(JSON.stringify({
      success: true,
      count: enrichedResults.length,
      message: `${enrichedResults.length}개 유사 작품이 DB에 저장됐습니다.`
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('[CompsAPI] Critical Error:', err);
    return new Response(JSON.stringify({ error: (err as any).message, success: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
