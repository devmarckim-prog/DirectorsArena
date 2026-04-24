const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase
    .from('projects_v2')
    .select('id, title, logline, status, progress, created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  console.log('Project ID:', data.id);
  console.log('Final Title:', data.title);
  console.log('Logline:', data.logline);
  console.log('Status:', data.status, 'Progress:', data.progress);
}

check();
