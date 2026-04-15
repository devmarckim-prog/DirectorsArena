import { streamObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createClient } from '@supabase/supabase-js';
import { ProjectGenerationSchema } from '@/lib/schemas/generation';

// Use direct Supabase client (not server action context)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;

  try {
    // 1. Fetch admin settings for dynamic model & prompt (v3.2 schema)
    const { data: adminSettings } = await supabase
      .from('admin_settings')
      .select('model_id_primary, prompt_scenario_init, prompt_episode_script')
      .limit(1)
      .single();

    // SAFE MODEL ID: Validate known claude models, fall back if garbage value injected
    const ALLOWED_MODELS = ['claude-sonnet-4-6', 'claude-sonnet-3-5', 'claude-opus-4-5', 'claude-haiku-4-5-20251001'];
    const rawModelId = adminSettings?.model_id_primary || 'claude-sonnet-4-6';
    const modelId = ALLOWED_MODELS.includes(rawModelId) ? rawModelId : 'claude-sonnet-4-6';

    const baseSystemPrompt = adminSettings?.prompt_scenario_init || 
      '당신은 세계적 수준의 시나리오 작가이자 엘리트 쇼러너입니다.';

    // 2. Fetch project seed data
    const { data: project, error: projectErr } = await supabase
      .from('projects_v2')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectErr || !project) {
      return new Response(JSON.stringify({ error: 'Project not found' }), { status: 404 });
    }

    // 3. Parse wizard seed data from synopsis field
    let seedData = {
      platform: project.platform || 'Movie',
      genres: [project.genre || 'Drama'],
      episodes: project.episode_count || 1,
      duration: project.duration || 120,
      logline: project.logline || '',
      world: project.world || 'Contemporary',
      characters: [],
    };

    try {
      const parsed = JSON.parse(project.synopsis || '{}');
      if (parsed.seed && parsed.formData) {
        seedData = { ...seedData, ...parsed.formData };
      }
    } catch { /* synopsis is not seed JSON, use defaults */ }

    // 4. Build XML-structured system prompt (v2.1 Architecture)
    const systemPrompt = `<system_instructions>
${baseSystemPrompt}

당신은 ${seedData.platform} 플랫폼에 맞는 시나리오를 작성합니다.
장르: ${seedData.genres.join(', ')}
총 에피소드 수: ${seedData.episodes}화
세계관: ${seedData.world}
런타임: ${seedData.duration}분

중요 규칙:
1. 정확히 ${seedData.episodes}개의 에피소드 아웃라인을 생성하십시오.
2. 에피소드 1의 scriptContent만 업계 표준 시나리오 포맷(INT./EXT., 캐릭터 이름 대문자, 대사)으로 작성하십시오.
3. 에피소드 2 이상의 scriptContent는 반드시 null로 설정하십시오.
4. 각 에피소드의 summary는 300자 내외로 작성하십시오.
5. 캐릭터는 4-6명 생성하고, gender와 ageGroup을 반드시 지정하십시오.
</system_instructions>`;

    // 5. Build user prompt with any wizard character seeds
    const characterSeeds = seedData.characters?.length > 0
      ? `\n\n사용자가 사전 정의한 캐릭터 시드:\n${JSON.stringify(seedData.characters, null, 2)}`
      : '';

    const userPrompt = `다음 로그라인을 기반으로 완전한 프로젝트를 생성하십시오:

로그라인: "${seedData.logline || '아직 정의되지 않음 — 장르와 세계관에 맞는 오리지널 로그라인을 창작하십시오.'}"
${characterSeeds}

정확히 ${seedData.episodes}개의 에피소드 아웃라인을 생성하되, 에피소드 1의 대본만 완전히 작성하십시오.`;

    // 6. Update progress before starting
    await supabase
      .from('projects_v2')
      .update({ progress: 10 })
      .eq('id', projectId);

    // 7. Stream the response using Vercel AI SDK (with 90s timeout guard)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    try {
      const result = streamObject({
        model: anthropic(modelId),
        schema: ProjectGenerationSchema,
        system: systemPrompt,
        prompt: userPrompt,
        abortSignal: controller.signal,
      });
      clearTimeout(timeoutId);
      return result.toTextStreamResponse();
    } catch (streamErr: any) {
      clearTimeout(timeoutId);
      if (streamErr?.name === 'AbortError') {
        return new Response(JSON.stringify({ error: 'Generation timed out after 90 seconds. Please try again.' }), { status: 504 });
      }
      throw streamErr;
    }

  } catch (err: any) {
    console.error('[API] Generate Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Generation failed' }), 
      { status: 500 }
    );
  }
}
