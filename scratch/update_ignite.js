const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'app', 'api', 'ignite', '[id]', 'route.ts');
let code = fs.readFileSync(targetFile, 'utf-8');

// Normalize line endings to LF for clean replacement
code = code.replace(/\r\n/g, '\n');

if (!code.includes('getPocDummyGeneration')) {
  const importTarget = "import { safeJSONParse } from '@/lib/utils/ai-parser';";
  const importReplacement = `import { safeJSONParse } from '@/lib/utils/ai-parser';
import { POC_TEST_ADMIN_USER, getPocDummyGeneration, getPocProjectById, savePocProject } from '@/lib/poc';`;

  code = code.replace(importTarget, importReplacement);

  const pulseTarget = "console.log(`--- [OMA] IGNITION PULSE START: ${projectId} (User: ${user.email}) ---`);";
  const pocInterceptor = `  // POC Admin Mode Intercept: Generate with dummy data without calling Anthropic API
  const cookieHeader = request.headers.get('cookie') || '';
  const isPoc = user.id === POC_TEST_ADMIN_USER.id || cookieHeader.includes('da_poc_admin=true');

  if (isPoc) {
    console.log(\`--- [POC MODE] Intercepted Ignition for Project: \${projectId} (Using Dummy Data, No External API Call) ---\`);
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
          controller.enqueue(encoder.encode(\`0:\${JSON.stringify("[POC 모드] AI 스토리 엔진 가동 (더미 데이터 생성 중)...\\n")}\\n\`));
          await new Promise(r => setTimeout(r, 400));

          controller.enqueue(encoder.encode(\`0:\${JSON.stringify("시네마틱 세계관 및 4대 핵심 인물 관계도 구축 완료...\\n")}\\n\`));
          await new Promise(r => setTimeout(r, 500));

          controller.enqueue(encoder.encode(\`0:\${JSON.stringify("3막 시나리오 구조화 및 씬별 지문 생성 중...\\n")}\\n\`));
          await new Promise(r => setTimeout(r, 500));

          controller.enqueue(encoder.encode(\`0:\${JSON.stringify("제1화 전체 대본 집필 완료 및 에피소드 저장 중...\\n")}\\n\`));
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
          controller.enqueue(encoder.encode(\`0:\${JSON.stringify({ phase: 3, status: 'COMPLETE', progress: 100 })}\\n\`));
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

  `;

  code = code.replace(pulseTarget, pocInterceptor + pulseTarget);
  fs.writeFileSync(targetFile, code, 'utf-8');
  console.log('Successfully updated app/api/ignite/[id]/route.ts');
} else {
  console.log('Already updated');
}
