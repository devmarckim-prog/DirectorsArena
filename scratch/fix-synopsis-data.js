const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://stfonaiuxavzbqwikcqb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM"
);

async function fixSynopsis() {
  // READY 상태의 모든 프로젝트 조회
  const { data: projects } = await supabase
    .from('projects_v2')
    .select('id, title, synopsis, logline')
    .eq('status', 'READY');

  console.log(`Found ${projects?.length || 0} READY projects to check.`);

  for (const project of (projects || [])) {
    if (!project.synopsis) continue;

    let synData;
    try {
      synData = JSON.parse(project.synopsis);
    } catch {
      console.log(`[${project.title}] synopsis is not JSON, skipping.`);
      continue;
    }

    const epicNarrative = synData?.story?.epicNarrative || '';

    // epicNarrative가 ```json 으로 시작한다면 날것 JSON이 저장된 상태
    if (epicNarrative.includes('```json') || epicNarrative.includes('"englishTitle"')) {
      console.log(`[${project.title}] FOUND RAW JSON in epicNarrative. Re-parsing...`);

      const cleanText = epicNarrative
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      try {
        const aiData = JSON.parse(cleanText);
        const fixedPayload = JSON.stringify({
          story: {
            epicNarrative: aiData.synopsis || aiData.story?.epicNarrative || cleanText,
            logline: aiData.logline || project.logline || '',
          },
          englishTitle: aiData.englishTitle || '',
          characters: aiData.characters || [],
          structure: aiData.structure || [],
          episodes: aiData.episodes || []
        });

        await supabase.from('projects_v2')
          .update({ synopsis: fixedPayload })
          .eq('id', project.id);

        console.log(`[${project.title}] ✅ Fixed! epicNarrative now: "${(aiData.synopsis || '').substring(0, 60)}..."`);
      } catch (e) {
        console.error(`[${project.title}] ❌ Re-parse failed:`, e.message);
      }
    } else {
      console.log(`[${project.title}] ✅ Already clean.`);
    }
  }

  console.log('\nDone!');
}

fixSynopsis();
