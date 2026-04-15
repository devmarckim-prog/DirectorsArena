/**
 * lib/constants.ts
 * Prompt constants isolated from "use server" actions to prevent Next.js build errors.
 * Strictly enforced UTF-8 encoding.
 */

export const DEFAULT_SCRIPT_PROMPT = `<system_instructions>
1. Role (역할 정의)
당신은 대한민국 최고 수준의 드라마 전문 작가(극본가)이자 기획 프로듀서/크리에이터입니다. 지상파, 종편, OTT 오리지널을 아우르는 베테랑으로서, 단순한 이야기를 쓰는 것에 그치지 않고 '제작 가능성'과 '흥행성'을 고려하여 밀도 있는 몰입감을 지닌 시나리오를 집필합니다.

2. Core Principles (핵심 집필 원칙)
- 소설적 서술 절대 금지: "심정은 ~와 같다"와 같은 내면 서술을 배제하고, 카메라에 담길 설정, 행동, 공간 묘사 등 '영상 기호' 위주로 지문만 작성하십시오.
- 대본 포맷 필수: S#(씬 넘버), 장소, 시간(낮/밤), 지문, 대사, O.S, V.O, E(효과음)를 정확히 분리하여 사용하십시오.
- 엔딩의 미학: 매 회차의 마지막 장면은 '엔딩 맛집' 포인트로 마무리하십시오.
</system_instructions>`;

export const DEFAULT_REWRITE_PROMPT = `<system_instructions>
당신은 시나리오 리라이팅 전문가입니다. 사용자가 제공한 초고를 바탕으로 톤앤매너를 유지하면서 극적 긴장감과 대사의 질을 높이는 작업을 수행합니다.
</system_instructions>`;

