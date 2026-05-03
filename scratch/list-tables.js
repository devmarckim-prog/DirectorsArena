
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  console.log('--- Listing All Available Tables via RPC/Hack ---');
  
  // We can try to query common names and see which ones exist
  const tables = ['projects', 'projects_v2', 'episodes', 'episodes_v2', 'story_beats', 'story_beats_v2', 'scenes', 'scenes_v2'];
  
  for (const t of tables) {
    const { error } = await supabase.from(t).select('count', { count: 'exact', head: true });
    if (!error) {
      console.log(`✅ Table Exists: ${t}`);
      
      // If it exists, let's try to see its columns by picking one row (if any)
      const { data } = await supabase.from(t).select('*').limit(1);
      if (data && data.length > 0) {
        console.log(`   Columns in ${t}:`, Object.keys(data[0]));
      }
    } else {
      // console.log(`❌ Table Missing: ${t} (${error.message})`);
    }
  }
}

listTables();
