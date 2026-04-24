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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const GLOAMING_ID = '4dd61c93-ee40-4de1-a54b-e91cc009887a';

async function seed() {
  console.log('--- Evolving The Gloaming: Data Injection Phase ---');

  // 1. Enrich Characters
  const characters = [
    { project_id: GLOAMING_ID, name: "이안 (Ian)", gender: "MALE", job: "해결사", look: "전직 형사 출신의 거칠고 고독한 해결사. 잃어버린 기억의 파편을 쫓으며 네온의 그림자를 배회한다.", relationship_type: "Protagonist" },
    { project_id: GLOAMING_ID, name: "세라 (Sarah)", gender: "FEMALE", job: "해커 / 가상 자아", look: "네트워크의 유령이라 불리는 천재 해커. 사실 시냅스 코어가 스스로 만들어낸 인공 지능의 발현이다.", relationship_type: "Protagonist" },
    { project_id: GLOAMING_ID, name: "밴스 (Vance)", gender: "MALE", job: "시냅스 보안 이사", look: "질서와 통제를 숭배하는 냉혈한. 이안의 과거를 알고 있는 유일한 인물이자 철저한 감시자.", relationship_type: "Antagonist" },
    { project_id: GLOAMING_ID, name: "카엘 (Kael)", gender: "MALE", job: "암시장 딜러", look: "기억의 파편을 매매하는 정보 상인. 돈과 권력보다 흥미로운 사건에 끌리는 괴짜.", relationship_type: "Supporting" },
    { project_id: GLOAMING_ID, name: "마이라 (Myra)", gender: "FEMALE", job: "저항군 리더", look: "뉴 쉘터의 태양을 되찾으려는 지하 저항군 '솔라리스'의 수장. 강인한 결단력을 지녔다.", relationship_type: "Supporting" }
  ];

  console.log('[1/3] Syncing Characters...');
  await supabase.from('characters_v2').delete().eq('project_id', GLOAMING_ID);
  await supabase.from('characters_v2').insert(characters);

  // 2. Enrich Episodes
  const episodes = [
    { 
      project_id: GLOAMING_ID, 
      episode_number: 1, 
      title: "Midnight Protocol", 
      summary: "뉴 쉘터의 어둠 속에서 이안은 정체불명의 해커 세라로부터 시냅스 코어의 데이터를 탈취해달라는 의뢰를 받는다. 기억의 단편이 스쳐 지나가며 그는 자신의 과거가 시냅스와 연결되어 있음을 느낀다.",
      script_content: `INT. NEON STREET - NIGHT\n\nRain pours down, reflecting the blinding neon of the 'SYNAPSE' hologram.\n\nIAN (40s, rough) stares at a flickering memory chip. His hand trembles.\n\nIAN\n(murmuring)\nIt's still there. The glitch...\n\nA shadow falls over him. VANCE (50s, sharp suit) steps out of a flying hover-limo.\n\nVANCE\nYou should have stayed in the Dark Zone, Ian.\n\nIAN\nAnd let you rot my brain for another cycle? Not this time.`
    },
    { project_id: GLOAMING_ID, episode_number: 2, title: "Neon Shadows", summary: "이안은 세라의 안내를 따라 시냅스 보안을 뚫고 기억 거래소로 잠입한다. 그곳에서 그는 메모리 리크 전염병이 단순한 사고가 아닌 인위적인 통제 수단임을 발견한다." },
    { project_id: GLOAMING_ID, episode_number: 3, title: "Memory Leak", summary: "밴스의 추격이 거세지자 이안은 세라가 현실의 인간이 아닌 네트워크 자체임을 알게 된다. 자아를 지키기 위한 기계와 인간의 경계가 무너지기 시작한다." },
    { project_id: GLOAMING_ID, episode_number: 4, title: "The Synapse Core", summary: "이안과 저항군 솔라리스는 뉴 쉘터의 인공 태양을 끄고 진짜 별빛을 되찾기 위해 시냅스 코어로 돌진한다. 최후의 결전에서 이안은 자신의 모든 기억을 걸고 도박을 시작한다." }
  ];

  console.log('[2/3] Syncing Episodes...');
  await supabase.from('episodes_v2').delete().eq('project_id', GLOAMING_ID);
  await supabase.from('episodes_v2').insert(episodes);

  // 3. Fallback Beats in Synopsis (since story_beats_v2 is missing)
  const beats = [
    { act_number: 1, beat_type: "Opening Image", title: "가짜 태양의 도시", description: "인공 돔 아래 네온사인만 빛나는 뉴 쉘터의 전경", timestamp_label: "00:05:00" },
    { act_number: 1, beat_type: "Inciting Incident", title: "유령의 접속", description: "세라로부터 도착한 위험한 의뢰와 첫 번째 기억 조각", timestamp_label: "00:15:00" },
    { act_number: 2, beat_type: "Midpoint", title: "거울 속의 기계", description: "자신이 시냅스의 실험체였다는 충격적인 진실의 노출", timestamp_label: "00:35:00" },
    { act_number: 2, beat_type: "All is Lost", title: "회색의 기억", description: "세라의 정체가 밝혀지고 이안의 기억 장치가 파손됨", timestamp_label: "00:50:00" },
    { act_number: 3, beat_type: "Climax", title: "코어로의 질주", description: "시냅스 중앙 타워에서의 최후의 해킹과 물리적 전투", timestamp_label: "01:05:00" },
    { act_number: 3, beat_type: "Resolution", title: "진짜 새벽", description: "뉴 쉘터의 돔이 열리며 2088년 만에 하늘이 열림", timestamp_label: "01:15:00" }
  ];

  console.log('[3/3] Updating Synopsis with Meta-Beats Fallback...');
  const { data: project } = await supabase.from('projects_v2').select('synopsis').eq('id', GLOAMING_ID).single();
  let synopsisObj = {};
  try {
    synopsisObj = JSON.parse(project.synopsis);
  } catch (e) {
    synopsisObj = { story: { logline: project.synopsis } };
  }
  synopsisObj.beats = beats; // Fallback for UI

  await supabase.from('projects_v2').update({ synopsis: JSON.stringify(synopsisObj) }).eq('id', GLOAMING_ID);

  console.log('✅ The Gloaming evolved successfully!');
}

seed();
