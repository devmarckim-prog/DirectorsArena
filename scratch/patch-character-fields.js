const fs = require('fs');
const path = require('path');

// ── admin.ts: 캐릭터 필드 추가 ────────────────────────────────────────────
const adminPath = path.resolve('lib/actions/admin.ts');
let content = fs.readFileSync(adminPath, 'utf8');

const oldBlock = `const DEFAULT_SCHEMA_FIELDS = {
  logline:          { enabled: true,  label: '로그라인',         type: 'textarea', promptKey: '로그라인',       sourceKey: 'logline',          options: [] },
  genre:            { enabled: true,  label: '장르',             type: 'select',   promptKey: '장르',           sourceKey: 'genre',            options: ['Noir', 'Romance', 'Fantasy', 'Thriller', 'Business', 'Historical', 'Action', 'Comedy', 'Horror', 'Sci-Fi'] },
  episode_count:    { enabled: true,  label: '에피소드 수',      type: 'number',   promptKey: '에피소드 수',    sourceKey: 'episodes',         options: [] },
  platform:         { enabled: true,  label: '타겟 플랫폼',      type: 'select',   promptKey: '타겟 플랫폼',    sourceKey: 'platform',         options: ['tvN', 'Netflix', 'Disney+', 'Watcha', 'JTBC', 'KBS', 'MBC', '기타'] },
  protagonist_name: { enabled: false, label: '주인공 이름',      type: 'text',     promptKey: '주인공 이름',    sourceKey: 'protagonist_name', options: [] },
  setting:          { enabled: false, label: '시대적 배경',      type: 'text',     promptKey: '시대적 배경',    sourceKey: 'setting',          options: [] },
  tone:             { enabled: false, label: '톤 / 분위기',      type: 'text',     promptKey: '톤과 분위기',    sourceKey: 'tone',             options: [] },
  target_audience:  { enabled: false, label: '타겟 시청층',      type: 'text',     promptKey: '타겟 시청층',    sourceKey: 'target_audience',  options: [] },
  reference_works:  { enabled: false, label: '레퍼런스 작품',    type: 'text',     promptKey: '레퍼런스 작품',  sourceKey: 'reference_works',  options: [] },
  special_request:  { enabled: false, label: '특별 요청 사항',   type: 'textarea', promptKey: '특별 요청 사항', sourceKey: 'special_request',  options: [] },
  world_setting:    { enabled: false, label: '세계관 설정',      type: 'textarea', promptKey: '세계관',         sourceKey: 'world_setting',    options: [] },
  budget_tier:      { enabled: false, label: '제작 규모',        type: 'select',   promptKey: '제작 규모',      sourceKey: 'budget_tier',      options: ['미니 시리즈', '중편', '대작', '블록버스터'] },
};`;

