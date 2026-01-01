import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { cabinetId } = await request.json()

    // Simulation de génération de rapport PDF
    const reportData = {
      id: Date.now(),
      cabinetId,
      periode: new Date().toISOString().slice(0, 7), // YYYY-MM
      dateGeneration: new Date().toISOString(),
      statut: "généré",
      contenu: {
        resume: {
          scoreGlobal: 87,
          chiffreAffaires: 45000,
          objectifCA: 50000,
          nombreRDV: 180,
          tauxAbsence: 8.3,
        },
        analyses: [
          "Performance financière satisfaisante avec 90% de l'objectif atteint",
          "Excellent taux de présence des patients",
          "Opportunité d'augmenter le nombre de nouveaux patients",
        ],
        recommandations: [
          "Développer les traitements esthétiques",
          "Optimiser les créneaux de fin de journée",
          "Mettre en place une campagne de communication locale",
        ],
      },
      fichierPDF: `/reports/cabinet-${cabinetId}-${Date.now()}.pdf`,
    }

    // Ici, on utiliserait une vraie librairie de génération PDF comme jsPDF ou Puppeteer
    console.log("Génération du rapport PDF pour le cabinet:", cabinetId)

    return NextResponse.json({
      success: true,
      message: "Rapport généré avec succès",
      data: reportData,
    })
  } catch (error) {
    console.error("Erreur génération rapport:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de la génération du rapport" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cabinetId = searchParams.get("cabinetId")
    const periode = searchParams.get("periode")

    // Simulation de récupération des rapports
    const mockReports = [
      {
        id: 1,
        cabinetId: 1,
        periode: "2024-11",
        dateGeneration: "2024-12-01",
        statut: "envoyé",
        fichierPDF: "/reports/cabinet-1-nov2024.pdf",
      },
      {
        id: 2,
        cabinetId: 2,
        periode: "2024-11",
        dateGeneration: "2024-12-01",
        statut: "généré",
        fichierPDF: "/reports/cabinet-2-nov2024.pdf",
      },
    ]

    let filteredReports = mockReports

    if (cabinetId) {
      filteredReports = filteredReports.filter((r) => r.cabinetId === Number.parseInt(cabinetId))
    }

    if (periode) {
      filteredReports = filteredReports.filter((r) => r.periode === periode)
    }

    return NextResponse.json({
      success: true,
      data: filteredReports,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur lors de la récupération des rapports" }, { status: 500 })
  }
}
