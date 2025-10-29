import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Public routes that don't require auth
  const publicRoutes = ['/', '/auth', '/subscribe', '/role-select'];
  if (publicRoutes.includes(pathname) || pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Check for authentication token in cookies
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    // Redirect to auth if no token and trying to access protected routes
    if (pathname.startsWith('/dashboard') || 
        pathname.startsWith('/theme-studio') ||
        pathname.startsWith('/account') ||
        pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    return NextResponse.next();
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Add user info to request headers for use in pages
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', (decoded as any).userId);
    requestHeaders.set('x-user-email', (decoded as any).email);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Invalid token, redirect to auth
    if (pathname.startsWith('/dashboard') || 
        pathname.startsWith('/theme-studio') ||
        pathname.startsWith('/account') ||
        pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
