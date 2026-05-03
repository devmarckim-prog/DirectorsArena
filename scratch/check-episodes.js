const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const PROJECT_ID = '142231a4-ede6-4cd1-a8e1-478757c01faf';

async function check() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  });
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from('projects_v2')
    .select('*')
    .eq('id', PROJECT_ID)
    .single();

  if (error) { console.error(error); return; }

  console.log('=== projects_v2 전체 컬럼 ===');
  Object.entries(data).forEach(([k, v]) => {
    const val = typeof v === 'string' && v.length > 120 ? v.substring(0, 120) + '...' : v;
    console.log(`${k}: ${JSON.stringify(val)}`);
  });
}
check();
