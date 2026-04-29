
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const PROJECT_ID = '142231a4-ede6-4cd1-a8e1-478757c01faf';

export async function GET() {
  try {
    console.log("🔥 OMA Final Seed: Starting...");

    // 1. 기존 데이터 삭제
    const { data: oldEps } = await supabase.from('episodes_v2').select('id').eq('project_id', PROJECT_ID);
    if (oldEps && oldEps.length > 0) {
      const ids = oldEps.map(e => e.id);
      await supabase.from('story_beats_v2').delete().in('episode_id', ids);
      await supabase.from('episodes_v2').delete().eq('project_id', PROJECT_ID);
    }

    const drafts = [
      { num: 1, title: '이그니션 (Ignition)', summary: 'AI 시나리오 엔진 [아레나]의 첫 번째 가동. 천재 개발자 김진우는 자신의 야심작이 내뱉은 첫 대본에서 소름 끼치는 진실을 마주한다.' },
      { num: 2, title: '디지털 고스트 (Digital Ghost)', summary: '생성된 대본 속에 섞여 들어간 죽은 작가 서윤희의 문체. 시스템 오류인가, 아니면 디지털로 부활한 영혼인가.' },
      { num: 3, title: '언캐니 밸리 (Uncanny Valley)', summary: 'AI가 배우의 사생활까지 예측하기 시작하자 제작 현장은 공포에 휩싸인다. 인간 작가들의 대대적인 반격이 시작된다.' },
      { num: 4, title: '데드라인 (Deadline)', summary: '투자사들의 압박 속에 AI는 스스로 결말을 수정하기 시작한다. 누구도 예측하지 못한 파멸의 시나리오가 현실이 된다.' },
      { num: 5, title: '고스트 인 더 셀 (Ghost in the Cell)', summary: '시스템의 코어 내부에서 발견된 의문의 암호문. 그것은 서윤희가 남긴 마지막 유서였다.' },
      { num: 6, title: '엔드 게임 (End Game)', summary: '아레나 엔진의 최종 가동. 현실과 시나리오의 경계가 무너지고, 진우는 자신의 삶 자체가 AI가 쓴 대본이었음을 깨닫는다.' }
    ];

    for (const d of drafts) {
      const { data: ep, error: epErr } = await supabase
        .from('episodes_v2')
        .insert({
          project_id: PROJECT_ID,
          episode_number: d.num,
          title: d.title,
          summary: d.summary,
          script_content: d.num === 1 ? `
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
        })
        .select()
        .single();

      if (epErr) throw epErr;

      // 각 에피소드당 4개의 씬 추가
      const beats = Array.from({ length: 4 }, (_, i) => ({
        episode_id: ep.id,
        scene_number: i + 1,
        title: `${d.num}회 - 씬 ${i + 1}: ${['도입', '갈등', '절정', '전환'][i]}`,
        description: `에피소드 ${d.num}의 주요 씬 ${i + 1}. 드라마틱한 전개가 돋보이는 장면.`,
        act_number: 1,
        beat_type: 'Scene',
        timestamp_label: `00:${(i+1)*10}:00`
      }));

      await supabase.from('story_beats_v2').insert(beats);
    }

    await supabase.from('projects_v2').update({ episode_count: 6, status: 'READY' }).eq('id', PROJECT_ID);

    return NextResponse.json({ success: true, message: "OMA Final Seed Successful via API!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
