import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// 🧠 ANALYSE INTELLIGENTE AVANCÉE avec IA
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cabinetId, periode, donnees, objectifs, historique } = body

    // Calculs de performance avancés
    const metriques = calculateAdvancedMetrics(donnees, objectifs, historique)

    // Analyse IA approfondie
    const analyseIA = await generateAdvancedAnalysis(cabinetId, periode, metriques, historique)

    // Scoring intelligent
    const scoring = calculateIntelligentScoring(metriques)

    // Prédictions
    const predictions = await generatePredictions(historique, metriques)

    // Recommandations personnalisées
    const recommandations = await generatePersonalizedRecommendations(metriques, analyseIA)

    const resultat = {
      cabinetId,
      periode,
      scoreGlobal: scoring.scoreGlobal,
      metriques: {
        ...metriques,
        tendances: calculateTrends(historique),
        comparaisons: calculateBenchmarks(metriques),
      },
      analyse: {
        resume: analyseIA.resume,
        pointsForts: analyseIA.pointsForts,
        pointsAmelioration: analyseIA.pointsAmelioration,
        risques: analyseIA.risques,
      },
      predictions: {
        prochainMois: predictions.prochainMois,
        tendanceTrimestrielle: predictions.tendanceTrimestrielle,
        alertes: predictions.alertes,
      },
      recommandations: {
        immediates: recommandations.immediates,
        moyen_terme: recommandations.moyenTerme,
        strategiques: recommandations.strategiques,
      },
      scoring: {
        ...scoring,
        evolution: calculateScoreEvolution(historique),
      },
      dateAnalyse: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: resultat,
    })
  } catch (error) {
    console.error("Erreur analyse avancée:", error)
    return NextResponse.json({ success: false, error: "Erreur lors de l'analyse avancée" }, { status: 500 })
  }
}

function calculateAdvancedMetrics(donnees: any, objectifs: any, historique: any[]) {
  const tauxAbsence = (donnees.nombreAbsences / donnees.nombreRendezVous) * 100
  const performanceCA = (donnees.chiffreAffaires / objectifs.chiffreAffaires) * 100
  const performanceRDV = (donnees.nombreRendezVous / objectifs.nombreRendezVous) * 100
  const croissancePatients =
    historique.length > 0
      ? ((donnees.nouveauxPatients - historique[historique.length - 1].nouveauxPatients) /
          historique[historique.length - 1].nouveauxPatients) *
        100
      : 0

  return {
    performanceCA: Math.round(performanceCA),
    performanceRDV: Math.round(performanceRDV),
    tauxAbsence: Math.round(tauxAbsence * 10) / 10,
    tauxPresence: Math.round((100 - tauxAbsence) * 10) / 10,
    croissancePatients: Math.round(croissancePatients * 10) / 10,
    productiviteMoyenne: Math.round(donnees.chiffreAffaires / donnees.nombreRendezVous),
    efficaciteCommerciale: Math.round((donnees.nouveauxPatients / donnees.nombreRendezVous) * 100 * 10) / 10,
  }
}

async function generateAdvancedAnalysis(cabinetId: number, periode: string, metriques: any, historique: any[]) {
  const prompt = `
  En tant qu'expert consultant en gestion de cabinets dentaires, analyse ces données détaillées :

  Cabinet ID: ${cabinetId}
  Période: ${periode}
  
  Métriques actuelles:
  - Performance CA: ${metriques.performanceCA}%
  - Performance RDV: ${metriques.performanceRDV}%
  - Taux de présence: ${metriques.tauxPresence}%
  - Croissance nouveaux patients: ${metriques.croissancePatients}%
  - Productivité moyenne: ${metriques.productiviteMoyenne}€/RDV
  - Efficacité commerciale: ${metriques.efficaciteCommerciale}%

  Historique disponible: ${historique.length} mois de données

  Fournis une analyse structurée avec:
  1. Résumé exécutif (2-3 phrases)
  2. 3 points forts principaux
  3. 3 points d'amélioration prioritaires
  4. Risques identifiés
  
  Sois précis, constructif et orienté action.
  `

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt,
    system:
      "Tu es un consultant expert en gestion de cabinets dentaires avec 15 ans d'expérience. Tes analyses sont précises, chiffrées et orientées résultats business.",
  })

  // Parser la réponse IA pour structurer les données
  return {
    resume: text.split("\n")[0] || "Analyse en cours...",
    pointsForts: extractSection(text, "points forts") || ["Performance globale satisfaisante"],
    pointsAmelioration: extractSection(text, "amélioration") || ["Optimisation continue recommandée"],
    risques: extractSection(text, "risques") || ["Aucun risque majeur identifié"],
  }
}

function extractSection(text: string, section: string): string[] {
  // Fonction utilitaire pour extraire les sections de l'analyse IA
  const lines = text.split("\n")
  const sectionLines = lines.filter(
    (line) => line.toLowerCase().includes(section) || line.match(/^\d+\./) || line.startsWith("-"),
  )
  return sectionLines.slice(0, 3).map((line) => line.replace(/^\d+\.\s*|-\s*/, "").trim())
}

