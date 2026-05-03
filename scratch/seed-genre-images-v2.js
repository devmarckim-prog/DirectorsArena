/**
 * 장르별 5개 이미지를 system_settings 테이블에 저장
 * id = 'genre_images', prompts 컬럼에 JSON으로 저장
 * 
 * 장르 10개 × 5장 = 총 50개
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const GENRE_IMAGES = {
  // 로맨스 — 따뜻한 빛, 커플, 감성적
  romance: [
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&q=80&w=800",
  ],
  // 공포/스릴러 — 어둠, 공포, 긴장
  horror: [
    "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1572544656882-6b0b30c51e38?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&q=80&w=800",
  ],
  // 판타지 — 신비, 마법, 환상
  fantasy: [
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?auto=format&fit=crop&q=80&w=800",
  ],
  // 누아르/범죄 — 도시 야경, 빗속, 어두운 분위기
  noir: [
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1545665277-5937489579f2?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=800",
  ],
  // 비즈니스/드라마 — 고층빌딩, 회의실, 도시
  business: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
  ],
  // 사극/시대극 — 전통 건축, 고궁, 한복
  historical: [
    "https://images.unsplash.com/photo-1551029506-0807df4e2031?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1548407260-da850faa41e3?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1519922639192-e73293ca430e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=800",
  ],
  // 코미디 — 밝고 화사한, 유머러스
  comedy: [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
  ],
  // SF/공상과학 — 우주, 사이버, 미래
  scifi: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1462332420958-a05d1e002413?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800",
  ],
  // 미스터리 — 안개, 그림자, 탐정
  mystery: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1535083783855-ade8e37a48ab?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1542159919831-40fb0656b45a?auto=format&fit=crop&q=80&w=800",
  ],
  // 액션 — 역동적, 강렬, 긴장감
  action: [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800",
  ],
};

async function seed() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  });
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const totalImages = Object.values(GENRE_IMAGES).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`📸 총 ${Object.keys(GENRE_IMAGES).length}개 장르 × 5장 = ${totalImages}개 이미지 저장 중...`);

  // system_settings에 id='genre_images' 행으로 저장
  const { error } = await supabase
    .from('system_settings')
    .upsert({
      id: 'genre_images',
      prompts: GENRE_IMAGES,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

  if (error) {
    console.error('❌ 저장 실패:', error.message);
    return;
  }

  // 검증
  const { data } = await supabase
    .from('system_settings')
    .select('prompts')
    .eq('id', 'genre_images')
    .single();

  console.log('\n🎉 저장 완료!');
  Object.entries(data.prompts).forEach(([genre, urls]) => {
    console.log(`  [${genre}] ${urls.length}장`);
  });
}

seed().catch(console.error);
