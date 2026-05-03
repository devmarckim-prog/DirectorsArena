const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const PROJECT_ID = '142231a4-ede6-4cd1-a8e1-478757c01faf';

async function debug() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  });
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data } = await supabase.from('projects_v2').select('synopsis').eq('id', PROJECT_ID).single();
  
  let syn;
  try { syn = JSON.parse(data.synopsis); } catch(e) { syn = data.synopsis; }
  
  console.log('synopsis 최상위 키:', Object.keys(syn || {}));
  console.log('syn.formData:', syn?.formData);
  console.log('syn.story keys:', syn?.story ? Object.keys(syn.story) : 'none');
  console.log('syn.episodes:', Array.isArray(syn?.episodes) ? `array(${syn.episodes.length})` : syn?.episodes);
  
  // 에피소드 목록 (있다면)
  if (syn?.episodes) {
    console.log('\n에피소드 목록 (synopsis):');
    syn.episodes.forEach((e, i) => console.log(`  ${i+1}. EP${e.episodeNumber||e.episode_number}: ${e.title}`));
  }
  if (syn?.story?.episodes) {
    console.log('\n에피소드 목록 (synopsis.story.episodes):');
    syn.story.episodes.forEach((e, i) => console.log(`  ${i+1}. EP${e.episodeNumber||e.episode_number}: ${e.title}`));
  }
}
debug();