function calculateIntelligentScoring(metriques: any) {
  // Scoring pondéré intelligent
  const poids = {
    performanceCA: 0.35,
    performanceRDV: 0.25,
    tauxPresence: 0.2,
    croissancePatients: 0.15,
    efficaciteCommerciale: 0.05,
  }

  const scoreCA = Math.min(metriques.performanceCA, 100)
  const scoreRDV = Math.min(metriques.performanceRDV, 100)
  const scorePresence = metriques.tauxPresence
  const scoreCroissance = Math.max(0, Math.min(100, 50 + metriques.croissancePatients * 2))
  const scoreEfficacite = Math.min(metriques.efficaciteCommerciale * 10, 100)

  const scoreGlobal = Math.round(
    scoreCA * poids.performanceCA +
      scoreRDV * poids.performanceRDV +
      scorePresence * poids.tauxPresence +
      scoreCroissance * poids.croissancePatients +
      scoreEfficacite * poids.efficaciteCommerciale,
  )

  return {
    scoreGlobal,
    details: {
      scoreCA,
      scoreRDV,
      scorePresence,
      scoreCroissance,
      scoreEfficacite,
    },
    niveau: scoreGlobal >= 90 ? "Excellent" : scoreGlobal >= 80 ? "Bon" : scoreGlobal >= 70 ? "Moyen" : "À améliorer",
  }
}

async function generatePredictions(historique: any[], metriques: any) {
  // Prédictions basées sur l'historique et les tendances
  const tendanceCA =
    historique.length > 2
      ? (historique[historique.length - 1].chiffreAffaires - historique[historique.length - 3].chiffreAffaires) / 2
      : 0

  return {
    prochainMois: {
      chiffreAffairesPrevu: Math.round(historique[historique.length - 1]?.chiffreAffaires + tendanceCA || 45000),
      confianceNiveau: historique.length > 6 ? "Élevé" : "Moyen",
    },
    tendanceTrimestrielle: tendanceCA > 0 ? "Croissance" : tendanceCA < 0 ? "Déclin" : "Stable",
    alertes: generateAlerts(metriques, historique),
  }
}

function generateAlerts(metriques: any, historique: any[]) {
  const alertes = []

  if (metriques.performanceCA < 80) {
    alertes.push({ type: "warning", message: "Performance CA en baisse", priorite: "haute" })
  }

  if (metriques.tauxAbsence > 15) {
    alertes.push({ type: "alert", message: "Taux d'absence élevé", priorite: "moyenne" })
  }

  if (metriques.croissancePatients < -10) {
    alertes.push({ type: "critical", message: "Baisse significative nouveaux patients", priorite: "critique" })
  }

  return alertes
}

async function generatePersonalizedRecommendations(metriques: any, analyseIA: any) {
  return {
    immediates: [
      metriques.performanceCA < 90 ? "Optimiser la tarification des actes" : null,
      metriques.tauxAbsence > 10 ? "Renforcer le système de rappel patients" : null,
      metriques.efficaciteCommerciale < 5 ? "Améliorer l'accueil et la conversion" : null,
    ].filter(Boolean),
    moyenTerme: [
      "Développer les traitements à forte valeur ajoutée",
      "Optimiser la planification des rendez-vous",
      "Mettre en place un suivi patient personnalisé",
    ],
    strategiques: [
      "Évaluer l'opportunité d'extension des horaires",
      "Considérer l'investissement en nouvelles technologies",
      "Développer une stratégie marketing digitale",
    ],
  }
}

function calculateTrends(historique: any[]) {
  if (historique.length < 2) return null

  const recent = historique.slice(-3)
  const ancien = historique.slice(-6, -3)

  return {
    ca: calculateTrendDirection(recent, ancien, "chiffreAffaires"),
    rdv: calculateTrendDirection(recent, ancien, "nombreRendezVous"),
    patients: calculateTrendDirection(recent, ancien, "nouveauxPatients"),
  }
}

function calculateTrendDirection(recent: any[], ancien: any[], field: string) {
  const recentAvg = recent.reduce((sum, item) => sum + (item[field] || 0), 0) / recent.length
  const ancienAvg = ancien.reduce((sum, item) => sum + (item[field] || 0), 0) / ancien.length

  const variation = ((recentAvg - ancienAvg) / ancienAvg) * 100

  return {
    direction: variation > 5 ? "hausse" : variation < -5 ? "baisse" : "stable",
    pourcentage: Math.round(variation * 10) / 10,
  }
}

function calculateBenchmarks(metriques: any) {
  // Comparaisons avec les moyennes du secteur
  const benchmarks = {
    performanceCA: 85,
    tauxPresence: 88,
    productiviteMoyenne: 250,
    efficaciteCommerciale: 12,
  }

  return {
    vsCA: metriques.performanceCA - benchmarks.performanceCA,
    vsPresence: metriques.tauxPresence - benchmarks.tauxPresence,
    vsProductivite: metriques.productiviteMoyenne - benchmarks.productiviteMoyenne,
    vsEfficacite: metriques.efficaciteCommerciale - benchmarks.efficaciteCommerciale,
  }
}

function calculateScoreEvolution(historique: any[]) {
  // Évolution du score sur les derniers mois
  return historique.slice(-6).map((item) => ({
    periode: item.periode,
    score: item.scoreGlobal || 75,
  }))
}
