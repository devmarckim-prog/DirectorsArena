import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // POC Admin Mode Bypass: Allow instant test admin access without auth redirects
  const isPocAdmin = request.cookies.get('da_poc_admin')?.value === 'true';
  const url = request.nextUrl.clone();

  // If visiting /admin directly, auto-grant POC admin cookie and allow immediate entrance
  if (url.pathname.startsWith('/admin')) {
    if (isPocAdmin) {
      return NextResponse.next();
    }
    const response = NextResponse.next();
    response.cookies.set('da_poc_admin', 'true', {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    return response;
  }

  if (isPocAdmin) {
    if (url.pathname === '/login') {
      url.pathname = '/project-list';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
