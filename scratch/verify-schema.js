const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  "https://stfonaiuxavzbqwikcqb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM"
);

async function verifySchema() {
  console.log('=== OMA Schema Verification ===\n');

  // 1. generated_content 컬럼 확인
  const { data: gcTest, error: gcErr } = await supabase
    .from('projects_v2')
    .select('id, generated_content')
    .limit(1);
  
  if (gcErr?.message?.includes('generated_content')) {
    console.log('❌ generated_content 컬럼: 미존재');
  } else {
    console.log('✅ generated_content 컬럼: 존재 확인');
  }

  // 2. story_beats_v2 테이블 확인
  const { data: sbTest, error: sbErr } = await supabase
    .from('story_beats_v2')
    .select('id')
    .limit(1);
  
  if (sbErr?.message?.includes('relation') || sbErr?.message?.includes('table')) {
    console.log('❌ story_beats_v2 테이블: 미존재');
  } else {
    console.log('✅ story_beats_v2 테이블: 존재 확인');
  }

  // 3. api_usage_logs 테이블 확인
  const { data: alTest, error: alErr } = await supabase
    .from('api_usage_logs')
    .select('id')
    .limit(1);
  
  if (alErr?.message?.includes('relation') || alErr?.message?.includes('table')) {
    console.log('❌ api_usage_logs 테이블: 미존재');
  } else {
    console.log('✅ api_usage_logs 테이블: 존재 확인');
  }

  console.log('\n=== 완료 ===');
}

verifySchema();
