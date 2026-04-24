const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStuckDetails() {
  const { data } = await supabase
    .from('projects_v2')
    .select('id, synopsis, progress')
    .eq('id', '3b227bb4-bd11-424d-84c9-51f1daf29f84') // One of the stuck ones
    .single();

  if (data) {
    console.log('Progress:', data.progress);
    console.log('Synopsis Content Preview:', data.synopsis.substring(0, 500));
    
    // Check if characters, episodes exist in their tables
    const { count: cCount } = await supabase.from('characters_v2').select('*', { count: 'exact' }).eq('project_id', data.id);
    const { count: eCount } = await supabase.from('episodes_v2').select('*', { count: 'exact' }).eq('project_id', data.id);
    console.log(`Characters recorded: ${cCount}`);
    console.log(`Episodes recorded: ${eCount}`);
  }
}
checkStuckDetails();
