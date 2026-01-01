// Utilitaire pour la génération de PDF (simulation)
// En production, utiliser jsPDF ou Puppeteer

export interface RapportData {
  cabinet: {
    nom: string
    ville: string
    periode: string
  }
  performance: {
    scoreGlobal: number
    chiffreAffaires: number
    objectifCA: number
    nombreRDV: number
    tauxAbsence: number
  }
  analyses: string[]
  recommandations: string[]
}

export class PDFGenerator {
  static async generateReport(data: RapportData): Promise<string> {
    // Simulation de génération PDF
    console.log("Génération du rapport PDF pour:", data.cabinet.nom)

    // Structure du rapport
    const reportStructure = {
      header: {
        title: "Rapport Mensuel d'Analyse",
        subtitle: `${data.cabinet.nom} - ${data.cabinet.ville}`,
        periode: data.performance.periode || data.cabinet.periode,
        logo: "/logo-efficience-dentaire.png",
      },
      summary: {
        scoreGlobal: data.performance.scoreGlobal,
        metriques: [
          {
            label: "Chiffre d'affaires",
            valeur: data.performance.chiffreAffaires,
            objectif: data.performance.objectifCA,
            unite: "€",
          },
          {
            label: "Nombre de RDV",
            valeur: data.performance.nombreRDV,
            unite: "rendez-vous",
          },
          {
            label: "Taux d'absence",
            valeur: data.performance.tauxAbsence,
            unite: "%",
          },
        ],
      },
      sections: [
        {
          title: "Analyse des Performances",
          content: data.analyses,
        },
        {
          title: "Recommandations",
          content: data.recommandations,
        },
      ],
      footer: {
        contact: "contact@efficience-dentaire.fr",
        website: "www.efficience-dentaire.fr",
        dateGeneration: new Date().toLocaleDateString("fr-FR"),
      },
    }

    // En production, ici on utiliserait jsPDF ou Puppeteer
    // pour générer le vrai PDF

    const fileName = `rapport-${data.cabinet.nom.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.pdf`

    return `/reports/${fileName}`
  }

  static async generateTemplate(): Promise<string> {
    // Template de base pour les rapports
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Rapport Mensuel - Efficience Dentaire</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .score { font-size: 48px; font-weight: bold; color: #2563eb; }
        .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .metric { padding: 20px; background: #f3f4f6; border-radius: 8px; }
        .section { margin: 30px 0; }
        .recommendations { background: #fef3c7; padding: 20px; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Rapport Mensuel d'Analyse</h1>
        <h2>{{CABINET_NOM}} - {{PERIODE}}</h2>
      </div>
      
      <div class="score-section">
        <div class="score">{{SCORE_GLOBAL}}/100</div>
        <p>Score de Performance Global</p>
      </div>
      
      <div class="metrics">
        <div class="metric">
          <h3>Chiffre d'Affaires</h3>
          <p>{{CA_REEL}}€ / {{CA_OBJECTIF}}€</p>
        </div>
        <div class="metric">
          <h3>Rendez-vous</h3>
          <p>{{NB_RDV}} rendez-vous</p>
        </div>
        <div class="metric">
          <h3>Taux d'Absence</h3>
          <p>{{TAUX_ABSENCE}}%</p>
        </div>
      </div>
      
      <div class="section">
        <h2>Analyse des Performances</h2>
        <div>{{ANALYSE_CONTENU}}</div>
      </div>
      
      <div class="recommendations">
        <h2>Recommandations</h2>
        <ul>{{RECOMMANDATIONS_LIST}}</ul>
      </div>
    </body>
    </html>
    `
  }
}
