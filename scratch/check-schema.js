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

  const { data, error } = await supabase
    .from('story_beats_v2')
    .insert({ 
      project_id: '142231a4-ede6-4cd1-a8e1-478757c01faf', 
      act_number: 1, 
      beat_type: 'Scene',
      title: 'TEST',
      description: 'test',
      order_index: 0
    })
    .select();

  if (error) {
    console.log('Insert error:', error.message);
  } else {
    console.log('✅ 실제 컬럼 목록:', JSON.stringify(Object.keys(data[0]), null, 2));
    await supabase.from('story_beats_v2').delete().eq('id', data[0].id);
    console.log('🧹 테스트 행 삭제 완료');
  }
}
check();
