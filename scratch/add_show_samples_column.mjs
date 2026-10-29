import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.stfonaiuxavzbqwikcqb:77!!supabasee@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres";

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Successfully connected to remote Supabase Postgres DB!');

    const sql = "ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS show_samples BOOLEAN DEFAULT true;";
    await client.query(sql);
    console.log('Successfully added show_samples column to admin_settings!');

  } catch (err) {
    console.error('Failed to add column:', err);
  } finally {
    await client.end();
  }
}

run();
