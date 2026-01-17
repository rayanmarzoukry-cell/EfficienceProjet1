import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { comparePassword, generateToken } from "@/lib/auth-utils"

const MONGODB_URI = process.env.MONGODB_URI || ''
const DB_NAME = process.env.MONGODB_DB || 'rayan_dev2'

// 🔐 ROUTE DE CONNEXION
export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    // Validation des données
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email et mot de passe requis" }, { status: 400 })
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Format d'email invalide" }, { status: 400 })
    }

    // Connexion MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db(DB_NAME)

    // Chercher l'utilisateur
    const user = await db.collection('users').findOne({
      email: email.toLowerCase(),
    })

    if (!user) {
      client.close()
      return NextResponse.json({ 
        success: false, 
        error: "Email ou mot de passe incorrect" 
      }, { status: 401 })
    }

    // Vérifier le mot de passe
    const passwordMatch = await comparePassword(password, user.password)

    if (!passwordMatch) {
      client.close()
      return NextResponse.json({ 
        success: false, 
        error: "Email ou mot de passe incorrect" 
      }, { status: 401 })
    }

    // Générer le token
    const token = generateToken(user._id.toString(), user.role)

    // Log de connexion
    console.log(`✅ Connexion réussie: ${user.email} (${user.role})`)

    client.close()

    // Réponse avec token
    const response = NextResponse.json({
      success: true,
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name || 'Utilisateur',
        role: user.role,
      },
    })

    // Ajouter le token dans un cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 jours
    })

    return response
  } catch (error) {
    console.error("Erreur connexion:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur lors de la connexion" }, { status: 500 })
  }
}
