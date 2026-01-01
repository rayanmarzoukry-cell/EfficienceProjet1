import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface AnalysisData {
  cabinetId: number
  periode: string
  donnees: {
    chiffreAffaires: number
    nombreRendezVous: number
    nombreAbsences: number
    nouveauxPatients: number
  }
  objectifs: {
    chiffreAffaires: number
    nombreRendezVous: number
    tauxAbsence: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisData = await request.json()

    // Calcul des métriques de base
    const tauxAbsence = (body.donnees.nombreAbsences / body.donnees.nombreRendezVous) * 100
    const performanceCA = (body.donnees.chiffreAffaires / body.objectifs.chiffreAffaires) * 100
    const performanceRDV = (body.donnees.nombreRendezVous / body.objectifs.nombreRendezVous) * 100

    // Score global
    const scoreGlobal = Math.round((performanceCA + performanceRDV + (100 - tauxAbsence)) / 3)

    // Génération de l'analyse IA
    const prompt = `
    Analyse les performances d'un cabinet dentaire pour la période ${body.periode}:
    
    Données réelles:
    - Chiffre d'affaires: ${body.donnees.chiffreAffaires}€
    - Nombre de rendez-vous: ${body.donnees.nombreRendezVous}
    - Absences: ${body.donnees.nombreAbsences}
    - Nouveaux patients: ${body.donnees.nouveauxPatients}
    
    Objectifs:
    - CA objectif: ${body.objectifs.chiffreAffaires}€
    - RDV objectif: ${body.objectifs.nombreRendezVous}
    - Taux d'absence max: ${body.objectifs.tauxAbsence}%
    
    Performance calculée:
    - Performance CA: ${performanceCA.toFixed(1)}%
    - Performance RDV: ${performanceRDV.toFixed(1)}%
    - Taux d'absence: ${tauxAbsence.toFixed(1)}%
    - Score global: ${scoreGlobal}%
    
    Fournis une analyse détaillée avec:
    1. Points forts
    2. Points d'amélioration
    3. Recommandations concrètes
    4. Prévisions pour le mois suivant
    
    Réponds en français, de manière professionnelle et constructive.
    `

    const { text: analyse } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system:
        "Tu es un consultant expert en gestion de cabinets dentaires. Tes analyses sont précises, constructives et orientées résultats.",
    })

    const resultatAnalyse = {
      cabinetId: body.cabinetId,
      periode: body.periode,
      scoreGlobal,
      metriques: {
        performanceCA: Math.round(performanceCA),
        performanceRDV: Math.round(performanceRDV),
        tauxAbsence: Math.round(tauxAbsence * 10) / 10,
      },
      analyse,
      recommandations: [
        performanceCA < 90 ? "Optimiser la tarification et les traitements proposés" : null,
        performanceRDV < 90 ? "Améliorer la planification et réduire les créneaux vides" : null,
        tauxAbsence > body.objectifs.tauxAbsence ? "Mettre en place un système de rappel automatique" : null,
      ].filter(Boolean),
      dateAnalyse: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: resultatAnalyse,
    })
  } catch (error) {
    console.error("Erreur analyse:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de l'analyse des données" }, { status: 500 })
  }
}
