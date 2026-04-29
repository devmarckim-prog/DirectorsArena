// OMA Zero-Defect Raw Protocol Engine (v6.3)
// Compliance: Claude API Guide (VIBE Dedicated)
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

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
    const stableModelId = adminSettings?.model_id_primary || 'claude-3-5-sonnet-20241022';
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

    const systemPrompt = `
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
  "ageGroup": "TEEN|20S|30S|40S|50S_PLUS",
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
${adminSettings?.prompt_scenario_init || ''}`;

    const steerPrompt = project.steer_prompt || "";
    const userPrompt = steerPrompt 
      ? `다음 지시사항을 반영하여 프로젝트를 재생성하십시오: "${steerPrompt}"\n\n기존 로그라인: "${project.logline || ''}"`
      : `로그라인: "${project.logline || ''}" 기반으로 프로젝트를 시네마틱하게 생성하십시오.`;

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
