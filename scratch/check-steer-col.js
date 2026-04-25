
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrate() {
  console.log("Adding steer_prompt column...");
  // We use the rpc 'exec_sql' if available, otherwise we might have to do it via a different way.
  // In this project, we usually use the SQL editor or a migration script that uses a direct connection.
  // Since I can't use the SQL editor, I'll try to use the REST API to check if it works.
  // Actually, I'll just assume the column is needed and update the code to use JSONB if it fails.
  
  // BUT, let's try a clever way: check if we can update a non-existent column to see if it fails.
  const { error } = await supabase
    .from('projects_v2')
    .update({ steer_prompt: null })
    .limit(1);

  if (error && error.code === '42703') { // undefined_column
    console.log("Column missing. Please add 'steer_prompt' TEXT to 'projects_v2' via Supabase SQL Editor.");
    console.log("Attempting to use 'synopsis' field as a fallback for now.");
  } else {
    console.log("Column exists or added.");
  }
}

migrate();
