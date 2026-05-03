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
  // information_schema로 컬럼 확인
  const { data } = await sb
    .from('information_schema.columns')
    .select('column_name, data_type, is_nullable')
    .eq('table_name', 'similar_contents')
    .eq('table_schema', 'public');
  
  if (data?.length) {
    console.log('similar_contents columns:');
    data.forEach(c => console.log(`  ${c.column_name} (${c.data_type}) nullable:${c.is_nullable}`));
  } else {
    // 대안: dummy insert로 스키마 추론
    console.log('Cannot read information_schema. Trying dummy insert...');
    const { error } = await sb.from('similar_contents').insert({
      project_id: '00000000-0000-0000-0000-000000000000',
      title: '__test__',
    });
    console.log('Insert error (shows missing columns):', error?.message);
  }
}
main().catch(console.error);
