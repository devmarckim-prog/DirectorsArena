const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function migrate() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  });

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  
  console.log('--- Migrating similar_contents ---');
  
  const sql = `
    ALTER TABLE similar_contents ADD COLUMN IF NOT EXISTS poster_path TEXT;
    ALTER TABLE similar_contents ADD COLUMN IF NOT EXISTS vote_average DECIMAL(3, 1);
    ALTER TABLE similar_contents ADD COLUMN IF NOT EXISTS release_date TEXT;
    ALTER TABLE similar_contents ADD COLUMN IF NOT EXISTS genres TEXT[];
    ALTER TABLE similar_contents ADD COLUMN IF NOT EXISTS media_type TEXT;
  `;

  const { error } = await supabase.rpc('exec_sql', { sql });
  if (error) {
    console.error('❌ Migration Error:', error.message);
    console.log('\n[PLAN B] Trying manual ALTER TABLE if RPC is limited...');
    // Some RPCs only allow one statement or have specific permissions.
  } else {
    console.log('✅ Migration Successful!');
  }
}

migrate();
