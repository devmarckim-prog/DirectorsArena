const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function inspect() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  });
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // 존재하는 테이블 목록 확인
  const tables = [
    'projects_v2','episodes_v2','story_beats_v2','characters_v2',
    'scenes_v2','admin_settings','system_assets','system_settings',
    'system_images','similar_contents','api_usage_logs'
  ];

  console.log('=== DB 테이블 존재 여부 ===');
  for (const t of tables) {
    const { error } = await supabase.from(t).select('id').limit(1);
    if (!error) {
      console.log(`  ✅ ${t}`);
    } else if (error.code === 'PGRST116') {
      console.log(`  ✅ ${t} (empty)`);
    } else {
      console.log(`  ❌ ${t} — ${error.message.slice(0, 60)}`);
    }
  }

  // projects_v2.genre 샘플 확인
  const { data: genres } = await supabase
    .from('projects_v2')
    .select('title, genre, platform')
    .limit(5);
  console.log('\n=== 프로젝트 장르 필드 현황 ===');
  genres?.forEach(p => console.log(`  "${p.title}" → genre: "${p.genre}" / platform: "${p.platform}"`));
}
inspect();
