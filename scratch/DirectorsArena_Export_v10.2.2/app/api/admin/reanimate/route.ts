import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const projectId = 'secret-garden-reboot-01';

    console.log('--- Phase 6.1: High-Density Narrative Injection (API Bridge) ---');
    
    const synopsis = {
      story: {
        logline: "영혼의 주인이 바뀌는 순간, 욕망의 민낯이 드러난다. 억만장자 상속자와 밑바닥 스턴트 우먼의 잔혹한 운명 교환.",
        epicNarrative: "2025년 서울, 초거대 기업 로엘 그룹의 후계자 김주원은 단순한 재벌 3세가 아닌, 타인의 감정을 데이터로 치환하여 분석하는 소시오패스적 천재성을 가진 인물이다. 그는 폐쇄적인 성벽 안에서 자신만의 왕국을 건설하며 완벽한 후계 구도를 짜나가고 있었다. 반면, 도시의 가장 어두운 구석 '더 그라운드'에서 하루하루 목숨을 걸고 액션 대역을 수행하는 길라임은 사라진 아버지의 죽음에 얽힌 진실을 파헤치기 위해 로엘 그룹의 심장부로 잠입할 기회를 노린다.\n\n어느 날, 제주도의 기괴한 안개 속에서 정체불명의 노인이 건넨 약술을 마신 두 사람은 다음 날 아침 서로의 몸이 바뀌었음을 깨닫는다. 하지만 이 리부트된 세계에서의 체인지(Change)는 낭만적인 해프닝이 아니다. 주원의 몸으로 들어간 라임은 로엘 그룹 내부에 도사린 추악한 비자금 세탁과 인체 실험의 흔적을 발견하고, 라임의 몸이 된 주원은 밑바닥 삶의 처절한 생존 본능과 마주하며 자신이 그토록 경멸하던 인간들의 뜨거운 감정에 서서히 잠식당하기 시작한다.\n\n바뀌어버린 육체는 서로의 삶을 파괴하는 무기가 된다. 주원은 라임의 육체를 이용해 자신의 정적들을 물리적으로 제거하려 하고, 라임은 주원의 권력을 이용해 로엘 그룹의 근간을 뒤흔드는 폭로를 준비한다. 영혼의 주도권을 잡기 위한 이들의 치열한 심리전은 단순한 로맨스를 넘어, 계급 사회의 본질과 인간 존엄성에 대한 근원적인 질문을 던진다. 안개가 걷히고 진짜 태양이 떠오를 때, 과연 그들의 영혼은 제자리를 찾을 수 있을 것인가, 아니면 서로의 욕망 속에서 영원히 실종될 것인가. 진정한 자아를 찾기 위한 잔혹하고도 아름다운 판타지 서사시가 지금 시작된다.",
        narrativeConflicts: [
          { type: "Internal", description: "바뀐 육체에서 솟아오르는 낯선 본능과 원래의 자아가 충돌하며 발생하는 정체성 붕괴" },
          { type: "External", description: "로엘 그룹 내의 치열한 경영권 승계 전쟁과 이를 틈탄 라임의 내부 폭로 작전" },
          { type: "Mystical", description: "몸을 되돌리기 위해 치러야 하는 대가와 안개 속 노인이 숨겨둔 잔혹한 마지막 거래" }
        ]
      }
    };

    const characters = [
      { name: "김주원", job: "로엘 그룹 총괄 상무", look: "감정을 숫자로 계산하는 냉혈한. 라임의 몸이 된 후 감정의 폭풍에 휘말리며 무너져 내린다.", relationship_type: "Protagonist" },
      { name: "길라임", job: "스턴트 우먼 / 복수귀", look: "아버지를 죽인 로엘 그룹을 무너뜨리기 위해 살인 병기가 된 여자. 주원의 몸으로 권력을 휘두른다.", relationship_type: "Protagonist" },
      { name: "오스카", job: "한물간 톱스타", look: "화려한 겉모습 뒤에 로엘 그룹의 추문을 덮는 '청소부' 역할을 수행하는 반전 인물.", relationship_type: "Supporting" },
      { name: "윤슬", job: "재벌가 장녀 / 복수 설계자", look: "주원의 정략결혼 상대이자, 오스카를 파멸시키기 위해 돌아온 치밀한 지략가.", relationship_type: "Antagonist" },
      { name: "임종수", job: "액션 스쿨 감독", look: "라임의 유일한 안식처이자 조력자였으나, 사실은 주원의 어머니에게 고용된 감시자.", relationship_type: "Supporting" },
      { name: "김비서", job: "주원의 심복", look: "주원의 모든 비밀을 알고 있는 정보원. 몸이 바뀐 주원과 라임을 가장 먼저 눈치챈다.", relationship_type: "Supporting" },
      { name: "박문홍", job: "로엘 그룹 회장", look: "모든 비극의 시작점. 자신의 영생을 위해 자식들을 실험체로 사용하는 비정한 노인.", relationship_type: "Antagonist" },
      { name: "미지의 노인", job: "운명의 설계자", look: "두 사람에게 술을 건넨 장본인. 인간의 욕망이 한계에 도달했을 때 나타나는 초월적 존재.", relationship_type: "Mystical" }
    ];

    // 1. Upsert Project
    const { error: pError } = await supabase
      .from('projects_v2')
      .upsert({
        id: projectId,
        title: "시크릿 가든 리부트 (Secret Garden Reboot)",
        genre: "Dark Fantasy / Romance",
        logline: synopsis.story.logline,
        synopsis: JSON.stringify(synopsis),
        status: 'COMPLETED',
        progress: 100,
        is_sample: true
      }, { onConflict: 'id' });

    if (pError) throw pError;

    // 2. Sync Characters
    await supabase.from('characters_v2').delete().eq('project_id', projectId);
    const { error: cError } = await supabase
      .from('characters_v2')
      .insert(characters.map(c => ({ ...c, project_id: projectId })));

    if (cError) throw cError;

    return NextResponse.json({ success: true, message: "Masterpiece metadata injected successfully." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
