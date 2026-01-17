import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/patients/:path*',
    '/cabinets/:path*',
    '/rapports/:path*',
    '/consultations/:path*',
    '/settings/:path*',
    '/analyses/:path*',
  ],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Récupérer le token du cookie
  const token = request.cookies.get('auth_token')?.value

  // Si pas de token et pas sur login/setup, rediriger vers login
  if (!token && !pathname.startsWith('/login') && !pathname.startsWith('/setup')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Token existe, continuer
  return NextResponse.next()
}