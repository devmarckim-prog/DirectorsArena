const fs = require('fs');
const path = require('path');

// ── 1. admin.ts: DEFAULT_SCHEMA_FIELDS 교체 ──────────────────────────────
const adminPath = path.resolve('lib/actions/admin.ts');
let adminContent = fs.readFileSync(adminPath, 'utf8');

const newFields = `// ─── Claude 프롬프트 주입 필드 ─────────────────────────────────────────────
// enabled: true → Claude userPrompt에 해당 값이 구조화된 형태로 포함됨
// promptKey: 프롬프트에 삽입될 레이블 (한국어)
// sourceKey: project 레코드 또는 synopsis.formData에서 값을 가져오는 키
const DEFAULT_SCHEMA_FIELDS = {
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

// Find and replace the DEFAULT_SCHEMA_FIELDS block
const startMarker = '// ─── Schema Field Default Config';
const endMarker = '};';

const startIdx = adminContent.indexOf(startMarker);
if (startIdx === -1) {
  console.error('❌ Cannot find start marker in admin.ts');
  process.exit(1);
}
// Find the closing '};' after the start marker
const endIdx = adminContent.indexOf('\n};\n', startIdx);
if (endIdx === -1) {
  console.error('❌ Cannot find end marker in admin.ts');
  process.exit(1);
}

adminContent = adminContent.slice(0, startIdx) + newFields + adminContent.slice(endIdx + 4);
fs.writeFileSync(adminPath, adminContent, 'utf8');
console.log('✅ admin.ts DEFAULT_SCHEMA_FIELDS updated');

// ── 2. ignite/route.ts: userPrompt를 schema_fields 기반으로 동적 생성 ──
const routePath = path.resolve('app/api/ignite/[id]/route.ts');
let routeContent = fs.readFileSync(routePath, 'utf8');

const oldUserPrompt = `    const steerPrompt = project.steer_prompt || "";
    const userPrompt = steerPrompt 
      ? \`다음 지시사항을 반영하여 프로젝트를 재생성하십시오: "\${steerPrompt}"\\n\\n기존 로그라인: "\${project.logline || ''}"\`
      : \`로그라인: "\${project.logline || ''}" 기반으로 프로젝트를 시네마틱하게 생성하십시오.\`;`;

const newUserPrompt = `    // v7.1: 어드민 schema_fields를 읽어 활성화된 필드만 userPrompt에 주입
    const { data: adminSchemaRow } = await supabase
      .from('admin_settings')
      .select('schema_fields')
      .limit(1)
      .single();

    const schemaFields: Record<string, any> = adminSchemaRow?.schema_fields || {};

    // project 레코드 + synopsis.formData에서 값 추출
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
    }

    const structuredContext = injectedLines.length > 0
      ? \`\\n\\n[프로젝트 구조화 정보]\\n\${injectedLines.join('\\n')}\`
      : '';

    const steerPrompt = project.steer_prompt || "";
    const userPrompt = steerPrompt
      ? \`다음 지시사항을 반영하여 프로젝트를 재생성하십시오: "\${steerPrompt}"\${structuredContext}\`
      : \`아래 정보를 바탕으로 시네마틱한 드라마/영화 프로젝트를 생성하십시오.\${structuredContext}\`;`;

if (!routeContent.includes('const steerPrompt = project.steer_prompt')) {
  console.error('❌ Cannot find steerPrompt block in route.ts');
  process.exit(1);
}

routeContent = routeContent.replace(oldUserPrompt, newUserPrompt);
fs.writeFileSync(routePath, routeContent, 'utf8');

const check = routeContent.includes('schema_fields') && routeContent.includes('structuredContext');
console.log('✅ ignite/route.ts dynamic userPrompt injected:', check);
