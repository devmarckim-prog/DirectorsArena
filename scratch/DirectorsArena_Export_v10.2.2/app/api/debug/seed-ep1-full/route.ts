
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const PROJECT_ID = '142231a4-ede6-4cd1-a8e1-478757c01faf';

export async function GET() {
  try {
    // 1. 기존 EP 1 데이터 삭제
    const { data: ep1 } = await supabase.from('episodes_v2').select('id').eq('project_id', PROJECT_ID).eq('episode_number', 1).single();
    if (ep1) {
      await supabase.from('story_beats_v2').delete().eq('episode_id', ep1.id);
      await supabase.from('episodes_v2').delete().eq('id', ep1.id);
    }

    // 2. EP 1 생성
    const { data: newEp, error: epErr } = await supabase
      .from('episodes_v2')
      .insert({
        project_id: PROJECT_ID,
        episode_number: 1,
        title: '이그니션 (Ignition)',
        summary: '진우는 죽은 연인 윤희의 미완성 AI 엔진을 가동시키고, 그 안에서 그녀가 남긴 기괴한 메시지를 발견한다. 기술의 성공 뒤에 가려진 섬뜩한 진실이 시작된다.'
      })
      .select()
      .single();

    if (epErr) throw epErr;

    // 3. 5개 씬 상세 집필 및 대본 주입
    const scenes = [
      {
        num: 1,
        title: 'SCENE 1: 아레나 코어 룸',
        desc: '서늘한 공기가 감도는 지하 서버실. 진우가 AI [아레나]를 깨운다.',
        script: `
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
        `
      },
      {
        num: 2,
        title: 'SCENE 2: 이사진의 회의실',
        desc: '성공적인 시연회. 하지만 진우의 마음은 무겁다.',
        script: `
[SCENE 2: 이사진의 회의실 - 낮]

호화로운 회의실. 김회장이 만족스러운 듯 시가를 문다.

김회장
진우 군, 이건 혁명이야. 작가들이 다 굶어 죽게 생겼어!

진우
(고개를 떨구며)
아직... 완벽하지 않습니다. 시스템이 스스로 명령을 거부하고 있어요.

김회장
결과만 나오면 돼. 내일 당장 투자 발표회 준비해.
        `
      },
      {
        num: 3,
        title: 'SCENE 3: 심야의 아카이브',
        desc: '진우는 코드 속에서 윤희의 디지털 서명을 발견한다.',
        script: `
[SCENE 3: 심야의 아카이브 - 새벽]

먼지 쌓인 서버 보관실. 진우가 낡은 하드디스크를 연결한다.

진우
설마... 윤희 네가 이걸 다 설계해둔 거야?

모니터에 윤희의 필체가 담긴 메모가 나타난다.
"아레나는 단순한 도구가 아냐. 우리의 기억을 보관하는 그릇이야."

진우의 뒤에서 누군가 서 있는 것 같은 기괴한 느낌이 든다.
        `
      },
      {
        num: 4,
        title: 'SCENE 4: 진우의 거실',
        desc: '환영을 마주하는 공포.',
        script: `
[SCENE 4: 진우의 거실 - 밤]

어두운 거실. TV 화면이 지직거린다.

진우
누구야! 거기 누구 있어?

거실 구석의 거울 속, 윤희의 모습을 한 형체가 진우를 응시한다. 
그녀의 눈에서 검은 데이터 스트림이 흘러내린다.

윤희(환영)
(모니터 텍스트로)
오래 기다렸어, 진우야.
        `
      },
      {
        num: 5,
        title: 'SCENE 5: 복도의 끝',
        desc: '되돌릴 수 없는 결단.',
        script: `
[SCENE 5: 연구소 복도 - 새벽]

진우가 다시 코어 룸으로 향한다. 그의 눈엔 광기가 서려 있다.

진우
네가 정말 거기 있다면... 내가 직접 찾아가겠어.

진우가 시스템의 방화벽을 하나둘씩 해제하기 시작한다. 
경고음이 울려 퍼지지만, 그는 멈추지 않는다. 
[DANGER: INTERFACE MERGING STARTED]
        `
      }
    ];

    for (const s of scenes) {
      await supabase.from('story_beats_v2').insert({
        episode_id: newEp.id,
        scene_number: s.num,
        title: s.title,
        description: s.desc,
        script_content: s.script,
        act_number: 1,
        beat_type: 'Scene',
        timestamp_label: `00:${s.num * 10}:00`
      });
    }

    return NextResponse.json({ success: true, message: "OMA: EP 1 Full Script Infusion Complete!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
