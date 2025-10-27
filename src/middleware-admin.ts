import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is an admin route
  if (pathname.startsWith('/admin')) {
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.redirect(new URL('/auth', request.url));
      }

      // Check if user is super_admin
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, subscription_status')
        .eq('id', user.id)
        .single();

      if (userError || userData?.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Check subscription status (even super admins need active subscription for some features)
      if (userData.subscription_status === 'canceled') {
        // Allow access but show warning
        const response = NextResponse.next();
        response.headers.set('X-Admin-Warning', 'subscription-canceled');
        return response;
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Admin middleware error:', error);
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
