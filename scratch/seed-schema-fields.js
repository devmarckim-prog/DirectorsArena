const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
env.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim();
});

const { createClient } = require('@supabase/supabase-js');
const sb = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

const DEFAULT_SCHEMA_FIELDS = {
  logline:             { category: 'project',      enabled: true,  label: '로그라인',            type: 'textarea', promptKey: '로그라인',           sourceKey: 'logline',            options: [] },
  genre:               { category: 'project',      enabled: true,  label: '장르',                type: 'select',   promptKey: '장르',               sourceKey: 'genre',              options: ['Noir','Romance','Fantasy','Thriller','Business','Historical','Action','Comedy','Horror','Sci-Fi'] },
  episode_count:       { category: 'project',      enabled: true,  label: '에피소드 수',         type: 'number',   promptKey: '에피소드 수',        sourceKey: 'episodes',           options: [] },
  platform:            { category: 'project',      enabled: true,  label: '타겟 플랫폼',         type: 'select',   promptKey: '타겟 플랫폼',        sourceKey: 'platform',           options: ['tvN','Netflix','Disney+','Watcha','JTBC','KBS','MBC','기타'] },
  setting:             { category: 'project',      enabled: false, label: '시대적 배경',         type: 'text',     promptKey: '시대적 배경',        sourceKey: 'setting',            options: [] },
  tone:                { category: 'project',      enabled: false, label: '톤 / 분위기',         type: 'text',     promptKey: '톤과 분위기',        sourceKey: 'tone',               options: [] },
  target_audience:     { category: 'project',      enabled: false, label: '타겟 시청층',         type: 'text',     promptKey: '타겟 시청층',        sourceKey: 'target_audience',    options: [] },
  reference_works:     { category: 'project',      enabled: false, label: '레퍼런스 작품',       type: 'text',     promptKey: '레퍼런스 작품',      sourceKey: 'reference_works',    options: [] },
  world_setting:       { category: 'project',      enabled: false, label: '세계관 설정',         type: 'textarea', promptKey: '세계관',             sourceKey: 'world_setting',      options: [] },
  special_request:     { category: 'project',      enabled: false, label: '특별 요청 사항',      type: 'textarea', promptKey: '특별 요청 사항',     sourceKey: 'special_request',    options: [] },
  budget_tier:         { category: 'project',      enabled: false, label: '제작 규모',           type: 'select',   promptKey: '제작 규모',          sourceKey: 'budget_tier',        options: ['미니 시리즈','중편','대작','블록버스터'] },
  protagonist_name:    { category: 'character',    enabled: false, label: '주인공 이름',         type: 'text',     promptKey: '주인공 이름',        sourceKey: 'protagonist_name',   options: [] },
  protagonist_age:     { category: 'character',    enabled: false, label: '주인공 나이',         type: 'text',     promptKey: '주인공 나이',        sourceKey: 'protagonist_age',    options: [] },
  protagonist_gender:  { category: 'character',    enabled: false, label: '주인공 성별',         type: 'select',   promptKey: '주인공 성별',        sourceKey: 'protagonist_gender', options: ['남성','여성','논바이너리'] },
  protagonist_job:     { category: 'character',    enabled: false, label: '주인공 직업',         type: 'text',     promptKey: '주인공 직업',        sourceKey: 'protagonist_job',    options: [] },
  protagonist_desire:  { category: 'character',    enabled: false, label: '주인공 욕망 / 동기',  type: 'textarea', promptKey: '주인공이 원하는 것', sourceKey: 'protagonist_desire', options: [] },
  protagonist_trait:   { category: 'character',    enabled: false, label: '주인공 성격 특징',    type: 'text',     promptKey: '주인공 성격',        sourceKey: 'protagonist_trait',  options: [] },
  antagonist_name:     { category: 'relationship', enabled: false, label: '안타고니스트 이름',   type: 'text',     promptKey: '안타고니스트',       sourceKey: 'antagonist_name',    options: [] },
  antagonist_job:      { category: 'relationship', enabled: false, label: '안타고니스트 직업',   type: 'text',     promptKey: '안타고니스트 직업',  sourceKey: 'antagonist_job',     options: [] },
  key_relationship:    { category: 'relationship', enabled: false, label: '핵심 인물 관계',      type: 'textarea', promptKey: '핵심 인물 관계 구도', sourceKey: 'key_relationship',  options: [] },
  love_interest_name:  { category: 'relationship', enabled: false, label: '로맨스 상대 이름',    type: 'text',     promptKey: '로맨스 상대',        sourceKey: 'love_interest_name', options: [] },
};

async function main() {
  console.log('🔧 admin_settings에 schema_fields 데이터 주입...');
  const { data: existing, error: fetchErr } = await sb.from('admin_settings').select('id').limit(1).single();

  if (fetchErr && fetchErr.code !== 'PGRST116') {
    console.log('❌ Fetch error:', fetchErr.message); return;
  }

  let res;
  if (existing) {
    res = await sb.from('admin_settings').update({ schema_fields: DEFAULT_SCHEMA_FIELDS }).eq('id', existing.id);
    console.log('   업데이트 대상 ID:', existing.id);
  } else {
    res = await sb.from('admin_settings').insert({ schema_fields: DEFAULT_SCHEMA_FIELDS });
    console.log('   신규 레코드 삽입');
  }

  if (res.error) { console.log('❌ Save error:', res.error.message); return; }

  // 검증
  const { data: v } = await sb.from('admin_settings').select('schema_fields').limit(1).single();
  if (v?.schema_fields) {
    const keys = Object.keys(v.schema_fields);
    console.log('✅ 완료! 총', keys.length, '개 필드 저장됨');
    console.log('   활성 필드:', keys.filter(k => v.schema_fields[k].enabled).join(', '));
  } else {
    console.log('❌ 저장 후 검증 실패 - schema_fields 컬럼이 없습니다. Supabase SQL Editor에서 ALTER TABLE을 먼저 실행하세요.');
  }
}
main().catch(console.error);
