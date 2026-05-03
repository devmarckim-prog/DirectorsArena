
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function guessColumn() {
  const candidates = ['episode_id', 'ep_id', 'parent_id', 'episode_v2_id', 'episode', 'parent'];
  const projectId = '142231a4-ede6-4cd1-a8e1-478757c01faf';
  
  console.log('--- Guessing Foreign Key Column for story_beats_v2 ---');

  for (const col of candidates) {
    console.log(`Trying column: ${col}...`);
    const { error } = await supabase.from('story_beats_v2').select(col).limit(1);
    
    if (!error) {
      console.log(`✅ FOUND IT! The correct column name is: ${col}`);
      return;
    } else {
      console.log(`❌ ${col} failed: ${error.message}`);
    }
  }
}

guessColumn();
