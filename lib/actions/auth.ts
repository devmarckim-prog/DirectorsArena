"use server";

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { headers, cookies } from "next/headers";
import { POC_COOKIE_NAME, POC_TEST_ADMIN_USER } from '@/lib/poc';

export async function pocLoginAction() {
  const cookieStore = await cookies();
  cookieStore.set(POC_COOKIE_NAME, 'true', {
    path: '/',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  });
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // v9.0: Record Login Log for Admin Audit
  if (data.user) {
    try {
      const headerList = await headers();
      const ip = headerList.get("x-forwarded-for") || "unknown";
      const ua = headerList.get("user-agent") || "unknown";

      await supabase.from('login_logs').insert({
        user_id: data.user.id,
        email: data.user.email,
        ip_address: ip,
        user_agent: ua
      });
    } catch (e) {
      // Ignore log error
    }
  }

  revalidatePath('/', 'layout')
  redirect('/project-list')
}

export async function signupAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/project-list')
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(POC_COOKIE_NAME);
  } catch (e) {}

  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (e) {}

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getUserSettingsAction() {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get(POC_COOKIE_NAME)?.value === 'true') {
      return { theme: 'dark', notifications: true };
    }
  } catch (e) {}

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
      .from('users')
      .select('settings')
      .eq('id', user.id)
      .single()
    
    return data?.settings || null
  } catch (e) {
    return null
  }
}

export async function updateUserSettingsAction(settings: any) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get(POC_COOKIE_NAME)?.value === 'true') {
      return { success: true };
    }
  } catch (e) {}

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
      .from('users')
      .update({ settings })
      .eq('id', user.id)
    
    if (error) return { success: false, error: error.message }
    
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function getCurrentUserAction() {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get(POC_COOKIE_NAME)?.value === 'true') {
      return {
        id: POC_TEST_ADMIN_USER.id,
        email: POC_TEST_ADMIN_USER.email,
        role: POC_TEST_ADMIN_USER.role,
        credits: POC_TEST_ADMIN_USER.credits,
        plan: POC_TEST_ADMIN_USER.plan,
        full_name: POC_TEST_ADMIN_USER.full_name,
        avatar_url: POC_TEST_ADMIN_USER.avatar_url
      };
    }
  } catch (cErr) {}

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('users')
      .select('id, email, role, credits, plan, avatar_url, full_name')
      .eq('id', user.id)
      .single()

    // Fallback if profile doesn't exist in public.users yet
    const finalProfile = profile || {
      id: user.id,
      email: user.email!,
      role: 'user',
      credits: 0,
      plan: 'free',
      full_name: user.user_metadata?.full_name || '',
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null
    }

    if (!finalProfile.avatar_url && (user.user_metadata?.avatar_url || user.user_metadata?.picture)) {
      finalProfile.avatar_url = user.user_metadata?.avatar_url || user.user_metadata?.picture
    }

    return finalProfile
  } catch (err) {
    console.error("Error in getCurrentUserAction:", err)
    return null
  }
}
