import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  console.log('--- Checking Supabase users table ---');
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, email, role, credits, plan, full_name, avatar_url, created_at');

  if (userError) {
    console.error('Error fetching users:', userError);
    return;
  }

  console.log('Total users found:', users?.length);
  if (users) {
    users.forEach(u => {
      console.log(`[${u.id}] Email: ${u.email}, Role: ${u.role}, Credits: ${u.credits}, Name: ${u.full_name}, Avatar: ${u.avatar_url}`);
    });
  }
}

check();
