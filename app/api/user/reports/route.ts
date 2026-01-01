import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth/jwt"

// 📄 ROUTES SÉCURISÉES POUR LES RAPPORTS UTILISATEUR
export async function GET(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

    if (!token) {
      return NextResponse.json({ success: false, error: "Token d'authentification requis" }, { status: 401 })
    }

    const user = AuthService.verifyAccessToken(token)
    if (!user) {
      return NextResponse.json({ success: false, error: "Token invalide ou expiré" }, { status: 401 })
    }

    // Récupérer les rapports selon le rôle
    let rapports = []

    if (user.role === "admin") {
      // Admin voit tous les rapports
      rapports = await getAllReports()
    } else if (user.role === "user" && user.cabinetId) {
      // User voit seulement ses rapports
      rapports = await getCabinetReports(user.cabinetId)
    } else {
      return NextResponse.json({ success: false, error: "Accès non autorisé" }, { status: 403 })
    }

    // Déchiffrer les données sensibles pour l'affichage
    const decryptedReports = rapports.map((rapport) => ({
      ...rapport,
      chiffreAffaires:
        user.role === "admin" ? AuthService.decryptSensitiveData(rapport.chiffreAffaires) : rapport.chiffreAffaires,
    }))

    return NextResponse.json({
      success: true,
      data: decryptedReports,
    })
  } catch (error) {
    console.error("Erreur récupération rapports:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}

async function getAllReports() {
  // Simulation - en production, récupérer depuis la base de données
  return [
    {
      id: 1,
      cabinetId: 1,
      cabinetNom: "Cabinet Dr. Martin",
      periode: "2024-11",
      dateGeneration: "2024-12-01",
      scoreGlobal: 87,
      chiffreAffaires: AuthService.encryptSensitiveData("45000"), // Données chiffrées
      statut: "envoyé",
      fichierPDF: "/reports/cabinet-1-nov2024.pdf",
    },
    {
      id: 2,
      cabinetId: 2,
      cabinetNom: "Dentaire Plus Lyon",
      periode: "2024-11",
      dateGeneration: "2024-12-01",
      scoreGlobal: 84,
      chiffreAffaires: AuthService.encryptSensitiveData("38000"), // Données chiffrées
      statut: "généré",
      fichierPDF: "/reports/cabinet-2-nov2024.pdf",
    },
  ]
}

async function getCabinetReports(cabinetId: number) {
  const allReports = await getAllReports()
  return allReports.filter((rapport) => rapport.cabinetId === cabinetId)
}
