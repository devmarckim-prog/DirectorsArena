
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const projectId = '142231a4-ede6-4cd1-a8e1-478757c01faf';
  
  console.log('--- Project Info ---');
  const { data: project } = await supabase.from('projects_v2').select('*').eq('id', projectId).single();
  console.log('Status:', project?.status);
  console.log('Episode Count:', project?.episode_count);

  console.log('\n--- Episodes ---');
  const { data: episodes } = await supabase.from('episodes_v2').select('*').eq('project_id', projectId);
  episodes?.forEach(ep => {
    console.log(`EP ${ep.episode_number}: ID=${ep.id}, HasScript=${!!ep.script_content}, Title=${ep.title}`);
  });

  console.log('\n--- Story Beats (v2) ---');
  const { data: beats } = await supabase.from('story_beats_v2').select('*').eq('project_id', projectId);
  console.log('Total Beats:', beats?.length);
  beats?.slice(0, 5).forEach(b => {
    console.log(`EP_ID=${b.episode_id}, Scene=${b.scene_number}, Title=${b.title}, HasScript=${!!b.script_content}`);
  });
}

checkData();