const newBlock = `const DEFAULT_SCHEMA_FIELDS = {
  // ── 프로젝트 기본 ──────────────────────────────────────────────
  logline:             { category: 'project',   enabled: true,  label: '로그라인',           type: 'textarea', promptKey: '로그라인',         sourceKey: 'logline',            options: [] },
  genre:               { category: 'project',   enabled: true,  label: '장르',               type: 'select',   promptKey: '장르',             sourceKey: 'genre',              options: ['Noir', 'Romance', 'Fantasy', 'Thriller', 'Business', 'Historical', 'Action', 'Comedy', 'Horror', 'Sci-Fi'] },
  episode_count:       { category: 'project',   enabled: true,  label: '에피소드 수',        type: 'number',   promptKey: '에피소드 수',      sourceKey: 'episodes',           options: [] },
  platform:            { category: 'project',   enabled: true,  label: '타겟 플랫폼',        type: 'select',   promptKey: '타겟 플랫폼',      sourceKey: 'platform',           options: ['tvN', 'Netflix', 'Disney+', 'Watcha', 'JTBC', 'KBS', 'MBC', '기타'] },
  setting:             { category: 'project',   enabled: false, label: '시대적 배경',        type: 'text',     promptKey: '시대적 배경',      sourceKey: 'setting',            options: [] },
  tone:                { category: 'project',   enabled: false, label: '톤 / 분위기',        type: 'text',     promptKey: '톤과 분위기',      sourceKey: 'tone',               options: [] },
  target_audience:     { category: 'project',   enabled: false, label: '타겟 시청층',        type: 'text',     promptKey: '타겟 시청층',      sourceKey: 'target_audience',    options: [] },
  reference_works:     { category: 'project',   enabled: false, label: '레퍼런스 작품',      type: 'text',     promptKey: '레퍼런스 작품',    sourceKey: 'reference_works',    options: [] },
  world_setting:       { category: 'project',   enabled: false, label: '세계관 설정',        type: 'textarea', promptKey: '세계관',           sourceKey: 'world_setting',      options: [] },
  special_request:     { category: 'project',   enabled: false, label: '특별 요청 사항',     type: 'textarea', promptKey: '특별 요청 사항',   sourceKey: 'special_request',    options: [] },
  budget_tier:         { category: 'project',   enabled: false, label: '제작 규모',          type: 'select',   promptKey: '제작 규모',        sourceKey: 'budget_tier',        options: ['미니 시리즈', '중편', '대작', '블록버스터'] },
  // ── 주인공 설정 ──────────────────────────────────────────────
  protagonist_name:    { category: 'character', enabled: false, label: '주인공 이름',        type: 'text',     promptKey: '주인공 이름',      sourceKey: 'protagonist_name',   options: [] },
  protagonist_age:     { category: 'character', enabled: false, label: '주인공 나이',        type: 'text',     promptKey: '주인공 나이',      sourceKey: 'protagonist_age',    options: [] },
  protagonist_gender:  { category: 'character', enabled: false, label: '주인공 성별',        type: 'select',   promptKey: '주인공 성별',      sourceKey: 'protagonist_gender', options: ['남성', '여성', '논바이너리'] },
  protagonist_job:     { category: 'character', enabled: false, label: '주인공 직업',        type: 'text',     promptKey: '주인공 직업',      sourceKey: 'protagonist_job',    options: [] },
  protagonist_desire:  { category: 'character', enabled: false, label: '주인공 욕망 / 동기', type: 'textarea', promptKey: '주인공이 원하는 것', sourceKey: 'protagonist_desire', options: [] },
  protagonist_trait:   { category: 'character', enabled: false, label: '주인공 성격 특징',   type: 'text',     promptKey: '주인공 성격',      sourceKey: 'protagonist_trait',  options: [] },
  // ── 주요 인물 관계 ─────────────────────────────────────────────
  antagonist_name:     { category: 'relationship', enabled: false, label: '안타고니스트 이름', type: 'text',     promptKey: '안타고니스트',     sourceKey: 'antagonist_name',    options: [] },
  antagonist_job:      { category: 'relationship', enabled: false, label: '안타고니스트 직업', type: 'text',     promptKey: '안타고니스트 직업', sourceKey: 'antagonist_job',    options: [] },
  key_relationship:    { category: 'relationship', enabled: false, label: '핵심 인물 관계',   type: 'textarea', promptKey: '핵심 인물 관계 구도', sourceKey: 'key_relationship',  options: [] },
  love_interest_name:  { category: 'relationship', enabled: false, label: '로맨스 상대 이름', type: 'text',     promptKey: '로맨스 상대',      sourceKey: 'love_interest_name', options: [] },
};`;

if (!content.includes('const DEFAULT_SCHEMA_FIELDS')) {
  console.error('❌ DEFAULT_SCHEMA_FIELDS block not found');
  process.exit(1);
}

content = content.replace(oldBlock, newBlock);
fs.writeFileSync(adminPath, content, 'utf8');

const ok = content.includes('protagonist_name') && content.includes('antagonist_name') && content.includes("category: 'character'");
console.log('✅ admin.ts character fields added:', ok);

