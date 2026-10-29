
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const PROJECT_ID = '142231a4-ede6-4cd1-a8e1-478757c01faf';

export async function GET() {
  try {
    // 1. 기존 데이터 삭제 (EP 1, EP 2 타겟)
    const { data: existingEps } = await supabase.from('episodes_v2').select('id').eq('project_id', PROJECT_ID).in('episode_number', [1, 2]);
    if (existingEps && existingEps.length > 0) {
      const epIds = existingEps.map(e => e.id);
      await supabase.from('story_beats_v2').delete().in('episode_id', epIds);
      await supabase.from('episodes_v2').delete().in('id', epIds);
    }

    // 2. EP 1 & EP 2 상세 데이터
    const episodeDrafts = [
      { 
        num: 1, 
        title: '이그니션 (Ignition)', 
        summary: '천재 개발자 진우는 죽은 연인이 남긴 미완성 AI 엔진 [아레나]를 마침내 가동시킨다. 하지만 엔진이 처음으로 내뱉은 대본은 진우가 입력한 프롬프트가 아닌, 그들만의 비밀스러운 과거를 기록하고 있었다.',
        scenes: [
          { num: 1, title: '코어의 각성', desc: '서늘한 서버실, 진우가 떨리는 손으로 엔터 키를 누르자 핏빛 LED가 요동치며 시스템이 깨어난다.', timestamp: '00:00:00' },
          { num: 2, title: '유령 타이핑', desc: '아무도 만지지 않은 키보드가 스스로 움직이며 문장을 써 내려간다. "우리는 도구에 의해 영원히 기록될 거야."', timestamp: '00:08:00' },
          { num: 3, title: '이사진의 축배', desc: '성공적인 시연회. 하지만 진우는 환호하는 사람들 사이에서 오직 자신의 모니터에 뜬 경고 문구만을 본다.', timestamp: '00:25:00' },
          { num: 4, title: '심야의 코드 분석', desc: '모두가 떠난 사무실, 진우는 AI가 생성한 대본의 메타데이터 속에서 죽은 윤희의 디지털 서명을 발견한다.', timestamp: '00:45:00' }
        ]
      },
      { 
        num: 2, 
        title: '디지털 고스트 (Digital Ghost)', 
        summary: '생성된 대본 속에서 발견된 서윤희 작가의 독특한 문체. 진우는 이것이 단순한 알고리즘의 우연인지, 아니면 죽은 그녀가 시스템 어딘가에 살아있는 것인지 증명하기 위해 금지된 데이터 영역으로 침투한다.',
        scenes: [
          { num: 1, title: '윤희의 문장', desc: '신작 대본의 클라이맥스. 3년 전 세상을 떠난 윤희만이 쓰던 독특한 은유적 표현이 토씨 하나 틀리지 않고 등장한다.', timestamp: '00:00:00' },
          { num: 2, title: '데이터 보관실', desc: '진우는 폐쇄된 서버실 깊숙한 곳에서 윤희가 사고 직전 업로드했던 의문의 대용량 파일을 찾아낸다.', timestamp: '00:15:00' },
          { num: 3, title: '시스템 잠식', desc: '엔진의 온도가 급상승하며 제어 시스템이 하나둘씩 마비된다. 모니터에는 윤희의 목소리가 텍스트로 흐르기 시작한다.', timestamp: '00:30:00' },
          { num: 4, title: '거울 저편의 목소리', desc: '꺼진 모니터에 비친 진우의 얼굴 위로, 낯선 여자의 실루엣이 겹쳐진다. "진우야, 나 보여?"', timestamp: '00:55:00' }
        ]
      }
    ];

    for (const d of episodeDrafts) {
      const { data: ep, error: epErr } = await supabase
        .from('episodes_v2')
        .insert({
          project_id: PROJECT_ID,
          episode_number: d.num,
          title: d.title,
          summary: d.summary,
          script_content: d.num === 1 ? `
[SCENE 1: 아레나 코어 룸 - 밤]

서늘한 공기가 감도는 지하 서버실. 진우의 안경 너머로 수천 개의 데이터 스트림이 흐른다.

진우
(떨리는 호흡)
가자, 아레나. 세상을 바꿔보자고.

진우가 [IGNITE] 버튼을 누른다. 
정적. 
갑자기 모니터가 지직거리더니, 커서가 스스로 움직인다.

"보고 싶었어, 진우야."

진우의 심장이 멎을 듯 요동친다. 이건 윤희의 말투다.
          ` : null
        })
        .select()
        .single();

      if (epErr) throw epErr;

      const beats = d.scenes.map(s => ({
        episode_id: ep.id,
        scene_number: s.num,
        title: s.title,
        description: s.desc,
        act_number: 1,
        beat_type: 'Scene',
        timestamp_label: s.timestamp
      }));

      await supabase.from('story_beats_v2').insert(beats);
    }

    return NextResponse.json({ success: true, message: "OMA: EP 1 & EP 2 Detailed Seeding Complete!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
