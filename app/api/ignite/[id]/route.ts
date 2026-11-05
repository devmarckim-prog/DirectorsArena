// OMA Zero-Defect Raw Protocol Engine (v10.3.3)
// Compliance: Claude API Guide (VIBE Dedicated)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getResolvedModelId } from '@/lib/ai/models';
import { createClient } from '@supabase/supabase-js';
import { persistProjectGeneration } from '@/lib/repository/generation';
import { ProjectGenerationSchema } from '@/lib/schemas/generation';
import { safeJSONParse } from '@/lib/utils/ai-parser';
import { POC_TEST_ADMIN_USER, getPocDummyGeneration, getPocProjectById, savePocProject } from '@/lib/poc';
import { authGuard } from '@/lib/auth/guard';
import { deductCredits } from '@/lib/credits/deduct';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const API_URL = "https://api.anthropic.com/v1/messages";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response, user } = await authGuard();
  if (response || !user) return response || new Response('Unauthorized', { status: 401 });

  const { id: projectId } = await params;
  
  // v4.0: Atomic Credit Deduction before Ignition
  const creditResult = await deductCredits(user.id, 'generate');
  if (!creditResult.success) {
    return new Response(JSON.stringify({ 
      error: 'Insufficient credits', 
      required: 10,
      code: 'INSUFFICIENT_CREDITS' 
    }), { status: 402 });
  }

  // Engine selection: Check URL params, header, or cookie
  const url = new URL(request.url);
  const forceApi = url.searchParams.get('engine') === 'api' || 
                   url.searchParams.get('mode') === 'api' ||
                   request.headers.get('x-engine-mode') === 'api';
  
  const cookieHeader = request.headers.get('cookie') || '';
  const isPocAdmin = user.id === POC_TEST_ADMIN_USER.id || cookieHeader.includes('da_poc_admin=true');
  
  // Run dummy only if POC mode is active AND user didn't explicitly request real API
  const usePocDummy = isPocAdmin && !forceApi;

  if (usePocDummy) {
    console.log(`--- [POC MODE] Intercepted Ignition for Project: ${projectId} (Using Dummy Data, No External API Call) ---`);
    let project = getPocProjectById(projectId);
    if (!project) {
      try {
        const { data } = await supabase.from('projects_v2').select('*').eq('id', projectId).single();
        project = data;
      } catch (e) {}
    }

    const dummyData = getPocDummyGeneration(project);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          controller.enqueue(encoder.encode(`0:${JSON.stringify("[POC 모드] AI 스토리 엔진 가동 (더미 데이터 생성 중)...\n")}\n`));
          await new Promise(r => setTimeout(r, 400));

          controller.enqueue(encoder.encode(`0:${JSON.stringify("시네마틱 세계관 및 4대 핵심 인물 관계도 구축 완료...\n")}\n`));
          await new Promise(r => setTimeout(r, 500));

          controller.enqueue(encoder.encode(`0:${JSON.stringify("3막 시나리오 구조화 및 씬별 지문 생성 중...\n")}\n`));
          await new Promise(r => setTimeout(r, 500));

          controller.enqueue(encoder.encode(`0:${JSON.stringify("제1화 전체 대본 집필 완료 및 에피소드 저장 중...\n")}\n`));
          await new Promise(r => setTimeout(r, 400));

          // Save dummy project
          const completedProject = {
            ...(project || {}),
            id: projectId,
            title: dummyData.title,
            subtitle: dummyData.englishTitle,
            logline: dummyData.logline,
            synopsis: typeof dummyData.synopsis === 'string' ? dummyData.synopsis : JSON.stringify(dummyData.synopsis),
            status: 'READY',
            progress: 100,
            generated_content: {
              epicNarrative: dummyData.story?.epicNarrative,
              generatedAt: new Date().toISOString(),
              wordCount: 850
            },
            characters: dummyData.characters,
            structure: dummyData.structure,
            episodes: dummyData.episodes
          };

          savePocProject(completedProject);

          try {
            await persistProjectGeneration(projectId, dummyData);
          } catch (dbErr) {
            console.warn('[POC] Supabase persistence skipped or failed, saved locally in POC store.');
          }

          // Complete signal
          controller.enqueue(encoder.encode(`0:${JSON.stringify({ phase: 3, status: 'COMPLETE', progress: 100 })}\n`));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }

  console.log(`--- [OMA] REAL API IGNITION PULSE START: ${projectId} (User: ${user.email || 'Admin'}, Model: Anthropic Claude) ---`);

  try {
    let adminSettings: any = null;
    try {
      const { data } = await supabase
        .from('admin_settings')
        .select('prompt_scenario_init, model_id_primary')
        .limit(1)
        .single();
      adminSettings = data;
    } catch (dbErr) {
      console.warn('[OMA] Admin settings fetch skipped (DB offline):', dbErr);
    }

    // Resolves to verified live model (claude-sonnet-4-6)
    const stableModelId = getResolvedModelId(adminSettings?.model_id_primary, 'claude-sonnet-4-6');
    console.log(`[OMA] Phase 1: Model Handshake with ${stableModelId}`);
    
    // Load project from DB or POC storage
    let project: any = null;
    try {
      const { data: pData, error: pErr } = await supabase
        .from('projects_v2')
        .select('*')
        .eq('id', projectId)
        .single();
      if (!pErr && pData) project = pData;
    } catch (e) {}

    if (!project) {
      project = getPocProjectById(projectId);
    }

    if (!project) {
      console.error("[OMA] ABORT: Project context missing");
      return new Response(JSON.stringify({ error: 'Project not found' }), { status: 404 });
    }

    // Prevent concurrent ignition if already baking
    if (project.status === 'BAKING' && project.progress > 25) {
      console.log("[OMA] Project already in active baking state. Preventing re-ignition.");
      return new Response(JSON.stringify({ message: 'Project is already baking' }), { status: 200 });
    }

    // 10% Initial Pulse
    console.log("[OMA] Phase 2: Updating DB to 10% (IGNITION)");
    try {
      await supabase.from('projects_v2').update({ status: 'BAKING', progress: 10 }).eq('id', projectId);
    } catch (e) {}
    savePocProject({ ...project, status: 'BAKING', progress: 10 });

    const HARDCODED_DEFAULT_PROMPT = `
당신은 한국 최고 수준의 시네마틱 영화/드라마 시나리오 전문가입니다.
입력받은 로그라인과 설정을 바탕으로, 깊이 있는 인물 관계도와 에피소드 구조를 가진 프로젝트를 설계하십시오.

[출력 규칙]
- 반드시 엄격한 JSON 형식으로만 응답하세요. 마크다운 따옴표(\`\`\`json)나 다른 설명은 배제하십시오.
- 아래 스키마 키를 모두 포함하십시오:
  "koreanTitle": "한국어 제목",
  "englishTitle": "영어 제목",
  "logline": "한 줄 로그라인",
  "synopsis": "매력적인 전체 줄거리 시놉시스 (최소 500자 이상)",
  "characters": [
    {
      "name": "캐릭터 이름",
      "gender": "MALE|FEMALE|OTHER",
      "age": 28,
      "role": "주인공|적대자|조력자",
      "job": "직업",
      "desire": "내면의 욕구 및 목표",
      "description": "상세 성격 및 외모 묘사",
      "traits": ["용감함", "냉철함"],
      "relationshipToProtagonist": "주인공과의 관계",
      "groups": ["진영"],
      "relations": [
        {
          "target": "상대 캐릭터 이름",
          "type": "enemy|ally|family|romantic|friend|mentor",
          "description": "관계 설명",
          "strength": 8
        }
      ]
    }
  ],
  "structure": [
    {
      "order": 1,
      "heading": "INT. 폐공장 - 밤",
      "summary": "씬 요약",
      "script_content": "실제 대본 지문 및 대사 (최소 100자 이상)",
      "characters": ["캐릭터1", "캐릭터2"]
    }
  ],
  "episodes": [
    {
      "episodeNumber": 1,
      "title": "제1화 제목",
      "summary": "1화 전체 줄거리 요약",
      "scriptContent": "1화 핵심 씬 대본 전문"
    }
  ]
`;

    const adminPrompt = adminSettings?.prompt_scenario_init || '';
    let systemPrompt = adminPrompt.length > 50 
      ? adminPrompt 
      : HARDCODED_DEFAULT_PROMPT;

    // Build context from project
    let logline = project.logline || '';
    let genre = project.genre || '드라마';
    let platform = project.platform || '시리즈';

    try {
      const synObj = typeof project.synopsis === 'string' ? JSON.parse(project.synopsis) : project.synopsis;
      if (synObj?.formData?.logline) logline = synObj.formData.logline;
      if (synObj?.formData?.genres?.[0]) genre = synObj.formData.genres[0];
    } catch (e) {}

    const userPrompt = `
[프로젝트 기획 요구사항]
- 장르: ${genre}
- 포맷: ${platform}
- 로그라인: ${logline}
- 제목: ${project.title}

위 기획안을 바탕으로 시네마틱한 캐릭터 4명 이상, 1화 대본이 포함된 완성형 JSON 시나리오 프로젝트를 생성하십시오.
`;
    
    console.log("[OMA] Phase 3: Sending Fetch to Anthropic API (Live Claude)...");
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: stableModelId,
        max_tokens: 4000,
        stream: true,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }]
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("[OMA] Anthropic API Error:", response.status, errBody);
      throw new Error(`Anthropic API Error (${response.status}): ${errBody}`);
    }

    console.log("[OMA] Phase 4: Streaming Narrative Chunks from Claude...");
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let totalText = "";
        let promptTokens = 0;
        let completionTokens = 0;
        const decoder = new TextDecoder();

        const safeEnqueue = (str: string) => {
          try {
            controller.enqueue(new TextEncoder().encode(str));
          } catch (e) {}
        };

        try {
          safeEnqueue(`0:${JSON.stringify({ phase: 2, status: 'STREAMING_STARTED' })}\n`);
          
          const keepAliveInterval = setInterval(() => {
            safeEnqueue(`0:${JSON.stringify({ type: 'KEEPALIVE' })}\n`);
          }, 4000);

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              clearInterval(keepAliveInterval);
              break;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;

                try {
                  const json = JSON.parse(data);
                  
                  if (json.type === "message_start" && json.message?.usage) {
                    promptTokens = json.message.usage.input_tokens || 0;
                  }
                  if (json.type === "message_delta" && json.usage) {
                    completionTokens = json.usage.output_tokens || 0;
                  }

                  if (json.type === "content_block_delta" && json.delta?.text) {
                    const text = json.delta.text;
                    totalText += text;
                    safeEnqueue(`0:${JSON.stringify(text)}\n`);
                  }
                } catch (e) {}
              }
            }
          }

          if (totalText) {
            console.log(`[OMA] Real API Stream complete (${totalText.length} chars). Parsing AI payload...`);
            
            try {
              const costUsd = (promptTokens * (3 / 1000000)) + (completionTokens * (15 / 1000000));
              await supabase.from('api_usage_logs').insert({
                project_id: projectId,
                model_id: stableModelId,
                feature_name: 'SCENARIO_INIT',
                prompt_tokens: promptTokens,
                completion_tokens: completionTokens,
                total_tokens: promptTokens + completionTokens,
                cost_usd: costUsd
              });
            } catch (telemetryErr) {}

            const cleanText = totalText
              .replace(/^\`\`\`json\s*/i, '')
              .replace(/^\`\`\`\s*/i, '')
              .replace(/\`\`\`\s*$/i, '')
              .trim();

            let finalTitle = project.title;
            let epicNarrative = "";
            let aiData: any = null;

            try {
              aiData = safeJSONParse(cleanText, null);
              if (aiData) {
                const validation = ProjectGenerationSchema.safeParse(aiData);
                if (validation.success) {
                  aiData = validation.data;
                } else {
                  aiData.characters = aiData.characters || [];
                  aiData.structure = aiData.structure || [];
                  aiData.episodes = aiData.episodes || [];
                }

                epicNarrative = aiData.synopsis || aiData.story?.epicNarrative || cleanText;
                finalTitle = aiData.koreanTitle || aiData.title || project.title;
              } else {
                epicNarrative = cleanText;
              }
            } catch (pErr) {
              epicNarrative = cleanText;
            }

            // High Availability: Save to local store first
            const savedProject = {
              ...(project || {}),
              id: projectId,
              title: finalTitle,
              subtitle: aiData?.englishTitle || project.subtitle,
              logline: aiData?.logline || project.logline,
              synopsis: typeof aiData?.synopsis === 'string' ? aiData.synopsis : JSON.stringify(aiData || { synopsis: epicNarrative }),
              status: 'READY',
              progress: 100,
              generated_content: {
                epicNarrative,
                generatedAt: new Date().toISOString(),
                wordCount: epicNarrative.split(' ').length
              },
              characters: aiData?.characters || [],
              structure: aiData?.structure || [],
              episodes: aiData?.episodes || []
            };

            savePocProject(savedProject);
            console.log(`[OMA] Real AI project saved to local store: ${projectId} (${finalTitle})`);

            // Also persist to Supabase if accessible
            try {
              if (aiData) {
                await persistProjectGeneration(projectId, aiData);
              }
              await supabase.from('projects_v2').update({
                status: 'READY',
                progress: 100,
                title: finalTitle,
                generated_content: {
                  epicNarrative,
                  generatedAt: new Date().toISOString(),
                  wordCount: epicNarrative.split(' ').length
                }
              }).eq('id', projectId);
            } catch (dbErr) {
              console.warn('[OMA] Supabase sub-table persistence skipped (Offline/Paused). Local store is active.');
            }

            safeEnqueue(`0:${JSON.stringify({ phase: 3, status: 'COMPLETE', progress: 100 })}\n`);
            console.log(`[OMA] SUCCESS: Real API Project ${projectId} is READY!`);
          } else {
            console.error('[OMA] Empty stream received from Anthropic API.');
            savePocProject({ ...project, status: 'ERROR', progress: 0 });
          }
        } catch (streamErr) {
          console.error('[OMA] Error during stream processing:', streamErr);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
      }
    });

  } catch (err: any) {
    console.error("[OMA] REAL API IGNITION FAILURE:", err);
    savePocProject({ id: projectId, status: 'ERROR', progress: 0 });
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
