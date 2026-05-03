
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
  console.log('--- Inspecting story_beats_v2 Schema ---');
  
  // A trick to see columns: select one row and look at keys
  const { data, error } = await supabase.from('story_beats_v2').select('*').limit(1);
  
  if (error) {
    console.error('Error fetching row:', error);
  } else if (data && data.length > 0) {
    console.log('Columns found in story_beats_v2:', Object.keys(data[0]));
  } else {
    console.log('Table is empty. Trying to find columns via another way...');
    // If empty, we can try to insert a dummy and see the error msg with columns
    const { error: insError } = await supabase.from('story_beats_v2').insert({ dummy_col_test: 'test' });
    console.log('Schema Error Hint:', insError.message);
  }
}

inspectSchema();
