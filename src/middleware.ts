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
];

// Routes that are always accessible
const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/onboarding',
  '/dashboard',
  '/account',
  '/support',
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

  // Check if route requires subscription
  const requiresSubscription = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  if (!requiresSubscription) {
    return NextResponse.next();
  }

  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Redirect to auth if not logged in
    if (authError || !user) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Check subscription status
    const subscription = await getUserSubscriptionStatus(user.id);

    if (!subscription.hasAccess) {
      // Redirect to dashboard with subscription required message
      const url = new URL('/dashboard', request.url);
      url.searchParams.set('subscription', 'required');
      return NextResponse.redirect(url);
    }

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