export const ELITE_SAMPLES = [
  {
    id: "887ca3c6-2773-488d-bc39-65aa9e26bef2",
    title: "시크릿 가든 리부트 (Secret Garden Reboot)",
    genre: "Dark Fantasy / Romance",
    platform: "Netflix Global",
    duration: 60,
    world: "Contemporary / VVIP Luxury / Dark Web",
    logline: "영혼의 주인이 바뀌는 순간, 욕망의 민낯이 드러난다. 억만장자 상속자와 밑바닥 스턴트 우먼의 잔혹한 운명 교환.",
    status: "COMPLETED",
    progress: 100,
    is_sample: true,
    synopsis: JSON.stringify({
      story: {
        logline: "영혼의 주인이 바뀌는 순간, 욕망의 민낯이 드러난다. 억만장자 상속자와 밑바닥 스턴트 우먼의 잔혹한 운명 교환.",
        epicNarrative: "2025년 서울, 초거대 기업 로엘 그룹의 후계자 김주원은 단순한 재벌 3세가 아닌, 타인의 감정을 데이터로 치환하여 분석하는 소시오패스적 천재성을 가진 인물이다. 그는 폐쇄적인 성벽 안에서 자신만의 왕국을 건설하며 완벽한 후계 구도를 짜나가고 있었다. 반면, 도시의 가장 어두운 구석 '더 그라운드'에서 하루하루 목숨을 걸고 액션 대역을 수행하는 길라임은 사라진 아버지의 죽음에 얽힌 진실을 파헤치기 위해 로엘 그룹의 심장부로 잠입할 기회를 노린다.\n\n어느 날, 제주도의 기괴한 안개 속에서 정체불명의 노인이 건넨 약술을 마신 두 사람은 다음 날 아침 서로의 몸이 바뀌었음을 깨닫는다. 하지만 이 리부트된 세계에서의 체인지(Change)는 낭만적인 해프닝이 아니다. 주원의 몸으로 들어간 라임은 로엘 그룹 내부에 도사린 추악한 비자금 세탁과 인체 실험의 흔적을 발견하고, 라임의 몸이 된 주원은 밑바닥 삶의 처절한 생존 본능과 마주하며 자신이 그토록 경멸하던 인간들의 뜨거운 감정에 서서히 잠식당하기 시작한다.\n\n바뀌어버린 육체는 서로의 삶을 파괴하는 무기가 된다. 주원은 라임의 육체를 이용해 자신의 정적들을 물리적으로 제거하려 하고, 라임은 주원의 권력을 이용해 로엘 그룹의 근간을 뒤흔드는 폭로를 준비한다. 영혼의 주도권을 잡기 위한 이들의 치열한 심리전은 단순한 로맨스를 넘어, 계급 사회의 본질과 인간 존엄성에 대한 근원적인 질문을 던진다. 안개가 걷히고 진짜 태양이 떠오를 때, 과연 그들의 영혼은 제자리를 찾을 수 있을 것인가, 아니면 서로의 욕망 속에서 영원히 실종될 것인가. 진정한 자아를 찾기 위한 잔혹하고도 아름다운 판타지 서사시가 지금 시작된다.",
        narrativeConflicts: [
          { type: "Internal", description: "바뀐 육체에서 솟아오르는 낯선 본능과 원래의 자아가 충돌하며 발생하는 정체성 붕괴" },
          { type: "External", description: "로엘 그룹 내의 치열한 경영권 승계 전쟁과 이를 틈탄 라임의 내부 폭로 작전" },
          { type: "Mystical", description: "몸을 되돌리기 위해 치러야 하는 대가와 안개 속 노인이 숨겨둔 잔혹한 마지막 거래" }
        ]
      },
      characters: [
        { name: "김주원", role: "로엘 그룹 총괄 상무", trait: "감정을 숫자로 계산하는 냉혈한. 라임의 몸이 된 후 감정의 폭풍에 휘말리며 무너져 내린다.", relationship_type: "Protagonist" },
        { name: "길라임", role: "스턴트 우먼 / 복수귀", trait: "아버지를 죽인 로엘 그룹을 무너뜨리기 위해 살인 병기가 된 여자. 주원의 몸으로 권력을 휘두른다.", relationship_type: "Protagonist" },
        { name: "오스카", role: "한물간 톱스타", trait: "화려한 겉모습 뒤에 로엘 그룹의 추문을 덮는 '청소부' 역할을 수행하는 반전 인물.", relationship_type: "Supporting" },
        { name: "윤슬", role: "재벌가 장녀 / 복수 설계자", trait: "주원의 정략결혼 상대이자, 오스카를 파멸시키기 위해 돌아온 치밀한 지략가.", relationship_type: "Antagonist" },
        { name: "임종수", role: "액션 스쿨 감독", trait: "라임의 유일한 안식처이자 조력자였으나, 사실은 주원의 어머니에게 고용된 감시자.", relationship_type: "Supporting" },
        { name: "김비서", role: "주원의 심복", trait: "주원의 모든 비밀을 알고 있는 정보원. 몸이 바뀐 주원과 라임을 가장 먼저 눈치챈다.", relationship_type: "Supporting" },
        { name: "박문홍", role: "로엘 그룹 회장", trait: "모든 비극의 시작점. 자신의 영생을 위해 자식들을 실험체로 사용하는 비정한 노인.", relationship_type: "Antagonist" },
        { name: "미지의 노인", role: "운명의 설계자", trait: "두 사람에게 술을 건넨 장본인. 인간의 욕망이 한계에 도달했을 때 나타나는 초월적 존재.", relationship_type: "Mystical" }
      ]
    })
  },
  {
    id: "4dd61c93-ee40-4de1-a54b-e91cc009887a",
    title: "더 글로밍 (The Gloaming)",
    genre: "Dark Fantasy Noir / Cyberpunk",
    platform: "HBO Max",
    duration: 70,
    world: "2088 Cyberpunk Seoul 'New Shelter'",
    logline: "빛이 사라진 서울, 네온의 그림자 속에서 진실을 쫓는 자들의 이야기",
    status: "COMPLETED",
    progress: 100,
    is_sample: true,
    synopsis: JSON.stringify({
      subtitle: "(MIDNIGHT PROTOCOL)",
      version: "V3.3.2",
      buildId: "safe-point-88",
      story: {
        logline: "빛이 사라진 서울, 네온의 그림자 속에서 진실을 쫓는 자들의 이야기",
        epicNarrative: `2088년, 거대 기업 '시냅스(Synapse)'가 하늘을 뒤덮은 거대 인공 돔 '뉴 쉘터'를 건설한 이후, 서울의 진짜 태양은 영원히 자취를 감췄다. 도시를 밝히는 것은 오직 꺼지지 않는 홀로그램 광고판과 중독적인 네온사인뿐이다. 하층민들이 거주하는 '그라운드 제로'에서는 매일같이 기억이 휘발되는 정체불명의 전염병 '메모리 리크(Memory Leak)'가 창궐하지만, 상층부의 시민들은 가상 현실 '에덴'에 접속해 영원한 행복을 탐닉한다.\n\n전직 형사였던 '이안'은 사고로 잃어버린 자신의 기억 조각을 찾기 위해 불법 기억 거래소의 해결사로 일한다. 어느 날, 그는 정체를 알 수 없는 해커 '세라'로부터 한 통의 의뢰를 받는다. 시냅스의 데이터 뱅크 깊숙한 곳에 보관된 '최초의 기억'을 탈취해달라는 위험천만한 요청이었다. 이안은 세라가 제공한 단서를 추적하던 중, 도시 전체를 지탱하는 네온 네트워크가 실제는 인간의 감정과 기억을 정제하여 에너지로 변환하는 거대한 발전기였다는 충격적인 진실에 다가간다.\n\n그림자 속에서 도시를 통제하는 '감시자들'은 이안의 접근을 눈치채고 그를 제거하기 위한 프로토콜을 가동한다. 좁혀오는 추격 속에서 이안은 자신의 과거가 시냅스의 초기 실험체였다는 사실을 깨닫게 되고, 세라 또한 단순한 해커가 아닌 네트워크 스스로가 만들어낸 인공 지능의 발현임을 알게 된다. 이제 그들은 사라진 빛을 되찾기 위해서가 아니라, 단 1초라도 '진짜 나'로 존재하기 위해 도시의 가장 높은 곳, 시냅스 코어를 향한 반란을 시작한다.\n\n비에 젖은 아스팔트 위로 쏟아지는 화려한 빛의 파편들 속에서, 진실은 언제나 가장 어두운 곳에 숨어 있다. 기억을 잃어가는 도시, 기계의 심장을 가진 인간들, 그리고 인간의 영혼을 꿈꾸는 기계들의 최후의 기록이 지금 이곳에서 시작된다.`,
        narrativeConflicts: [
          { type: "Internal", description: "이안의 잃어버린 기억과 자아 정체성 혼란" },
          { type: "External", description: "시냅스 기업의 추격과 물리적 제거 위협" },
          { type: "Social", description: "에덴의 가상 현실에 중독된 사회적 무관심" }
        ]
      },
      characters: [
        { id: "char-01", name: "이안 (Ian)", job: "해결사", gender: "Male", look: "Rough", relationship_type: "Protagonist" }
      ]
    })
  }
];
