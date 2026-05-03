const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
env.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim();
});

const { createClient } = require('@supabase/supabase-js');
const sb = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  // 현재 DB 상태 확인
  const { data } = await sb.from('admin_settings').select('id, model_id_fast, model_id_quality').limit(1).single();
  if (!data) { console.log('❌ admin_settings 레코드 없음'); return; }
  
  console.log('현재 model_id_fast:', data.model_id_fast);
  console.log('현재 model_id_quality:', data.model_id_quality);

  const VALID_MAP = {
    'claude-sonnet-3-5': 'claude-3-5-sonnet-latest',
    'claude-haiku-3-5': 'claude-3-5-haiku-20241022',
    'claude-opus-3': 'claude-3-opus-20240229',
    'claude-sonnet-4-6': 'claude-sonnet-4-5',
    'claude-opus-4-5': 'claude-opus-4-5',    // 유효
    'claude-3-5-sonnet-latest': 'claude-3-5-sonnet-latest', // 유효
    'claude-3-5-sonnet-20241022': 'claude-3-5-sonnet-20241022', // 유효
  };

  const fixes = {};
  if (data.model_id_fast && VALID_MAP[data.model_id_fast]) {
    fixes.model_id_fast = VALID_MAP[data.model_id_fast];
  }
  if (data.model_id_quality && VALID_MAP[data.model_id_quality]) {
    fixes.model_id_quality = VALID_MAP[data.model_id_quality];
  }

  if (Object.keys(fixes).length === 0) {
    console.log('✅ 모델 ID 모두 유효합니다. 수정 불필요.');
    return;
  }

  console.log('🔧 수정할 값:', fixes);
  const { error } = await sb.from('admin_settings').update(fixes).eq('id', data.id);
  if (error) {
    console.log('❌ 업데이트 실패:', error.message);
  } else {
    console.log('✅ DB 모델 ID 수정 완료!');
    console.log('   model_id_fast:', fixes.model_id_fast || data.model_id_fast, '(유지)');
  }
}
main().catch(console.error);
