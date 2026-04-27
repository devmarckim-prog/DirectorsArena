// OMA Zero-Defect Raw Protocol Engine (v6.3)
// Compliance: Claude API Guide (VIBE Dedicated)
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { persistProjectGeneration } from '@/lib/repository/generation';
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
  console.log(`--- [OMA] GENERATION PULSE START: ${projectId} ---`);

  try {
    const { data: adminSettings } = await supabase
      .from('admin_settings')
      .select('prompt_scenario_init, model_id_primary')
      .limit(1)
      .single();

    const stableModelId = adminSettings?.model_id_primary || 'claude-3-5-sonnet-20241022';
    
    const { data: project, error: pErr } = await supabase
      .from('projects_v2')
      .select('*')
      .eq('id', projectId)
      .single();

    if (pErr || !project) {
      return new Response(JSON.stringify({ error: 'Project not found' }), { status: 404 });
    }

    await supabase.from('projects_v2').update({ status: 'BAKING', progress: 10 }).eq('id', projectId);

    const systemPrompt = `당신은 ${project.platform || 'Movie'} 작가이자 쇼러너입니다. 
반드시 JSON 형식으로만 응답하세요. ProjectGenerationSchema를 엄격히 준수하십시오.
${adminSettings?.prompt_scenario_init || ''}`;

    const userPrompt = `로그라인: "${project.logline || ''}" 기반으로 프로젝트를 시네마틱하게 생성하십시오.`;

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
        const errText = await response.text();
        throw new Error(`API Error: ${errText}`);
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) return;

        let totalText = "";
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;

                try {
                  const json = JSON.parse(data);
                  if (json.type === "content_block_delta" && json.delta?.text) {
                    const text = json.delta.text;
                    totalText += text;
                    controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(text)}\n`));
                  }
                } catch (e) {}
              }
            }
          }

          if (totalText) {
            try {
              const parsed = safeJSONParse(totalText, null);
              if (parsed) {
                await persistProjectGeneration(projectId, parsed);
                console.log(`[OMA] Project ${projectId} persisted via Safety Harness.`);
              } else {
                throw new Error("Final parse result is null");
              }
            } catch (pErr) {
              console.error("[OMA] Final persistence failed:", pErr);
            }
          }
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });

  } catch (err) {
    console.error("[OMA] GHOST GENERATION FAILURE:", err);
    await supabase.from('projects_v2').update({ status: 'ERROR', progress: 0 }).eq('id', projectId);
    return new Response(JSON.stringify({ error: (err as any).message }), { status: 500 });
  }
}
