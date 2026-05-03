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
  const { data, error } = await sb.from('similar_contents').select('*').limit(2);
  console.log('error:', error?.message);
  if (data?.[0]) {
    console.log('columns:', Object.keys(data[0]));
    console.log('sample row:', JSON.stringify(data[0], null, 2));
  } else {
    console.log('rows: 0 (empty table or not exist)');
  }
}
main().catch(console.error);
