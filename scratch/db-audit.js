
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function audit() {
  console.log('--- DB Audit Start ---');
  
  const { data: projects } = await supabase.from('projects_v2').select('id, title, status, episode_count');
  console.log('All Projects:', projects);

  const targetId = '142231a4-ede6-4cd1-a8e1-478757c01faf';
  const { data: project } = await supabase.from('projects_v2').select('*').eq('id', targetId).single();
  console.log('Target Project Details:', project);

  const { data: episodes } = await supabase.from('episodes_v2').select('*').eq('project_id', targetId);
  console.log('Episodes for Target:', episodes);

  if (episodes && episodes.length > 0) {
    const { data: beats } = await supabase.from('story_beats_v2').select('*').eq('episode_id', episodes[0].id);
    console.log('Beats for First Episode:', beats);
  }
}

audit();
