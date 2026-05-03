const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'MASKED';

const ELITE_SAMPLES = [
  {
    title: "시크릿 가든 (Secret Garden) - 2026",
    genre: "Fantasy Romantic Comedy",
    platform: "Netflix Global",
    duration: 60,
    world: "Contemporary / VVIP Luxury",
    logline: "영혼이 바뀐 VVIP 전용 백화점 CEO와 가난한 스턴트 우먼. 서로의 몸으로 살아가며 계급의 벽을 부수고 진정한 자아를 찾는 마법 같은 로맨스.",
    synopsis: JSON.stringify({
      title: "시크릿 가든 (Secret Garden) - 2026",
      genre: "Fantasy Romantic Comedy",
      format: "12부작 (Episode 당 60분)",
      budgetEstimate: "총 제작비 180억 (회당 15억) - CG 및 VVIP 세트장 비중 높음",
      targetAudience: "Netflix Global, 2030 여성 및 로맨스 코미디 선호층",
      story: {
        logline: "영혼의 주인이 바뀌는 순간, 욕망의 민낯이 드러난다. 억만장자 상속자와 밑바닥 스턴트 우먼의 잔혹한 운명 교환.",
        epicNarrative: "2025년 서울, 초거대 기업 로엘 그룹의 후계자 김주원은 단순한 재벌 3세가 아닌, 타인의 감정을 데이터로 치환하여 분석하는 소시오패스적 천재성을 가진 인물이다. 그는 폐쇄적인 성벽 안에서 자신만의 왕국을 건설하며 완벽한 후계 구도를 짜나가고 있었다. 반면, 도시의 가장 어두운 구석 '더 그라운드'에서 하루하루 목숨을 걸고 액션 대역을 수행하는 길라임은 사라진 아버지의 죽음에 얽힌 진실을 파헤치기 위해 로엘 그룹의 심장부로 잠입할 기회를 노린다.\n\n어느 날, 제주도의 기괴한 안개 속에서 정체불명의 노인이 건넨 약술을 마신 두 사람은 다음 날 아침 서로의 몸이 바뀌었음을 깨닫는다. 하지만 이 리부트된 세계에서의 체인지(Change)는 낭만적인 해프닝이 아니다. 주원의 몸으로 들어간 라임은 로엘 그룹 내부에 도사린 추악한 비자금 세탁과 인체 실험의 흔적을 발견하고, 라임의 몸이 된 주원은 밑바닥 삶의 처절한 생존 본능과 마주하며 자신이 그토록 경멸하던 인간들의 뜨거운 감정에 서서히 잠식당하기 시작한다.\n\n바뀌어버린 육체는 서로의 삶을 파괴하는 무기가 된다. 주원은 라임의 육체를 이용해 자신의 정적들을 물리적으로 제거하려 하고, 라임은 주원의 권력을 이용해 로엘 그룹의 근간을 뒤흔드는 폭로를 준비한다. 영혼의 주도권을 잡기 위한 이들의 치열한 심리전은 단순한 로맨스를 넘어, 계급 사회의 본질과 인간 존엄성에 대한 근원적인 질문을 던진다.",
        narrativeConflicts: [
          { type: "Internal", description: "바뀐 육체에서 솟아오르는 낯선 본능과 원래의 자아가 충돌하며 발생하는 정체성 붕괴" },
          { type: "External", description: "로엘 그룹 내의 치열한 경영권 승계 전쟁과 이를 틈탄 라임의 내부 폭로 작전" },
          { type: "Mystical", description: "몸을 되돌리기 위해 치러야 하는 대가와 안개 속 노인이 숨겨둔 잔혹한 마지막 거래" }
        ]
      },
      characters: [
        { "name": "김주원", "role": "백화점 CEO", "trait": "완벽주의자, 폐소공포증, 애정결핍.", "relationshipToProtagonist": "Protagonist", "gender": "Male", "age": 34, "groups": ["Roel Group", "Main Romance"], "relations": [{ "target": "길라임", "type": "Romance" }, { "target": "오스카", "type": "Ally" }, { "target": "문분홍", "type": "Conflict" }] },
        { "name": "길라임", "role": "스턴트 무술감독", "trait": "걸크러시, 높은 자존감.", "relationshipToProtagonist": "Protagonist", "gender": "Female", "age": 30, "groups": ["Action School", "Main Romance"], "relations": [{ "target": "김주원", "type": "Romance" }, { "target": "임종수", "type": "Ally" }] },
        { "name": "오스카", "role": "한류스타", "trait": "낙천적인 바람둥이, 주원의 사촌.", "relationshipToProtagonist": "Romance", "gender": "Male", "age": 36, "groups": ["Roel Group", "Social Elite"], "relations": [{ "target": "윤슬", "type": "Romance" }, { "target": "김주원", "type": "Ally" }] },
        { "name": "윤슬", "role": "CF 감독", "trait": "도도하지만 상처받은 내면.", "relationshipToProtagonist": "Romance", "gender": "Female", "age": 34, "groups": ["Media Elite", "Social Elite"], "relations": [{ "target": "오스카", "type": "Romance" }] },
        { "name": "임종수", "role": "액션스쿨 대표", "trait": "묵묵한 카리스마, 라임의 스승.", "relationshipToProtagonist": "Ally", "gender": "Male", "age": 38, "groups": ["Action School"], "relations": [{ "target": "길라임", "type": "Ally" }] },
        { "name": "문분홍", "role": "로엘 그룹 여주인", "trait": "냉정한 계급주의자, 주원의 모친.", "relationshipToProtagonist": "Conflict", "gender": "Female", "age": 58, "groups": ["Roel Group", "The Authority"], "relations": [{ "target": "김주원", "type": "Conflict" }, { "target": "박봉호", "type": "Ally" }] },
        { "name": "박봉호", "role": "로엘 그룹 전무", "trait": "야심가, 주원을 견제하는 숙적.", "relationshipToProtagonist": "Conflict", "gender": "Male", "age": 55, "groups": ["Roel Group", "The Authority"], "relations": [{ "target": "문분홍", "type": "Ally" }, { "target": "김주원", "type": "Conflict" }] }
      ],
      beats: [
        { act_number: 1, beat_type: "Opening Image", title: "네온속의 그림자", description: "VVIP 파티장, 가면을 쓴 주원이 사람들의 감정을 데이터로 분석하며 지루해하는 모습.", timestamp_label: "00:03:00" },
        { act_number: 1, beat_type: "Inciting Incident", title: "운명의 교차로", description: "제주도 스턴트 현장, 주원과 라임이 처음으로 눈을 맞추며 정적을 느낀다.", timestamp_label: "00:12:00" },
        { act_number: 1, beat_type: "Plot Point 1", title: "영혼의 전이", description: "의문의 약술을 마신 뒤, 폭우속에서 두 사람의 영혼이 뒤바뀌며 비명이 터져나온다.", timestamp_label: "00:25:00" },
        { act_number: 2, beat_type: "Midpoint", title: "음모의 심장부", description: "로엘 그룹 지하의 비밀 실험실 발견. 주원의 아버지가 숨겨온 인체 실험의 증거를 포착한다.", timestamp_label: "01:00:00" },
        { act_number: 3, beat_type: "Finale", title: "최후의 폭로", description: "로엘 그룹 공청회, 라임과 주원이 협동하여 박회장의 만행을 전 세계에 스트리밍으로 폭로한다.", timestamp_label: "01:45:00" }
      ],
      aiPersonaPrompt: "김은숙 작가 스타일의 로맨스 특화 봇. 위트 있는 티키타카 대사 구사."
    }),
    status: 'COMPLETED',
    progress: 100,
    is_sample: true
  },
  {
    title: "더 글로밍 (The Gloaming)",
    genre: "Dark Fantasy Noir",
    platform: "HBO Max",
    duration: 70,
    world: "Cyberpunk Night City 'Gloaming'",
    logline: "빛이 사라진 영원한 밤의 도시 '글로밍'. 연쇄 실종 사건을 추적하던 중 잊혀진 고대 신들의 거대한 음모와 마주하는 하드보일드 추적극.",
    synopsis: JSON.stringify({
      title: "더 글로밍 (The Gloaming)",
      genre: "Dark Fantasy Noir",
      format: "8부작 리미티드 시리즈 (Episode 당 70분)",
      budgetEstimate: "총 제작비 250억 (회당 31억) - 대규모 버추얼 스튜디오 사용",
      targetAudience: "HBO Max, 3040 남성 및 다크 장르물 마니아",
      story: {
        logline: "빛이 사라진 영원한 밤의 도시 '글로밍'. 연쇄 실종 사건을 추적하던 중 잊혀진 고대 신들의 거대한 음모와 마주하는 하드보일드 추적극.",
        epicNarrative: "2088년, 거대 기업 '시냅스(Synapse)'가 하늘을 뒤덮은 거대 인공 돔 '뉴 쉘터'를 건설한 이후, 서울의 진짜 태양은 영원히 자취를 감췄다. 도시를 밝히는 것은 오직 꺼지지 않는 홀로그램 광고판과 중독적인 네온사인뿐이다. 하층민들이 거주하는 '그라운드 제로'에서는 매일같이 기억이 휘발되는 정체불명의 전염병 '메모리 리크(Memory Leak)'가 창궐하지만, 상층부의 시민들은 가상 현실 '에덴'에 접속해 영원한 행복을 탐닉한다.\n\n전직 형사였던 '이안'은 사고로 잃어버린 자신의 기억 조각을 찾기 위해 불법 기억 거래소의 해결사로 일한다. 어느 날, 그는 정체를 알 수 없는 해커 '세라'로부터 한 통의 의뢰를 받는다. 시냅스의 데이터 뱅크 깊숙한 곳에 보관된 '최초의 기억'을 탈취해달라는 위험천만한 요청이었다. 이안은 세라가 제공한 단서를 추적하던 중, 도시 전체를 지탱하는 네온 네트워크가 실제는 인간의 감정과 기억을 정제하여 에너지로 변환하는 거대한 발전기였다는 충격적인 진실에 다가간다.\n\n그림자 속에서 도시를 통제하는 '감시자들'은 이안의 접근을 눈치채고 그를 제거하기 위한 프로토콜을 가동한다. 좁혀오는 추격 속에서 이안은 자신의 과거가 시냅스의 초기 실험체였다는 사실을 깨닫게 되고, 세라 또한 단순한 해커가 아닌 네트워크 스스로가 만들어낸 인공 지능의 발현임을 알게 된다.",
        narrativeConflicts: [
          { type: "Internal", description: "이안의 잃어버린 기억과 자아 정체성 혼란" },
          { type: "External", description: "시냅스 기업의 추격과 물리적 제거 위협" },
          { type: "Social", description: "에덴의 가상 현실에 중독된 사회적 무관심" }
        ]
      },
      characters: [
        { "name": "이안", "role": "특수반 형사", "trait": "알콜 중독, 트라우마.", "relationshipToProtagonist": "Protagonist", "gender": "Male", "age": 32 },
        { "name": "세라", "role": "팜므파탈 정보상", "trait": "기억을 읽는 소유자.", "relationshipToProtagonist": "Ally", "gender": "Female", "age": 28 },
        { "name": "케이", "role": "국가 정보원", "trait": "냉철한 전략가, 이안의 옛 동료.", "relationshipToProtagonist": "Handler", "gender": "Male", "age": 35 },
        { "name": "미라", "role": "공허의 사제", "trait": "고대 신의 부활을 꿈꾸는 흑막.", "relationshipToProtagonist": "Antagonist", "gender": "Female", "age": 42 },
        { "name": "닥터 제이", "role": "암시장 의사", "trait": "사이보그 기술의 대가.", "relationshipToProtagonist": "Informant", "gender": "Male", "age": 50 }
      ],
      aiPersonaPrompt: "데이빗 핀처 스타일의 다크 스릴러 거장 모드. 대사는 건조하고 짧게 묘사."
    }),
    status: 'COMPLETED',
    progress: 100,
    is_sample: true
  },
  {
    title: "디렉터즈 아레나: 더 비기닝 (Directors Arena)",
    genre: "Business / Media Drama",
    platform: "tvN / Netflix",
    duration: 60,
    world: "Contemporary Media Industry (Seoul)",
    logline: "숏드라마 전쟁의 서막. 두 명의 제작자와 한 명의 플랫폼 전략가가 그리는 대한민국 미디어 업계의 처절한 생존기.",
    synopsis: JSON.stringify({
      title: "디렉터즈 아레나: 더 비기닝 (Directors Arena)",
      genre: "Business / Media Drama",
      format: "10부작 (Episode 당 60분)",
      budgetEstimate: "총 제작비 120억 (회당 12억) - 오디션 세트 및 로케이션 위주",
      targetAudience: "미디어 업계 종사자 및 오디션 예능 애호가, 2040 직장인층",
      story: {
        logline: "숏드라마 전쟁의 서막. 두 명의 제작자와 한 명의 플랫폼 전략가가 그리는 대한민국 미디어 업계의 처절한 생존기.",
        epicNarrative: "스튜디오 룰루랄라 최고의 사업 PD로 명성을 떨치던 조재현은 거대 자본의 간섭에서 벗어나 자신만의 오리지널리티를 지키기 위해 독립을 선언한다. 한편, 업계 최고의 PPL 수완가로 인정받는 '샐리 스토리'의 오서영 대표 역시 단순한 마케팅 대행을 넘어 콘텐츠의 본질을 직접 장악하려는 야심을 품고 있었다. 이 두 사람은 업계의 노련한 플랫폼 전략가이자 지인인 김병수의 주선으로 운명처럼 의기투합하게 된다.\n\n그들이 내건 첫 번째 프로젝트는 신개념 숏드라마 오디션 프로그램 '디렉터즈 아레나'. 대한민국 최고의 트렌드 리더 채널 tvN에 이 프로그램을 편성시키기 위해 그들은 발이 부르트도록 뛰어다닌다. 하지만 기성 방송사들의 보이지 않는 견제와 대형 제작사들의 방해 공작은 그들을 벼랑 끝으로 몰아넣는다. 작품의 퀄리티를 최우선으로 생각하는 재현과 상업적 성공 및 PPL 효율을 극대화하려는 서영 사이의 균열은 서서히 깊어지고, 김병수 역시 자신의 숨겨진 목적을 위해 두 사람 사이에서 아슬아슬한 줄타기를 시작하는데...",
        narrativeConflicts: [
          { type: "Value", description: "조재현의 제작 철학과 오서영의 비즈니스 전략이 정면으로 충돌하며 발생하는 파트너십의 위기" },
          { type: "External", description: "tvN 편성을 확정 짓기 위해 마주하는 기득권 방송 시스템의 높은 장벽과 대형 제작사의 사보타주" },
          { type: "Ambition", description: "오디션 참가자들 사이에서 벌어지는 처절한 생존 경쟁과 그들을 이용해 시청률을 뽑아내려는 제작진의 고뇌" }
        ]
      },
      characters: [
        { "name": "조재현", "role": "제작사 공동대표", "trait": "사업 PD 출신의 워커홀릭. '작품은 영혼이다'라고 믿는 예술가적 경영자.", "relationshipToProtagonist": "Protagonist", "gender": "Male", "age": 42, "groups": ["Directors Arena", "The Arena"], "relations": [{ "target": "오서영", "type": "Ally" }, { "target": "강동욱", "type": "Conflict" }, { "target": "최정훈", "type": "Conflict" }] },
        { "name": "오서영", "role": "제작사 공동대표", "trait": "샐리 스토리 대표 출신. 업계 최고의 PPL 퀸이자 냉철한 데이터 분석가.", "relationshipToProtagonist": "Protagonist", "gender": "Female", "age": 38, "groups": ["Directors Arena", "The Arena"], "relations": [{ "target": "조재현", "type": "Ally" }, { "target": "한유리", "type": "Ally" }] },
        { "name": "김병수", "role": "전략 컨설턴트", "trait": "플랫폼 생태계의 포식자. 재현과 서영을 연결해주었으나 속내를 알 수 없는 인물.", "relationshipToProtagonist": "Mystery", "gender": "Male", "age": 45, "groups": ["The Oracle", "Independent"], "relations": [{ "target": "조재현", "type": "Ally" }, { "target": "오서영", "type": "Ally" }] },
        { "name": "강동욱", "role": "tvN 편성 CP", "trait": "편성의 키를 쥔 자. 까다롭고 보수적이지만 실력이 있다면 기회를 주는 인물.", "relationshipToProtagonist": "Conflict", "gender": "Male", "age": 48, "groups": ["tvN Platform", "The Gatekeepers"], "relations": [{ "target": "조재현", "type": "Conflict" }] },
        { "name": "이혜인", "role": "메인 연출 PD", "trait": "숏폼 장르의 개척자. 섬세한 감각과 빠른 판단력을 가진 실력파 감독.", "relationshipToProtagonist": "Ally", "gender": "Female", "age": 32, "groups": ["Directors Arena"], "relations": [{ "target": "조재현", "type": "Ally" }] },
        { "name": "박민규", "role": "오디션 참가자", "trait": "천재적인 재능을 가졌으나 통제 불능인 트러블 메이커이자 화제성의 중심.", "relationshipToProtagonist": "Ally", "gender": "Male", "age": 27, "groups": ["Talent Pool", "The Arena"], "relations": [{ "target": "조재현", "type": "Ally" }] },
        { "name": "한유리", "role": "제작 실장", "trait": "서영의 오랜 오른팔. 산전수전 다 겪은 살림꾼이자 프로젝트의 윤활유.", "relationshipToProtagonist": "Ally", "gender": "Female", "age": 29, "groups": ["Directors Arena"], "relations": [{ "target": "오서영", "type": "Ally" }] },
        { "name": "최정훈", "role": "대형 기획사 본부장", "trait": "재현의 시크릿 라이벌. 사사건건 '디렉터즈 아레나'의 편성을 방해하는 악역.", "relationshipToProtagonist": "Conflict", "gender": "Male", "age": 44, "groups": ["Rival Production", "The Gatekeepers"], "relations": [{ "target": "조재현", "type": "Conflict" }] }
      ],
      beats: [
        { act_number: 1, beat_type: "Opening Image", title: "야심의 조우", description: "강남의 한 카페. 조재현과 오서영이 김병수와 만난다.", timestamp_label: "00:05:00" },
        { act_number: 1, beat_type: "Inciting Incident", title: "제작사 설립", description: "'디렉터즈 아레나'라는 이름으로 법인을 설립한다.", timestamp_label: "00:15:00" },
        { act_number: 2, beat_type: "Midpoint", title: "배신의 안개", description: "최정훈 본부장의 로비로 tvN 편성이 취소될 위기에 처한다.", timestamp_label: "01:15:00" },
        { act_number: 2, beat_type: "All is Lost", title: "최후의 통첩", description: "편성 확정까지 남은 시간 24시간. 강동욱 CP의 압박.", timestamp_label: "01:45:00" },
        { act_number: 3, beat_type: "Finale", title: "아레나의 기적", description: "밤샘 작업 끝에 완성된 파일럿으로 편성 확정.", timestamp_label: "02:00:00" }
      ],
      aiPersonaPrompt: "냉정한 비즈니스 드라마 서사 봇. 업계 전문 용어와 치열한 심리 묘사 특화."
    }),
    status: 'COMPLETED',
    progress: 100,
    is_sample: true
  }
];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function inject() {
  console.log('--- 정예 샘플 강제 주입 시작 ---');
  console.log('ELITE_SAMPLES 개수:', ELITE_SAMPLES.length);
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Supabase Key가 누락되었습니다.');
      return;
  }

  // 1. Purge
  console.log('기존 샘플 조회 중...');
  const { data: old, error: fetchError } = await supabase.from('projects_v2').select('id').eq('is_sample', true);
  
  if (fetchError) {
      console.error('❌ 기존 샘플 조회 실패:', fetchError.message);
      return;
  }

  if (old && old.length > 0) {
    console.log(`기존 샘플 ${old.length}개 삭제 중...`);
    const ids = old.map(o => o.id);
    await Promise.all([
      supabase.from('characters_v2').delete().in('project_id', ids),
      supabase.from('episodes_v2').delete().in('project_id', ids),
      supabase.from('scenes_v2').delete().in('project_id', ids)
    ]);
    const { error: delError } = await supabase.from('projects_v2').delete().in('id', ids);
    if (delError) {
        console.error('❌ 프로젝트 삭제 실패:', delError.message);
    } else {
        console.log('기존 샘플 삭제 완료');
    }
  } else {
      console.log('삭제할 기존 샘플 없음');
  }

  // 2. Inject
  for (const s of ELITE_SAMPLES) {
    console.log(`주입 시도: ${s.title}...`);
    const { data: project, error: insError } = await supabase.from('projects_v2').insert(s).select('id').single();
    
    if (insError) {
        console.error(`❌ ${s.title} 주입 실패:`, insError.message);
        continue;
    }

    if (project) {
        console.log(`ID 할당 성공: ${project.id}. 캐릭터 주입 중...`);
        const meta = JSON.parse(s.synopsis);
        const characters = meta.characters.map(c => ({
            project_id: project.id,
            name: c.name,
            job: c.role,
            gender: c.gender || 'Neutral',
            age: c.age || 0,
            look: c.trait,
            relationship_type: c.relationshipToProtagonist || 'Ally'
        }));
        const { error: charError } = await supabase.from('characters_v2').insert(characters);
        if (charError) {
            console.error(`❌ 캐릭터 주입 실패:`, charError.message);
        } else {
            console.log(`✔ 주입 완료: ${s.title}`);
        }
    }
  }
  console.log('--- 주입 프로세스 종료 ---');
}

inject()
  .then(() => console.log('✔ Script Execution Finished'))
  .catch(err => {
    console.error('❌ Critical Script Error:', err);
    process.exit(1);
  });
