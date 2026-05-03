/**
 * EP3~EP8 플레이스홀더 에피소드를 DB에 삽입하여 
 * "디렉터스 아레나" 프로젝트가 8개 EP 카드를 보여주게 함
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const PROJECT_ID = '142231a4-ede6-4cd1-a8e1-478757c01faf';

const EP_TITLES = [
  { n: 3, title: 'EP3. 아레나의 규칙',      summary: '디렉터스 아레나의 본선 진출자들이 처음으로 마주치는 첫 번째 대결 룰이 공개된다.' },
  { n: 4, title: 'EP4. 배신의 시나리오',    summary: '오세영은 강민준이 처음부터 다른 목적을 가지고 접근했다는 사실을 알게 된다.' },
  { n: 5, title: 'EP5. 두 번째 기회',       summary: '모든 것을 잃을 위기에서 오세영은 새로운 파트너를 만나게 된다.' },
  { n: 6, title: 'EP6. 결전의 전야',        summary: '파이널 라운드를 하루 앞두고, 세 팀의 전략이 충돌하기 시작한다.' },
  { n: 7, title: 'EP7. 아레나의 심판',      summary: '드디어 펼쳐지는 디렉터스 아레나 파이널. 세 편의 파일럿이 모두 공개된다.' },
  { n: 8, title: 'EP8. 살아남은 자들',      summary: '최후의 승자가 결정되고, 각자의 상처와 성장이 드러나는 마지막 이야기.' },
];

async function seed() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  });
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // 기존 에피소드 번호 확인
  const { data: existing } = await supabase
    .from('episodes_v2')
    .select('episode_number')
    .eq('project_id', PROJECT_ID);
  
  const existingNums = (existing || []).map(e => e.episode_number);
  console.log('기존 에피소드 번호:', existingNums);

  const toInsert = EP_TITLES.filter(ep => !existingNums.includes(ep.n));
  
  if (toInsert.length === 0) {
    console.log('✅ 이미 모든 에피소드가 존재합니다.');
    return;
  }

  console.log(`📝 ${toInsert.length}개 에피소드 삽입: EP${toInsert.map(e=>e.n).join(', EP')}`);
  
  const { data, error } = await supabase
    .from('episodes_v2')
    .insert(toInsert.map(ep => ({
      project_id: PROJECT_ID,
      episode_number: ep.n,
      title: ep.title,
      summary: ep.summary,
      script_content: null
    })))
    .select('id, episode_number, title');

  if (error) { console.error('❌ 실패:', error.message); return; }
  
  console.log('\n🎉 삽입 완료!');
  data.forEach(e => console.log(`  EP${e.episode_number}: ${e.title}`));
  
  // 전체 에피소드 확인
  const { data: all } = await supabase
    .from('episodes_v2')
    .select('episode_number, title')
    .eq('project_id', PROJECT_ID)
    .order('episode_number');
  
  console.log(`\n📋 전체 에피소드 (${all.length}개):`);
  all.forEach(e => console.log(`  EP${e.episode_number}: ${e.title}`));
}
seed().catch(console.error);
