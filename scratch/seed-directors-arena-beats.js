const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals) env[key.trim()] = vals.join('=').trim();
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

// 디렉터즈 아레나 프로젝트 ID (이전 실행 결과에서 획득)
const PROJECT_ID = "d20d800d-f0cc-410b-ae9c-4d785ab1d639";

const BEATS = [
  // ACT 1: THE GENESIS
  { act_number: 1, beat_type: "Opening Image", title: "야심의 조우", description: "강남의 한 카페. 조재현과 오서영이 김병수의 중재로 처음 만난다. 숏드라마라는 새로운 판에 대한 열망이 부딪힌다.", timestamp_label: "00:05:00", order_index: 0 },
  { act_number: 1, beat_type: "Inciting Incident", title: "제작사 설립", description: "'디렉터즈 아레나'라는 이름으로 법인을 설립한다. 축배를 들지만 곧바로 자금난과 인력난이라는 현실에 직면한다.", timestamp_label: "00:15:00", order_index: 1 },
  { act_number: 1, beat_type: "Plot Point 1", title: "tvN 편성 도전", description: "강동욱 CP에게 사활을 건 첫 피칭을 제안한다. 숏폼 포맷의 가능성을 증명해야 하는 불가능한 미션을 받는다.", timestamp_label: "00:30:00", order_index: 2 },
  
  // ACT 2: THE STRUGGLE
  { act_number: 2, beat_type: "B-Story", title: "실무의 무게", description: "재현은 연출의 디테일을, 서영은 PPL 수익성을 두고 대립하기 시작한다. 한유리가 사이에서 고분분투하며 조율한다.", timestamp_label: "00:45:00", order_index: 3 },
  { act_number: 2, beat_type: "Fun and Games", title: "오디션 킥오프", description: "천재적인 트러블 메이커 박민규가 오디션 현장을 뒤집어놓는다. 화제성은 터졌지만 사고 처리에 제작사는 마비된다.", timestamp_label: "01:00:00", order_index: 4 },
  { act_number: 2, beat_type: "Midpoint", title: "배신의 안개", description: "라이벌 제작사 최정훈 본부장의 로비로 tvN 편성이 취소될 위기에 처한다. 김병수의 태도가 모호해지기 시작한다.", timestamp_label: "01:15:00", order_index: 5 },
  { act_number: 2, beat_type: "Bad Guys Close In", title: "제작비 증발", description: "메인 투자자가 발을 뺀다. 서영은 자신의 사재까지 털어 제작비를 충당하려 하지만 재현은 자존심을 굽히지 않는다.", timestamp_label: "01:30:00", order_index: 6 },
  { act_number: 2, beat_type: "All is Lost", title: "최후의 통첩", description: "편성 확정까지 남은 시간 24시간. 강동욱 CP는 완성되지 않은 파일럿 시퀀스의 수정을 요구하며 통보한다.", timestamp_label: "01:45:00", order_index: 7 },
  
  // ACT 3: THE TRIUMPH
  { act_number: 3, beat_type: "Finale", title: "아레나의 기적", description: "밤샘 작업 끝에 완성된 파일럿. tvN 편성 회의실에서 기립 박수가 터져 나온다. 마침내 '디렉터즈 아레나' 방영 확정.", timestamp_label: "02:00:00", order_index: 8 },
  { act_number: 3, beat_type: "Resolution", title: "새로운 전쟁터", description: "성공적인 첫 방송. 하지만 그들은 이제 더 큰 판을 준비한다. 재현과 서영은 진정한 파트너가 되어 서로를 마주 본다.", timestamp_label: "02:15:00", order_index: 9 },
];

async function seed() {
  console.log("--- Starting Directors Arena Navigator Beat Injection ---");
  
  const { error: delError } = await supabase
    .from('story_beats_v2')
    .delete()
    .eq('project_id', PROJECT_ID);
    
  if (delError) {
    console.error("Error clearing old beats:", delError);
    return;
  }

  const beatsToInsert = BEATS.map(b => ({ ...b, project_id: PROJECT_ID }));
  const { error: insError } = await supabase
    .from('story_beats_v2')
    .insert(beatsToInsert);

  if (insError) {
    console.error("Error inserting beats:", insError);
  } else {
    console.log(`✔ Successfully injected ${BEATS.length} cinematic beats into Project: ${PROJECT_ID}`);
  }
}

seed();
