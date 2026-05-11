import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Protect admin routes (except login)
  if (
    req.nextUrl.pathname.startsWith('/admin') &&
    !req.nextUrl.pathname.startsWith('/api/admin/login')
  ) {
    // Admin page itself handles auth client-side (cookie checked via API)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
