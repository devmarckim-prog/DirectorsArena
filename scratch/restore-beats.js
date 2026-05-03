
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreBeats() {
  const projectId = '142231a4-ede6-4cd1-a8e1-478757c01faf';
  
  console.log('--- Restoring Beats from Episode Script ---');
  
  // 1. Get Episode 1 Script
  const { data: ep } = await supabase
    .from('episodes_v2')
    .select('*')
    .eq('project_id', projectId)
    .eq('episode_number', 1)
    .single();

  if (!ep || !ep.script_content) {
    console.error('Episode 1 script not found.');
    return;
  }

  // 2. Split script by scene headings (INT. or EXT.)
  const sceneBlocks = ep.script_content.split(/(?=INT\.|EXT\.)/g);
  console.log(`Found ${sceneBlocks.length} scenes in script.`);

  for (let i = 0; i < sceneBlocks.length; i++) {
    const content = sceneBlocks[i].trim();
    if (!content) continue;

    const sceneNum = i + 1;
    // Extract title from first line
    const title = content.split('\n')[0] || `Scene ${sceneNum}`;

    console.log(`Inserting Scene ${sceneNum}: ${title}`);

    await supabase.from('story_beats_v2').insert({
      project_id: projectId,
      episode_id: ep.id,
      scene_number: sceneNum,
      title: title,
      description: `${title} 장면입니다.`,
      script_content: content,
      timestamp_label: `00:${sceneNum.toString().padStart(2, '0')}:00`,
      act_number: Math.ceil(sceneNum / 2), // Rough act assignment
      beat_type: 'Scene'
    });
  }

  console.log('Beats restoration complete.');
}

restoreBeats();
