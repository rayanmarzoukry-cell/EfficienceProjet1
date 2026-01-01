import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth/jwt"

// 🔐 ROUTE DE CONNEXION
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation des données
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email et mot de passe requis" }, { status: 400 })
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Format d'email invalide" }, { status: 400 })
    }

    // Tentative d'authentification
    const authResult = await AuthService.authenticate(email, password)

    if (!authResult) {
      return NextResponse.json({ success: false, error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    const { user, accessToken, refreshToken } = authResult

    // Log de connexion
    console.log(`✅ Connexion réussie: ${user.email} (${user.role})`)

    // Réponse avec tokens et informations utilisateur
    const response = NextResponse.json({
      success: true,
      message: "Connexion réussie",
      data: {
        user: {
          id: user.id,
          email: user.email,
          nom: user.nom,
          role: user.role,
          cabinetId: user.cabinetId,
          cabinetNom: user.cabinetNom,
          dernierConnexion: user.dernierConnexion,
        },
        accessToken,
        expiresIn: 900, // 15 minutes
      },
    })

    // Définir le refresh token dans un cookie sécurisé
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Erreur connexion:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur lors de la connexion" }, { status: 500 })
  }
}
