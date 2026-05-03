const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
env.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim();
});

const { createClient } = require('@supabase/supabase-js');
const sb = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

// 최신 DEFAULT_SCHEMA_FIELDS (category + promptKey + sourceKey 포함)
const DEFAULT_SCHEMA_FIELDS = {
  // ── 프로젝트 기본
  logline:             { category: 'project',      enabled: true,  label: '로그라인',            type: 'textarea', promptKey: '로그라인',          sourceKey: 'logline',            options: [] },
  genre:               { category: 'project',      enabled: true,  label: '장르',                type: 'select',   promptKey: '장르',              sourceKey: 'genre',              options: ['Noir','Romance','Fantasy','Thriller','Business','Historical','Action','Comedy','Horror','Sci-Fi'] },
  episode_count:       { category: 'project',      enabled: true,  label: '에피소드 수',         type: 'number',   promptKey: '에피소드 수',       sourceKey: 'episodes',           options: [] },
  platform:            { category: 'project',      enabled: true,  label: '타겟 플랫폼',         type: 'select',   promptKey: '타겟 플랫폼',       sourceKey: 'platform',           options: ['tvN','Netflix','Disney+','Watcha','JTBC','KBS','MBC','기타'] },
  setting:             { category: 'project',      enabled: false, label: '시대적 배경',         type: 'text',     promptKey: '시대적 배경',       sourceKey: 'setting',            options: [] },
  tone:                { category: 'project',      enabled: false, label: '톤 / 분위기',         type: 'text',     promptKey: '톤과 분위기',       sourceKey: 'tone',               options: [] },
  target_audience:     { category: 'project',      enabled: false, label: '타겟 시청층',         type: 'text',     promptKey: '타겟 시청층',       sourceKey: 'target_audience',    options: [] },
  reference_works:     { category: 'project',      enabled: false, label: '레퍼런스 작품',       type: 'text',     promptKey: '레퍼런스 작품',     sourceKey: 'reference_works',    options: [] },
  world_setting:       { category: 'project',      enabled: false, label: '세계관 설정',         type: 'textarea', promptKey: '세계관',            sourceKey: 'world_setting',      options: [] },
  special_request:     { category: 'project',      enabled: false, label: '특별 요청 사항',      type: 'textarea', promptKey: '특별 요청 사항',    sourceKey: 'special_request',    options: [] },
  budget_tier:         { category: 'project',      enabled: false, label: '제작 규모',           type: 'select',   promptKey: '제작 규모',         sourceKey: 'budget_tier',        options: ['미니 시리즈','중편','대작','블록버스터'] },
  // ── 주인공 설정
  protagonist_name:    { category: 'character',    enabled: false, label: '주인공 이름',         type: 'text',     promptKey: '주인공 이름',       sourceKey: 'protagonist_name',   options: [] },
  protagonist_age:     { category: 'character',    enabled: false, label: '주인공 나이',         type: 'text',     promptKey: '주인공 나이',       sourceKey: 'protagonist_age',    options: [] },
  protagonist_gender:  { category: 'character',    enabled: false, label: '주인공 성별',         type: 'select',   promptKey: '주인공 성별',       sourceKey: 'protagonist_gender', options: ['남성','여성','논바이너리'] },
  protagonist_job:     { category: 'character',    enabled: false, label: '주인공 직업',         type: 'text',     promptKey: '주인공 직업',       sourceKey: 'protagonist_job',    options: [] },
  protagonist_desire:  { category: 'character',    enabled: false, label: '주인공 욕망 / 동기',  type: 'textarea', promptKey: '주인공이 원하는 것', sourceKey: 'protagonist_desire', options: [] },
  protagonist_trait:   { category: 'character',    enabled: false, label: '주인공 성격 특징',    type: 'text',     promptKey: '주인공 성격',       sourceKey: 'protagonist_trait',  options: [] },
  // ── 인물 관계
  antagonist_name:     { category: 'relationship', enabled: false, label: '안타고니스트 이름',   type: 'text',     promptKey: '안타고니스트',      sourceKey: 'antagonist_name',    options: [] },
  antagonist_job:      { category: 'relationship', enabled: false, label: '안타고니스트 직업',   type: 'text',     promptKey: '안타고니스트 직업', sourceKey: 'antagonist_job',     options: [] },
  key_relationship:    { category: 'relationship', enabled: false, label: '핵심 인물 관계',      type: 'textarea', promptKey: '핵심 인물 관계 구도', sourceKey: 'key_relationship',  options: [] },
  love_interest_name:  { category: 'relationship', enabled: false, label: '로맨스 상대 이름',    type: 'text',     promptKey: '로맨스 상대',       sourceKey: 'love_interest_name', options: [] },
};

async function main() {
  console.log('🔧 Step 1: admin_settings 테이블에 schema_fields 컬럼 추가...');
  
  // Supabase REST API로 직접 컬럼 추가 (RPC 사용)
  const { error: rpcError } = await sb.rpc('exec_sql', {
    sql: `ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS schema_fields JSONB;`
  });
  
  if (rpcError) {
    // RPC 없으면 직접 upsert로 처리 (컬럼이 없어도 JSONB upsert 가능)
    console.log('   RPC not available, trying direct upsert...');
  } else {
    console.log('   ✅ schema_fields 컬럼 추가 성공');
  }

  console.log('\n🔧 Step 2: 기존 admin_settings 레코드에 schema_fields 주입...');
  const { data: existing } = await sb.from('admin_settings').select('id').limit(1).single();
  
  let result;
  if (existing) {
    result = await sb.from('admin_settings')
      .update({ schema_fields: DEFAULT_SCHEMA_FIELDS })
      .eq('id', existing.id);
    console.log('   ✅ 기존 레코드 업데이트:', existing.id);
  } else {
    result = await sb.from('admin_settings').insert({ schema_fields: DEFAULT_SCHEMA_FIELDS });
    console.log('   ✅ 신규 레코드 삽입');
  }

  if (result.error) {
    console.log('   ❌ Error:', result.error.message);
    console.log('   → 수동으로 Supabase 대시보드에서 schema_fields JSONB 컬럼 추가 필요');
  }

  console.log('\n🔧 Step 3: DB 저장 검증...');
  const { data: verify, error: vErr } = await sb
    .from('admin_settings')
    .select('schema_fields')
    .limit(1)
    .single();

  if (vErr) {
    console.log('   ❌ 검증 실패:', vErr.message);
    console.log('\n⚠️  Supabase 대시보드에서 admin_settings 테이블에 schema_fields (type: jsonb) 컬럼을 수동 추가하세요.');
  } else if (verify?.schema_fields) {
    const keys = Object.keys(verify.schema_fields);
    console.log('   ✅ 검증 성공! 총', keys.length, '개 필드 저장됨');
    const enabled = keys.filter(k => verify.schema_fields[k].enabled);
    console.log('   활성화된 필드:', enabled.join(', '));
  } else {
    console.log('   ❌ schema_fields가 여전히 null — 컬럼이 DB에 없습니다.');
    console.log('\n📋 Supabase SQL Editor에서 아래 쿼리를 실행하세요:');
    console.log('ALTER TABLE admin_settings ADD COLUMN IF NOT EXISTS schema_fields JSONB;');
  }
}

main().catch(console.error);
