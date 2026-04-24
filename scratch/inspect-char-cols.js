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
    .from('characters_v2')
    .select('*')
    .limit(1);

  if (error) {
    console.log("Error:", error.message);
  } else {
    console.log("Characters Columns:", Object.keys(data[0] || {}));
  }
}

inspect();
