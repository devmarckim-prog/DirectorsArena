import { ProjectGeneration } from "@/lib/schemas/generation";

export const POC_COOKIE_NAME = 'da_poc_admin';

export const POC_TEST_ADMIN_USER = {
  id: 'poc-test-admin-uuid',
  email: 'test-admin@directorsarena.app',
  role: 'admin',
  credits: 99999,
  plan: 'enterprise',
  full_name: 'Test Admin (POC)',
  avatar_url: null,
};

/**
 * Checks if current environment or request is running in POC mode
 */
export function isPocMode(cookieValue?: string | null): boolean {
  return cookieValue === 'true';
}

// In-memory universal store (Edge & Node compatible)
const inMemoryPocProjects: Map<string, any> = new Map();

function getFsStorage() {
  try {
    if (typeof process !== 'undefined' && process.versions?.node) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'scratch', 'poc_projects.json');
      return { fs, path, filePath };
    }
  } catch (e) {}
  return null;
}

export function loadPocProjects(): any[] {
  const disk = getFsStorage();
  if (disk && disk.fs.existsSync(disk.filePath)) {
    try {
      const raw = disk.fs.readFileSync(disk.filePath, 'utf-8');
      const list = JSON.parse(raw);
      list.forEach((p: any) => inMemoryPocProjects.set(p.id, p));
      return list;
    } catch (e) {}
  }
  return Array.from(inMemoryPocProjects.values());
}

