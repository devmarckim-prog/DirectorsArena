const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function check() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  });

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  
  console.log('--- Checking Content of similar_contents ---');
  
  const { data, error } = await supabase.from('similar_contents').select('*');
  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log('Count:', data.length);
    if (data.length > 0) {
      console.log('Sample Row:', JSON.stringify(data[0], null, 2));
    }
  }
}

check();
