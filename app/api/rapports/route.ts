// API pour les rapports
export async function GET(request: Request) {
  try {
    const rapportsData = {
      rapportsEnvoyes: 18,
      rapportsGeneresNonEnvoyes: 4,
      rapportsNonGeneres: 2,
      rapports: [
        {
          id: 1,
          cabinet: "Dental Care Bordeaux",
          email: "contact@cabinetb.fr",
          periode: "Décembre",
          statut: "Envoyé",
          dateGeneration: "01/04",
          dateEnvoi: "02/12/2025",
        },
        {
          id: 2,
          cabinet: "Cabinet Dr. Martin",
          email: "dr.martin@cabinet.fr",
          periode: "2025",
          statut: "Envoyé",
          dateGeneration: "01/04",
          dateEnvoi: "02/12/2025",
        },
        {
          id: 3,
          cabinet: "Dr. Emmanuel (ER)",
          email: "emmanuel@cabinet.fr",
          periode: "Février",
          statut: "Généré",
          dateGeneration: "01/12/2023",
        },
      ],
    }

    return Response.json(rapportsData)
  } catch (error) {
    return Response.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Logique pour générer un rapport
    const newRapport = {
      id: Math.random(),
      cabinet: body.cabinetId,
      statut: "Généré",
      dateGeneration: new Date().toLocaleDateString(),
    }

    return Response.json(newRapport, { status: 201 })
  } catch (error) {
    return Response.json({ error: "Erreur lors de la génération" }, { status: 500 })
  }
}
