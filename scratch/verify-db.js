
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const projectId = '142231a4-ede6-4cd1-a8e1-478757c01faf';
  
  const { data: eps } = await supabase.from('episodes_v2').select('*').eq('project_id', projectId);
  console.log('Episodes in DB:', eps);

  if (eps && eps.length > 0) {
    const { data: beats } = await supabase.from('story_beats_v2').select('*').eq('episode_id', eps[0].id);
    console.log('Beats for first episode:', beats);
  }
}

check();
