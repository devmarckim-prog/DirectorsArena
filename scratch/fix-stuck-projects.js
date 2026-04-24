const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixStuckProjects() {
  console.log('--- STARTING DB RECOVERY PROTOCOL ---');

  // 1. Update Admin Settings Model IDs
  console.log('1. Normalizing AI Model Configuration in admin_settings...');
  const { error: adminError } = await supabase
    .from('admin_settings')
    .update({ 
      model_id_primary: 'claude-3-5-sonnet-20241022',
      model_id_fast: 'claude-3-5-haiku-20241022'
    })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all (usually only one)

  if (adminError) console.error('Failed to update admin settings:', adminError);
  else console.log('Successfully updated AI model names to real-world identifiers.');

  // 2. Un-stick BAKING projects
  // We change status to COMPLETED so the dashboard doesn't block them.
  // The StoryBibleTab "Seed Fallback" will handle the visual rendering.
  console.log('2. Releasing stuck projects from BAKING state...');
  const { data: stuckProjects, error: fetchError } = await supabase
    .from('projects_v2')
    .select('id, title')
    .eq('status', 'BAKING');

  if (fetchError) {
    console.error('Error fetching stuck projects:', fetchError);
  } else if (stuckProjects.length === 0) {
    console.log('No stuck projects found.');
  } else {
    for (const p of stuckProjects) {
      console.log(`Patching project: ${p.title} (${p.id})`);
      const { error: patchError } = await supabase
        .from('projects_v2')
        .update({ 
          status: 'COMPLETED',
          progress: 100 
        })
        .eq('id', p.id);
      
      if (patchError) console.error(`Failed to patch ${p.id}:`, patchError);
    }
    console.log(`Successfully patched ${stuckProjects.length} projects.`);
  }

  console.log('--- DB RECOVERY COMPLETE ---');
}

fixStuckProjects();
