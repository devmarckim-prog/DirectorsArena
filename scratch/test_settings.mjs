import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  console.log('--- Testing admin_settings ---');
  const { data: settingsData, error: settingsError } = await supabase
    .from('admin_settings')
    .select('*')
    .limit(1);

  if (settingsError) {
    console.error('admin_settings Error:', settingsError);
  } else {
    console.log('admin_settings success:', settingsData);
  }

  console.log('--- Testing users table ---');
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('*')
    .limit(1);

  if (usersError) {
    console.error('users Error:', usersError);
  } else {
    console.log('users success:', usersData);
  }
}

test();
