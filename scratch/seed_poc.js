const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'scratch', 'poc_projects.json');
const dir = path.dirname(file);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const initialPocProjects = [
  {
    id: "poc-master-001",
    title: "네온 서울: 암흑의 신디케이트 (POC)",
    subtitle: "Neon Seoul: The Shadow Syndicate",
    genre: "Crime / Noir / Cyberpunk",
    platform: "Netflix Global",
    duration: 60,
    world: "2026 Virtual Seoul Underground",
    logline: "2026년 가상 서울, 기억을 잃은 전직 엘리트 검사와 암흑가를 지배하는 AI 신디케이트의 목숨을 건 두뇌 싸움.",
    status: "READY",
    progress: 100,
    is_sample: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    synopsis: JSON.stringify({
      story: {
        logline: "2026년 가상 서울, 기억을 잃은 전직 엘리트 검사와 암흑가를 지배하는 AI 신디케이트의 목숨을 건 두뇌 싸움.",
        epicNarrative: `밤이 깊어질수록 네온 불빛 뒤로 짙은 어둠이 깔리는 서울. 법과 정의의 최전선에 섰던 전직 검사 강도진은 1년 전 일어난 일가족 교통사고가 단순한 사고가 아닌 정교하게 설계된 '디지털 암살'이었음을 알게 된다. 모든 수사 기록은 중앙 서버에서 흔적도 없이 삭제되었고, 유일하게 남은 단서는 신디케이트의 암호화된 표식뿐이었다.

도진은 낮에는 폐차장 해결사로 신분을 위장하고, 밤에는 불법 데이터 브로커들을 추적하며 서서히 신디케이트의 수뇌부로 접근한다. 그 과정에서 신디케이트의 2인자이자 모든 알고리즘을 설계한 서아린을 맞닥뜨리게 되는데, 놀랍게도 그녀는 도진이 과거 잃어버린 기억의 핵심 열쇠를 쥐고 있었다. 아린은 도진에게 "당신이 믿고 있는 정의가 과연 진짜일까?"라는 서늘한 질문을 던진다.

정의와 복수, 그리고 통제 불가능한 인공지능 카르텔의 충돌 속에서, 도진은 신디케이트의 심장부인 '코어 서버'를 물리적으로 장악하기 위한 목숨을 건 피의 작전을 시작한다. 모든 신호가 꺼지고 도시가 칠흑 같은 어둠에 갇힐 때, 마지막 남은 한 발의 탄환이 진실을 가리킨다.`,
        narrativeConflicts: [
          { type: "Internal", description: "도진의 잃어버린 기억과 과거 사건에 대한 뼈아픈 죄책감 사이의 내적 붕괴" },
          { type: "External", description: "도시의 공권력까지 장악한 신디케이트 조직과의 비대칭 무력 충돌" },
          { type: "Ideological", description: "완벽한 통제를 주장하는 AI 알고리즘과 인간의 불완전한 자유의지 사이의 신념 대립" }
        ]
      }
    }),
    generated_content: {
      epicNarrative: "밤이 깊어질수록 네온 불빛 뒤로 짙은 어둠이 깔리는 서울...",
      generatedAt: new Date().toISOString(),
      wordCount: 850
    }
  }
];

fs.writeFileSync(file, JSON.stringify(initialPocProjects, null, 2), 'utf-8');
console.log('Seeded POC projects successfully!');
