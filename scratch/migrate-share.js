const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k) env[k.trim()] = v.join('=').trim();
});

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function migrate() {
  console.log("Starting DB migration for Shareable Links...");
  
  // Create an RPC or raw SQL function to run ALTER TABLE.
  // We can just use the supabase API if we have an RPC, but we probably don't.
  // Instead, we will use a raw SQL execution via postgres or standard REST if possible.
  // Wait, Supabase JS client doesn't support raw SQL easily unless through RPC.
  // Let's try calling `sb.rpc` with an existing function, or just inserting via Prisma/Drizzle if it existed.
  // Since we don't have direct SQL access here, let's try calling a generic RPC if one exists.
  
  // Since this is a restricted environment, maybe the user wants me to do it.
  // Actually, I can just use `pg` package since it's in package.json!
  
  const { Client } = require('pg');
  const connectionString = env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', 'postgres://postgres:').replace('.supabase.co', '.supabase.co:6543/postgres'); 
  // Wait, the password is not in NEXT_PUBLIC_SUPABASE_URL. We don't have the DB password.
  // We cannot run ALTER TABLE without direct DB connection or an existing RPC.
  // Let me check if there's an RPC like 'exec_sql'.
  
  const { error } = await sb.rpc('exec_sql', { sql: `
    ALTER TABLE projects_v2 ADD COLUMN IF NOT EXISTS share_token UUID UNIQUE DEFAULT gen_random_uuid();
    ALTER TABLE projects_v2 ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT false;
  `});
  
  if (error) {
    console.error("RPC exec_sql failed, trying direct pg connection if DB_URL exists...");
    console.log(error);
  } else {
    console.log("Migration successful via RPC!");
  }
}

migrate();
