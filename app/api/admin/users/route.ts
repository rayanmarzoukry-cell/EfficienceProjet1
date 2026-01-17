import { NextRequest, NextResponse } from 'next/server'
import { getUsersCollection } from '@/lib/db-admin'
import { verifyToken, hashPassword, validateUserData, generateTemporaryPassword } from '@/lib/admin-auth'
import { ObjectId } from 'mongodb'

// Middleware pour vérifier l'authentification admin
function checkAdminAuth(request: NextRequest): { valid: boolean; decoded?: any } {
  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    return { valid: false }
  }

  const decoded = verifyToken(token)

  if (!decoded || decoded.role !== 'admin') {
    return { valid: false }
  }

  return { valid: true, decoded }
}

// GET: Lister tous les utilisateurs
export async function GET(request: NextRequest) {
  try {
    const auth = checkAdminAuth(request)

    if (!auth.valid) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const usersCollection = await getUsersCollection()
    const users = await usersCollection
      .find({}, { projection: { password: 0 } })
      .toArray()

    return NextResponse.json(
      {
        success: true,
        users: users.map((user: any) => ({
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          cabinet: user.cabinet || '',
          isActive: user.isActive,
          createdAt: user.createdAt,
        })),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Erreur GET users:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST: Créer un nouvel utilisateur
export async function POST(request: NextRequest) {
  try {
    const auth = checkAdminAuth(request)

    if (!auth.valid) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { email, name, role = 'user', cabinet = '' } = await request.json()

    // Valider les données
    const validation = validateUserData({ email, name, role, password: 'temp' })
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Données invalides', errors: validation.errors },
        { status: 400 }
      )
    }

    const usersCollection = await getUsersCollection()

    // Vérifier que l'email n'existe pas déjà
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Générer un mot de passe temporaire
    const temporaryPassword = generateTemporaryPassword()
    const hashedPassword = await hashPassword(temporaryPassword)

    // Créer le nouvel utilisateur
    const newUser = {
      email,
      name,
      password: hashedPassword,
      role,
      cabinet,
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
    }

    const result = await usersCollection.insertOne(newUser)

    return NextResponse.json(
      {
        success: true,
        message: 'Utilisateur créé avec succès',
        user: {
          id: result.insertedId.toString(),
          email,
          name,
          role,
          cabinet,
          isActive: true,
        },
        temporaryPassword, // À envoyer à l'utilisateur de manière sécurisée
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Erreur POST users:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
