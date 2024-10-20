import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
// import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  if (error) {
    console.error(`Authentication error: ${error}, Description: ${errorDescription}`)
    return NextResponse.redirect(`${requestUrl.origin}/login`)
  }

  if (code) {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) throw error

      // Successful authentication, redirect to farmer dashboard
      return NextResponse.redirect(`${requestUrl.origin}/farmer/`)
    } catch (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login`)
    }
  }

  // If no code and no error, redirect to login page
  return NextResponse.redirect(`${requestUrl.origin}/login`)
}
