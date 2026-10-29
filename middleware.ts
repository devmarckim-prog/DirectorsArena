import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // 1. NEVER redirect Server Actions (POST requests with Next-Action or RSC headers)
  // Intercepting/redirecting server actions causes "An unexpected response was received from the server"
  const isServerAction = request.headers.has('next-action') || 
                         request.headers.has('rsc-action-id') ||
                         (request.method === 'POST' && Boolean(request.headers.get('content-type')?.includes('multipart/form-data')));
  
  if (isServerAction) {
    return NextResponse.next();
  }

  const isPocAdmin = request.cookies.get('da_poc_admin')?.value === 'true';
  const url = request.nextUrl.clone();

  // 2. Auto-grant POC access to protected routes in dev/POC mode so user is never blocked by login walls
  const protectedPaths = ['/admin', '/project-wizard', '/project-list', '/workspace', '/project-contents'];
  const isProtectedPath = protectedPaths.some((p) => url.pathname.startsWith(p));

  if (isProtectedPath) {
    if (isPocAdmin) {
      return NextResponse.next();
    }
    // Auto-grant POC cookie on response and allow direct entrance
    const response = NextResponse.next();
    response.cookies.set('da_poc_admin', 'true', {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    return response;
  }

  // 3. If already POC Admin and visiting /login on GET, route to /project-list
  if (isPocAdmin && url.pathname === '/login' && request.method === 'GET') {
    url.pathname = '/project-list';
    return NextResponse.redirect(url);
  }

  if (isPocAdmin) {
    return NextResponse.next();
  }

  return await updateSession(request);
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
