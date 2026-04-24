const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function restoreDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

  console.log('--- 🚀 Directors Arena Database Restoration Tool (v1.0) ---');
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Since we have the Management Token (sbp_), we can't directly use it with supabase-js
  // But we can use it to potentially call the management API.
  // HOWEVER, the Service Role Key might already be enough if we had exec_sql.
  // If exec_sql is missing, we will attempt to "guess" if we can create it.
  
  const migrationSql = fs.readFileSync('scratch/migrate-v3.3-core.sql', 'utf8');

  console.log('--- Phase 1: Checking for exec_sql RPC ---');
  
  try {
    const { data: rpcCheck, error: rpcError } = await supabase.rpc('exec_sql', { sql_query: 'SELECT 1' });
    
    if (rpcError && rpcError.message.includes('function "exec_sql" does not exist')) {
      console.warn('⚠️ exec_sql function is missing. Manual intervention required via SQL Editor or CLI.');
      console.log('--- Manual SQL to run in Supabase Dashboard (SQL Editor) ---');
      console.log(migrationSql);
    } else {
      console.log('✅ exec_sql detected. Running migration...');
      const { data, error } = await supabase.rpc('exec_sql', { sql_query: migrationSql });
      if (error) throw error;
      console.log('🎉 Migration successful!');
    }
  } catch (err) {
    console.error('❌ Restoration failed:', err.message);
  }
}

restoreDatabase();
