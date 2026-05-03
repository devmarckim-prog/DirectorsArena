const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
env.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim();
});

const { createClient } = require('@supabase/supabase-js');
const sb = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  // admin_settings 모든 컬럼 확인
  const { data, error } = await sb.from('admin_settings').select('*').limit(5);
  console.log('admin_settings rows:', data?.length ?? 0);
  console.log('error:', error?.message);
  if (data?.[0]) {
    console.log('columns:', Object.keys(data[0]));
    console.log('row[0]:', JSON.stringify(data[0], null, 2).substring(0, 500));
  }
}
main().catch(console.error);
