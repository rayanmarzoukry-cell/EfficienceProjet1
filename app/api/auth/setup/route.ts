// app/api/auth/setup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { hashPassword } from '@/lib/auth-utils'

const MONGODB_URI = process.env.MONGODB_URI || ''
const DB_NAME = process.env.MONGODB_DB || 'rayan_dev2'

// GET: Vérifier si la setup est déjà faite
export async function GET() {
  try {
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db(DB_NAME)

    const adminCount = await db.collection('users').countDocuments({ role: 'admin' })
    client.close()

    return NextResponse.json({
      setupComplete: adminCount > 0,
      adminCount,
    })
  } catch (error) {
    console.error('Erreur check setup:', error)
    return NextResponse.json({ setupComplete: false })
  }
}

// POST: Créer l'admin initial (une seule fois)
export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, mot de passe et nom requis' },
        { status: 400 }
      )
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db(DB_NAME)

    // Vérifier qu'il n'existe pas d'admin
    const adminExists = await db.collection('users').countDocuments({ role: 'admin' })
    if (adminExists > 0) {
      client.close()
      return NextResponse.json(
        { error: 'Un administrateur existe déjà. Setup impossible.' },
        { status: 403 }
      )
    }

    // Vérifier que l'email n'existe pas
    const userExists = await db.collection('users').findOne({
      email: email.toLowerCase(),
    })
    if (userExists) {
      client.close()
      return NextResponse.json(
        { error: 'Cet email existe déjà' },
        { status: 409 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password)

    // Créer l'admin
    const result = await db.collection('users').insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
    })

    client.close()

    return NextResponse.json({
      success: true,
      message: 'Administrateur créé avec succès!',
      userId: result.insertedId,
    })
  } catch (error) {
    console.error('Erreur setup:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
