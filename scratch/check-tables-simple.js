const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function check() {
  const env = {};
  fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  });

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  
  console.log('--- Checking Tables ---');
  
  // Try common table names
  const tables = ['similar_contents', 'similar_works', 'similar_works_v2', 'comparables', 'comps'];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('id').limit(1);
    if (error) {
      console.log(`❌ ${t}: ${error.message}`);
    } else {
      console.log(`✅ ${t}: Found!`);
    }
  }

  // Also check projects_v2 columns
  const { data: proj, error: pErr } = await supabase.from('projects_v2').select('*').limit(1);
  if (proj && proj[0]) {
    console.log('\n--- projects_v2 columns ---');
    console.log(Object.keys(proj[0]).join(', '));
  }
}

check();
