// OMA Zero-Defect Raw Protocol Engine (v6.3)
// Compliance: Claude API Guide (VIBE Dedicated)
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { getResolvedModelId } from '@/lib/ai/models';
import { createClient } from '@supabase/supabase-js';
import { persistProjectGeneration } from '@/lib/repository/generation';
import { ProjectGenerationSchema } from '@/lib/schemas/generation';
import { safeJSONParse } from '@/lib/utils/ai-parser';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const API_URL = "https://api.anthropic.com/v1/messages";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  console.log(`--- [OMA] IGNITION PULSE START: ${projectId} ---`);

  try {
    const { data: adminSettings } = await supabase
      .from('admin_settings')
      .select('prompt_scenario_init, model_id_primary')
      .limit(1)
      .single();

    // v6.3: VIBE Protocol Calibration - Multi-model Aware
    const stableModelId = getResolvedModelId(adminSettings?.model_id_primary, 'claude-sonnet-4-20250514');
    console.log(`[OMA] Phase 1: Model Handshake with ${stableModelId}`);
    
    const { data: project, error: pErr } = await supabase
      .from('projects_v2')
      .select('*')
      .eq('id', projectId)
      .single();

    if (pErr || !project) {
      console.error("[OMA] ABORT: Project context missing");
      return new Response(JSON.stringify({ error: 'Project not found' }), { status: 404 });
    }

    // v8.5: Prevent concurrent ignition if already baking
    if (project.status === 'BAKING' && project.progress > 15) {
      console.log("[OMA] Project already in active baking state. Preventing re-ignition.");
      return new Response(JSON.stringify({ message: 'Project is already baking' }), { status: 200 });
    }

    // 10% Initial Pulse
    console.log("[OMA] Phase 2: Updating DB to 10% (IGNITION)");
    await supabase.from('projects_v2').update({ status: 'BAKING', progress: 10 }).eq('id', projectId);

    // v7.0: Admin 프롬프트 동적 주입 - DB에 prompt_scenario_init가 있으면 완전 대체
    const HARDCODED_DEFAULT_PROMPT = `
당신은 영화/드라마 시나리오 전문가입니다.
대본이나 시나리오 설명을 입력받아, 등장인물을 JSON 배열로 추출하고 전체 프로젝트를 구성합니다.

[출력 규칙]
- 반드시 JSON 형식으로만 응답하세요. 다른 설명은 배제하십시오.
- ProjectGenerationSchema를 엄격히 준수하십시오.

# 캐릭터 생성 규칙

각 캐릭터는 반드시 다음 필드를 포함해야 합니다:

{
  "name": "캐릭터 이름",
  "gender": "MALE|FEMALE|OTHER",
  "age": 1~100 사이 숫자,
  "role": "역할",
  "job": "직업",
  "desire": "욕구",
  "description": "설명",
  "traits": ["성격 특징"],
  "relationshipToProtagonist": "주인공과의 관계",
  "groups": ["소속 진영"],
  "relations": [
    {
      "target": "상대방 이름",
      "type": "enemy|ally|family|romantic|friend|mentor",
      "description": "관계 설명 (한 문장)",
      "strength": 1~10 사이 숫자
    }
  ]
}

## relations 필드 생성 규칙

1. **모든 캐릭터는 최소 2개 이상의 관계**를 가져야 합니다
2. **주인공은 모든 캐릭터와 관계**를 가져야 합니다
3. **양방향 관계는 한쪽만 정의**하면 됩니다 (A→B만 있으면 B→A는 자동)
4. **관계 타입 정의:**
   - romantic: 연인, 짝사랑, 첫사랑
   - family: 부모-자식, 형제자매
   - friend: 절친, 동료, 친구
   - mentor: 스승-제자, 선배-후배
   - enemy: 적대, 라이벌
   - ally: 협력, 동맹

5. **strength 규칙:**
   - 10: 가장 중요한 관계 (주인공의 첫사랑, 부모-자식)
   - 7-9: 중요한 관계 (절친, 멘토)
   - 4-6: 일반 관계 (동료, 지인)
   - 1-3: 약한 관계 (아는 사람)

JSON keys: koreanTitle, englishTitle, logline, synopsis, characters, structure, episodes.
Only include scriptContent for Episode 1.

# 씬(structure) 생성 규칙 [CRITICAL]
- structure 배열의 각 beat는 반드시 **script_content** 필드를 포함해야 합니다
- 각 beat의 script_content는 해당 씬의 실제 대본 (최소 100자 이상)
- 씬 헤딩 형식: INT./EXT. 장소 - 시간대
- 에피소드당 최소 5개 이상의 beat 생성
- timestamp_label은 "00:01:00" 형식`;

    // Admin DB 프롬프트가 충분히 길면 (50자 이상) 완전 대체
    const adminPrompt = adminSettings?.prompt_scenario_init || '';
    let systemPrompt = adminPrompt.length > 50 
      ? adminPrompt 
      : HARDCODED_DEFAULT_PROMPT;

    // --- Inject Universe Settings (Custom Persona & Glossary) ---
    try {
      const generatedContent = typeof project.generated_content === 'string' 
        ? JSON.parse(project.generated_content) 
        : (project.generated_content || {});
      const universeSettings = generatedContent.universe_settings;
      
      if (universeSettings) {
        if (universeSettings.persona) {
          systemPrompt = `[DIRECTOR'S PERSONA - CRITICAL INSTRUCTION]\n${universeSettings.persona}\n\n` + systemPrompt;
        }
        
        if (universeSettings.glossary && Array.isArray(universeSettings.glossary) && universeSettings.glossary.length > 0) {
          const glossaryStr = universeSettings.glossary.map((g: any) => `- ${g.term}: ${g.definition}`).join('\n');
          systemPrompt += `\n\n[PROJECT GLOSSARY - MANDATORY VOCABULARY]\n${glossaryStr}\n(You MUST use these exact terms when referring to the concepts above.)`;
        }
      }
    } catch (e) {
      console.error("[OMA] Failed to parse universe settings:", e);
    }

    console.log(`[OMA] System Prompt Source: ${adminPrompt.length > 50 ? 'ADMIN_DB' : 'HARDCODED_DEFAULT'} (with UNIVERSE injection)`);

    // v7.1: 어드민 schema_fields를 읽어 활성화된 필드만 userPrompt에 주입
    const { data: adminSchemaRow } = await supabase
      .from('admin_settings')
      .select('schema_fields')
      .limit(1)
      .single();

    const schemaFields: Record<string, any> = adminSchemaRow?.schema_fields || {};

    // project 레코드 + synopsis.formData에서 값 추출
    let formDataSeed: Record<string, any> = {};
    try {
      const synObj = typeof project.synopsis === 'string' ? JSON.parse(project.synopsis) : project.synopsis;
      formDataSeed = synObj?.formData || {};
    } catch {}

    // characters_v2에서 주인공(첫 번째) 데이터 추출 (캐릭터 필드 소스)
    const { data: chars } = await supabase
      .from('characters_v2')
      .select('name, age, gender, job, desire, traits, relationship_to_protagonist')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })
      .limit(10);

    const protagonist = chars?.[0];
    const antagonist = chars?.[1];
    const charSeed: Record<string, any> = {
      protagonist_name:   protagonist?.name || '',
      protagonist_age:    protagonist?.age || '',
      protagonist_gender: protagonist?.gender || '',
      protagonist_job:    protagonist?.job || '',
      protagonist_desire: protagonist?.desire || '',
      protagonist_trait:  Array.isArray(protagonist?.traits) ? protagonist.traits.join(', ') : (protagonist?.traits || ''),
      antagonist_name:    antagonist?.name || '',
      antagonist_job:     antagonist?.job || '',
      key_relationship:   chars?.slice(0, 3).map((c: any) => `${c.name}(${c.relationship_to_protagonist || '주요인물'})`).join(', ') || '',
      love_interest_name: chars?.find((c: any) => c.relationship_to_protagonist?.includes('romantic') || c.relationship_to_protagonist?.includes('연인'))?.name || '',
    };

    // 활성화된 필드만 골라 "- 레이블: 값" 형태로 구성
    const injectedLines: string[] = [];
    for (const [key, field] of Object.entries(schemaFields)) {
      if (!field.enabled) continue;
      const val =
        charSeed[key] ??                    // 0순위: characters_v2 (캐릭터 카테고리)
        project[field.sourceKey] ??         // 1순위: project 직접 컬럼
        formDataSeed[field.sourceKey] ??    // 2순위: synopsis.formData
        formDataSeed[key] ??                // 3순위: formData에 key 직접
        '';
      if (val !== '' && val !== null && val !== undefined) {
        injectedLines.push(`- ${field.promptKey}: ${val}`);
      }
    }

    const structuredContext = injectedLines.length > 0
      ? `\n\n[프로젝트 구조화 정보]\n${injectedLines.join('\n')}`
      : '';

    const steerPrompt = project.steer_prompt || "";
    const userPrompt = steerPrompt
      ? `다음 지시사항을 반영하여 프로젝트를 재생성하십시오: "${steerPrompt}"${structuredContext}`
      : `아래 정보를 바탕으로 시네마틱한 드라마/영화 프로젝트를 생성하십시오.${structuredContext}`;
    
    console.log("[OMA] Phase 3: Sending Fetch to Anthropic (Raw VIBE)...");
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
      throw new Error(`API Error (${response.status}): ${errBody}`);
    }

    // Manual Stream Handling to pipe back to cinematic UI
    console.log("[OMA] Phase 4: Streaming Narrative Chunks...");
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) return;

        let totalText = "";
        let promptTokens = 0;
        let completionTokens = 0;
        const decoder = new TextDecoder();

        try {
          // [OMA] Signal PHASE 2 START to UI
          controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify({ phase: 2, status: 'STREAMING_STARTED' })}\n`));
          
          // Keep-alive timer to prevent browser timeout (5s intervals)
          const keepAliveInterval = setInterval(() => {
            controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify({ type: 'KEEPALIVE' })}\n`));
          }, 5000);

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
                  
                  // v7.5: Telemetry - Token Harvesting
                  if (json.type === "message_start" && json.message?.usage) {
                    promptTokens = json.message.usage.input_tokens || 0;
                  }
                  if (json.type === "message_delta" && json.usage) {
                    completionTokens = json.usage.output_tokens || 0;
                  }

                  if (json.type === "content_block_delta" && json.delta?.text) {
                    const text = json.delta.text;
                    totalText += text;
                    // Pipe to client in Vercel AI SDK compatible stream format (0:"...")
                    controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(text)}\n`));
                  }
                } catch (e) {
                  // Skip invalid JSON lines
                }
              }
            }
          }

          // Termination: Parse AI JSON → save to generated_content JSONB
          if (totalText) {
            console.log(`[OMA] Stream complete. Parsing & Logging Telemetry...`);
            
            // v7.5: Persist API Usage Cost (Claude 3.5 Sonnet Pricing)
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

            // Strip markdown fences from AI response
            const cleanText = totalText
              .replace(/^```json\s*/i, '')
              .replace(/^```\s*/i, '')
              .replace(/```\s*$/i, '')
              .trim();

            // Extract the actual narrative synopsis from JSON (or use raw if plain text)
            let finalTitle = project.title;
            let epicNarrative = "";
            let parsedSynopsisPayload: any = null;

            // 1. Initial Parsing with Safety Harness
            let aiData: any = null;
            try {
              aiData = safeJSONParse(cleanText, null);
              if (!aiData) throw new Error("JSON Parsing yielded null after repair attempts.");
              
              // 2. Schema Validation (Safe Parse)
              const validation = ProjectGenerationSchema.safeParse(aiData);
              
              if (!validation.success) {
                console.warn('[OMA] Validation issues detected. Attempting to heal structure...');
                // Even if not perfectly valid, we try to use what we have
                // Filling defaults for missing fields
                aiData.characters = aiData.characters || [];
                aiData.structure = aiData.structure || [];
                aiData.episodes = aiData.episodes || [];
              } else {
                // Use the validated data which might have trimmed extra fields
                aiData = validation.data;
              }

              epicNarrative = aiData.synopsis || aiData.story?.epicNarrative || cleanText;
              finalTitle = aiData.koreanTitle || aiData.title || project.title;

              // 3. Special Rescue: If characters are empty, check if they leaked into synopsis string
              // (Specifically addresses the "Heart-aching" project issue)
              if ((!aiData.characters || aiData.characters.length === 0) && cleanText.includes('"name":')) {
                 console.log("[OMA] DETECTED LEAKED CHARACTERS. Attempting deep-tissue rescue...");
                 // Basic regex extraction for common fields
                 const leakedChars: any[] = [];
                 const nameMatches = cleanText.match(/"name":\s*"([^"]+)"/g);
                 if (nameMatches) {
                    nameMatches.forEach((m, idx) => {
                       const name = m.match(/"name":\s*"([^"]+)"/)?.[1];
                       if (name) leakedChars.push({ name, gender: "OTHER", ageGroup: "30S", role: "Rescued", description: "Leaked in stream", relationshipToProtagonist: "N/A", groups: [], relations: [] });
                    });
                    aiData.characters = leakedChars;
                 }
              }

              // Also update the synopsis field for backward compatibility
              parsedSynopsisPayload = {
                story: {
                  epicNarrative,
                  logline: aiData.logline || project.logline || '',
                },
                koreanTitle: finalTitle,
                englishTitle: aiData.englishTitle || '',
                characters: aiData.characters || [],
                structure: aiData.structure || [],
                episodes: aiData.episodes || []
              };

              console.log(`[OMA] Safety Harness processed. Title: ${finalTitle}, Characters: ${aiData.characters?.length || 0}`);
            } catch (err) {
              console.error('[OMA] CRITICAL: Post-processing failed even with Safety Harness.', err);
              parsedSynopsisPayload = {
                story: { epicNarrative: cleanText, logline: project.logline || '' }
              };
            }

            // Save to sub-tables (Characters, Beats, Episodes) using repository
            try {
              await persistProjectGeneration(projectId, aiData);
              console.log(`[OMA] Sub-tables persisted successfully for project: ${projectId}`);
            } catch (pErr) {
              console.error(`[OMA] Sub-table persistence failed:`, pErr);
              // Fallback: Just update core project record if sub-tables fail
              await supabase.from('projects_v2').update({
                status: 'READY',
                progress: 100,
                title: finalTitle,
                generated_content: {
                  epicNarrative,
                  generatedAt: new Date().toISOString(),
                  wordCount: epicNarrative.split(' ').length
                },
                ...(parsedSynopsisPayload ? { synopsis: parsedSynopsisPayload } : {})
              }).eq('id', projectId);
            }

            // Signal 100% completion to browser
            controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify({ phase: 3, status: 'COMPLETE', progress: 100 })}\n`));
            console.log(`[OMA] SUCCESS: Project ${projectId} READY. Words: ${epicNarrative.split(' ').length}`);
          } else {
            console.error('[OMA] WARN: Empty stream. Marking ERROR.');
            await supabase.from('projects_v2').update({ status: 'ERROR', progress: 0 }).eq('id', projectId);
          }
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

  } catch (err) {
    console.error("[OMA] RAW IGNITION FAILURE:", err);
    // Restore status update on failure
    await supabase.from('projects_v2').update({ status: 'ERROR', progress: 0 }).eq('id', projectId);
    return new Response(JSON.stringify({ error: (err as any).message }), { status: 500 });
  }
}
