
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://stfonaiuxavzbqwikcqb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM'
);

async function find() {
  const { data, error } = await supabase.from('projects').select('id, title, synopsis');
  if (error) {
    console.error(error);
    return;
  }
  
  for (const p of data) {
    const synString = typeof p.synopsis === 'string' ? p.synopsis : JSON.stringify(p.synopsis);
    if (synString && synString.includes('조재현')) {
      console.log(`Found! Project ID: ${p.id}, Title: ${p.title}`);
    }
  }
}
find();
