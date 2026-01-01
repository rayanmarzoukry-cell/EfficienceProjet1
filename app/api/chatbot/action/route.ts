import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth/jwt"

// 🎯 API ACTIONS CHATBOT
export async function POST(request: NextRequest) {
  try {
    const { action, data, userContext } = await request.json()

    // Vérification de l'authentification si nécessaire
    let user = null
    if (userContext) {
      const authHeader = request.headers.get("authorization")
      const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

      if (token) {
        const payload = AuthService.verifyAccessToken(token)
        if (payload) {
          user = await AuthService.findUserByEmail(payload.email)
        }
      }
    }

    let response = ""
    let actionData = null

    switch (action) {
      case "view_analytics":
        if (user && user.cabinetId) {
          response = `📊 Voici un aperçu de vos performances actuelles. Votre score global est de 87/100 avec un CA de 45 000€ ce mois. Souhaitez-vous voir plus de détails ?`
          actionData = {
            type: "analytics_preview",
            cabinetId: user.cabinetId,
            redirectUrl: user.role === "admin" ? "/admin" : "/cabinet",
          }
        } else {
          response = "🔐 Veuillez vous connecter pour accéder à vos analyses de performance."
        }
        break

      case "generate_report":
        if (user && user.cabinetId) {
          response = `📄 Je vais générer votre rapport mensuel. Cela prendra quelques instants...`
          // Déclencher la génération de rapport
          await triggerReportGeneration(user.cabinetId)
          actionData = {
            type: "report_generation",
            status: "started",
            estimatedTime: "2-3 minutes",
          }
        } else {
          response = "🔐 Veuillez vous connecter pour générer un rapport."
        }
        break

      case "schedule_demo":
        response = `📅 Parfait ! Je vais vous rediriger vers notre calendrier de démonstration. Vous pourrez choisir un créneau qui vous convient.`
        actionData = {
          type: "external_link",
          url: "https://calendly.com/efficience-dentaire/demo",
          openInNewTab: true,
        }
        break

      case "contact_support":
        response = `💬 Notre équipe support est là pour vous aider ! Vous pouvez nous contacter par email ou téléphone.`
        actionData = {
          type: "contact_info",
          email: "support@efficience-dentaire.fr",
          phone: "01 23 45 67 89",
          hours: "Lun-Ven 9h-18h",
        }
        break

      default:
        response = "🤔 Je ne comprends pas cette action. Pouvez-vous reformuler votre demande ?"
    }

    return NextResponse.json({
      success: true,
      response,
      data: actionData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erreur action chatbot:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'exécution de l'action",
      },
      { status: 500 },
    )
  }
}

async function triggerReportGeneration(cabinetId: number) {
  try {
    // Appel à l'API de génération de rapport
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reports/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cabinetId }),
    })

    if (response.ok) {
      console.log(`✅ Rapport déclenché pour cabinet ${cabinetId}`)
    }
  } catch (error) {
    console.error("Erreur déclenchement rapport:", error)
  }
}
