import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt, SESSION_COOKIE_NAME } from '@/lib/auth-core';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const payload = await decrypt(session);
      if (!payload || payload.role !== 'admin') {
        throw new Error('Invalid session');
      }
    } catch (error) {
      // Clear the cookie and redirect to login if session is invalid or expired
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
