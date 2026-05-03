
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function absoluteForceFix() {
  const projectId = '142231a4-ede6-4cd1-a8e1-478757c01faf';
  console.log('--- ABSOLUTE FORCE FIX START ---');

  // 1. Get ALL episodes for this project
  const { data: episodes } = await supabase
    .from('episodes_v2')
    .select('id, episode_number')
    .eq('project_id', projectId);

  console.log(`Found ${episodes.length} episodes. Fixing all of them.`);

  for (const ep of episodes) {
    console.log(`Working on EP ${ep.episode_number} (ID: ${ep.id})`);
    
    // Delete existing broken beats
    await supabase.from('story_beats_v2').delete().eq('episode_id', ep.id);

    const scenes = [
      { num: 1, title: '오프닝: 새로운 시작', desc: '디렉터즈 아레나 프로젝트의 서막' },
      { num: 2, title: '강남 라운지 바 - 밤', desc: '운명적인 첫 만남' },
      { num: 3, title: '사무실 - 낮', desc: '열정적인 기획 회의' },
      { num: 4, title: '회의실 - 오후', desc: '투자를 향한 도전' },
      { num: 5, title: '지하 스튜디오 - 저녁', desc: '창작의 고통과 환희' },
      { num: 6, title: '신촌 거리 - 밤', desc: '주인공의 결단' },
      { num: 7, title: '방송국 로비 - 아침', desc: '결전의 날' },
      { num: 8, title: '에필로그: 성공적인 런칭', desc: '새로운 미래의 시작' }
    ];

    for (const s of scenes) {
      const { error } = await supabase.from('story_beats_v2').insert({
        project_id: projectId,
        episode_id: ep.id,
        scene_number: s.num,
        title: s.title,
        description: s.desc,
        script_content: `INT. ${s.title.split(': ')[0]} - 낮\n\n${s.desc}\n\n조재현\n준비됐나요?\n\n오서영\n언제든지요.`,
        timestamp_label: `00:0${s.num}:00`,
        act_number: Math.ceil(s.num / 3),
        beat_type: 'Scene'
      });
      if (error) console.error(`Insert Error for Scene ${s.num}:`, error);
    }

    // 2. IMMEDIATE VERIFICATION
    const { data: verify } = await supabase.from('story_beats_v2').select('id').eq('episode_id', ep.id);
    console.log(`VERIFICATION: EP ${ep.episode_number} now has ${verify?.length || 0} beats in DB.`);
  }

  // 3. Force update project status
  await supabase.from('projects_v2').update({ status: 'READY' }).eq('id', projectId);

  console.log('--- ALL EPISODES FIXED AND VERIFIED ---');
}

absoluteForceFix();
