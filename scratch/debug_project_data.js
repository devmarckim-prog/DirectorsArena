const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase
    .from('projects_v2')
    .select('id, title, synopsis, generated_content, status, progress')
    .eq('id', 'd5cef2c4-f560-4933-8294-2a4440a4e5e4')
    .single();

  if (error) {
    console.error(error);
    return;
  }

  console.log('Project Status:', data.status, 'Progress:', data.progress);
  console.log('Synopsis (first 500 chars):', data.synopsis?.substring(0, 500));
  console.log('Generated Content Keys:', Object.keys(data.generated_content || {}));
}

check();
