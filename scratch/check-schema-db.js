const fs = require('fs');
// .env.local 수동 파싱
const env = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
env.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim();
});

const { createClient } = require('@supabase/supabase-js');
const sb = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data, error } = await sb.from('admin_settings').select('schema_fields').limit(1).single();
  if (error) { console.log('DB Error:', error.message); return; }
  if (!data?.schema_fields) { console.log('❌ schema_fields: NULL — DB에 아직 저장 안 됨'); return; }

  const fields = data.schema_fields;
  const keys = Object.keys(fields);
  console.log('✅ Total fields in DB:', keys.length);
  console.log('   Has category field:', Object.values(fields).some(f => f.category) ? '✅' : '❌ 없음 (구버전)');
  console.log('   Has protagonist_name:', fields.protagonist_name ? '✅' : '❌ 없음');
  console.log('   Has antagonist_name:', fields.antagonist_name ? '✅' : '❌ 없음');
  const enabled = keys.filter(k => fields[k].enabled);
  console.log('   Enabled fields:', enabled.length > 0 ? enabled.join(', ') : '없음');
  console.log('\n현재 DB schema_fields 샘플:');
  keys.slice(0, 4).forEach(k => console.log(`   ${k}:`, JSON.stringify(fields[k])));
}
main();
