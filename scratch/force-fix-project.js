
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function forceFix() {
  const projectId = '142231a4-ede6-4cd1-a8e1-478757c01faf';
  
  console.log('--- Force Fixing Project Structure & Templates ---');

  // 1. Update Project Episode Count (The 'Master Template' info)
  await supabase.from('projects_v2').update({ 
    episode_count: 6,
    status: 'READY' 
  }).eq('id', projectId);
  console.log('Project episode_count updated to 6.');

  // 2. Ensure Episode 1 has a real record and proper metadata
  let { data: ep } = await supabase
    .from('episodes_v2')
    .select('*')
    .eq('project_id', projectId)
    .eq('episode_number', 1)
    .single();

  if (!ep) {
    const { data: newEp } = await supabase
      .from('episodes_v2')
      .insert({ 
        project_id: projectId, 
        episode_number: 1, 
        title: '에피소드 1: 새로운 시작', 
        summary: '주인공 조재현이 디렉터즈 아레나에 첫 발을 내딛는 이야기' 
      })
      .select('*')
      .single();
    ep = newEp;
    console.log('Episode 1 record created.');
  }

  const epId = ep.id;
  
  // 3. Create Scene Templates (The 'Rendering Templates' user requested)
  const templates = [
    { num: 1, title: '오프닝: 강남의 밤', desc: '화려한 도시 조명 아래 긴장감이 감도는 라운지 바' },
    { num: 2, title: '만남: 운명적 조우', desc: '재현과 서영이 처음으로 대면하며 갈등이 시작되는 지점' },
    { num: 3, title: '사건: 예상치 못한 제안', desc: '김병수로부터 거부할 수 없는 달콤한 제안을 받는 재현' },
    { num: 4, title: '결정: 선택의 기로', desc: '현실과 이상 사이에서 고뇌하는 주인공' }
  ];

  // Clear existing broken beats for this ep first
  await supabase.from('story_beats_v2').delete().eq('episode_id', epId);

  for (const t of templates) {
    await supabase.from('story_beats_v2').insert({
      project_id: projectId,
      episode_id: epId,
      scene_number: t.num,
      title: t.title,
      description: t.desc,
      script_content: `INT. ${t.title.split(': ')[1]} - 밤\n\n${t.desc}\n\n조재현\n(심각하게)\n과연 이게 맞는 선택일까요?\n\n오서영\n우리에겐 다른 길이 없어요.`,
      timestamp_label: `00:0${t.num}:00`,
      act_number: Math.ceil(t.num / 2),
      beat_type: 'Scene'
    });
  }
  console.log('Scene templates (beats) injected.');

  console.log('--- ALL FIXES APPLIED ---');
}

forceFix();
