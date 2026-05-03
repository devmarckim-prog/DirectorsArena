const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function list() {
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
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) { console.error('Error:', error.message); return; }
  if (data.length > 0) {
    console.log('projects_v2 컬럼:', Object.keys(data[0]));
    data.forEach(p => {
      console.log(`\n[${p.id}]`);
      Object.entries(p).forEach(([k, v]) => {
        const val = typeof v === 'string' && v.length > 80 ? v.substring(0, 80) + '...' : v;
        console.log(`  ${k}: ${JSON.stringify(val)}`);
      });
    });
  }
}
list();
