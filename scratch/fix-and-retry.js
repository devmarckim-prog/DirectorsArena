const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://stfonaiuxavzbqwikcqb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM"
);

async function fixModelAndProject() {
  console.log("Updating admin_settings to correct model...");
  await supabase.from('admin_settings').update({ 
    model_id_primary: 'claude-3-5-sonnet-20240620',
    model_id_fast: 'claude-3-haiku-20240307'
  }).neq('id', '00000000-0000-0000-0000-000000000000'); // update first record

  console.log("Resetting project status for d5cef2c4...");
  await supabase.from('projects_v2').update({ 
    status: 'BAKING', 
    progress: 10 
  }).eq('id', 'd5cef2c4-f560-4933-8294-2a4440a4e5e4');

  console.log("Done. Ready for ignition retry.");
}

fixModelAndProject();
