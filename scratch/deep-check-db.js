
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function deepCheck() {
  const projectId = '142231a4-ede6-4cd1-a8e1-478757c01faf';
  console.log('Checking Project:', projectId);

  const { data: project } = await supabase.from('projects_v2').select('*').eq('id', projectId).single();
  console.log('Project Status:', project?.status, 'Episode Count:', project?.episode_count);

  const { data: episodes } = await supabase.from('episodes_v2').select('*').eq('project_id', projectId);
  console.log('Episodes Found:', episodes?.length);
  episodes?.forEach(e => console.log(`- EP ${e.episode_number}: ID=${e.id}`));

  if (episodes && episodes.length > 0) {
    const { data: beats } = await supabase.from('story_beats_v2').select('*').eq('episode_id', episodes[0].id);
    console.log(`Beats for EP 1 (${episodes[0].id}):`, beats?.length);
    beats?.forEach(b => console.log(`  - Scene ${b.scene_number}: ${b.title}`));
  }
}

deepCheck();
