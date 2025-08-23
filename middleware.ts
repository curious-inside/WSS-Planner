import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow access to public routes
  const publicRoutes = ['/', '/login', '/register']
  const apiAuthRoutes = request.nextUrl.pathname.startsWith('/api/auth')
  const staticFiles = request.nextUrl.pathname.startsWith('/_next') || 
                     request.nextUrl.pathname.startsWith('/favicon.ico')

  if (publicRoutes.includes(request.nextUrl.pathname) || apiAuthRoutes || staticFiles) {
    return NextResponse.next()
  }

  // Check for authentication token (simplified for now)
  // In a real implementation, you'd decode and verify the JWT
  const token = request.cookies.get('next-auth.session-token') || 
                request.cookies.get('__Secure-next-auth.session-token')

  // Protect dashboard routes
  const protectedRoutes = ['/dashboard', '/issues', '/projects', '/board', '/team']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}