
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://stfonaiuxavzbqwikcqb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Zm9uYWl1eGF2emJxd2lrY3FiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDMyNjcwMCwiZXhwIjoyMDg5OTAyNzAwfQ._g-OZFUnWxQrbuwNTmqyAduudYciX7vP4piq9xiHwgM'
);

async function fix() {
  const projectId = '142231a4-ede6-4cd1-a8e1-478757c01faf';
  
  const { data: project, error: pError } = await supabase
    .from('projects_v2')
    .select('synopsis')
    .eq('id', projectId)
    .single();

  if (pError) throw pError;
  
  let synopsis = typeof project.synopsis === 'string' ? JSON.parse(project.synopsis) : project.synopsis;
  if (!synopsis.characters) {
    console.log('No characters in synopsis');
    return;
  }

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

  synopsis.characters = synopsis.characters.map(char => {
    const demo = demoMap[char.name];
    if (demo) {
      return { ...char, ...demo };
    }
    return char;
  });

  const { error: uError } = await supabase
    .from('projects_v2')
    .update({ synopsis: JSON.stringify(synopsis) })
    .eq('id', projectId);

  if (uError) throw uError;
  console.log('Successfully updated synopsis in projects_v2');
}

fix().catch(console.error);
