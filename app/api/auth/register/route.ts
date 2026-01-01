import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth/jwt"

// 📝 ROUTE D'INSCRIPTION (Admin uniquement)
export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est admin
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

    if (!token) {
      return NextResponse.json({ success: false, error: "Authentification requise" }, { status: 401 })
    }

    const adminUser = AuthService.verifyAccessToken(token)
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Seuls les administrateurs peuvent créer des comptes" },
        { status: 403 },
      )
    }

    const { email, password, nom, role, cabinetId, cabinetNom } = await request.json()

    // Validation des données
    if (!email || !password || !nom || !role) {
      return NextResponse.json({ success: false, error: "Données manquantes" }, { status: 400 })
    }

    if (role === "user" && (!cabinetId || !cabinetNom)) {
      return NextResponse.json({ success: false, error: "Cabinet requis pour les utilisateurs" }, { status: 400 })
    }

    // Vérifier que l'email n'existe pas déjà
    const existingUser = await AuthService.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Un utilisateur avec cet email existe déjà" }, { status: 409 })
    }

    // Validation du mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 },
      )
    }

    // Créer l'utilisateur
    const newUser = await AuthService.createUser({
      email,
      password,
      nom,
      role,
      cabinetId: role === "user" ? cabinetId : undefined,
      cabinetNom: role === "user" ? cabinetNom : undefined,
    })

    console.log(`✅ Utilisateur créé: ${newUser.email} (${newUser.role})`)

    return NextResponse.json({
      success: true,
      message: "Utilisateur créé avec succès",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          nom: newUser.nom,
          role: newUser.role,
          cabinetId: newUser.cabinetId,
          cabinetNom: newUser.cabinetNom,
          dateCreation: newUser.dateCreation,
        },
      },
    })
  } catch (error) {
    console.error("Erreur création utilisateur:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur lors de la création" }, { status: 500 })
  }
}
