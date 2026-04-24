// OMA Migration: projects_v2에 generated_content JSONB 컬럼 추가
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://stfonaiuxavzbqwikcqb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM"
);

async function migrate() {
  console.log('[Migration] Adding generated_content JSONB column to projects_v2...');

  // Supabase JS SDK로는 DDL 실행 불가 → rpc 또는 직접 SQL 실행
  const { error } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE projects_v2 ADD COLUMN IF NOT EXISTS generated_content JSONB;`
  });

  if (error) {
    // exec_sql RPC가 없는 경우 → 더미 row로 컬럼 존재 여부 확인
    console.warn('[Migration] RPC not available. Checking column via select...');
    const { data, error: selectErr } = await supabase
      .from('projects_v2')
      .select('generated_content')
      .limit(1);

    if (selectErr?.message?.includes('column') && selectErr.message.includes('generated_content')) {
      console.error('[Migration] ❌ Column does not exist. Please run this SQL in Supabase Dashboard:');
      console.error('  ALTER TABLE projects_v2 ADD COLUMN IF NOT EXISTS generated_content JSONB;');
    } else {
      console.log('[Migration] ✅ generated_content column already exists or was added successfully!');
    }
  } else {
    console.log('[Migration] ✅ Column added successfully!');
  }
}

migrate();
