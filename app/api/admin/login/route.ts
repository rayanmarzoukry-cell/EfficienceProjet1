import { NextRequest, NextResponse } from 'next/server'
import { getUsersCollection } from '@/lib/db-admin'
import { comparePassword, generateToken, verifyToken } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    const usersCollection = await getUsersCollection()
    const user = await usersCollection.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Vérifier que l'utilisateur est actif et admin
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Compte désactivé' },
        { status: 403 }
      )
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès administrateur requis' },
        { status: 403 }
      )
    }

    // Comparer les mots de passe
    const passwordMatch = await comparePassword(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Générer le token JWT
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      password: user.password,
      isActive: user.isActive,
      createdAt: user.createdAt,
    })

    // Créer la réponse avec le cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Authentification réussie',
        admin: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    )

    // Stocker le token dans un cookie httpOnly
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 jours
    })

    return response
  } catch (error) {
    console.error('❌ Erreur de connexion:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
