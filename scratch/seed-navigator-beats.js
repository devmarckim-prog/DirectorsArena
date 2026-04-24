const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manual .env.local parsing to avoid dependency issues in scratch environment
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

const PROJECT_ID = "887ca3c6-2773-488d-bc39-65aa9e26bef2"; // 시크릿 가든 리부트

const BEATS = [
  // ACT 1
  { act_number: 1, beat_type: "Opening Image", title: "네온속의 그림자", description: "VVIP 파티장, 가면을 쓴 주원이 사람들의 감정을 데이터로 분석하며 지루해하는 모습.", timestamp_label: "00:03:00", order_index: 0 },
  { act_number: 1, beat_type: "Inciting Incident", title: "운명의 교차로", description: "제주도 스턴트 현장, 주원과 라임이 처음으로 눈을 맞추며 정적을 느낀다.", timestamp_label: "00:12:00", order_index: 1 },
  { act_number: 1, beat_type: "Plot Point 1", title: "영혼의 전이", description: "의문의 약술을 마신 뒤, 폭우속에서 두 사람의 영혼이 뒤바뀌며 비명이 터져나온다.", timestamp_label: "00:25:00", order_index: 2 },
  
  // ACT 2
  { act_number: 2, beat_type: "B-Story", title: "타인의 육체", description: "서로의 몸으로 살아남기 위한 처절한 적응기. 주원은 라임의 빈곤을, 라임은 주원의 고독을 경험한다.", timestamp_label: "00:35:00", order_index: 3 },
  { act_number: 2, beat_type: "Fun and Games", title: "권력의 장난", description: "주원의 몸이 된 라임이 무례한 재벌 일가에게 화끈한 액션으로 복수하며 판을 흔든다.", timestamp_label: "00:45:00", order_index: 4 },
  { act_number: 2, beat_type: "Midpoint", title: "음모의 심장부", description: "로엘 그룹 지하의 비밀 실험실 발견. 주원의 아버지가 숨겨온 인체 실험의 증거를 포착한다.", timestamp_label: "01:00:00", order_index: 5 },
  { act_number: 2, beat_type: "Bad Guys Close In", title: "추격의 안개", description: "박회장의 심복들이 몸이 바뀐 사실을 눈치채고 라임(주원의 몸)을 납치하려 시도한다.", timestamp_label: "01:15:00", order_index: 6 },
  { act_number: 2, beat_type: "All is Lost", title: "거절할 수 없는 거래", description: "노인이 다시 나타나 영혼을 돌려받으려면 상대방의 목숨을 바쳐야 한다는 잔혹한 조건을 제시한다.", timestamp_label: "01:30:00", order_index: 7 },
  
  // ACT 3
  { act_number: 3, beat_type: "Finale", title: "최후의 폭로", description: "로엘 그룹 공청회, 라임과 주원이 협동하여 박회장의 만행을 전 세계에 스트리밍으로 폭로한다.", timestamp_label: "01:45:00", order_index: 8 },
  { act_number: 3, beat_type: "Resolution", title: "진짜 나로 산다는 것", description: "영혼은 제자리로 돌아오지만, 이제 두 사람은 예전과는 다른 눈으로 세상을 바라보게 된다.", timestamp_label: "01:55:00", order_index: 9 },
];

async function seed() {
  console.log("--- Starting Navigator Beat Injection ---");
  
  // 1. Clear existing beats for this project
  const { error: delError } = await supabase
    .from('story_beats_v2')
    .delete()
    .eq('project_id', PROJECT_ID);
    
  if (delError) {
    console.error("Error clearing old beats:", delError);
    return;
  }

  // 2. Insert new high-quality beats
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
