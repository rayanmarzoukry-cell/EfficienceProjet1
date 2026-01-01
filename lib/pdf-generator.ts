import { jsPDF } from "jspdf"

// 📄 GÉNÉRATION DE RAPPORTS PDF AVANCÉE
export interface RapportCompletData {
  cabinet: {
    nom: string
    ville: string
    periode: string
    logo?: string
  }
  performance: {
    scoreGlobal: number
    niveau: string
    metriques: any
    evolution: any[]
  }
  analyse: {
    resume: string
    pointsForts: string[]
    pointsAmelioration: string[]
    risques: string[]
  }
  predictions: {
    prochainMois: any
    tendanceTrimestrielle: string
    alertes: any[]
  }
  recommandations: {
    immediates: string[]
    moyenTerme: string[]
    strategiques: string[]
  }
  graphiques?: {
    evolution: string // Base64 image
    repartition: string // Base64 image
  }
}

export class AdvancedPDFGenerator {
  private doc: jsPDF
  private pageHeight: number
  private pageWidth: number
  private currentY: number
  private margin: number

  constructor() {
    this.doc = new jsPDF()
    this.pageHeight = this.doc.internal.pageSize.height
    this.pageWidth = this.doc.internal.pageSize.width
    this.currentY = 20
    this.margin = 20
  }

  async generateCompletReport(data: RapportCompletData): Promise<string> {
    try {
      // Page de couverture
      this.generateCoverPage(data)

      // Page de résumé exécutif
      this.addNewPage()
      this.generateExecutiveSummary(data)

      // Page de métriques détaillées
      this.addNewPage()
      this.generateMetricsPage(data)

      // Page d'analyse
      this.addNewPage()
      this.generateAnalysisPage(data)

      // Page de recommandations
      this.addNewPage()
      this.generateRecommendationsPage(data)

      // Page d'annexes
      this.addNewPage()
      this.generateAppendixPage(data)

      // Génération du PDF
      const pdfBlob = this.doc.output("blob")
      const fileName = `rapport-${data.cabinet.nom.toLowerCase().replace(/\s+/g, "-")}-${data.cabinet.periode}.pdf`

      // En production, sauvegarder le fichier sur le serveur ou cloud storage
      console.log(`PDF généré: ${fileName}, taille: ${pdfBlob.size} bytes`)

      return `/reports/${fileName}`
    } catch (error) {
      console.error("Erreur génération PDF:", error)
      throw new Error("Erreur lors de la génération du rapport PDF")
    }
  }

  private generateCoverPage(data: RapportCompletData) {
    // Header avec logo
    this.doc.setFontSize(24)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("RAPPORT MENSUEL D'ANALYSE", this.pageWidth / 2, 40, { align: "center" })

    this.doc.setFontSize(18)
    this.doc.setFont("helvetica", "normal")
    this.doc.text("Efficience-Dentaire", this.pageWidth / 2, 55, { align: "center" })

    // Informations du cabinet
    this.currentY = 80
    this.doc.setFontSize(16)
    this.doc.setFont("helvetica", "bold")
    this.doc.text(data.cabinet.nom, this.pageWidth / 2, this.currentY, { align: "center" })

    this.currentY += 10
    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "normal")
    this.doc.text(data.cabinet.ville, this.pageWidth / 2, this.currentY, { align: "center" })

    // Score global en grand
    this.currentY = 120
    this.doc.setFontSize(48)
    this.doc.setFont("helvetica", "bold")
    const scoreColor = this.getScoreColor(data.performance.scoreGlobal)
    this.doc.setTextColor(scoreColor.r, scoreColor.g, scoreColor.b)
    this.doc.text(`${data.performance.scoreGlobal}/100`, this.pageWidth / 2, this.currentY, { align: "center" })

    this.currentY += 15
    this.doc.setFontSize(14)
    this.doc.setTextColor(0, 0, 0)
    this.doc.text(`Niveau: ${data.performance.niveau}`, this.pageWidth / 2, this.currentY, { align: "center" })

    // Période
    this.currentY = 180
    this.doc.setFontSize(12)
    this.doc.text(`Période: ${data.cabinet.periode}`, this.pageWidth / 2, this.currentY, { align: "center" })

