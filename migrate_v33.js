const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const sql = `
  ALTER TABLE admin_settings 
  ADD COLUMN IF NOT EXISTS prompt_scenario_rewrite TEXT DEFAULT '당신은 메인 작가를 보조하는 뛰어난 보조 작가입니다. 주어진 원본 텍스트와 주변 문맥을 파악한 뒤, 작가의 [요구사항]에 맞게 원본 텍스트를 정확히 재작성하십시오. 다른 부연 설명이나 인사말 없이 오직 수정된 텍스트만 출력하십시오.';
`;

async function runMigration() {
  try {
    await client.connect();
    console.log("Connected to DB. Running V3.3 Migration...");
    await client.query(sql);
    console.log("Migration successful! prompt_scenario_rewrite added to admin_settings.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
  }
}

runMigration();
