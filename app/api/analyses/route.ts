// API pour les analyses globales
export async function GET(request: Request) {
  try {
    // Mock data - dans un vrai projet, cela viendrait de la base de données
    const analysesData = {
      cabinetsSuivis: 5,
      rapportsGeneres: 156,
      emailsEnvoyes: 142,
      performanceMoyenne: 87,
      cabinets: [
        {
          id: 1,
          nom: "Dental Care Bordeaux",
          score: 94,
          ca: 52000,
          trend: "+5%",
          statut: "performant",
        },
        {
          id: 2,
          nom: "Cabinet Dr. Martin",
          score: 92,
          ca: 45000,
          trend: "+3%",
          statut: "performant",
        },
        {
          id: 3,
          nom: "Dr. Emmanuel (ER)",
          score: 88,
          ca: 38000,
          trend: "-1%",
          statut: "surveiller",
        },
        {
          id: 4,
          nom: "Dr. Jean-Claude (JC)",
          score: 87,
          ca: 45000,
          trend: "+2%",
          statut: "surveiller",
        },
        {
          id: 5,
          nom: "Cabinet Sourire",
          score: 76,
          ca: 32000,
          trend: "-8%",
          statut: "attention",
        },
      ],
    }

    return Response.json(analysesData)
  } catch (error) {
    return Response.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