// ── ignite/route.ts: characters_v2에서 캐릭터 필드 값 읽기 추가 ──────────
const routePath = path.resolve('app/api/ignite/[id]/route.ts');
let routeContent = fs.readFileSync(routePath, 'utf8');

const oldSource = `    // project 레코드 + synopsis.formData에서 값 추출
    let formDataSeed: Record<string, any> = {};
    try {
      const synObj = typeof project.synopsis === 'string' ? JSON.parse(project.synopsis) : project.synopsis;
      formDataSeed = synObj?.formData || {};
    } catch {}

    // 활성화된 필드만 골라 "- 레이블: 값" 형태로 구성
    const injectedLines: string[] = [];
    for (const [key, field] of Object.entries(schemaFields)) {
      if (!field.enabled) continue;
      const val =
        project[field.sourceKey] ??         // 1순위: project 직접 컬럼
        formDataSeed[field.sourceKey] ??    // 2순위: synopsis.formData
        formDataSeed[key] ??                // 3순위: formData에 key 직접
        '';
      if (val !== '' && val !== null && val !== undefined) {
        injectedLines.push(\`- \${field.promptKey}: \${val}\`);
      }
    }`;

const newSource = `    // project 레코드 + synopsis.formData에서 값 추출
    let formDataSeed: Record<string, any> = {};
    try {
      const synObj = typeof project.synopsis === 'string' ? JSON.parse(project.synopsis) : project.synopsis;
      formDataSeed = synObj?.formData || {};
    } catch {}

    // characters_v2에서 주인공(첫 번째) 데이터 추출 (캐릭터 필드 소스)
    const { data: chars } = await supabase
      .from('characters_v2')
      .select('name, age, gender, job, desire, traits, relationship_to_protagonist')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })
      .limit(10);

    const protagonist = chars?.[0];
    const antagonist = chars?.[1];
    const charSeed: Record<string, any> = {
      protagonist_name:   protagonist?.name || '',
      protagonist_age:    protagonist?.age || '',
      protagonist_gender: protagonist?.gender || '',
      protagonist_job:    protagonist?.job || '',
      protagonist_desire: protagonist?.desire || '',
      protagonist_trait:  Array.isArray(protagonist?.traits) ? protagonist.traits.join(', ') : (protagonist?.traits || ''),
      antagonist_name:    antagonist?.name || '',
      antagonist_job:     antagonist?.job || '',
      key_relationship:   chars?.slice(0, 3).map((c: any) => \`\${c.name}(\${c.relationship_to_protagonist || '주요인물'})\`).join(', ') || '',
      love_interest_name: chars?.find((c: any) => c.relationship_to_protagonist?.includes('romantic') || c.relationship_to_protagonist?.includes('연인'))?.name || '',
    };

    // 활성화된 필드만 골라 "- 레이블: 값" 형태로 구성
    const injectedLines: string[] = [];
    for (const [key, field] of Object.entries(schemaFields)) {
      if (!field.enabled) continue;
      const val =
        charSeed[key] ??                    // 0순위: characters_v2 (캐릭터 카테고리)
        project[field.sourceKey] ??         // 1순위: project 직접 컬럼
        formDataSeed[field.sourceKey] ??    // 2순위: synopsis.formData
        formDataSeed[key] ??                // 3순위: formData에 key 직접
        '';
      if (val !== '' && val !== null && val !== undefined) {
        injectedLines.push(\`- \${field.promptKey}: \${val}\`);
      }
    }`;

if (!routeContent.includes('// project 레코드 + synopsis.formData에서 값 추출')) {
  console.error('❌ Source block not found in route.ts');
  process.exit(1);
}

routeContent = routeContent.replace(oldSource, newSource);
fs.writeFileSync(routePath, routeContent, 'utf8');

const routeOk = routeContent.includes('characters_v2') && routeContent.includes('charSeed');
console.log('✅ ignite/route.ts character DB lookup added:', routeOk);
