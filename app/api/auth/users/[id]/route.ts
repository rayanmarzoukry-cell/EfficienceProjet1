// app/api/auth/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import { verifyToken } from '@/lib/auth-utils'

const MONGODB_URI = process.env.MONGODB_URI || ''
const DB_NAME = process.env.MONGODB_DB || 'rayan_dev2'

// DELETE: Supprimer un user (admin seulement)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Empêcher la suppression du dernier admin
    const adminCount = await db.collection('users').countDocuments({ role: 'admin' })
    
    const userToDelete = await db.collection('users').findOne({
      _id: new ObjectId(params.id),
    })

    if (!userToDelete) {
      client.close()
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    if (userToDelete.role === 'admin' && adminCount <= 1) {
      client.close()
      return NextResponse.json(
        { error: 'Impossible de supprimer le dernier admin' },
        { status: 400 }
      )
    }

    // Supprimer l'utilisateur
    const result = await db.collection('users').deleteOne({
      _id: new ObjectId(params.id),
    })

    client.close()

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé avec succès',
    })
  } catch (error) {
    console.error('Erreur DELETE user:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT: Mettre à jour un user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { name, isActive, role } = await request.json()

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db(DB_NAME)

    const updateData: any = {}
    if (name) updateData.name = name
    if (isActive !== undefined) updateData.isActive = isActive
    if (role) updateData.role = role

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )

    client.close()

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Utilisateur mis à jour',
    })
  } catch (error) {
    console.error('Erreur PUT user:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
