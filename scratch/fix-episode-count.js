const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const PROJECT_ID = '142231a4-ede6-4cd1-a8e1-478757c01faf';

async function fix() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  });
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // synopsis에서 에피소드 수 확인
  const { data: project } = await supabase
    .from('projects_v2')
    .select('episode_count, synopsis')
    .eq('id', PROJECT_ID)
    .single();

  let synEpCount = 0;
  try {
    const synObj = typeof project.synopsis === 'string' ? JSON.parse(project.synopsis) : project.synopsis;
    synEpCount = Number(
      synObj?.formData?.episodes ||
      synObj?.episodes?.length ||
      synObj?.story?.episodeCount || 0
    );
    console.log('Synopsis formData.episodes:', synObj?.formData?.episodes);
    console.log('Synopsis episodes.length:', synObj?.episodes?.length);
    console.log('Synopsis story.episodeCount:', synObj?.story?.episodeCount);
  } catch(e) {
    console.log('Synopsis parse error:', e.message);
  }

  console.log(`Current episode_count in DB: ${project.episode_count}`);
  console.log(`Synopsis derived count: ${synEpCount}`);

  // episode_count가 없으면 8로 설정
  if (!project.episode_count) {
    const targetCount = synEpCount || 8;
    console.log(`\n📝 episode_count를 ${targetCount}로 업데이트 중...`);
    const { error } = await supabase
      .from('projects_v2')
      .update({ episode_count: targetCount })
      .eq('id', PROJECT_ID);
    if (error) console.error('업데이트 실패:', error.message);
    else console.log(`✅ episode_count = ${targetCount} 저장 완료`);
  } else {
    console.log('✅ episode_count 이미 설정됨. 변경 불필요.');
  }
}
fix();
