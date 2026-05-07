import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

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
  console.log(`[Middleware] Processing: ${url.pathname}`);

  // 1. Get User
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  console.log(`[Middleware] User: ${user?.email || 'Guest'}`);

  // 2. Auth Guard
  const protectedPaths = ['/project-list', '/project-wizard', '/workspace', '/account', '/admin', '/project-contents']
  const isProtectedPath = protectedPaths.some((path) => url.pathname.startsWith(path))

  if (!user && isProtectedPath) {
    url.pathname = '/login'
    console.log(`[Middleware] REDIRECTING GUEST TO: ${url.href}`);
    // 방어 코드: 로컬 개발 중인데 배포 주소가 섞여 있다면 교정
    if (url.hostname.includes('vercel.app')) {
      return NextResponse.redirect(new URL('/login', 'http://localhost:3000'));
    }
    return NextResponse.redirect(url)
  }

  // 3. Admin Guard
  if (user && url.pathname.startsWith('/admin')) {
    // v10.0: Use app_metadata for secure, DB-less role checking
    const role = user.app_metadata?.role;
    const isMasterAdmin = role === 'admin';

    if (!isMasterAdmin) {
      url.pathname = '/'
      console.log(`[Middleware] NON-ADMIN ACCESS DENIED: ${user.email} (Role: ${role})`);
      if (url.hostname.includes('vercel.app')) {
        return NextResponse.redirect(new URL('/', 'http://localhost:3000'));
      }
      return NextResponse.redirect(url)
    }
  }

  // 4. Auth Page Guard
  if (user && (url.pathname === '/login' || url.pathname === '/signup')) {
    url.pathname = '/'
    console.log(`[Middleware] AUTHED USER AT LOGIN PAGE, REDIRECTING TO: ${url.href}`);
    if (url.hostname.includes('vercel.app')) {
      return NextResponse.redirect(new URL('/', 'http://localhost:3000'));
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
