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

const PROJECT_ID = '142231a4-ede6-4cd1-a8e1-478757c01faf';

const SAMPLE_SCRIPT = `
S#1. 강남의 한 카페 - 낮

통창 너머로 쏟아지는 오후의 햇살. 북적이는 소음 속에서 재현(40)이 심각한 표정으로 아이패드를 들여다보고 있다.
그의 앞에는 식어버린 에스프레소가 놓여 있다.

재현
(혼잣말처럼) 
드라마는 영혼이야. 영혼이 없으면 그냥 데이터 조각일 뿐이라고.

뒤이어 카페 문이 열리고, 세련된 정장 차림의 서영(38)이 당당하게 걸어 들어온다. 그녀의 하이힐 소리가 카페 안을 가로지른다.

서영
조재현 대표님, 여기까지 오는데 3분 12초 걸렸네요. 시간은 금인 거 아시죠?

재현이 고개를 들어 서영을 바라본다. 그의 눈엔 피로와 동시에 형형한 긴장감이 서려 있다.

재현
오셨습니까, 오 대표님. 

서영
바로 본론으로 들어가죠. tvN 편성, 강 CP님이 확답 주셨나요?

재현
...아직입니다. 우리 쪽 대본이 너무 '매니악'하다는 게 그쪽 의견입니다.

서영
(차갑게 웃으며) 
당연하죠. 지금 기성의 문법으로 접근하니까 그렇죠. 제가 말씀드렸잖아요. 숏드라마 전장에서는 3초 안에 멱살을 잡아야 한다고. 

서영이 재현의 아이패드를 뺏어 들어 화면을 넘긴다.

서영
이 대사들, 너무 문학적이에요. 작가님한테 전하세요. "사랑해" 대신 "너 없으면 나 죽어"라고 지르라고. 그래야 조회수가 터집니다.

재현
조회수가 드라마의 전부는 아닙니다. 우리는 '아레나'를 만들려는 거지, 단순한 릴스를 찍으려는 게 아닙니다.

서영
시청률 안 나오면 그 '아레나'에 관객은 한 명도 없을 겁니다. 제 전략대로 가시죠.

두 사람 사이에 팽팽한 정적이 흐른다. 카페 안의 BGM이 고조되며 화면 전환.

CUT TO:

S#2. tvN 편성국 복구 - 오후

강 CP(50)가 서류 뭉치를 뒤적이며 한숨을 내쉰다.

강 CP
조 PD, 마음은 알겠는데... 우리도 장사하는 사람들이야. 이 기획이 먹힐지 도박을 할 수는 없다고.

재현
도박이 아닙니다. 이건 새로운 미디어 생태계의 서막입니다.

강 CP가 말없이 창밖을 내다본다. 
`;

const BEATS = [
  { act_number: 1, beat_type: "Opening", title: "야심의 조우", description: "강남 카페에서 재현과 서영의 가치관이 정면으로 충돌하는 첫 만남.", timestamp_label: "00:00:00", order_index: 0 },
  { act_number: 1, beat_type: "Inciting Incident", title: "벼랑 끝의 제안", description: "강 CP로부터 편성 거절 의사를 듣고 재현이 배수진을 치는 과정.", timestamp_label: "00:15:20", order_index: 1 },
  { act_number: 2, beat_type: "Plot Point 1", title: "아레나의 결성", description: "재현과 서영이 결국 손을 잡고 독자적인 제작 시스템을 구축하는 순간.", timestamp_label: "00:30:10", order_index: 2 },
  { act_number: 2, beat_type: "Rising Action", title: "캐스팅 전쟁", description: "무명의 천재 배우들을 찾아 다니며 대형 기획사의 방해를 뚫고 오디션을 진행.", timestamp_label: "00:50:45", order_index: 3 },
  { act_number: 3, beat_type: "Climax", title: "생중계의 기적", description: "첫 방송 사고를 딛고 시청률 10%를 돌파하며 대한민국을 뒤흔드는 디렉터즈 아레나.", timestamp_label: "01:20:00", order_index: 4 }
];

async function insertScript() {
  console.log('--- Inserting Sample Script for Directors Arena ---');

  // 1. Simple Insert for Episode (Checking existing first)
  const { data: existingEp } = await supabase
    .from('episodes_v2')
    .select('id')
    .eq('project_id', PROJECT_ID)
    .eq('episode_number', 1)
    .single();

  let epId;
  if (existingEp) {
    console.log('✅ Episode 1 already exists. Updating...');
    const { data: updated, error: upError } = await supabase
      .from('episodes_v2')
      .update({
        title: '제1화: 야심의 서막',
        summary: '제작자 재현과 전략가 서영의 역사적인 만남과 tvN 편성을 향한 처절한 사투.',
        script_content: SAMPLE_SCRIPT.trim()
      })
      .eq('id', existingEp.id)
      .select().single();
    if (upError) console.error('❌ Update Error:', upError.message);
    epId = updated?.id;
  } else {
    const { data: inserted, error: inError } = await supabase
      .from('episodes_v2')
      .insert({
        project_id: PROJECT_ID,
        episode_number: 1,
        title: '제1화: 야심의 서막',
        summary: '제작자 재현과 전략가 서영의 역사적인 만남과 tvN 편성을 향한 처절한 사투.',
        script_content: SAMPLE_SCRIPT.trim()
      })
      .select().single();
    if (inError) console.error('❌ Insert Error:', inError.message);
    epId = inserted?.id;
  }

  // 2. Story Beats (Using fallback to story_beats if _v2 is missing)
  try {
    const { error: v2Error } = await supabase
      .from('story_beats_v2')
      .upsert(BEATS.map(b => ({ ...b, project_id: PROJECT_ID })), { onConflict: 'project_id, order_index' });

    if (v2Error) {
      console.log('⚠️ story_beats_v2 failed. Trying legacy story_beats...');
      await supabase.from('story_beats').upsert(BEATS.map(b => ({ ...b, project_id: PROJECT_ID })), { onConflict: 'project_id, order_index' });
    } else {
      console.log('✅ Story Beats (v2) inserted.');
    }
  } catch (e) {
    console.error('❌ Beat insertion failed entirely.');
  }

  console.log('--- Processing Complete ---');
}

insertScript();
