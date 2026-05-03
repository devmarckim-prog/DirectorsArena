
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function finalFix() {
  const projectId = '142231a4-ede6-4cd1-a8e1-478757c01faf';
  
  console.log('--- FINAL FIX IN PROGRESS ---');

  // 1. Force update project metadata
  const { error: pError } = await supabase
    .from('projects_v2')
    .update({ 
      episode_count: 6, 
      status: 'READY',
      progress: 100 
    })
    .eq('id', projectId);
  
  if (pError) console.error('Project Update Error:', pError);
  else console.log('Project metadata fixed (episode_count=6, status=READY)');

  // 2. Get Episode 1 ID precisely
  const { data: ep1 } = await supabase
    .from('episodes_v2')
    .select('id')
    .eq('project_id', projectId)
    .eq('episode_number', 1)
    .single();

  if (!ep1) {
    console.error('EP 1 not found in DB!');
    return;
  }
  console.log('Targeting EP 1 ID:', ep1.id);

  // 3. Re-inject 8 Scenes (Beats) for EP 1
  const scenes = [
    { num: 1, title: 'FADE IN: 새로운 시작', desc: '디렉터즈 아레나 프로젝트의 시작' },
    { num: 2, title: '강남 라운지 바 - 밤', desc: '조재현과 오서영의 첫 만남' },
    { num: 3, title: '사무실 - 낮', desc: '본격적인 기획 회의 시작' },
    { num: 4, title: '회의실 - 오후', desc: '투자 유치를 위한 열띤 토론' },
    { num: 5, title: '지하 스튜디오 - 저녁', desc: '첫 촬영 준비' },
    { num: 6, title: '신촌 거리 - 밤', desc: '주인공의 고뇌와 결단' },
    { num: 7, title: '방송국 로비 - 아침', desc: '운명의 날, 방송국 도착' },
    { num: 8, title: '에필로그: 첫 방송', desc: '성공적인 첫 방송과 새로운 위기' }
  ];

  // Clear any existing beats for this episode to prevent duplicates
  await supabase.from('story_beats_v2').delete().eq('episode_id', ep1.id);

  for (const s of scenes) {
    await supabase.from('story_beats_v2').insert({
      project_id: projectId,
      episode_id: ep1.id,
      scene_number: s.num,
      title: s.title,
      description: s.desc,
      script_content: `INT. ${s.title.split(': ')[0]} - 낮\n\n${s.desc}\n\n조재현\n결국 해냈군요.\n\n오서영\n이제 시작일 뿐이에요.`,
      timestamp_label: `00:0${s.num}:00`,
      act_number: Math.ceil(s.num / 3),
      beat_type: 'Scene'
    });
  }
  console.log('8 Scenes successfully injected into EP 1');

  console.log('--- FIX COMPLETE. PLEASE REFRESH THE BROWSER ---');
}

finalFix();
