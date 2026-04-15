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
        logline: "영혼이 바뀐 VVIP 전용 백화점 CEO와 가난한 스턴트 우먼. 서로의 몸으로 살아가며 계급의 벽을 부수고 진정한 자아를 찾는 마법 같은 로맨스."
      },
      characters: [
        { "name": "김주원", "role": "백화점 CEO", "trait": "완벽주의자, 폐소공포증, 애정결핍. (가상 캐스팅: 박보검)" },
        { "name": "길라임", "role": "스턴트 무술감독", "trait": "걸크러시, 높은 자존감. (가상 캐스팅: 한소희)" }
      ],
      pplStrategy: [
        { "item": "프리미엄 전기 스포츠카", "scene": "영혼이 바뀐 상태에서 화려한 드리프트" },
        { "item": "제로슈거 에너지바", "scene": "와이어 액션 훈련 후 섭취" }
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
        logline: "빛이 사라진 영원한 밤의 도시 '글로밍'. 연쇄 실종 사건을 추적하던 중 잊혀진 고대 신들의 거대한 음모와 마주하는 하드보일드 추적극."
      },
      characters: [
        { "name": "이안", "role": "특수반 형사", "trait": "알콜 중독, 트라우마. (가상 캐스팅: 손석구)" },
        { "name": "세라", "role": "뒷골목 정보상", "trait": "기억을 읽는 팜므파탈. (가상 캐스팅: 전종서)" }
      ],
      pplStrategy: [
        { "item": "하이엔드 싱글몰트 위스키", "scene": "비가 내리는 창밖을 보며 단골 바에서 섭취" },
        { "item": "무광 블랙 대형 SUV", "scene": "빗길 추격전" }
      ],
      aiPersonaPrompt: "데이빗 핀처 스타일의 다크 스릴러 거장 모드. 대사는 건조하고 짧게 묘사."
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
            gender: 'Neutral',
            look: c.trait,
            relationship_type: 'Protagonist'
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
