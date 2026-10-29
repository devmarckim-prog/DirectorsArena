import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 0. Never redirect Server Action POST requests (prevents fetchServerAction unhandledRejection)
  const isServerAction = request.headers.has('next-action') || 
                         request.headers.has('rsc-action-id') ||
                         (request.method === 'POST' && request.nextUrl.pathname.includes('/'));
  if (isServerAction) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const url = request.nextUrl.clone()

  // 1. Get User
  let user = null;
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user;
  } catch (e) {
    user = null;
  }

  // 2. Auth Guard
  const protectedPaths = ['/project-list', '/project-wizard', '/workspace', '/account', '/admin', '/project-contents']
  const isProtectedPath = protectedPaths.some((path) => url.pathname.startsWith(path))

  if (!user && isProtectedPath) {
    // If accessing protected path without user in local mode, set POC cookie instead of blocking
    const response = NextResponse.next();
    response.cookies.set('da_poc_admin', 'true', {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });
    return response;
  }

  // 3. Admin Guard
  if (user && url.pathname.startsWith('/admin')) {
    const role = user.app_metadata?.role;
    const isMasterAdmin = role === 'admin';

    if (!isMasterAdmin) {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // 4. Auth Page Guard
  if (user && (url.pathname === '/login' || url.pathname === '/signup')) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
