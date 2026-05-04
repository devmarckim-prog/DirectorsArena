"use server";

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { headers } from "next/headers";

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
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";
    const ua = headerList.get("user-agent") || "unknown";

    await supabase.from('login_logs').insert({
      user_id: data.user.id,
      email: data.user.email,
      ip_address: ip,
      user_agent: ua
    });
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
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getUserSettingsAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('users')
    .select('settings')
    .eq('id', user.id)
    .single()
  
  return data?.settings || null
}

export async function updateUserSettingsAction(settings: any) {
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
}
