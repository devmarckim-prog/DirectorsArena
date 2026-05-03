
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function finalTemplateFix() {
  const projectId = '142231a4-ede6-4cd1-a8e1-478757c01faf';
  
  console.log('--- Injecting Rendering Templates (Beats) ---');

  // 1. Get the Episode ID
  const { data: ep } = await supabase
    .from('episodes_v2')
    .select('id, script_content')
    .eq('project_id', projectId)
    .eq('episode_number', 1)
    .single();

  if (!ep) {
    console.error('Episode 1 record missing.');
    return;
  }

  const epId = ep.id;
  const fullScript = ep.script_content;

  // 2. Define the 8 scene structures extracted from the script
  const scenes = [
    { num: 1, title: 'FADE IN', desc: '프로그램의 시작을 알리는 도입부' },
    { num: 2, title: '강남 라운지 바 - 밤', desc: '조재현과 오서영의 긴장감 넘치는 첫 만남' },
    { num: 3, title: '강남 라운지 바 - 대화', desc: '투자 조건과 프로젝트에 대한 심도 있는 논의' },
    { num: 4, title: '강남 라운지 바 - 결단', desc: '불투명한 미래에도 불구하고 손을 잡는 두 사람' },
    { num: 5, title: '지하 스튜디오 - 낮', desc: '본격적인 제작 준비에 착수하는 팀' },
    { num: 6, title: '지하 스튜디오 - 저녁', desc: '현실적인 제약과 자금 문제로 인한 갈등' },
    { num: 7, title: 'tvN 사옥 회의실 - 낮', desc: '강동욱 CP와의 운명적인 피칭 미팅' },
    { num: 8, title: '지하 스튜디오 - 밤', desc: '2주 안에 파일럿을 만들어야 하는 절박한 상황' }
  ];

  // 3. Delete any stale beats and insert fresh ones linked to BOTH project and episode
  await supabase.from('story_beats_v2').delete().eq('episode_id', epId);

  for (const s of scenes) {
    // Extract a chunk of script for each beat (simplified for seeding)
    const scriptLines = fullScript.split('\n');
    const startIdx = (s.num - 1) * 20;
    const endIdx = s.num * 20;
    const beatScript = scriptLines.slice(startIdx, endIdx).join('\n');

    await supabase.from('story_beats_v2').insert({
      project_id: projectId,
      episode_id: epId,
      scene_number: s.num,
      title: s.title,
      description: s.desc,
      script_content: beatScript || "내용을 작성 중입니다.",
      timestamp_label: `00:0${s.num}:00`,
      act_number: Math.ceil(s.num / 2),
      beat_type: 'Scene'
    });
  }

  console.log(`Injected ${scenes.length} templates into DB.`);

  // 4. Update project to READY status to trigger UI load
  await supabase.from('projects_v2').update({ status: 'READY', episode_count: 6 }).eq('id', projectId);
  
  console.log('--- TEMPLATES READY ---');
}

finalTemplateFix();
