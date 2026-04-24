const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://stfonaiuxavzbqwikcqb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM'
);

const PROJECT_ID = '142231a4-ede6-4cd1-a8e1-478757c01faf';

const ep1Script = `
S#1. 강남 최고급 레스토랑 - 낮

조재현과 오서영, 긴장된 표정으로 앉아있다. 마주 앉은 김병수, 여유롭게 와인잔을 굴린다.

김병수
정말 tvN 편성을 원하십니까?

조재현
그게 아니면 여기까지 오지도 않았습니다.

(효과음) E. 와인잔 부딪히는 소리

오서영
우리가 보여드릴 수 있는 건 '가치'입니다.

S#2. tvN 방송국 로비 - 오후

강동욱 CP, 서류를 바닥에 내팽개친다.

강동욱
이딴 기획안으로 편성시간을 달라고?!

조재현
(이를 꽉 물며)
단 한 번의 기회만 주십시오. 파일럿 시청률이 안 나오면 전액 우리가 책임지겠습니다.

S#3. 디렉터즈 아레나 사무실 - 밤

어두운 사무실. 달빛만 창문으로 스며든다. 조재현, 화이트보드에 적힌 타임라인을 멍하니 바라본다. 

오서영 (O.S)
아직 안 끝났어요.

오서영, 커피 두 잔을 들고 들어온다.
`;

const dummyScript = "S#1. 방송국 복도 - 낮\n\n(이 회차의 상세 대본은 아직 집필되지 않았습니다. AI를 통해 씬별로 재생성하세요.)";

async function seed() {
  console.log('Seeding episodes and scenes for', PROJECT_ID);

  await supabase.from('episodes_v2').delete().eq('project_id', PROJECT_ID);
  await supabase.from('scenes_v2').delete().eq('project_id', PROJECT_ID);

  const episodes = [];
  for (let i = 1; i <= 8; i++) {
    episodes.push({
      project_id: PROJECT_ID,
      episode_number: i,
      title: i === 1 ? '제1화: 야심의 서막' : '제' + i + '화: 아레나의 도전자들',
      summary: i === 1 ? '강남의 한 카페. 조재현과 오서영이 김병수와 만난다. 디렉터즈 아레나의 편성을 위한 거대한 게임이 시작된다.' : '디렉터즈 아레나 ' + i + '회 방송을 앞두고 벌어지는 업계의 치열한 암투와 전략.',
      script_content: i === 1 ? ep1Script : dummyScript
    });
  }

  const { data: epData, error: epErr } = await supabase.from('episodes_v2').insert(episodes).select();
  if (epErr) {
    console.error('Episode error:', epErr);
    return;
  }
  console.log('Inserted 8 episodes.');

  const scenes = [];
  for (const ep of epData) {
    const numScenes = 4;
    for (let s = 1; s <= numScenes; s++) {
      scenes.push({
        project_id: PROJECT_ID,
        episode_id: ep.id,
        scene_number: s,
        title: ep.episode_number === 1 && s === 1 ? '야심의 조우' : 
               ep.episode_number === 1 && s === 2 ? '제작사 설립' : 
               ep.episode_number === 1 && s === 3 ? '배신의 안개' : '씬 ' + s + ': 갈등',
        description: '에피소드 ' + ep.episode_number + '의 ' + s + '번째 씬 요약입니다. 인물 간의 갈등이 심화됩니다.',
        setting: s % 2 === 0 ? '방송국' : '사무실',
        time_of_day: s % 2 === 0 ? '낮' : '밤',
      });
    }
  }

  const { error: scErr } = await supabase.from('scenes_v2').insert(scenes);
  if (scErr) {
    console.error('Scene error:', scErr);
    return;
  }
  console.log('Inserted', scenes.length, 'scenes.');
  console.log('Seeding complete.');
}

seed();
