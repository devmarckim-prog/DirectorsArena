import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { POC_COOKIE_NAME, POC_TEST_ADMIN_USER } from '@/lib/poc'

export async function authGuard() {
  // 1. Check POC Admin Cookie
  try {
    const cookieStore = await cookies();
    if (cookieStore.get(POC_COOKIE_NAME)?.value === 'true') {
      return {
        user: {
          id: POC_TEST_ADMIN_USER.id,
          email: POC_TEST_ADMIN_USER.email,
          role: POC_TEST_ADMIN_USER.role,
          app_metadata: { role: 'admin' },
          user_metadata: { role: 'admin', full_name: POC_TEST_ADMIN_USER.full_name }
        } as any,
        response: null
      };
    }
  } catch (cErr) {
    // In edge runtime or special context, fallback to regular client
  }

  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return { 
        user: null, 
        response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) 
      }
    }

    return { user, response: null }
  } catch (err) {
    return { 
      user: null, 
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) 
    }
  }
}
