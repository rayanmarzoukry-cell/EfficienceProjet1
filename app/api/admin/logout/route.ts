import { NextRequest, NextResponse } from 'next/server'

export function POST(request: NextRequest) {
  const response = NextResponse.json(
    { success: true, message: 'Déconnexion réussie' },
    { status: 200 }
  )

  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  })

  return response
}
