const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function list() {
  const { data, error } = await supabase
    .from('projects_v2')
    .select('id, title, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error(error);
    return;
  }

  console.log('Recent Projects:');
  data.forEach(p => console.log(`- ${p.id}: ${p.title} (${p.created_at})`));
}

list();
