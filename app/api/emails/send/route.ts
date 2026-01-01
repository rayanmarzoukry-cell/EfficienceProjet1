import { type NextRequest, NextResponse } from "next/server"

interface EmailData {
  cabinetId: number
  destinataire?: string
  sujet?: string
  contenu?: string
  pieceJointe?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailData = await request.json()

    // Simulation de récupération des données du cabinet
    const cabinetInfo = {
      nom: "Cabinet Dr. Martin",
      email: "contact@cabinet-martin.fr",
    }

    // Configuration de l'email
    const emailConfig = {
      from: "noreply@efficience-dentaire.fr",
      to: body.destinataire || cabinetInfo.email,
      subject: body.sujet || `Rapport mensuel - ${cabinetInfo.nom}`,
      html:
        body.contenu ||
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Rapport Mensuel - Efficience Dentaire</h2>
          
          <p>Bonjour,</p>
          
          <p>Veuillez trouver ci-joint votre rapport mensuel d'analyse des performances.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Résumé de vos performances</h3>
            <ul>
              <li><strong>Score global :</strong> 87/100</li>
              <li><strong>Chiffre d'affaires :</strong> 45 000€</li>
              <li><strong>Taux de présence :</strong> 91.7%</li>
            </ul>
          </div>
          
          <p>N'hésitez pas à nous contacter pour toute question.</p>
          
          <p>Cordialement,<br>
          L'équipe Efficience-Dentaire</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280;">
            Cet email a été envoyé automatiquement. Merci de ne pas répondre à cette adresse.
          </p>
        </div>
      `,
      attachments: body.pieceJointe
        ? [
            {
              filename: `rapport-${new Date().toISOString().slice(0, 7)}.pdf`,
              path: body.pieceJointe,
            },
          ]
        : [],
    }

    // Ici, on utiliserait Nodemailer ou SendGrid pour l'envoi réel
    console.log("Configuration email:", emailConfig)

    // Simulation de l'envoi
    const emailResult = {
      id: Date.now(),
      cabinetId: body.cabinetId,
      destinataire: emailConfig.to,
      sujet: emailConfig.subject,
      dateEnvoi: new Date().toISOString(),
      statut: "envoyé",
      messageId: `msg_${Date.now()}`,
    }

    return NextResponse.json({
      success: true,
      message: "Email envoyé avec succès",
      data: emailResult,
    })
  } catch (error) {
    console.error("Erreur envoi email:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de l'envoi de l'email" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Simulation de récupération de l'historique des emails
    const emailHistory = [
      {
        id: 1,
        cabinetId: 1,
        destinataire: "contact@cabinet-martin.fr",
        sujet: "Rapport mensuel - Novembre 2024",
        dateEnvoi: "2024-12-01T10:00:00Z",
        statut: "envoyé",
      },
      {
        id: 2,
        cabinetId: 2,
        destinataire: "admin@dentaire-plus.fr",
        sujet: "Rapport mensuel - Novembre 2024",
        dateEnvoi: "2024-12-01T10:05:00Z",
        statut: "envoyé",
      },
    ]

    return NextResponse.json({
      success: true,
      data: emailHistory,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération de l'historique" },
      { status: 500 },
    )
  }
}
