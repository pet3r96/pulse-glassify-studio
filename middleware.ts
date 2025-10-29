import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Temporarily disable middleware to test if it's causing 401 errors
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
