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

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspect() {
  const { data, error } = await supabase
    .rpc('get_tables'); // Assuming the RPC exists, or try raw query if possible

  if (error) {
    console.log("RPC get_tables failed, searching for alternative...");
    // Try to query a known table to see if it works
    const { data: proj, error: projErr } = await supabase.from('projects_v2').select('id').limit(1);
    console.log("projects_v2 check:", projErr ? projErr.message : "Success");
    
    // Try without v2
    const { data: beats, error: beatsErr } = await supabase.from('story_beats').select('id').limit(1);
    console.log("story_beats check:", beatsErr ? beatsErr.message : "Success");
  } else {
    console.log("Tables:", data);
  }
}

inspect();
