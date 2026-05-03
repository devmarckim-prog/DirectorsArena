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

  const { data, error } = await supabase.from('system_settings').select('*');
  if (error) { console.error(error.message); return; }
  console.log('system_settings 컬럼:', data.length > 0 ? Object.keys(data[0]) : '(empty table)');
  console.log('rows:', JSON.stringify(data, null, 2).slice(0, 500));
}
check();
