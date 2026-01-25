import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // 1. Check if user has the 'admin_token' cookie
  const adminToken = req.cookies.get('admin_token')?.value;

  // 2. If trying to access /admin WITHOUT token -> Kick to /login
  if (req.nextUrl.pathname.startsWith('/admin') && !adminToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 3. If trying to access /login WITH token -> Send straight to /admin
  // (Optional convenience)
  if (req.nextUrl.pathname.startsWith('/login') && adminToken) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};