// app/api/auth/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import { hashPassword, verifyToken } from '@/lib/auth-utils'

const MONGODB_URI = process.env.MONGODB_URI || ''
const DB_NAME = process.env.MONGODB_DB || 'rayan_dev2'

// GET: Lister tous les users (admin seulement)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization requise' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès refusé. Admin requis' },
        { status: 403 }
      )
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db(DB_NAME)

    const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray()

    client.close()

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
    })
  } catch (error) {
    console.error('Erreur GET users:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST: Créer un nouveau user (admin seulement)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization requise' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès refusé. Admin requis' },
        { status: 403 }
      )
    }

    const { email, password, name, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, mot de passe et rôle requis' },
        { status: 400 }
      )
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db(DB_NAME)

    // Vérifier si l'utilisateur existe déjà
    const existing = await db.collection('users').findOne({ email: email.toLowerCase() })
    if (existing) {
      client.close()
      return NextResponse.json(
        { error: 'Cet email existe déjà' },
        { status: 409 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password)

    // Créer le nouvel utilisateur
    const result = await db.collection('users').insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || email.split('@')[0],
      role: role, // 'admin' ou 'user'
      createdAt: new Date(),
      isActive: true,
    })

    client.close()

    return NextResponse.json({
      success: true,
      message: 'Utilisateur créé avec succès',
      userId: result.insertedId,
    })
  } catch (error) {
    console.error('Erreur POST user:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
