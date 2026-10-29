import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

const connectionString = "postgresql://postgres.stfonaiuxavzbqwikcqb:77!!supabasee@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres";

const migrations = [
  'supabase/migrations/20240503_auth_and_credits.sql',
  'supabase/migrations/20240505_update_grant_rpc.sql',
  'supabase/migrations/20240505_update_welcome_bonus.sql'
];

async function run() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Successfully connected to remote Supabase Postgres DB!');

    for (const migrationFile of migrations) {
      console.log(`\n--- Running migration: ${migrationFile} ---`);
      const filePath = path.resolve(migrationFile);
      const sql = fs.readFileSync(filePath, 'utf8');

      // Execute SQL
      await client.query(sql);
      console.log(`Success: ${migrationFile} executed.`);
    }

    console.log('\n=========================================');
    console.log('All migrations executed successfully!');
    console.log('Your database is now fully populated with tables, functions, and triggers.');
    console.log('=========================================');

  } catch (err) {
    console.error('Migration execution failed:', err);
  } finally {
    await client.end();
  }
}

run();
