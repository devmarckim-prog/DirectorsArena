const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const envPath = path.resolve('.env.local');
  const envConfig = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envConfig.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals) env[key.trim()] = vals.join('=').trim();
  });

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  
  console.log('--- Initializing v3.3 Core Migration ---');
  
  const sql = fs.readFileSync(path.join('scratch', 'migrate-v3.3-core.sql'), 'utf8');

  console.log('Executing SQL via RPC...');
  const { error } = await supabase.rpc('exec_sql', { sql });
  
  if (error) {
    console.error('❌ Migration Error:', error.message);
    process.exit(1);
  } else {
    console.log('✅ Migration Successful!');
  }
}

migrate();
