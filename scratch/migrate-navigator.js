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

async function migrate() {
  console.log('--- Creating story_beats_v2 table ---');
  
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS story_beats_v2 (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        project_id UUID REFERENCES projects_v2(id) ON DELETE CASCADE,
        act_number INTEGER NOT NULL,
        beat_type TEXT,
        title TEXT,
        description TEXT,
        timestamp_label TEXT,
        order_index INTEGER,
        is_completed BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });

  if (error) {
    console.error('❌ Migration Error:', error.message);
    console.log('⚠️ RPC exec_sql might not be available. Please create the table manually in Supabase SQL editor.');
  } else {
    console.log('✅ story_beats_v2 table created successfully.');
  }
}

migrate();
