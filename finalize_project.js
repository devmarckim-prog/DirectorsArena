
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://stfonaiuxavzbqwikcqb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM');

async function finalizeProject() {
  const projectId = '142231a4-ede6-4cd1-a8e1-478757c01faf';
  
  const { data: project, error: fetchError } = await supabase
    .from('projects_v2')
    .select('synopsis')
    .eq('id', projectId)
    .single();

  if (fetchError) {
    console.error('Fetch error:', fetchError);
    return;
  }

  let synopsis = {};
  try {
    synopsis = JSON.parse(project.synopsis);
  } catch (e) {
    console.error('Parse error:', e);
    return;
  }

  const newTitle = "아레나의 대본가 (Scriptwriter in the Arena)";
  
  // Map synopsis data to generated_content format if needed
  const generatedContent = {
    epicNarrative: synopsis.story?.epicNarrative || synopsis.logline || "",
    characters: synopsis.characterNodes || [],
    storyBeats: synopsis.storyBeats || {},
    storyBible: synopsis.storyBible || {}
  };

  const { error: updateError } = await supabase
    .from('projects_v2')
    .update({
      title: newTitle,
      status: 'READY',
      generated_content: generatedContent
    })
    .eq('id', projectId);

  if (updateError) {
    console.error('Update error:', updateError);
  } else {
    console.log('Project finalized successfully!');
  }
}

finalizeProject();
