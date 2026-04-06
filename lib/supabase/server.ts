import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for regular user actions (respecting RLS)
export const createServerClient = (token?: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });
};

// Admin client for system-level actions (bypassing RLS)
export const createAdminClient = () => {
  return createClient(supabaseUrl, supabaseServiceRole);
};
