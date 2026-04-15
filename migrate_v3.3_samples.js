const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres.stfonaiuxavzbqwikcqb:77!!supabasee@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres"
});

const sql = `
  ALTER TABLE projects_v2 
  ADD COLUMN IF NOT EXISTS is_sample BOOLEAN DEFAULT FALSE;
`;

async function runMigration() {
  try {
    await client.connect();
    console.log("Connected to DB. Running is_sample Migration...");
    await client.query(sql);
    console.log("Migration successful! is_sample added to projects_v2.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
  }
}

runMigration();
