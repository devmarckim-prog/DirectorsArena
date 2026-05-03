
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals) env[key.trim()] = vals.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: project } = await supabase.from('projects_v2').select('synopsis').eq('title', '그날의 약속').single();
  if (project) {
    const syn = typeof project.synopsis === 'string' ? JSON.parse(project.synopsis) : project.synopsis;
    console.log("Characters in Synopsis:", syn.characters?.map(c => ({ name: c.name, age: c.age, ageGroup: c.ageGroup, age_group: c.age_group })));
  }
}
check();
