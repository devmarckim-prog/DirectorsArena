const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function check() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k) env[k.trim()] = v.join('=').trim();
  });
  const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: projects } = await sb.from('projects_v2').select('id').limit(1);
  const projectId = projects[0].id;

  // genres 없이 최소한의 필드로 insert 시도
  const { data, error } = await sb.from('similar_contents').insert({
    project_id: projectId,
    title: 'Test',
    similarity_reason: 'Test'
  }).select('*').single();

  if (error) {
    console.log('Error during test insert:', error.message);
  } else {
    console.log('Available columns in similar_contents:', Object.keys(data));
    // 테스트 데이터 삭제
    await sb.from('similar_contents').delete().eq('id', data.id);
  }
}

check();
