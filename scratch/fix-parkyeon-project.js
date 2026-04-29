const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].trim();
});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const systemPrompt = `당신은 영화/드라마 시나리오 전문가입니다.
대본이나 시나리오 설명을 입력받아, 등장인물을 JSON 배열로 추출하고 전체 프로젝트를 구성합니다.

[출력 규칙]
- 반드시 JSON 형식으로만 응답하세요.
- 각 캐릭터는 반드시 다음 필드를 포함해야 합니다: name, gender, ageGroup(TEEN|20S|30S|40S|50S_PLUS), role, job, desire, description, traits, relationshipToProtagonist, groups(진영 배열), relations(타겟과의 관계 배열: target, type, description, strength 1-10).
- relations의 type은 enemy, ally, family, romantic, friend, mentor 중 하나입니다.
- 주인공은 모든 캐릭터와 관계를 가져야 합니다.
- JSON keys: koreanTitle, englishTitle, logline, synopsis, characters, structure, episodes.`;

const logline = '한국 알리바바에 파견온 중국인 우령은 알리바바를 그만 두고 화장품 무역업으로 성공하는 스토리';

async function run() {
  console.log('Generating fresh content from Anthropic...');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: '로그라인: ' + logline }]
    })
  });
  
  const data = await res.json();
  if (data.error) { console.error('Anthropic Error:', data.error); return; }
  
  let text = data.content[0].text;
  text = text.replace(/^\s*```json/i, '').replace(/```\s*$/i, '').trim();
  
  const parsed = JSON.parse(text);
  console.log('Successfully generated clean JSON. Characters:', parsed.characters?.length);
  
  const { data: projects } = await supabase.from('projects_v2').select('id').ilike('title', '%파견온%');
  if (projects && projects.length > 0) {
    const pId = projects[0].id;
    await supabase.from('projects_v2').update({
      synopsis: parsed, // Supabase client will auto-stringify JSON properly for JSONB
      generated_content: { epicNarrative: parsed.synopsis || '' },
      status: 'READY',
      progress: 100
    }).eq('id', pId);
    
    // Update characters table too
    await supabase.from('characters_v2').delete().eq('project_id', pId);
    if (parsed.characters) {
      const charsToInsert = parsed.characters.map((c, idx) => ({
        project_id: pId,
        id: c.name.toLowerCase().replace(/\s+/g, '_') + '_' + idx,
        name: c.name,
        role: c.role || '조연',
        gender: c.gender || 'OTHER',
        ageGroup: c.ageGroup || '30S',
        job: c.job || '',
        description: c.description || '',
        groups: c.groups || [],
        relations: c.relations || [],
        created_at: new Date().toISOString()
      }));
      await supabase.from('characters_v2').insert(charsToInsert);
    }
    console.log('Database updated successfully for project', pId);
  }
}
run();
