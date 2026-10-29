import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// We must use the service role key to access administrative auth functions
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createDevUser() {
  console.log('--- Creating Dev Admin User (Marc Kim) ---');
  
  const devEmail = 'dev.marckim@gmail.com';
  const devPass = 'admin1234password';

  const { data, error } = await supabase.auth.admin.createUser({
    email: devEmail,
    password: devPass,
    email_confirm: true,
    user_metadata: { 
      full_name: 'Marc Kim',
      role: 'admin'
    },
    app_metadata: {
      role: 'admin'
    }
  });

  if (error) {
    if (error.message.includes('already exists') || error.status === 422) {
      console.log('✅ dev.marckim@gmail.com already exists in the auth table.');
    } else {
      console.error('❌ Failed to create dev user:', error);
    }
  } else {
    console.log('🎉 Successfully created dev user in auth table:', data.user.id);
    
    // Explicitly verify/ensure their public role is 'admin'
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'admin', full_name: 'Marc Kim' })
      .eq('id', data.user.id);
      
    if (updateError) {
      console.error('⚠️ Warning: Failed to set public user role to admin:', updateError.message);
    } else {
      console.log('✅ Set public user profile role to admin.');
    }
  }
}

createDevUser();
