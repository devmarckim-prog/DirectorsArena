const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

const projectId = '142231a4-ede6-4cd1-a8e1-478757c01faf';

const characters = [
  {
    project_id: projectId,
    name: '조재현',
    job: '기획자 / 디렉터즈 아레나 대표',
    gender: '남성',
    age: 35,
    look: '냉철하고 예리한 외모. 늘 깔끔한 정장 차림.',
    secret: '과거 강대표의 음모로 모든 것을 잃은 트라우마가 있음.',
    void: 'The Mastermind',
    desire: '숏폼 콘텐츠 시장을 뒤집어 강대표에게 완벽히 복수하는 것.',
    relationship_type: 'Protagonist'
  },
  {
    project_id: projectId,
    name: '오서영',
    job: '메인 PD / 디렉터즈 아레나 공동대표',
    gender: '여성',
    age: 32,
    look: '세련되고 도회적인 스타일. 날카로운 눈빛.',
    secret: '자신의 커리어를 위해 재현을 이용하고 있다고 생각하지만 점차 그에게 동화됨.',
    void: 'The Commander',
    desire: '최고의 시청률과 업계 1위 탈환.',
    relationship_type: 'Protagonist'
  },
  {
    project_id: projectId,
    name: '강대표',
    job: '제국엔터테인먼트 대표',
    gender: '남성',
    age: 55,
    look: '기품있지만 위압감을 주는 거구. 고급 시가를 즐김.',
    secret: '재현의 아버지를 파멸로 몰아넣은 진짜 흑막.',
    void: 'The Ruler',
    desire: '디렉터즈 아레나를 짓밟고 숏폼 시장을 독식하는 것.',
    relationship_type: 'Antagonist'
  },
  {
    project_id: projectId,
    name: '박민규',
    job: '무명 배우 / 서바이벌 참가자',
    gender: '남성',
    age: 27,
    look: '어딘가 불안정해 보이는 마른 체형이지만 카메라 앞에서는 눈빛이 돌변함.',
    secret: '무대에서 인정받지 못하면 자살하려는 극단적 충동을 앓고 있음.',
    void: 'The Magician',
    desire: '자신의 천재성을 세상에 인정받는 것.',
    relationship_type: 'Ally'
  },
  {
    project_id: projectId,
    name: '김병수',
    job: '거대 투자사 대표',
    gender: '남성',
    age: 48,
    look: '여유있고 능글맞은 미소. 화려한 명품 코디.',
    secret: '강대표의 독주를 막기 위해 의도적으로 재현을 키우려는 뒷배.',
    void: 'The Gambler',
    desire: '오직 막대한 자본 스펙터클과 재미, 그리고 돈.',
    relationship_type: 'Foil'
  },
  {
    project_id: projectId,
    name: '최국장',
    job: '방송국 예능국장',
    gender: '남성',
    age: 52,
    look: '전형적인 관료주의적 꼰대 패션. 늘 안경을 치켜올림.',
    secret: '강대표에게 약점을 잡혀 오서영을 내친 것에 대한 일말의 죄책감.',
    void: 'The Chameleon',
    desire: '양쪽의 눈치를 보며 자신의 자리와 연금을 보전하는 것.',
    relationship_type: 'Trickster'
  },
  {
    project_id: projectId,
    name: '김동욱',
    job: '어시스턴트 / 정보원',
    gender: '남성',
    age: 28,
    look: '힙하고 캐주얼한 스트릿 패션. 빠릿한 몸놀림.',
    secret: '과거 어둠의 경로에서 해커로 활동한 전력이 있음.',
    void: 'The Ally',
    desire: '재현 형이 다시 업계 최고로 올라서는 것을 돕는 것.',
    relationship_type: 'Ally'
  }
];

async function seedCharacters() {
  console.log('Seeding 7 characters for Directors Arena...');
  
  await supabase.from('characters_v2').delete().eq('project_id', projectId);

  const { data, error } = await supabase
    .from('characters_v2')
    .insert(characters);

  if (error) {
    console.error('Error inserting characters:', error);
  } else {
    console.log('Successfully inserted 7 detailed characters!');
  }
}

seedCharacters();
