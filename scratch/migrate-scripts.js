
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateScripts() {
  const projectId = '142231a4-ede6-4cd1-a8e1-478757c01faf';
  
  console.log('--- Migrating Scripts for Project:', projectId, '---');
  
  // 1. Fetch episodes with scripts
  const { data: episodes, error: epError } = await supabase
    .from('episodes_v2')
    .select('id, script_content, episode_number')
    .eq('project_id', projectId)
    .not('script_content', 'is', null);

  if (epError) {
    console.error('Error fetching episodes:', epError);
    return;
  }

  if (!episodes || episodes.length === 0) {
    console.log('No episodes with scripts found to migrate.');
    return;
  }

  for (const ep of episodes) {
    console.log(`\nProcessing EP ${ep.episode_number}...`);
    const scriptBlocks = ep.script_content.split(/(?=INT\.|EXT\.)/g);
    
    const { data: beats, error: bError } = await supabase
      .from('story_beats_v2')
      .select('id, scene_number')
      .eq('episode_id', ep.id)
      .order('scene_number', { ascending: true });

    if (bError) {
      console.error(`Error fetching beats for EP ${ep.episode_number}:`, bError);
      continue;
    }

    if (!beats || beats.length === 0) {
      console.log(`No beats found for EP ${ep.episode_number}. Skipping.`);
      continue;
    }

    console.log(`Found ${beats.length} beats and ${scriptBlocks.length} script blocks.`);

    for (let i = 0; i < beats.length; i++) {
      const beat = beats[i];
      const content = scriptBlocks[i] || "";
      if (content) {
        const { error: uError } = await supabase
          .from('story_beats_v2')
          .update({ script_content: content.trim() })
          .eq('id', beat.id);
        
        if (uError) {
          console.error(`Error updating beat ${beat.scene_number}:`, uError);
        } else {
          console.log(`Updated beat ${beat.scene_number} with script content.`);
        }
      }
    }
  }
  
  console.log('\nMigration Complete.');
}

migrateScripts();
