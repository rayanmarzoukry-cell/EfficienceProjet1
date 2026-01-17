import { NextRequest, NextResponse } from 'next/server'
import { getUsersCollection } from '@/lib/db-admin'
import { hashPassword } from '@/lib/admin-auth'

/**
 * Endpoint pour initialiser le premier administrateur
 * À utiliser une seule fois lors du démarrage
 * Vérifiez que c'est sécurisé (secret clé, IP whitelist, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier une clé secrète pour cette opération
    const initKey = request.headers.get('x-init-key')

    if (initKey !== process.env.INIT_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Clé d\'initialisation invalide' },
        { status: 403 }
      )
    }

    const usersCollection = await getUsersCollection()

    // Vérifier s'il existe déjà un admin
    const adminExists = await usersCollection.findOne({ role: 'admin' })

    if (adminExists) {
      return NextResponse.json(
        {
          success: false,
          message: 'Un administrateur existe déjà. Cette opération ne peut être effectuée qu\'une fois.',
        },
        { status: 409 }
      )
    }

    const { email, name, password } = await request.json()

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, nom et mot de passe requis' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const adminUser = {
      email,
      name,
      password: hashedPassword,
      role: 'admin',
      cabinet: '',
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
    }

    const result = await usersCollection.insertOne(adminUser)

    return NextResponse.json(
      {
        success: true,
        message: 'Administrateur créé avec succès',
        admin: {
          id: result.insertedId.toString(),
          email,
          name,
          role: 'admin',
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Erreur init admin:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
