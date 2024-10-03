'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {

  console.log(formData)
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Supabase auth error:', error.message)
    // Instead of redirecting, return the error
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
  console.log(formData)
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}