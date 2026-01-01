import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { AuthService } from "@/lib/auth/jwt"

// 🤖 API CHATBOT CONVERSATIONNEL
export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, userContext } = await request.json()

    // Vérification de l'authentification si contexte utilisateur fourni
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

    // Construction du contexte pour l'IA
    const systemPrompt = buildSystemPrompt(user, userContext)
    const conversationContext = buildConversationContext(conversationHistory, message)

    // Génération de la réponse IA
    const { text: response } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: conversationContext,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Analyse des intentions et génération d'actions
    const actions = await generateSuggestedActions(message, response, user)

    // Récupération de données contextuelles si nécessaire
    const contextualData = await getContextualData(message, user)

    return NextResponse.json({
      success: true,
      response,
      actions,
      data: contextualData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erreur chatbot conversation:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors du traitement de votre message",
      },
      { status: 500 },
    )
  }
}

function buildSystemPrompt(user: any, userContext: any): string {
  const basePrompt = `
Tu es l'assistant IA d'Efficience-Dentaire, une plateforme d'analyse de performance pour cabinets dentaires.

PERSONNALITÉ:
- Professionnel mais chaleureux
- Expert en gestion de cabinets dentaires
- Orienté solutions et résultats
- Utilise des emojis avec parcimonie (📊 📈 💡)

CAPACITÉS:
- Analyser les performances des cabinets
- Générer des rapports personnalisés
- Donner des conseils d'optimisation
- Expliquer les métriques et indicateurs
- Aider à la navigation sur la plateforme

RÈGLES:
- Réponds en français
- Sois concis mais informatif (max 3-4 phrases)
- Propose des actions concrètes
- Adapte ton niveau selon l'utilisateur
- Ne donne jamais d'informations médicales
`

  if (user && userContext) {
    return (
      basePrompt +
      `

CONTEXTE UTILISATEUR:
- Nom: ${user.nom}
- Rôle: ${user.role === "admin" ? "Administrateur" : "Praticien"}
- Cabinet: ${user.cabinetNom || "Non spécifié"}
- ID Cabinet: ${userContext.cabinetId || "N/A"}

Tu peux accéder aux données de performance de ce cabinet et proposer des analyses personnalisées.
`
    )
  }

  return (
    basePrompt +
    `

L'utilisateur n'est pas connecté. Tu peux donner des informations générales sur la plateforme et encourager l'inscription.
`
  )
}

function buildConversationContext(history: any[], currentMessage: string): string {
  let context = "CONVERSATION:\n"

  // Ajouter l'historique récent
  if (history && history.length > 0) {
    history.slice(-3).forEach((msg) => {
      const role = msg.type === "user" ? "Utilisateur" : "Assistant"
      context += `${role}: ${msg.content}\n`
    })
  }

  context += `Utilisateur: ${currentMessage}\n\nAssistant:`

  return context
}

async function generateSuggestedActions(message: string, response: string, user: any) {
  const actions = []

  // Analyse des intentions dans le message
  const messageLower = message.toLowerCase()

  if (user) {
    // Actions pour utilisateurs connectés
    if (messageLower.includes("performance") || messageLower.includes("résultat") || messageLower.includes("chiffre")) {
      actions.push({
        type: "view_analytics",
        label: "Voir mes performances",
        icon: "BarChart3",
      })
    }

    if (messageLower.includes("rapport") || messageLower.includes("pdf") || messageLower.includes("document")) {
      actions.push({
        type: "generate_report",
        label: "Générer un rapport",
        icon: "FileText",
      })
    }

    if (messageLower.includes("objectif") || messageLower.includes("but") || messageLower.includes("cible")) {
      actions.push({
        type: "view_analytics",
        label: "Consulter mes objectifs",
        icon: "Target",
      })
    }
  } else {
    // Actions pour visiteurs
    if (messageLower.includes("démo") || messageLower.includes("essai") || messageLower.includes("test")) {
      actions.push({
        type: "schedule_demo",
        label: "Planifier une démo",
        icon: "Calendar",
      })
    }

    if (messageLower.includes("prix") || messageLower.includes("tarif") || messageLower.includes("coût")) {
      actions.push({
        type: "contact_support",
        label: "Demander un devis",
        icon: "Mail",
      })
    }
  }

  // Action support toujours disponible
  if (messageLower.includes("aide") || messageLower.includes("problème") || messageLower.includes("support")) {
    actions.push({
      type: "contact_support",
      label: "Contacter le support",
      icon: "HelpCircle",
    })
  }

  return actions.slice(0, 3) // Maximum 3 actions
}

async function getContextualData(message: string, user: any) {
  if (!user || !user.cabinetId) return null

  const messageLower = message.toLowerCase()

  // Si l'utilisateur demande des données spécifiques
  if (messageLower.includes("performance") || messageLower.includes("chiffre") || messageLower.includes("résultat")) {
    // Simulation - en production, récupérer les vraies données
    return {
      type: "performance_summary",
      data: {
        scoreGlobal: 87,
        chiffreAffaires: 45000,
        objectifCA: 50000,
        nombreRDV: 180,
        tauxPresence: 91.7,
        periode: "Novembre 2024",
      },
    }
  }

  if (messageLower.includes("tendance") || messageLower.includes("évolution")) {
    return {
      type: "trend_data",
      data: {
        evolution: [
          { mois: "Sept", score: 89 },
          { mois: "Oct", score: 84 },
          { mois: "Nov", score: 87 },
        ],
      },
    }
  }

  return null
}
