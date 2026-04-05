import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createClient } from '@/utils/supabase/server'

export async function proxy(request: NextRequest) {
  // Update session first
  const response = await updateSession(request)
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const path = url.pathname

  // Public routes
  if (path === '/login' || path === '/') {
    if (user) {
      // If logged in, redirect to dashboard
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (profile?.role === 'admin') {
        url.pathname = '/admin/dashboard'
      } else {
        url.pathname = '/employee/dashboard'
      }
      return NextResponse.redirect(url)
    }
    return response
  }

  // Protected routes
  if (!user) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Role-based protection
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (path.startsWith('/admin') && profile?.role !== 'admin') {
    url.pathname = '/employee/dashboard'
    return NextResponse.redirect(url)
  }

  if (path.startsWith('/employee') && profile?.role !== 'employee') {
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes - handled separately or allowed)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
