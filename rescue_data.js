
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://stfonaiuxavzbqwikcqb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM');

async function rescueData() {
  const projectId = '5561a436-c4e5-4ec7-946e-e29f30c542f9';
  const { data: project } = await supabase.from('projects_v2').select('synopsis').eq('id', projectId).single();
  
  if (!project || !project.synopsis) return;

  const rawObject = project.synopsis;
  const raw = typeof rawObject === 'string' ? rawObject : (rawObject.story?.epicNarrative || JSON.stringify(rawObject));
  console.log("Analyzing raw content (length):", raw.length);
  console.log("Sample:", raw.substring(0, 300));

  // 1. Extract Characters using Regex
  const characters = [];
  // Handle escaped or unescaped quotes
  const charRegex = /\\?"name\\?":\s*\\?"([^"\\]+)\\?"[\s\S]*?\\?"gender\\?":\s*\\?"([^"\\]+)\\?"[\s\S]*?\\?"(?:relationshipToProtagonist|ageGroupshipToProtagonist)\\?":\s*\\?"([^"\\]+)\\?"/g;
  let match;
  while ((match = charRegex.exec(raw)) !== null) {
    characters.push({
      project_id: projectId,
      name: match[1],
      gender: match[2],
      relationship_type: match[3],
      age: 0,
      job: "N/A",
      look: "Rescued from corrupted string"
    });
  }


  console.log(`Found ${characters.length} characters to rescue.`);
  if (characters.length > 0) {
    const { error } = await supabase.from('characters_v2').insert(characters);
    if (error) console.error("Error inserting characters:", error);
    else console.log("Characters rescued successfully!");
  }

  // 2. Extract Structure/Beats
  const beats = [];
  const beatRegex = /\\?"act_number\\?":\s*(\d+)[\s\S]*?\\?"beat_type\\?":\s*\\?"([^"\\]+)\\?"[\s\S]*?\\?"timestamp_label\\?":\s*\\?"([^"\\]+)\\?"/g;
  let beatIdx = 0;
  while ((match = beatRegex.exec(raw)) !== null) {
    beats.push({
      project_id: projectId,
      act_number: parseInt(match[1]),
      beat_type: match[2],
      timestamp_label: match[3],
      title: "Rescued Beat",
      description: "Rescued from corrupted string",
      order_index: beatIdx++
    });
  }




  console.log(`Found ${beats.length} beats to rescue.`);
  if (beats.length > 0) {
    const { error } = await supabase.from('story_beats_v2').insert(beats);
    if (error) console.error("Error inserting beats:", error);
    else console.log("Beats rescued successfully!");
  }
}

rescueData();
