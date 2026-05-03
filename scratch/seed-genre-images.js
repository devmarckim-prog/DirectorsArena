/**
 * 장르별 영화 분위기 이미지 20개 DB 삽입
 * 장르 카테고리 (각 2개씩):
 * - romance (로맨스)
 * - horror (공포/스릴러)
 * - fantasy (판타지)
 * - noir (누아르/범죄)
 * - business (비즈니스/드라마)
 * - historical (사극/시대극)
 * - comedy (코미디)
 * - sci-fi (SF)
 * - mystery (미스터리)
 * - action (액션)
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const GENRE_IMAGES = [
  // 로맨스 (romance)
  { genre: 'romance', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800', label: 'Romance - Warm Light' },
  { genre: 'romance', url: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?auto=format&fit=crop&q=80&w=800', label: 'Romance - Couple' },

  // 공포/스릴러 (horror)
  { genre: 'horror', url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800', label: 'Horror - Dark Forest' },
  { genre: 'horror', url: 'https://images.unsplash.com/photo-1572544656882-6b0b30c51e38?auto=format&fit=crop&q=80&w=800', label: 'Horror - Abandoned' },

  // 판타지 (fantasy)
  { genre: 'fantasy', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800', label: 'Fantasy - Mystical' },
  { genre: 'fantasy', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=800', label: 'Fantasy - Forest Light' },

  // 누아르/범죄 (noir)
  { genre: 'noir', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800', label: 'Noir - City Night' },
  { genre: 'noir', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=800', label: 'Noir - Rain Street' },

  // 비즈니스/드라마 (business/drama)
  { genre: 'business', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', label: 'Business - Skyline' },
  { genre: 'business', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', label: 'Business - Office' },

  // 사극/시대극 (historical)
  { genre: 'historical', url: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?auto=format&fit=crop&q=80&w=800', label: 'Historical - Ancient' },
  { genre: 'historical', url: 'https://images.unsplash.com/photo-1548407260-da850faa41e3?auto=format&fit=crop&q=80&w=800', label: 'Historical - Temple' },

  // 코미디 (comedy)
  { genre: 'comedy', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800', label: 'Comedy - Colorful' },
  { genre: 'comedy', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800', label: 'Comedy - Friends' },

  // SF (sci-fi)
  { genre: 'sci-fi', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', label: 'SciFi - Space' },
  { genre: 'sci-fi', url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=800', label: 'SciFi - Cyber' },

  // 미스터리 (mystery)
  { genre: 'mystery', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', label: 'Mystery - Foggy' },
  { genre: 'mystery', url: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?auto=format&fit=crop&q=80&w=800', label: 'Mystery - Shadow' },

  // 액션 (action)
  { genre: 'action', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800', label: 'Action - Intense' },
  { genre: 'action', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800', label: 'Action - Dynamic' },
];

async function seed() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  });
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // 기존 genre_image 타입 삭제 후 재삽입
  console.log('🧹 기존 genre_image 타입 이미지 삭제...');
  await supabase.from('system_assets').delete().eq('type', 'genre_image');

  const toInsert = GENRE_IMAGES.map(img => ({
    type: 'genre_image',
    url: img.url,
    label: img.label,
    metadata: { genre: img.genre }
  }));

  console.log(`📝 ${toInsert.length}개 장르 이미지 삽입 중...`);
  const { data, error } = await supabase
    .from('system_assets')
    .insert(toInsert)
    .select('id, label, metadata');

  if (error) {
    console.error('❌ 삽입 실패:', error.message);
    console.error('상세:', error);
    return;
  }

  console.log(`\n🎉 완료! ${data.length}개 이미지 등록됨`);
  data.forEach(d => console.log(`  ✅ [${d.metadata?.genre}] ${d.label}`));
}

seed().catch(console.error);
