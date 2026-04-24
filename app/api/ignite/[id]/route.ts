// OMA Zero-Defect Raw Protocol Engine (v6.3)
// Compliance: Claude API Guide (VIBE Dedicated)
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { persistProjectGeneration } from '@/lib/repository/generation';

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

    const systemPrompt = `당신은 ${project.platform || 'Movie'} 작가이자 쇼러너입니다. 
반드시 JSON 형식으로만 응답하세요. 다른 설명은 배제하십시오.
ProjectGenerationSchema를 엄격히 준수하십시오.
JSON keys: koreanTitle, englishTitle, logline, synopsis, characters (array of {name, gender, ageGroup, role, description, relationshipToProtagonist}), structure (array of {act_number, beat_type, title, description, timestamp_label}), episodes (array of {episodeNumber, title, summary, scriptContent}).
Only include scriptContent for Episode 1.

${adminSettings?.prompt_scenario_init || ''}`;

    const userPrompt = `로그라인: "${project.logline || ''}" 기반으로 프로젝트를 시네마틱하게 생성하십시오.`;

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
            let parsedSynopsisPayload = "";

            try {
              const aiData = JSON.parse(cleanText);
              epicNarrative = aiData.synopsis || aiData.story?.epicNarrative || cleanText;
              finalTitle = aiData.koreanTitle || aiData.title || project.title;

              // Also update the synopsis field for backward compatibility
              parsedSynopsisPayload = JSON.stringify({
                story: {
                  epicNarrative,
                  logline: aiData.logline || project.logline || '',
                },
                koreanTitle: finalTitle,
                englishTitle: aiData.englishTitle || '',
                characters: aiData.characters || [],
                structure: aiData.structure || [],
                episodes: aiData.episodes || []
              });

              console.log(`[OMA] JSON parsed. Title: ${finalTitle}`);
            } catch {
              console.warn('[OMA] AI response is not JSON. Saving as plain text.');
              parsedSynopsisPayload = JSON.stringify({
                story: { epicNarrative: cleanText, logline: project.logline || '' }
              });
            }

            // Save to generated_content (JSONB) + synopsis (backward compat)
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
