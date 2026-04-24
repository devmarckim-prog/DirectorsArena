const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function check() {
  const env = {};
  fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  });

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  
  console.log('--- Checking similar_contents Columns ---');
  
  // Try to insert a dummy row and catch the error to see expected columns
  const { data, error } = await supabase.from('similar_contents').insert({}).select();
  if (error) {
    console.log('Error Message:', error.message);
    console.log('Error Hint:', error.hint);
    console.log('Error Details:', error.details);
  }
}

check();
