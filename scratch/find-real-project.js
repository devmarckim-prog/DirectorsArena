
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function findTheRealOne() {
  console.log('--- Searching for the REAL Project ---');
  
  // 1. Search projects by name
  const { data: projects } = await supabase
    .from('projects_v2')
    .select('id, title, created_at')
    .ilike('title', '%디렉터즈%');
  
  console.log('Projects found with "디렉터즈" in title:');
  projects.forEach(p => console.log(`- ID: ${p.id} | Title: ${p.title} | Created: ${p.created_at}`));

  const urlId = '142231a4-ede6-4cd1-a8e1-478757c01faf';
  const match = projects.find(p => p.id === urlId);

  if (match) {
    console.log('✅ MATCH FOUND! URL ID exists in DB.');
    
    // Check if this specific ID has episodes and beats
    const { data: eps } = await supabase.from('episodes_v2').select('id, episode_number').eq('project_id', urlId);
    console.log(`Episodes for ${urlId}:`, eps.length);
    
    if (eps.length > 0) {
      const { data: beats } = await supabase.from('story_beats_v2').select('id').eq('episode_id', eps[0].id);
      console.log(`Beats for EP 1 of ${urlId}:`, beats.length);
    }
  } else {
    console.log('❌ NO MATCH! The ID in your URL is NOT in the projects_v2 table.');
    
    // Maybe it is in an old table?
    const { data: oldProj } = await supabase.from('projects').select('id, title').eq('id', urlId).single();
    if (oldProj) console.log('⚠️ Found in OLD "projects" table instead of "projects_v2"!');
  }
}

findTheRealOne();
