import { NextResponse, type NextRequest } from 'next/server';
import { verify } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect the /admin route and its children, but not the login page itself
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get('session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const decoded = await verify(sessionCookie);
      if (!decoded.isAdmin) {
        throw new Error('Not an admin');
      }
      // If verification is successful, allow the request to proceed
      return NextResponse.next();
    } catch (err) {
      // If verification fails, redirect to the login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
