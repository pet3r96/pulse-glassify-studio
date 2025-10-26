import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from './lib/supabase/types'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth', '/auth/login', '/auth/register']
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // If user is authenticated and trying to access auth pages
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is authenticated, get their profile and check role-based access
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, agency_id, onboarding_completed')
      .eq('id', user.id)
      .single()

    // Redirect to onboarding if not completed
    if (profile && !profile.onboarding_completed && !request.nextUrl.pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // Super admin routes
    const superAdminRoutes = ['/admin']
    if (superAdminRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      if (profile?.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Agency owner routes
    const agencyRoutes = ['/theme-studio', '/marketplace', '/menu-builder', '/webhook-builder']
    if (agencyRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      if (profile?.role !== 'agency' && profile?.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Subaccount routes
    const subaccountRoutes = ['/task-manager']
    if (subaccountRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      if (profile?.role !== 'subaccount' && profile?.role !== 'agency' && profile?.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
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
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
