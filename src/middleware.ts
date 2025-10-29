import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserSubscriptionStatus } from '@/lib/subscription/utils';

// Routes that require active subscription
const PROTECTED_ROUTES = [
  '/theme-studio',
  '/marketplace',
  '/menu-builder',
  '/project-manager',
  '/analytics',
  '/task-manager',
  '/webhook-builder',
  '/injection',
  '/preview-frame',
];

// Routes that are always accessible
const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/onboarding',
  '/role-select',
  '/subscribe',
  '/dashboard',
  '/account',
  '/support',
];

// Admin routes (super admin only)
const ADMIN_ROUTES = [
  '/admin',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and public routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  // Check if route is admin route
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  
  // Check if route requires subscription
  const requiresSubscription = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  if (!requiresSubscription && !isAdminRoute) {
    return NextResponse.next();
  }

  try {
    // For now, let's temporarily bypass authentication to allow access
    // This will be fixed when we implement proper session management
    console.log('Middleware: Bypassing authentication for development');
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/auth', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};