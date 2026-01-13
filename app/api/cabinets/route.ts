// API pour les cabinets
export async function GET(request: Request) {
  try {
    const cabinetsData = {
      cabinets: [
        {
          id: 1,
          nom: "Dental Care Bordeaux",
          email: "contact@cabinetb.fr",
          score: 94,
          statut: "performant",
          ca: "52 000€",
          trend: "+5%",
          rapport: "Envoyé",
          rapportStatut: "sent",
        },
        {
          id: 2,
          nom: "Cabinet Dr. Martin",
          email: "dr.martin@cabinet.fr",
          score: 92,
          statut: "performant",
          ca: "45 000€",
          trend: "+3%",
          rapport: "Envoyé",
          rapportStatut: "sent",
        },
        {
          id: 3,
          nom: "Dr. Emmanuel (ER)",
          email: "emmanuel@cabinet.fr",
          score: 88,
          statut: "surveiller",
          ca: "38 000€",
          trend: "-1%",
          rapport: "À générer",
          rapportStatut: "pending",
        },
        {
          id: 4,
          nom: "Dr. Jean-Claude (JC)",
          email: "jc@cabinet.fr",
          score: 87,
          statut: "surveiller",
          ca: "45 000€",
          trend: "+2%",
          rapport: "Envoyé",
          rapportStatut: "sent",
        },
        {
          id: 5,
          nom: "Cabinet Sourire",
          email: "sourire@cabinet.fr",
          score: 76,
          statut: "attention",
          ca: "32 000€",
          trend: "-8%",
          rapport: "Non envoyé",
          rapportStatut: "failed",
        },
      ],
    }

    return Response.json(cabinetsData)
  } catch (error) {
    return Response.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
