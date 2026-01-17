import { NextRequest, NextResponse } from 'next/server'
import { getUsersCollection } from '@/lib/db-admin'
import { verifyToken, hashPassword, validateUserData } from '@/lib/admin-auth'
import { ObjectId } from 'mongodb'

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

// GET: Récupérer un utilisateur spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = checkAdminAuth(request)

    if (!auth.valid) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const usersCollection = await getUsersCollection()
    const user = await usersCollection.findOne(
      { _id: new ObjectId(params.id) },
      { projection: { password: 0 } }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          cabinet: user.cabinet || '',
          isActive: user.isActive,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Erreur GET user [id]:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT: Mettre à jour un utilisateur
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = checkAdminAuth(request)

    if (!auth.valid) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { email, name, role, cabinet, isActive, password } = await request.json()

    const usersCollection = await getUsersCollection()

    // Vérifier que l'utilisateur existe
    const existingUser = await usersCollection.findOne({
      _id: new ObjectId(params.id),
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Préparer les données de mise à jour
    const updateData: any = {}

    if (email && email !== existingUser.email) {
      // Vérifier que le nouvel email n'existe pas
      const emailExists = await usersCollection.findOne({ email })
      if (emailExists) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 409 }
        )
      }
      updateData.email = email
    }

    if (name) updateData.name = name
    if (role) updateData.role = role
    if (cabinet !== undefined) updateData.cabinet = cabinet
    if (isActive !== undefined) updateData.isActive = isActive

    // Si un nouveau mot de passe est fourni
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Le mot de passe doit contenir au moins 8 caractères' },
          { status: 400 }
        )
      }
      updateData.password = await hashPassword(password)
    }

    // Mettre à jour l'utilisateur
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Utilisateur mis à jour avec succès',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Erreur PUT user [id]:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE: Supprimer un utilisateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = checkAdminAuth(request)

    if (!auth.valid) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const usersCollection = await getUsersCollection()

    // Vérifier que l'utilisateur existe
    const user = await usersCollection.findOne({
      _id: new ObjectId(params.id),
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Empêcher la suppression du dernier admin
    if (user.role === 'admin') {
      const adminCount = await usersCollection.countDocuments({ role: 'admin' })
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Impossible de supprimer le dernier administrateur' },
          { status: 403 }
        )
      }
    }

    // Supprimer l'utilisateur
    const result = await usersCollection.deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Utilisateur supprimé avec succès',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Erreur DELETE user [id]:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
