import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth/jwt"

// 📤 ROUTE SÉCURISÉE POUR L'UPLOAD DE DONNÉES
export async function POST(request: NextRequest) {
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

    // Seuls les utilisateurs peuvent uploader leurs données
    if (user.role !== "user" || !user.cabinetId) {
      return NextResponse.json(
        { success: false, error: "Seuls les cabinets peuvent uploader des données" },
        { status: 403 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const periode = formData.get("periode") as string

    if (!file || !periode) {
      return NextResponse.json({ success: false, error: "Fichier et période requis" }, { status: 400 })
    }

    // Validation du type de fichier
    const allowedTypes = [".csv", ".xlsx", ".xls"]
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf("."))

    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        {
          success: false,
          error: "Type de fichier non autorisé. Formats acceptés: CSV, Excel",
        },
        { status: 400 },
      )
    }

    // Validation de la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: "Fichier trop volumineux. Taille maximum: 10MB",
        },
        { status: 400 },
      )
    }

    // Traitement du fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Parser les données selon le type de fichier
    let parsedData
    if (fileExtension === ".csv") {
      parsedData = await parseCSVData(buffer.toString())
    } else {
      parsedData = await parseExcelData(buffer)
    }

    // Validation et chiffrement des données sensibles
    const processedData = {
      cabinetId: user.cabinetId,
      periode,
      chiffreAffaires: AuthService.encryptSensitiveData(parsedData.chiffreAffaires.toString()),
      nombreRendezVous: parsedData.nombreRendezVous,
      nombreAbsences: parsedData.nombreAbsences,
      nouveauxPatients: parsedData.nouveauxPatients,
      dateUpload: new Date().toISOString(),
      uploadedBy: user.userId,
      fileName: file.name,
      fileSize: file.size,
    }

    // Sauvegarder en base de données (simulation)
    console.log("Données uploadées et chiffrées:", processedData)

    return NextResponse.json({
      success: true,
      message: "Données uploadées avec succès",
      data: {
        periode: processedData.periode,
        recordsProcessed: 1,
        dateUpload: processedData.dateUpload,
      },
    })
  } catch (error) {
    console.error("Erreur upload données:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de l'upload" }, { status: 500 })
  }
}

async function parseCSVData(csvContent: string) {
  // Parser CSV simple
  const lines = csvContent.split("\n")
  const data = lines[1]?.split(",") || []

  return {
    chiffreAffaires: Number.parseFloat(data[0]) || 0,
    nombreRendezVous: Number.parseInt(data[1]) || 0,
    nombreAbsences: Number.parseInt(data[2]) || 0,
    nouveauxPatients: Number.parseInt(data[3]) || 0,
  }
}

async function parseExcelData(buffer: Buffer) {
  // Simulation parsing Excel - en production utiliser 'xlsx'
  return {
    chiffreAffaires: 45000,
    nombreRendezVous: 180,
    nombreAbsences: 15,
    nouveauxPatients: 25,
  }
}
