
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://stfonaiuxavzbqwikcqb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM'
);

async function fix() {
  // 1. characters_v2 에서 '조재현' 찾기
  const { data: chars, error: cError } = await supabase
    .from('characters_v2')
    .select('*')
    .eq('name', '조재현');

  if (cError) throw cError;
  
  if (chars.length === 0) {
    console.log('No character named 조재현 found in characters_v2');
    return;
  }

  const projectId = chars[0].project_id;
  console.log(`Found project ID via character: ${projectId}`);

  // 2. 해당 프로젝트의 모든 캐릭터 업데이트
  const demoMap = {
    "조재현": { gender: "MALE", age: 38 },
    "오서영": { gender: "FEMALE", age: 34 },
    "김병수": { gender: "MALE", age: 42 },
    "강동욱": { gender: "MALE", age: 48 },
    "이혜인": { gender: "FEMALE", age: 29 },
    "박민규": { gender: "MALE", age: 27 },
    "한유리": { gender: "FEMALE", age: 31 },
    "최정훈": { gender: "MALE", age: 45 }
  };

  for (const [name, demo] of Object.entries(demoMap)) {
    const { error: uError } = await supabase
      .from('characters_v2')
      .update({ gender: demo.gender, age: demo.age })
      .match({ project_id: projectId, name: name });

    if (uError) console.error(`Failed to update ${name}:`, uError);
    else console.log(`Updated ${name}`);
  }
}

fix().catch(console.error);
