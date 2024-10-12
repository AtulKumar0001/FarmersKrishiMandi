'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Supabase auth error:', error.message)
    return { error: error.message }
  }

  if (authData.user) {
    console.log('User logged in successfully:', authData.user.email)
    revalidatePath('/', 'layout')
    redirect('/farmer')
  } else {
    console.error('No user data returned from Supabase')
    return { error: 'Login failed' }
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function loginWithGoogleFarmer() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/farmer`,
    },
  })

  if (error) {
    return { error: error.message }
  }
  return { url: data.url }
}

export async function loginWithGoogleBuyer() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/buyer`,
    },
  })

  if (error) {
    return { error: error.message }
  }
  return { url: data.url }
}


export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}