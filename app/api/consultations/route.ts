// API pour les consultations
export async function GET(request: Request) {
  try {
    const consultationsData = {
      consultations: [
        {
          id: 1,
          cabinet: "Dental Care Bordeaux",
          email: "contact@cabinetb.fr",
          consultations: 145,
          enregistrements: 130,
          analyseIA: "89%",
          scoreMoyen: 85,
          dateAnalyse: "10/12/2025",
        },
        {
          id: 2,
          cabinet: "Cabinet Dr. Martin",
          email: "dr.martin@cabinet.fr",
          consultations: 98,
          enregistrements: 76,
          analyseIA: "78%",
          scoreMoyen: 74,
          dateAnalyse: "12/12/2025",
        },
      ],
    }

    return Response.json(consultationsData)
  } catch (error) {
    return Response.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
