const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://stfonaiuxavzbqwikcqb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'MASKED';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verify() {
  console.log('--- DB 무결성 자체 검증 시작 (Self-QA) ---');
  
  const { data: projects, error } = await supabase
    .from('projects_v2')
    .select('id, title, is_sample, synopsis')
    .eq('is_sample', true);

  if (error) {
    console.error('❌ DB 조회 에러:', error.message);
    process.exit(1);
  }

  console.log(`조회된 샘플 개수: ${projects.length}`);

  if (projects.length === 2) {
    console.log('✅ 2 Samples Confirmed');
  } else {
    console.error('❌ Samples Mismatch: Expected 2, found ' + projects.length);
  }

  projects.forEach((p, i) => {
    console.log(`\n[Sample ${i + 1}] Title: ${p.title}`);
    try {
      const syn = JSON.parse(p.synopsis);
      console.log('   - Synopsis Parsing: SUCCESS');
      if (syn.characters && syn.budgetEstimate) {
        console.log('   - Metadata Specification: FULL-SPEC CONFIRMED');
      } else {
        console.warn('   - Metadata Specification: PARTIAL (Missing characters or budget)');
      }
    } catch (e) {
      console.error('   - Synopsis Parsing: FAILED');
    }
  });

  console.log('\n--- 검증 완료 ---');
}

verify()
  .then(() => console.log('✔ Verification Finished'))
  .catch(err => {
    console.error('❌ Critical Verification Error:', err);
    process.exit(1);
  });
