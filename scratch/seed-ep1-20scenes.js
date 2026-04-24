const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://stfonaiuxavzbqwikcqb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM'
);

const PROJECT_ID = '142231a4-ede6-4cd1-a8e1-478757c01faf';

const fs = require('fs');
const path = require('path');
const ep1FullScript = fs.readFileSync(path.join(__dirname, 'ep1.txt'), 'utf8');

async function seedEp1() {
  console.log('Injecting 20-scene script for Episode 1...');
  const { error } = await supabase
    .from('episodes_v2')
    .update({ script_content: ep1FullScript })
    .eq('project_id', PROJECT_ID)
    .eq('episode_number', 1);

  if (error) {
    console.error('Update error:', error);
  } else {
    console.log('Episode 1 full script successfully updated!');
  }
}

seedEp1();
