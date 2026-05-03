
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkChars() {
  const { data: projects } = await supabase.from('projects_v2').select('id, title').limit(5);
  console.log("Projects:", projects);
  
  for (const p of projects) {
    const { data: chars } = await supabase.from('characters_v2').select('*').eq('project_id', p.id);
    console.log(`Project: ${p.title} (${p.id})`);
    console.log("Characters:", chars?.map(c => ({ id: c.id, name: c.name, age: c.age })));
  }
}

checkChars();
