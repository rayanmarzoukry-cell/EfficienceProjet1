import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth/jwt"

// 🏢 ROUTES ADMIN POUR LA GESTION DES CABINETS
export async function GET(request: NextRequest) {
  try {
    // Vérification admin uniquement
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

    if (!token) {
      return NextResponse.json({ success: false, error: "Token d'authentification requis" }, { status: 401 })
    }

    const user = AuthService.verifyAccessToken(token)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Accès administrateur requis" }, { status: 403 })
    }

    // Récupérer tous les cabinets avec données déchiffrées
    const cabinets = await getAllCabinetsWithData()

    // Déchiffrer les données sensibles pour l'admin
    const decryptedCabinets = cabinets.map((cabinet) => ({
      ...cabinet,
      chiffreAffaires: AuthService.decryptSensitiveData(cabinet.chiffreAffaires),
      performance: {
        ...cabinet.performance,
        chiffreAffaires: AuthService.decryptSensitiveData(cabinet.performance.chiffreAffaires),
      },
    }))

    return NextResponse.json({
      success: true,
      data: decryptedCabinets,
    })
  } catch (error) {
    console.error("Erreur récupération cabinets admin:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérification admin uniquement
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

    if (!token) {
      return NextResponse.json({ success: false, error: "Token d'authentification requis" }, { status: 401 })
    }

    const user = AuthService.verifyAccessToken(token)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Accès administrateur requis" }, { status: 403 })
    }

    const { nom, ville, email, telephone, adresse, objectifs } = await request.json()

    // Validation des données
    if (!nom || !ville || !email) {
      return NextResponse.json({ success: false, error: "Nom, ville et email requis" }, { status: 400 })
    }

    // Créer le nouveau cabinet
    const newCabinet = {
      id: Date.now(),
      nom,
      ville,
      email,
      telephone,
      adresse,
      dateCreation: new Date().toISOString(),
      objectifs: {
        chiffreAffaires: objectifs?.chiffreAffaires || 50000,
        nombreRendezVous: objectifs?.nombreRendezVous || 200,
        tauxAbsence: objectifs?.tauxAbsence || 10,
      },
      statut: "actif",
      createdBy: user.userId,
    }

    // Sauvegarder en base (simulation)
    console.log("Nouveau cabinet créé:", newCabinet)

    return NextResponse.json({
      success: true,
      message: "Cabinet créé avec succès",
      data: newCabinet,
    })
  } catch (error) {
    console.error("Erreur création cabinet:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la création" }, { status: 500 })
  }
}

async function getAllCabinetsWithData() {
  // Simulation - en production, récupérer depuis la base de données
  return [
    {
      id: 1,
      nom: "Cabinet Dr. Martin",
      ville: "Paris",
      email: "contact@cabinet-martin.fr",
      telephone: "01 42 34 56 78",
      statut: "actif",
      dateCreation: "2024-01-15",
      chiffreAffaires: AuthService.encryptSensitiveData("45000"), // Données chiffrées
      performance: {
        scoreGlobal: 87,
        chiffreAffaires: AuthService.encryptSensitiveData("45000"),
        nombreRendezVous: 180,
        tauxAbsence: 8.3,
      },
      dernierRapport: "2024-12-01",
    },
    {
      id: 2,
      nom: "Dentaire Plus Lyon",
      ville: "Lyon",
      email: "admin@dentaire-plus.fr",
      telephone: "04 78 90 12 34",
      statut: "actif",
      dateCreation: "2024-02-01",
      chiffreAffaires: AuthService.encryptSensitiveData("38000"), // Données chiffrées
      performance: {
        scoreGlobal: 84,
        chiffreAffaires: AuthService.encryptSensitiveData("38000"),
        nombreRendezVous: 160,
        tauxAbsence: 12.1,
      },
      dernierRapport: "2024-12-01",
    },
  ]
}
