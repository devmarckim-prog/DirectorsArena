
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://stfonaiuxavzbqwikcqb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM'
);

async function fix() {
  // 1. 디렉터즈 아레나 프로젝트 찾기
  const { data: projects, error: pError } = await supabase
    .from('projects')
    .select('id, title, synopsis')
    .ilike('title', '%디렉터즈 아레나%');

  if (pError) throw pError;
  
  for (const project of projects) {
    console.log(`Found project: ${project.title} (${project.id})`);
    
    let synopsis = typeof project.synopsis === 'string' ? JSON.parse(project.synopsis) : project.synopsis;
    if (!synopsis.characters) continue;

    const demoMap = {
      "조재현": { gender: "MALE", age: 38, id: "cho_jae_hyun" },
      "오서영": { gender: "FEMALE", age: 34, id: "oh_seo_young" },
      "김병수": { gender: "MALE", age: 42, id: "kim_byung_soo" },
      "강동욱": { gender: "MALE", age: 48, id: "kang_dong_wook" },
      "이혜인": { gender: "FEMALE", age: 29, id: "lee_hye_in" },
      "박민규": { gender: "MALE", age: 27, id: "park_min_gyu" },
      "한유리": { gender: "FEMALE", age: 31, id: "han_yu_ri" },
      "최정훈": { gender: "MALE", age: 45, id: "choi_jung_hoon" }
    };

    synopsis.characters = synopsis.characters.map(char => {
      const demo = demoMap[char.name];
      if (demo) {
        return { ...char, ...demo };
      }
      return char;
    });

    const { error: uError } = await supabase
      .from('projects')
      .update({ synopsis: JSON.stringify(synopsis) })
      .eq('id', project.id);

    if (uError) console.error(`Update failed for ${project.id}:`, uError);
    else console.log(`Successfully updated characters for ${project.title}`);
  }
}

fix().catch(console.error);
