import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/error`)
    }

    // Check user role from the database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user?.id)
      .single()

    if (userError) {
      console.error('Error fetching user role:', userError)
      return NextResponse.redirect(`${requestUrl.origin}/error`)
    }

    // Redirect based on user role
    if (userData?.role === 'buyer') {
      return NextResponse.redirect(`${requestUrl.origin}/buyer/`)
    } else if (userData?.role === 'farmer') {
      return NextResponse.redirect(`${requestUrl.origin}/farmer/${data.user?.id}`)
    }
  }

  // Fallback redirect if no code or unrecognized role
  return NextResponse.redirect(`${requestUrl.origin}/`)
}