
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const PROJECT_ID = '142231a4-ede6-4cd1-a8e1-478757c01faf';

async function seedNavigatorData() {
  console.log('🚀 OMA Data Injection Started...');

  // 1. 에피소드 데이터 정의
  const episodes = [
    { num: 1, title: '이그니션 (Ignition)', summary: 'AI 시나리오 엔진 [아레나]의 첫 번째 가동. 천재 개발자 김진우는 자신의 야심작이 내뱉은 첫 대본에서 소름 끼치는 진실을 마주한다.' },
    { num: 2, title: '디지털 고스트 (Digital Ghost)', summary: '생성된 대본 속에 섞여 들어간 죽은 작가 서윤희의 문체. 시스템 오류인가, 아니면 디지털로 부활한 영혼인가.' },
    { num: 3, title: '언캐니 밸리 (Uncanny Valley)', summary: 'AI가 배우의 사생활까지 예측하기 시작하자 제작 현장은 공포에 휩싸인다. 인간 작가들의 대대적인 반격이 시작된다.' },
    { num: 4, title: '데드라인 (Deadline)', summary: '투자사들의 압박 속에 AI는 스스로 결말을 수정하기 시작한다. 누구도 예측하지 못한 파멸의 시나리오가 현실이 된다.' },
    { num: 5, title: '고스트 인 더 셀 (Ghost in the Cell)', summary: '시스템의 코어 내부에서 발견된 의문의 암호문. 그것은 서윤희가 남긴 마지막 유서였다.' },
    { num: 6, title: '엔드 게임 (End Game)', summary: '아레나 엔진의 최종 가동. 현실과 시나리오의 경계가 무너지고, 진우는 자신의 삶 자체가 AI가 쓴 대본이었음을 깨닫는다.' }
  ];

  for (const ep of episodes) {
    // Episode Insert/Update
    const { data: epData, error: epErr } = await supabase
      .from('episodes_v2')
      .upsert({
        project_id: PROJECT_ID,
        episode_number: ep.num,
        title: ep.title,
        summary: ep.summary,
        status: 'READY',
        // EP 1, Scene 1에 대한 대본 샘플
        script_content: ep.num === 1 ? `
[SCENE 1: 아레나 코어 룸 - 밤]

어둡고 서늘한 서버실. 수천 개의 LED가 핏빛으로 깜빡인다. 
진우(30대, 초췌한 천재)가 모니터 앞에 앉아 떨리는 손으로 엔터 키를 누른다.

진우
(혼잣말처럼)
제발... 이번엔 제대로 나와줘.

모니터에 텍스트가 빠르게 타이핑된다.
"인간은 결국 자신이 만든 도구에 의해 기록될 것이다."

진우의 눈이 커진다. 이건 그가 입력한 프롬프트가 아니다.

진우
잠깐... 뭐야, 누가 접속 중이야?

시스템 경고음이 울린다. [ARENA CORE IGNITED]
        ` : null
      }, { onConflict: 'project_id, episode_number' })
      .select()
      .single();

    if (epErr) {
      console.error(`❌ EP ${ep.num} Error:`, epErr);
      continue;
    }

    console.log(`✅ EP ${ep.num} Inserted: ${epData.id}`);

    // 2. 씬(Beat) 데이터 생성
    const sceneCounts = [4, 3, 4, 5, 4, 6]; // 각 에피소드별 씬 개수
    const beats = [];
    for (let i = 0; i < sceneCounts[ep.num - 1]; i++) {
      beats.push({
        episode_id: epData.id,
        scene_number: i + 1,
        title: `${ep.num}회 - 씬 ${i + 1}: ${['서막', '갈등', '전개', '절정', '결말', '반전'][i] || '비하인드'}`,
        description: `에피소드 ${ep.num}의 핵심 전환점 ${i + 1}. 시나리오 엔진의 긴장감이 고조되는 중요한 장면이다.`,
        act_number: Math.floor(i / 2) + 1,
        beat_type: 'Scene',
        timestamp_label: `00:${String((i + 1) * 8).padStart(2, '0')}:00`
      });
    }

    const { error: beatErr } = await supabase
      .from('story_beats_v2')
      .upsert(beats, { onConflict: 'episode_id, scene_number' });

    if (beatErr) console.error(`❌ EP ${ep.num} Beats Error:`, beatErr);
    else console.log(`   └ 🎬 ${beats.length} Scenes Synced.`);
  }

  // 3. Project Table Update (Episode Count Sync)
  await supabase
    .from('projects_v2')
    .update({ episode_count: 6, status: 'READY' })
    .eq('id', PROJECT_ID);

  console.log('✨ OMA Data Injection Completed!');
}

seedNavigatorData();