export function savePocProject(project: any) {
  inMemoryPocProjects.set(project.id, {
    ...project,
    updated_at: new Date().toISOString()
  });

  const disk = getFsStorage();
  if (disk) {
    try {
      const dir = disk.path.dirname(disk.filePath);
      if (!disk.fs.existsSync(dir)) disk.fs.mkdirSync(dir, { recursive: true });
      const list = Array.from(inMemoryPocProjects.values());
      disk.fs.writeFileSync(disk.filePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[POC] Disk write warning:', e);
    }
  }
}

export function getPocProjectById(id: string): any | null {
  if (inMemoryPocProjects.has(id)) {
    return inMemoryPocProjects.get(id);
  }
  const all = loadPocProjects();
  return all.find((p: any) => p.id === id) || inMemoryPocProjects.get(id) || null;
}

/**
 * High-fidelity Korean Drama dummy generation payload
 */
export function getPocDummyGeneration(projectData?: any): ProjectGeneration & { title: string; story?: any; koreanTitle?: string } {
  const title = projectData?.title?.replace(/^\[가칭\]\s*/, '') || "네온 서울: 암흑의 신디케이트";
  const logline = projectData?.logline || "2026년 가상 서울, 기억을 잃은 전직 엘리트 검사와 암흑가를 지배하는 AI 신디케이트의 목숨을 건 두뇌 싸움.";

  return {
    title: title,
    koreanTitle: title,
    englishTitle: "Neon Seoul: The Shadow Syndicate",
    logline: logline,
    synopsis: `${title}는 급변하는 2026년 가상 미래 서울의 지하 세계를 배경으로 펼쳐지는 하이퍼 리얼리즘 범죄 느와르 드라마입니다.
초거대 금융 카르텔과 결탁한 AI 데이터 신디케이트가 인간의 기억과 금융 자산을 은밀히 탈취하고 있는 실태를 포착한 전직 엘리트 검사 강도진은 가족의 의문의 죽음 뒤에 숨겨진 거대한 배후를 파헤치기 위해 법의 테두리를 벗어나 직접 지하 세계로 잠입합니다.

하지만 그가 마주한 상대는 냉철한 지능과 무자비한 네트워크를 통제하는 신디케이트의 브레인 서아린. 그녀는 도진의 과거 트라우마와 잃어버린 기억을 무기로 도진을 시험하며, 도시 전체를 뒤흔들 디지털 숙청 작전을 감행합니다.
피와 네온사인이 교차하는 골목길에서, 도진은 천재적인 화이트해커 최민우와 전직 형사 한지수와 손을 잡고 최후의 반격을 설계합니다. 과연 도진은 왜곡된 진실을 바로잡고 가족의 복수를 완성할 수 있을 것인가?`,
    story: {
      logline: logline,
      epicNarrative: `밤이 깊어질수록 네온 불빛 뒤로 짙은 어둠이 깔리는 서울. 법과 정의의 최전선에 섰던 전직 검사 강도진은 1년 전 일어난 일가족 교통사고가 단순한 사고가 아닌 정교하게 설계된 '디지털 암살'이었음을 알게 된다. 모든 수사 기록은 중앙 서버에서 흔적도 없이 삭제되었고, 유일하게 남은 단서는 신디케이트의 암호화된 표식뿐이었다.

도진은 낮에는 폐차장 해결사로 신분을 위장하고, 밤에는 불법 데이터 브로커들을 추적하며 서서히 신디케이트의 수뇌부로 접근한다. 그 과정에서 신디케이트의 2인자이자 모든 알고리즘을 설계한 서아린을 맞닥뜨리게 되는데, 놀랍게도 그녀는 도진이 과거 잃어버린 기억의 핵심 열쇠를 쥐고 있었다. 아린은 도진에게 "당신이 믿고 있는 정의가 과연 진짜일까?"라는 서늘한 질문을 던진다.

정의와 복수, 그리고 통제 불가능한 인공지능 카르텔의 충돌 속에서, 도진은 신디케이트의 심장부인 '코어 서버'를 물리적으로 장악하기 위한 목숨을 건 피의 작전을 시작한다. 모든 신호가 꺼지고 도시가 칠흑 같은 어둠에 갇힐 때, 마지막 남은 한 발의 탄환이 진실을 가리킨다.`,
      narrativeConflicts: [
        { type: "Internal", description: "도진의 잃어버린 기억과 과거 사건에 대한 뼈아픈 죄책감 사이의 내적 붕괴" },
        { type: "External", description: "도시의 공권력까지 장악한 신디케이트 조직과의 비대칭 무력 충돌" },
        { type: "Ideological", description: "완벽한 통제를 주장하는 AI 알고리즘과 인간의 불완전한 자유의지 사이의 신념 대립" }
      ]
    },
    characters: [
      {
        id: "kang_do_jin",
        name: "강도진",
        gender: "MALE",
        age: 38,
        ageGroup: "30S",
        role: "주인공",
        job: "전직 엘리트 검사 / 사설 해결사",
        desire: "가족을 살해한 신디케이트의 배후를 밝혀내고 법이 심판하지 못한 악을 직접 처단하는 것",
        description: "날카로운 눈매와 굳게 다문 입술. 뛰어난 직관과 육탄전에 능하며, 과거의 트라우마로 인해 불면증에 시달린다.",
        traits: ["냉철한 분석력", "불굴의 집념", "비정한 결단력", "트라우마"],
        relationshipToProtagonist: "Protagonist",
        groups: ["Underground Network", "Ex-Prosecution"],
        relations: [
          { target: "서아린", type: "Conflict", description: "숙명의 적이자 비밀을 공유한 관계", strength: 9 },
          { target: "최민우", type: "Ally", description: "믿을 수 있는 기술적 조력자", strength: 8 },
          { target: "한지수", type: "Ally", description: "서로의 과거를 보듬는 전우", strength: 7 }
        ]
      },
      {
        id: "seo_ah_rin",
        name: "서아린",
        gender: "FEMALE",
        age: 34,
        ageGroup: "30S",
        role: "안타고니스트",
        job: "신디케이트 전략기획 총괄 / AI 아키텍트",
        desire: "도시의 모든 금융과 데이터를 자신의 알고리즘 아래 완전히 통제하는 디지털 유토피아 구축",
        description: "감정을 일체 드러내지 않는 포커페이스. 완벽한 논리와 냉혹한 실행력으로 조직의 실권을 장악했다.",
        traits: ["천재적 지능", "극단적 효율주의", "소시오패스적 카리스마", "은밀한 상처"],
        relationshipToProtagonist: "Antagonist",
        groups: ["The Syndicate", "Cyber Elite"],
        relations: [
          { target: "강도진", type: "Conflict", description: "자신의 계획을 유일하게 위협하는 체스 말", strength: 9 },
          { target: "최민우", type: "Conflict", description: "과거 연구소에서 갈라선 경쟁자", strength: 6 }
        ]
      },
      {
        id: "choi_min_woo",
        name: "최민우",
        gender: "MALE",
        age: 27,
        ageGroup: "20S",
        role: "조력자",
        job: "다크웹 화이트해커 / 정보 브로커",
        desire: "신디케이트가 독점한 기밀 데이터를 전 세계에 공개해 동생의 억울한 누명을 벗기는 것",
        description: "후드티와 에너지 드링크, 빠른 타자 속도. 가벼운 언행 속에 천재적인 암호 해독 능력을 숨기고 있다.",
        traits: ["해킹 천재", "재치 있는 입담", "의외의 의리", "기계 중독"],
        relationshipToProtagonist: "Ally",
        groups: ["Underground Network", "Whitehats"],
        relations: [
          { target: "강도진", type: "Ally", description: "생명의 은인이자 큰형 같은 존재", strength: 8 },
          { target: "서아린", type: "Conflict", description: "넘어서야 할 과거의 스승", strength: 7 }
        ]
      },
      {
        id: "han_ji_soo",
        name: "한지수",
        gender: "FEMALE",
        age: 36,
        ageGroup: "30S",
        role: "조력자 / 핵심 인물",
        job: "광역수사대 출신 사립탐정",
        desire: "경찰 내부의 부패 카르텔을 청산하고 진정한 법치질서를 회복하는 것",
        description: "가죽 재킷과 권총, 언제나 경계 태세를 늦추지 않는 베테랑 형사 기질.",
        traits: ["탁월한 사격술", "강한 정의감", "현장 감각", "과묵함"],
        relationshipToProtagonist: "Ally",
        groups: ["Underground Network", "Ex-Police"],
        relations: [
          { target: "강도진", type: "Ally", description: "동지적 유대감과 은밀한 신뢰", strength: 8 },
          { target: "서아린", type: "Conflict", description: "반드시 체포해야 할 주범", strength: 8 }
        ]
      }
    ],
    structure: [
      {
        act_number: 1,
        beat_type: "Opening Image",
        title: "빗속의 단서",
        description: "폐차장에서 일하던 도진이 익명의 제보자로부터 가족 사고 차량의 블랙박스 복원 칩을 전달받는다.",
        timestamp_label: "00:05:00",
        script_content: `INT. 폐차장 정비실 - 밤

거센 빗소리가 함석지붕을 세차게 두드린다.
기름때 묻은 작업복 차림의 강도진(38), 찌그러진 세단의 문짝을 산소용접기로 절단하고 있다.
불꽃이 튀며 도진의 굳은 턱선과 피로에 절어 있는 눈빛을 비춘다.

낡은 라디오에서 흘러나오는 뉴스.
라디오 앵커 (V.O.): "지난해 성북동 일가족 차량 전복 사고의 최종 재조사 결과, 결함 없는 단순 졸음운전으로..."

도진의 손이 멈칫한다. 산소용접기 불꽃을 끈다.
그때, 정비실 문이 거칠게 열리며 비에 젖은 후드를 뒤집어쓴 최민우(27)가 뛰어 들어온다.

최민우: (숨을 헐떡이며) 형님... 떴습니다. 진짜가 떴어요.
강도진: (차갑게) 헛소리면 나가라. 비 맞는다.
최민우: (주머니에서 지퍼백을 꺼내며) 단순 사고 아니었어요. 중앙 서버에서 차량 ECU 통신을 강제로 끊은 패킷 로그를 건졌다고요!

도진의 눈빛이 순식간에 매섭게 변한다.`
      },
      {
        act_number: 1,
        beat_type: "Inciting Incident",
        title: "침투와 조우",
        description: "도진은 패킷 발신지를 추적하여 강남 고급 라운지에 잠입하고, 신디케이트의 설계자 아린과 마주친다.",
        timestamp_label: "00:18:00",
        script_content: `INT. VIP 프라이빗 라운지 - 밤

은은한 재즈 음악과 몽환적인 앰비언트 조명.
슈트를 차려입은 도진, 웨이터로 위장해 보안 구역 복도로 접근한다.

문이 열리며 서아린(34)이 수행원 둘을 거느리고 걸어 나온다.
검은 실크 드레스에 한 치의 흐트러짐도 없는 자태.
도진과 아린의 시선이 공중에서 마주친다.

서아린: (걸음을 멈추지 않고 차분히) 냄새가 나네. 폐차장 쇠 냄새.
강도진: (낮게 깔린 목소리) 성북동 그 사고. 네가 오더 내렸나?
서아린: (미소 띤 채 도진을 돌아보며) 당신이 기억을 잃어버려서 다행이라고 생각해요, 강도진 검사님. 기억이 돌아오면... 당신 자신을 가장 먼저 죽이고 싶어질 테니까.`
      },
      {
        act_number: 2,
        beat_type: "Midpoint",
        title: "치명적인 함정",
        description: "도진 팀이 신디케이트의 제2 데이터센터를 급습하지만, 이미 그들의 움직임을 예상한 아린의 역습으로 포위된다.",
        timestamp_label: "00:35:00",
        script_content: `INT. 데이터센터 지하 통로 - 밤

수천 개의 서버 랙이 내뿜는 푸른 LED 불빛.
도진과 한지수, 방탄조끼를 착용한 채 벽에 밀착해 있다.

한지수: 이상해. 메인 서버인데 보안 요원이 한 명도 없어.
강도진: ...함정이다. 당장 빠져나가!

그 순간, 통로의 모든 셔터가 굉음을 내며 일제히 내려앉는다.
벽면의 대형 모니터가 일제히 켜지며 서아린의 얼굴이 떠오른다.

서아린 (화면 속): 어서 와요, 도진 씨. 당신의 두 번째 장례식에 온 걸 환영해요.`
      },
      {
        act_number: 3,
        beat_type: "Climax",
        title: "코어 서버의 대결",
        description: "도시의 모든 전력이 차단된 밤, 본사 최상층 코어 룸에서 도진과 아린의 최후의 육탄전과 진실 폭로가 벌어진다.",
        timestamp_label: "00:52:00",
        script_content: `INT. 타워 80층 메인 코어 룸 - 밤

통유리창 밖으로 정전된 서울 도심의 암흑이 펼쳐져 있다.
피투성이가 된 도진, 권총을 겨눈 채 코어 단말기 앞에 선 아린에게 다가간다.

강도진: 끝났다, 서아린. 드라이브는 이미 방송사로 넘어갔어.
서아린: (유리창에 비친 자신을 바라보며) 세상은 진실을 원하지 않아요. 그저 내일 아침 출근길에 마실 커피와 가짜 주가 상승률만 원하지.
강도진: 그래도 난 네가 만든 거짓 속에 살지 않겠다.

아린이 품에서 격발 리모컨을 꺼내려는 순간, 도진의 총구가 불을 뿜는다.`
      }
    ],
    episodes: [
      {
        episodeNumber: 1,
        title: "제1화: 지워진 번호판",
        summary: "폐차장 기술자로 은둔하던 전직 검사 강도진에게 1년 전 일가족 사망 사고가 디지털 암살이었음을 입증하는 충격적인 단서가 전달되고, 도진은 복수의 방아쇠를 당긴다.",
        scriptContent: `S# 1. 서울 외곽 폐차장 / 밤 (EXT. JUNKYARD - NIGHT)

거센 폭우가 쏟아지는 자정.
폐차된 수백 대의 차량들이 거대한 고철 무덤을 이루고 있다.
작업등 불빛 아래, 기름 묻은 작업복의 강도진(38)이 찌그러진 승용차 문짝을 용접 절단하고 있다.
산소용접기의 푸른 불꽃이 도진의 깊게 패인 흉터와 고독한 눈빛을 드러낸다.

라디오 앵커 (V.O.):
"검찰 과거사 진상조사단은 1년 전 일어난 강도진 전 특수부 검사의 일가족 교통사고 재조사를 최종 종결 처리했습니다..."

도진이 굳은 표정으로 라디오를 거칠게 꺼버린다.

S# 2. 정비실 내부 / 밤 (INT. WORKSHOP - NIGHT)

비에 젖은 문이 덜컥 열리며 최민우(27)가 뛰어들어온다.
젖은 백팩에서 방수팩에 싸인 낡은 하드디스크를 꺼내 테이블 위에 던진다.

최민우:
형님! 성북동 그 사고 차량 ECU 칩... 백업본 찾았습니다.

도진이 서서히 고개를 든다.

강도진:
...내가 헛소리하지 말라고 했지.

최민우:
헛소리 아닙니다! 차량 통신망이 끊긴 게 충돌 3초 전이 아니라 충돌 10분 전이었어요!
누군가 밖에서 무선으로 브레이크 제어권을 뺏은 거라고요!`
      },
      {
        episodeNumber: 2,
        title: "제2화: 암호명 신디케이트",
        summary: "단서를 쫓아 VIP 비밀 사교 클럽에 잠입한 도진은 신디케이트의 설계자 서아린과 첫 대면을 갖고, 자신의 과거 기억이 누군가에 의해 조작되었음을 감지한다.",
        scriptContent: null
      },
      {
        episodeNumber: 3,
        title: "제3화: 섀도우 네트워크",
        summary: "경찰 내부의 감시망을 피해 사립탐정 한지수와 공조를 시작한 도진 팀은 신디케이트의 자금 세탁 창구인 불법 암호화폐 거래소를 급습한다.",
        scriptContent: null
      },
      {
        episodeNumber: 4,
        title: "제4화: 통제 구역의 덫",
        summary: "서아린이 파놓은 역정보에 걸려든 도진은 경찰 살해 용의자로 전국 지명수배를 받게 되고, 고립무원의 위기에 처한다.",
        scriptContent: null
      },
      {
        episodeNumber: 5,
        title: "제5화: 블랙아웃 카운트다운",
        summary: "서울 전역의 금융망을 일시 마비시키는 '블랙아웃' 프로토콜을 가동하려는 서아린을 저지하기 위해 도진과 민우는 목숨을 건 송전탑 침투 작전을 결행한다.",
        scriptContent: null
      },
      {
        episodeNumber: 6,
        title: "제6화: 어둠이 걷힐 때 (최종화)",
        summary: "타워 최상층 메인 코어에서 마주한 도진과 아린. 왜곡된 진실의 마지막 퍼즐이 맞춰지고, 도시의 빛을 되찾기 위한 최후의 결전이 벌어진다.",
        scriptContent: null
      }
    ]
  };
}

export function getPocDummyCasting() {
  return [
    { recommended_actor: "이병헌", role: "강도진", reason: "과묵하면서도 폭발적인 감정 연기와 압도적인 카리스마로 복수심에 불타는 전직 검사를 완벽히 소화" },
    { recommended_actor: "한소희", role: "서아린", reason: "서늘하고 우아한 외모 뒤에 감춰진 날카로운 지성과 소시오패스적 미스터리를 극대화" },
    { recommended_actor: "최우식", role: "최민우", reason: "가벼운 입담 속에 천재적인 기술과 끈끈한 인간미를 지닌 해커 캐릭터에 최적화" },
    { recommended_actor: "김태리", role: "한지수", reason: "거침없는 현장 액션과 깊이 있는 정의감을 지닌 베테랑 사립탐정을 입체적으로 표현" }
  ];
}

export function getPocDummyBudget() {
  return {
    total_budget: 18500000000,
    formatted_total: "185억 원",
    currency: "KRW",
    breakdown: [
      { category: "주연 및 조연 캐스팅", cost: "55억 원", ratio: "29.7%" },
      { category: "VFX 및 CG 특수효과 (미래 서울 구현)", cost: "42억 원", ratio: "22.7%" },
      { category: "미술, 세트 및 카체이싱 특수촬영", cost: "38억 원", ratio: "20.5%" },
      { category: "촬영, 조명 및 현장 프로덕션", cost: "32억 원", ratio: "17.3%" },
      { category: "음향, 편집 및 후반 DI 작업", cost: "18억 원", ratio: "9.8%" }
    ]
  };
}

export function getPocDummyPplLocation() {
  return {
    locations: [
      { name: "인천 송도 센트럴파크 & 트라이보울", scene: "S#2 VIP 라운지 및 미래형 오피스 외경", note: "미래지향적이고 차가운 사이버펑크 분위기 연출" },
      { name: "문래동 철공소 골목", scene: "S#1 외곽 폐차장 및 은신처", note: "기름때 묻은 아날로그적 거친 질감" },
      { name: "강남 테헤란로 야간 도로", scene: "S#4 도심 추격전", note: "화려한 네온사인과 차량 액션" }
    ],
    ppl: [
      { brand: "현대 아이오닉 N (무광 블랙)", type: "주인공 전용 차량", scene: "S#1, S#4 카체이싱" },
      { brand: "삼성 갤럭시 워치 울트라", type: "웨어러블 통신 장비", scene: "S#2 긴급 신호 송수신" },
      { brand: "정관장 에브리타임", type: "해커 밤샘 작업 스낵", scene: "S#1 민우 밤샘 해킹 씬" }
    ]
  };
}
