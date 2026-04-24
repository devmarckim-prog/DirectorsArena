const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function check() {
  const env = {};
  fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  });

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  
  const tables = ['episodes_v2', 'story_beats_v2', 'scenes_v2'];
  for (const t of tables) {
    console.log(`--- ${t} columns ---`);
    const { data: proj, error: pErr } = await supabase.from(t).select('*').limit(1);
    if (proj && proj[0]) {
      console.log(Object.keys(proj[0]).join(', '));
    } else if (pErr) {
        console.log(`❌ ${t}: ${pErr.message}`);
    } else {
        console.log(`(Empty table)`);
    }
  }
}

check();
