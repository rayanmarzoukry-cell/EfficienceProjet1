import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/admin-auth'

export function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        admin: decoded,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Erreur de vérification:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
