const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPendingProjects() {
  const { data, error } = await supabase
    .from('projects_v2')
    .select('id, title, status, genre, logline, synopsis, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching projects:', error);
  } else {
    data.forEach(p => {
      console.log(`[Project] ID: ${p.id} | Title: ${p.title} | Status: ${p.status}`);
      console.log(`  - Genre: ${p.genre}`);
      console.log(`  - Logline length: ${p.logline ? p.logline.length : 'NULL'}`);
      console.log(`  - Synopsis length: ${p.synopsis ? p.synopsis.length : 'NULL'}`);
      console.log('---');
    });
  }
}

checkPendingProjects();
