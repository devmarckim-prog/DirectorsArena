/**
 * 최종 대본 삽입 스크립트 — 실제 컬럼 기준
 * story_beats_v2 실제 컬럼: id, project_id, act_number, beat_type, title, description, timestamp_label, order_index
 * script_content는 episodes_v2.script_content에만 전체 저장
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const PROJECT_ID = '142231a4-ede6-4cd1-a8e1-478757c01faf';
const EPISODE_ID = '86828326-79b2-4db5-aeab-41b86a47c265';

// 전체 합본 대본 (episodes_v2.script_content에 저장)
const FULL_SCRIPT = `INT. 방송국 편집실 - 새벽 3시

형광등 하나가 깜빡인다. 사방이 적막하다.
모니터 불빛만이 OSE YOUNG(32, 여)의 얼굴을 비춘다.

OSE YOUNG
(혼잣말)
...한 번만 더. 딱 한 번만.

Enter 키를 누르는 순간 — 화면이 꺼진다. 정전.

OSE YOUNG
괜찮아. 다시 하면 되지.

비상등이 켜지고, 붉은 빛이 편집실을 물들인다.

INT. 방송국 엘리베이터 - 연속

KANG MIN-JUN(35, 남, 말끔한 수트)이 손전등을 들고 나타난다.

KANG MIN-JUN
거기 누구세요?

OSE YOUNG
야, 눈! 눈!

KANG MIN-JUN
죄송합니다. 혼자 계셨어요?

OSE YOUNG
혼자가 아니었으면 이 상황이 더 복잡했겠죠.

KANG MIN-JUN
(명함을 내밀며)
강민준입니다. 투자개발팀.

OSE YOUNG
전 지금 양손이 다 차서요.
(한 손엔 커피, 한 손엔 하드디스크)

EXT. 방송국 옥상 - 새벽 4시

서울의 야경이 펼쳐진다. 바람이 분다.
두 사람이 나란히 난간에 기댄다.

OSE YOUNG
이 도시에서 지금 잠 못 자는 사람이 몇 명이나 될까요.

KANG MIN-JUN
저는 매일이에요.

OSE YOUNG
(하드디스크를 들어올리며)
혹시, 콘텐츠 투자 쪽이세요?

KANG MIN-JUN
거기 뭐가 들어있어요?

OSE YOUNG
(한 박자 쉬고)
제 인생 3년이요.

INT. 방송국 휴게실 - 새벽 5시

자판기 불빛 아래, 두 사람이 노트북 화면을 들여다본다.

KANG MIN-JUN
(조용히)
이걸 혼자 만들었어요?

OSE YOUNG
PD가 잘렸고, 작가가 떠났고, 촬영감독이 아팠어요.
그래서 제가 다 했어요.

KANG MIN-JUN
(결정하듯)
저한테 제출해요. 오늘 9시 발표에 넣고 싶어요.

INT. 투자개발사 대회의실 - 오전 9시

정장 차림의 임원들. 창밖으로 서울의 아침이 시작된다.
OSE YOUNG이 화면 앞에 선다. 어젯밤과 같은 옷.

EXECUTIVE A
밤새 작업하셨나요?

OSE YOUNG
(미소)
네. 덕분에 오늘 이 자리에 있습니다.

(영상 상영 후)

EXECUTIVE B
이 작품의 제목이 왜 "디렉터스 아레나"입니까?

OSE YOUNG
살아남은 자가 진짜 감독이 되는 곳이니까요.

INT. 투자개발사 엘리베이터 - 오전 11시

문이 열린다. OSE YOUNG이 들어선다. MIN-JUN이 이미 타고 있다.

OSE YOUNG
...어젯밤이랑 비슷하네요.

MIN-JUN이 서류 봉투를 내민다. "투자의향서 (Letter of Intent)"

OSE YOUNG
...진짜예요?

KANG MIN-JUN
제가 원래 좋은 걸 보면 바로 말한다고 했잖아요.

서울의 아침 햇살이 쏟아진다.

OSE YOUNG
(첫 번째 진짜 미소)
다음번엔 제대로 된 미팅실에서 봐요.

FADE OUT. — END OF EPISODE 1 —`;

// story_beats_v2 실제 컬럼만 사용
const BEATS = [
  { act_number: 1, beat_type: 'Opening Image',    title: 'SCENE 1: 심야의 편집실',     description: '오세영이 홀로 편집실에서 정전을 맞닥뜨린다.',               timestamp_label: '00:01:00', order_index: 0 },
  { act_number: 1, beat_type: 'Inciting Incident',title: 'SCENE 2: 엘리베이터의 남자', description: '정전 속 엘리베이터에서 강민준과 우연히 조우한다.',          timestamp_label: '00:06:00', order_index: 1 },
  { act_number: 1, beat_type: 'First Plot Point', title: 'SCENE 3: 옥상의 첫 새벽',   description: '옥상에서 서울의 새벽을 배경으로 두 사람이 처음 대화한다.',  timestamp_label: '00:14:00', order_index: 2 },
  { act_number: 2, beat_type: 'Midpoint',         title: 'SCENE 4: 오세영의 프로젝트',description: '오세영이 3년의 작업물을 민준에게 보여주고 기회를 얻는다.',  timestamp_label: '00:22:00', order_index: 3 },
  { act_number: 2, beat_type: 'All Is Lost',      title: 'SCENE 5: 해가 뜨는 발표장', description: '오세영이 공식 발표장에서 자신의 프로젝트를 발표한다.',      timestamp_label: '00:33:00', order_index: 4 },
  { act_number: 3, beat_type: 'Finale',           title: 'SCENE 6: 엘리베이터, 다시', description: '투자의향서를 받아든 오세영. 두 사람의 이야기가 시작된다.', timestamp_label: '00:44:00', order_index: 5 },
];

async function seed() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  });
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // 1. EP1 script_content 전체 대본 업데이트
  console.log('📝 EP1 전체 대본 업데이트...');
  const { error: epErr } = await supabase
    .from('episodes_v2')
    .update({ script_content: FULL_SCRIPT, title: 'EP1. 심야의 편집실' })
    .eq('id', EPISODE_ID);
  if (epErr) { console.error('❌ EP 업데이트 실패:', epErr.message); return; }
  console.log('✅ EP1 script_content 업데이트 완료.');

  // 2. 기존 beats 삭제
  console.log('🧹 기존 beats 삭제...');
  await supabase.from('story_beats_v2').delete().eq('project_id', PROJECT_ID);

  // 3. beats 삽입 (실제 컬럼만 사용)
  console.log('📝 6개 씬 비트 삽입 중...');
  const toInsert = BEATS.map(b => ({ ...b, project_id: PROJECT_ID }));

  const { data, error } = await supabase
    .from('story_beats_v2')
    .insert(toInsert)
    .select('id, title');

  if (error) { console.error('❌ 삽입 실패:', error.message); return; }

  console.log(`\n🎉 완료!`);
  console.log(`✅ EP1 ID: ${EPISODE_ID}`);
  console.log(`✅ 삽입된 비트: ${data.length}개`);
  data.forEach(b => console.log(`  - ${b.title}`));
  console.log('\n🔗 테스트: http://localhost:3000/project-contents/142231a4-ede6-4cd1-a8e1-478757c01faf');
}

seed().catch(console.error);
