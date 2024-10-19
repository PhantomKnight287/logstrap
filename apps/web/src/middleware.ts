import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_NAME } from './constants';
import { Redirects } from './constants/redirects';
import { middleware as logstrapMiddleware } from '../logstrap';

function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookie = request.cookies.get(COOKIE_NAME);
  if (pathname.startsWith('/auth') && cookie?.value) {
    return NextResponse.redirect(new URL(Redirects.AFTER_AUTH, request.url));
  } else if (pathname.startsWith('/dashboard') && !cookie?.value)
    return NextResponse.redirect(
      new URL(`${Redirects.UNAUTHENTICATED}?to=${pathname}`, request.url),
    );
  else if (pathname === '/' && cookie?.value)
    return NextResponse.redirect(new URL(Redirects.AFTER_AUTH, request.url));

  return NextResponse.next(); // this is required for logstrap to work
}
export const config = {
  matcher: [
    '/auth/:path*',
    '/dashboard',
    '/dashboard/:path*',
    '/',
    '/api',
    '/api/:path*',
  ],
};

export default logstrapMiddleware(middleware);
