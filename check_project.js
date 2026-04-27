
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);


async function checkProject() {
  const { data, error } = await supabase
    .from('projects_v2')
    .select('*')
    .eq('id', '142231a4-ede6-4cd1-a8e1-478757c01faf')
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return;
  }

  console.log('Project Status:', data.status);
  console.log('Project Title:', data.title);
  
  let synopsisParsed = {};
  if (typeof data.synopsis === 'string') {
    try { synopsisParsed = JSON.parse(data.synopsis); } catch(e) {}
  } else { synopsisParsed = data.synopsis || {}; }

  console.log('Extracted Title from Synopsis:', synopsisParsed.title || synopsisParsed.story?.title || 'N/A');
  console.log('Has Characters:', !!synopsisParsed.characters || !!synopsisParsed.relationshipGraph);
  console.log('Has Beats:', !!synopsisParsed.storyBeats);
}


checkProject();
