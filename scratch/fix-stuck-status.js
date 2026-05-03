const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function check() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  });
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // status가 BAKING이면서 progress 100인 프로젝트 찾기
  const { data, error } = await supabase
    .from('projects_v2')
    .select('id, title, status, progress')
    .order('created_at', { ascending: false });

  if (error) { console.error(error.message); return; }

  console.log('=== 모든 프로젝트 status 현황 ===');
  data.forEach(p => console.log(`  [${p.status}] progress:${p.progress} | ${p.title} [${p.id.slice(0,8)}]`));

  // BAKING이면서 progress >= 100인 것만 READY로 업데이트
  const stuck = data.filter(p => p.status === 'BAKING' && (p.progress ?? 0) >= 90);
  if (stuck.length === 0) {
    console.log('\n✅ 고착된 BAKING 프로젝트 없음');
    return;
  }
  
  console.log(`\n⚠️ 고착 감지: ${stuck.length}개`);
  stuck.forEach(p => console.log(`  - ${p.title}`));

  for (const p of stuck) {
    const { error: updateErr } = await supabase
      .from('projects_v2')
      .update({ status: 'READY', progress: 100 })
      .eq('id', p.id);
    if (updateErr) console.error(`  ❌ ${p.title}: ${updateErr.message}`);
    else console.log(`  ✅ ${p.title} → READY`);
  }
}
check();
