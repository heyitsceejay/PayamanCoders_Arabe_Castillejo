import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /jobs)
  const path = request.nextUrl.pathname

  // Skip middleware for API routes, static files, images, and debug pages
  if (
    path.startsWith('/api/') ||
    path.startsWith('/_next/') ||
    path.startsWith('/favicon.ico') ||
    path.startsWith('/debug') ||
    path.startsWith('/test-redirect') ||
    path.startsWith('/simple-dashboard') ||
    path.includes('.')
  ) {
    return NextResponse.next()
  }

  console.log('🛡️ Middleware checking path:', path)

  // Define paths that require authentication
  const protectedPaths = ['/dashboard', '/profile', '/applications', '/team']
  
  // Define paths that should redirect to dashboard if user is already logged in
  const authPaths = ['/auth/login', '/auth/register']

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path.startsWith(protectedPath)
  )

  // Check if the current path is an auth path
  const isAuthPath = authPaths.some(authPath => 
    path.startsWith(authPath)
  )

  console.log('🔍 Path analysis:', { isProtectedPath, isAuthPath })

  // Get the token from the cookies (simple check without JWT verification in middleware)
  const token = request.cookies.get('token')?.value
  const hasToken = !!token
  console.log('🍪 Token present:', hasToken)

  // Redirect to login if trying to access protected route without token
  if (isProtectedPath && !hasToken) {
    console.log('🚫 Redirecting to login - protected path without token')
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Redirect authenticated users away from auth pages to their role-specific homepage
  if (isAuthPath && hasToken && request.method === 'GET') {
    console.log('🏠 Redirecting to homepage - user already has token')
    return NextResponse.redirect(new URL('/', request.url))
  }

  console.log('✅ Middleware passed, continuing to:', path)
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}