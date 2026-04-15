import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  console.log('--- Checking Supabase projects_v2 table ---');
  const { data, error, count } = await supabase
    .from('projects_v2')
    .select('*', { count: 'exact' });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Total projects found:', count);
  if (data) {
    data.forEach(p => {
      console.log(`[${p.id}] ${p.title} (Sample: ${p.is_sample})`);
    });
  }
}

check();