    // Date de génération
    this.currentY = 250
    this.doc.setFontSize(10)
    this.doc.setTextColor(128, 128, 128)
    this.doc.text(`Rapport généré le ${new Date().toLocaleDateString("fr-FR")}`, this.pageWidth / 2, this.currentY, {
      align: "center",
    })
  }

  private generateExecutiveSummary(data: RapportCompletData) {
    this.addSectionTitle("RÉSUMÉ EXÉCUTIF")

    // Résumé principal
    this.doc.setFontSize(11)
    this.doc.setFont("helvetica", "normal")
    const resumeLines = this.doc.splitTextToSize(data.analyse.resume, this.pageWidth - 2 * this.margin)
    this.doc.text(resumeLines, this.margin, this.currentY)
    this.currentY += resumeLines.length * 5 + 10

    // Métriques clés en tableau
    this.addSubTitle("Indicateurs Clés")
    this.generateMetricsTable(data.performance.metriques)

    // Points forts
    this.addSubTitle("Points Forts")
    data.analyse.pointsForts.forEach((point, index) => {
      this.doc.text(`• ${point}`, this.margin + 5, this.currentY)
      this.currentY += 6
    })

    this.currentY += 5

    // Points d'amélioration
    this.addSubTitle("Points d'Amélioration")
    data.analyse.pointsAmelioration.forEach((point, index) => {
      this.doc.text(`• ${point}`, this.margin + 5, this.currentY)
      this.currentY += 6
    })
  }

  private generateMetricsPage(data: RapportCompletData) {
    this.addSectionTitle("ANALYSE DÉTAILLÉE DES PERFORMANCES")

    // Graphique d'évolution (si disponible)
    if (data.graphiques?.evolution) {
      this.doc.addImage(data.graphiques.evolution, "PNG", this.margin, this.currentY, 170, 80)
      this.currentY += 90
    }

    // Tableau détaillé des métriques
    this.generateDetailedMetricsTable(data.performance)

    // Comparaisons sectorielles
    this.addSubTitle("Comparaison Sectorielle")
    this.generateBenchmarkTable(data.performance.metriques)
  }

  private generateAnalysisPage(data: RapportCompletData) {
    this.addSectionTitle("ANALYSE APPROFONDIE")

    // Analyse IA
    this.addSubTitle("Analyse Intelligente")
    const analyseLines = this.doc.splitTextToSize(data.analyse.resume, this.pageWidth - 2 * this.margin)
    this.doc.text(analyseLines, this.margin, this.currentY)
    this.currentY += analyseLines.length * 5 + 10

    // Prédictions
    this.addSubTitle("Prévisions")
    this.doc.text(`Tendance trimestrielle: ${data.predictions.tendanceTrimestrielle}`, this.margin, this.currentY)
    this.currentY += 8
    this.doc.text(
      `CA prévu mois prochain: ${data.predictions.prochainMois.chiffreAffairesPrevu?.toLocaleString("fr-FR")}€`,
      this.margin,
      this.currentY,
    )
    this.currentY += 15

    // Alertes
    if (data.predictions.alertes.length > 0) {
      this.addSubTitle("Alertes")
      data.predictions.alertes.forEach((alerte) => {
        const color =
          alerte.type === "critical"
            ? { r: 220, g: 38, b: 38 }
            : alerte.type === "warning"
              ? { r: 245, g: 158, b: 11 }
              : { r: 59, g: 130, b: 246 }
        this.doc.setTextColor(color.r, color.g, color.b)
        this.doc.text(`⚠ ${alerte.message}`, this.margin, this.currentY)
        this.doc.setTextColor(0, 0, 0)
        this.currentY += 8
      })
    }
  }

  private generateRecommendationsPage(data: RapportCompletData) {
    this.addSectionTitle("RECOMMANDATIONS PERSONNALISÉES")

    // Recommandations immédiates
    this.addSubTitle("Actions Immédiates")
    data.recommandations.immediates.forEach((rec) => {
      this.doc.setTextColor(220, 38, 38)
      this.doc.text("●", this.margin, this.currentY)
      this.doc.setTextColor(0, 0, 0)
      this.doc.text(rec, this.margin + 8, this.currentY)
      this.currentY += 8
    })

    this.currentY += 5

    // Recommandations moyen terme
    this.addSubTitle("Moyen Terme (1-3 mois)")
    data.recommandations.moyenTerme.forEach((rec) => {
      this.doc.setTextColor(245, 158, 11)
      this.doc.text("●", this.margin, this.currentY)
      this.doc.setTextColor(0, 0, 0)
      this.doc.text(rec, this.margin + 8, this.currentY)
      this.currentY += 8
    })

    this.currentY += 5

    // Recommandations stratégiques
    this.addSubTitle("Stratégiques (3-6 mois)")
    data.recommandations.strategiques.forEach((rec) => {
      this.doc.setTextColor(59, 130, 246)
      this.doc.text("●", this.margin, this.currentY)
      this.doc.setTextColor(0, 0, 0)
      this.doc.text(rec, this.margin + 8, this.currentY)
      this.currentY += 8
    })
  }

  private generateAppendixPage(data: RapportCompletData) {
    this.addSectionTitle("ANNEXES")

    // Méthodologie
    this.addSubTitle("Méthodologie de Calcul")
    const methodologie = [
      "Score Global: Moyenne pondérée des indicateurs clés",
      "Performance CA: (Réalisé / Objectif) × 100",
      "Taux de Présence: (1 - Absences/RDV) × 100",
      "Analyse IA: Traitement par intelligence artificielle",
    ]

    methodologie.forEach((item) => {
      this.doc.text(`• ${item}`, this.margin, this.currentY)
      this.currentY += 6
    })

    this.currentY += 10

    // Contact
    this.addSubTitle("Contact & Support")
    this.doc.text("Email: support@efficience-dentaire.fr", this.margin, this.currentY)
    this.currentY += 6
    this.doc.text("Téléphone: 01 23 45 67 89", this.margin, this.currentY)
    this.currentY += 6
    this.doc.text("Site web: www.efficience-dentaire.fr", this.margin, this.currentY)
  }

  private addSectionTitle(title: string) {
    this.doc.setFontSize(16)
    this.doc.setFont("helvetica", "bold")
    this.doc.setTextColor(59, 130, 246)
    this.doc.text(title, this.margin, this.currentY)
    this.currentY += 15
    this.doc.setTextColor(0, 0, 0)
  }

  private addSubTitle(title: string) {
    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "bold")
    this.doc.text(title, this.margin, this.currentY)
    this.currentY += 10
    this.doc.setFont("helvetica", "normal")
  }

  private generateMetricsTable(metriques: any) {
    const tableData = [
      ["Indicateur", "Valeur", "Statut"],
      ["Performance CA", `${metriques.performanceCA}%`, this.getStatusText(metriques.performanceCA, 90)],
      ["Performance RDV", `${metriques.performanceRDV}%`, this.getStatusText(metriques.performanceRDV, 90)],
      ["Taux de Présence", `${metriques.tauxPresence}%`, this.getStatusText(metriques.tauxPresence, 85)],
      ["Productivité", `${metriques.productiviteMoyenne}€/RDV`, "Normal"],
    ]

    this.generateSimpleTable(tableData)
  }

  private generateDetailedMetricsTable(performance: any) {
    // Implémentation d'un tableau détaillé
    this.addSubTitle("Métriques Détaillées")
    // ... code du tableau détaillé
    this.currentY += 40
  }

  private generateBenchmarkTable(metriques: any) {
    // Implémentation du tableau de comparaison sectorielle
    this.currentY += 30
  }

  private generateSimpleTable(data: string[][]) {
    const startY = this.currentY
    const rowHeight = 8
    const colWidth = (this.pageWidth - 2 * this.margin) / data[0].length

    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = this.margin + colIndex * colWidth
        const y = startY + rowIndex * rowHeight

        if (rowIndex === 0) {
          this.doc.setFont("helvetica", "bold")
        } else {
          this.doc.setFont("helvetica", "normal")
        }

        this.doc.text(cell, x + 2, y)
      })
    })

    this.currentY = startY + data.length * rowHeight + 10
  }

  private addNewPage() {
    this.doc.addPage()
    this.currentY = 20
  }

  private getScoreColor(score: number) {
    if (score >= 90) return { r: 16, g: 185, b: 129 } // Vert
    if (score >= 80) return { r: 59, g: 130, b: 246 } // Bleu
    if (score >= 70) return { r: 245, g: 158, b: 11 } // Orange
    return { r: 239, g: 68, b: 68 } // Rouge
  }

  private getStatusText(value: number, threshold: number): string {
    return value >= threshold ? "Excellent" : value >= threshold * 0.8 ? "Bon" : "À améliorer"
  }
}

// Fonction utilitaire pour générer un rapport complet
export async function generateAdvancedReport(data: RapportCompletData): Promise<string> {
  const generator = new AdvancedPDFGenerator()
  return await generator.generateCompletReport(data)
}
