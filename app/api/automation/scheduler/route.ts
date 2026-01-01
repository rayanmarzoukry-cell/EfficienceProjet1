import { type NextRequest, NextResponse } from "next/server"
import cron from "node-cron"

// 🔄 AUTOMATISATION AVANCÉE avec node-cron
class AutomationScheduler {
  private jobs: Map<string, cron.ScheduledTask> = new Map()

  constructor() {
    this.initializeScheduledTasks()
  }

  private initializeScheduledTasks() {
    // 📅 Génération automatique des rapports mensuels (1er de chaque mois à 00:00)
    const monthlyReportsJob = cron.schedule(
      "0 0 1 * *",
      async () => {
        console.log("🔄 Démarrage génération rapports mensuels automatique")
        await this.executeMonthlyReportsGeneration()
      },
      {
        scheduled: false,
        timezone: "Europe/Paris",
      },
    )

    // 📧 Envoi automatique des emails (1er de chaque mois à 01:00)
    const monthlyEmailsJob = cron.schedule(
      "0 1 1 * *",
      async () => {
        console.log("📧 Démarrage envoi emails automatique")
        await this.executeMonthlyEmailSending()
      },
      {
        scheduled: false,
        timezone: "Europe/Paris",
      },
    )

    // 📊 Import automatique des données (tous les jours à 23:00)
    const dailyImportJob = cron.schedule(
      "0 23 * * *",
      async () => {
        console.log("📊 Démarrage import données automatique")
        await this.executeDailyDataImport()
      },
      {
        scheduled: false,
        timezone: "Europe/Paris",
      },
    )

    // 🚨 Vérification des alertes (toutes les heures)
    const alertsCheckJob = cron.schedule(
      "0 * * * *",
      async () => {
        console.log("🚨 Vérification des alertes")
        await this.executeAlertsCheck()
      },
      {
        scheduled: false,
        timezone: "Europe/Paris",
      },
    )

    // 🧹 Nettoyage des fichiers temporaires (tous les dimanches à 02:00)
    const cleanupJob = cron.schedule(
      "0 2 * * 0",
      async () => {
        console.log("🧹 Nettoyage des fichiers temporaires")
        await this.executeCleanup()
      },
      {
        scheduled: false,
        timezone: "Europe/Paris",
      },
    )

    // Enregistrer les tâches
    this.jobs.set("monthly-reports", monthlyReportsJob)
    this.jobs.set("monthly-emails", monthlyEmailsJob)
    this.jobs.set("daily-import", dailyImportJob)
    this.jobs.set("alerts-check", alertsCheckJob)
    this.jobs.set("cleanup", cleanupJob)

    console.log("✅ Tâches automatisées initialisées")
  }

  async executeMonthlyReportsGeneration() {
    try {
      // Récupérer tous les cabinets actifs
      const cabinets = await this.getActiveCabinets()
      const results = []

      for (const cabinet of cabinets) {
        try {
          // Récupérer les données du mois précédent
          const donnees = await this.getCabinetMonthlyData(cabinet.id)

          // Générer l'analyse IA
          const analyse = await this.generateAIAnalysis(cabinet.id, donnees)

          // Générer le rapport PDF
          const pdfPath = await this.generatePDFReport(cabinet, analyse)

          results.push({
            cabinetId: cabinet.id,
            nom: cabinet.nom,
            statut: "généré",
            pdfPath,
            dateGeneration: new Date().toISOString(),
          })

          console.log(`✅ Rapport généré pour ${cabinet.nom}`)
        } catch (error) {
          console.error(`❌ Erreur génération rapport ${cabinet.nom}:`, error)
          results.push({
            cabinetId: cabinet.id,
            nom: cabinet.nom,
            statut: "erreur",
            erreur: error.message,
          })
        }
      }

      // Sauvegarder les résultats
      await this.saveGenerationResults(results)

      console.log(
        `📊 Génération terminée: ${results.filter((r) => r.statut === "généré").length}/${results.length} rapports générés`,
      )

      return results
    } catch (error) {
      console.error("❌ Erreur génération rapports mensuels:", error)
      throw error
    }
  }

  async executeMonthlyEmailSending() {
    try {
      // Récupérer les rapports générés du mois
      const rapports = await this.getMonthlyReports()
      const results = []

      for (const rapport of rapports) {
        try {
          // Préparer le template email
          const emailTemplate = {
            type: "rapport_mensuel" as const,
            cabinet: {
              nom: rapport.cabinetNom,
              email: rapport.cabinetEmail,
              contact: rapport.cabinetContact,
            },
            data: {
              periode: rapport.periode,
              scoreGlobal: rapport.scoreGlobal,
              niveau: rapport.niveau,
              metriques: rapport.metriques,
              alertes: rapport.alertes,
              recommandations: rapport.recommandations,
            },
          }

          // Envoyer l'email avec le PDF
          const emailService = await import("@/lib/email-service-advanced")
          const sent = await emailService.emailService.sendMonthlyReport(emailTemplate, rapport.pdfPath)

          results.push({
            cabinetId: rapport.cabinetId,
            nom: rapport.cabinetNom,
            email: rapport.cabinetEmail,
            statut: sent ? "envoyé" : "erreur",
            dateEnvoi: new Date().toISOString(),
          })

          console.log(`📧 Email ${sent ? "envoyé" : "échoué"} pour ${rapport.cabinetNom}`)

          // Délai entre les envois
          await new Promise((resolve) => setTimeout(resolve, 2000))
        } catch (error) {
          console.error(`❌ Erreur envoi email ${rapport.cabinetNom}:`, error)
          results.push({
            cabinetId: rapport.cabinetId,
            nom: rapport.cabinetNom,
            statut: "erreur",
            erreur: error.message,
          })
        }
      }

      // Sauvegarder les résultats d'envoi
      await this.saveEmailResults(results)

      console.log(
        `📧 Envoi terminé: ${results.filter((r) => r.statut === "envoyé").length}/${results.length} emails envoyés`,
      )

      return results
    } catch (error) {
      console.error("❌ Erreur envoi emails mensuels:", error)
      throw error
    }
  }

  async executeDailyDataImport() {
    try {
      // Vérifier les sources de données configurées
      const dataSources = await this.getConfiguredDataSources()
      const results = []

      for (const source of dataSources) {
        try {
          let importedData = null

          switch (source.type) {
            case "api":
              importedData = await this.importFromAPI(source)
              break
            case "ftp":
              importedData = await this.importFromFTP(source)
              break
            case "email":
              importedData = await this.importFromEmail(source)
              break
            default:
              console.log(`⚠️ Type de source non supporté: ${source.type}`)
              continue
          }

          if (importedData) {
            // Valider et structurer les données
            const validatedData = await this.validateImportedData(importedData, source.cabinetId)

            // Sauvegarder en base
            await this.saveImportedData(validatedData)

            results.push({
              cabinetId: source.cabinetId,
              sourceType: source.type,
              recordsImported: validatedData.length,
              statut: "succès",
              dateImport: new Date().toISOString(),
            })

            console.log(`✅ Import réussi pour cabinet ${source.cabinetId}: ${validatedData.length} enregistrements`)
          }
        } catch (error) {
          console.error(`❌ Erreur import cabinet ${source.cabinetId}:`, error)
          results.push({
            cabinetId: source.cabinetId,
            sourceType: source.type,
            statut: "erreur",
            erreur: error.message,
          })
        }
      }

      console.log(
        `📊 Import quotidien terminé: ${results.filter((r) => r.statut === "succès").length}/${results.length} imports réussis`,
      )

      return results
    } catch (error) {
      console.error("❌ Erreur import quotidien:", error)
      throw error
    }
  }

  async executeAlertsCheck() {
    try {
      // Récupérer les données récentes de tous les cabinets
      const cabinets = await this.getActiveCabinets()
      const alertes = []

      for (const cabinet of cabinets) {
        try {
          // Récupérer les données récentes
          const recentData = await this.getRecentCabinetData(cabinet.id)

          // Vérifier les seuils d'alerte
          const cabinetAlertes = await this.checkAlertThresholds(cabinet, recentData)

          if (cabinetAlertes.length > 0) {
            alertes.push(...cabinetAlertes)

            // Envoyer les alertes critiques immédiatement
            const criticalAlerts = cabinetAlertes.filter((a) => a.priorite === "critique")
            if (criticalAlerts.length > 0) {
              await this.sendCriticalAlerts(cabinet, criticalAlerts)
            }
          }
        } catch (error) {
          console.error(`❌ Erreur vérification alertes cabinet ${cabinet.id}:`, error)
        }
      }

      if (alertes.length > 0) {
        console.log(`🚨 ${alertes.length} alertes détectées`)
        await this.saveAlerts(alertes)
      }

      return alertes
    } catch (error) {
      console.error("❌ Erreur vérification alertes:", error)
      throw error
    }
  }

  async executeCleanup() {
    try {
      const cleanupResults = {
        tempFiles: 0,
        oldReports: 0,
        logFiles: 0,
      }

      // Nettoyer les fichiers temporaires
      cleanupResults.tempFiles = await this.cleanTempFiles()

      // Archiver les anciens rapports
      cleanupResults.oldReports = await this.archiveOldReports()

      // Nettoyer les logs anciens
      cleanupResults.logFiles = await this.cleanOldLogs()

      console.log("🧹 Nettoyage terminé:", cleanupResults)

      return cleanupResults
    } catch (error) {
      console.error("❌ Erreur nettoyage:", error)
      throw error
    }
  }

  // Méthodes utilitaires (simulation)
  private async getActiveCabinets() {
    // Simulation - en production, récupérer depuis la base de données
    return [
      { id: 1, nom: "Cabinet Dr. Martin", email: "contact@cabinet-martin.fr" },
      { id: 2, nom: "Dentaire Plus Lyon", email: "admin@dentaire-plus.fr" },
    ]
  }

  private async getCabinetMonthlyData(cabinetId: number) {
    // Simulation - récupérer les données du mois précédent
    return {
      chiffreAffaires: 45000,
      nombreRendezVous: 180,
      nombreAbsences: 15,
      nouveauxPatients: 25,
    }
  }

  private async generateAIAnalysis(cabinetId: number, donnees: any) {
    // Appel à l'API d'analyse IA
    const response = await fetch("/api/analysis/advanced", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cabinetId, donnees }),
    })
    return await response.json()
  }

  private async generatePDFReport(cabinet: any, analyse: any) {
    // Génération du PDF
    const pdfGenerator = await import("@/lib/pdf-generator")
    return await pdfGenerator.generateAdvancedReport({
      cabinet,
      performance: analyse.data,
      analyse: analyse.data.analyse,
      predictions: analyse.data.predictions,
      recommandations: analyse.data.recommandations,
    })
  }

  // Méthodes utilitaires supplémentaires
  private async saveGenerationResults(results: any[]) {
    // Sauvegarder les résultats de génération en base
    console.log("💾 Sauvegarde résultats génération:", results.length)
  }

  private async getMonthlyReports() {
    // Récupérer les rapports du mois
    return [
      {
        cabinetId: 1,
        cabinetNom: "Cabinet Dr. Martin",
        cabinetEmail: "contact@cabinet-martin.fr",
        periode: "2024-11",
        scoreGlobal: 87,
        niveau: "Bon",
        pdfPath: "/reports/cabinet-1-2024-11.pdf",
        metriques: { performanceCA: 90, performanceRDV: 85 },
        alertes: [],
        recommandations: { immediates: ["Optimiser planning"] },
      },
    ]
  }

  private async saveEmailResults(results: any[]) {
    console.log("💾 Sauvegarde résultats emails:", results.length)
  }

  private async getConfiguredDataSources() {
    return [
      { cabinetId: 1, type: "api", url: "https://api.cabinet1.fr/data" },
      { cabinetId: 2, type: "ftp", host: "ftp.cabinet2.fr" },
    ]
  }

  private async importFromAPI(source: any) {
    console.log(`📡 Import API pour cabinet ${source.cabinetId}`)
    return [{ date: "2024-11-30", ca: 45000, rdv: 180 }]
  }

  private async importFromFTP(source: any) {
    console.log(`📁 Import FTP pour cabinet ${source.cabinetId}`)
    return [{ date: "2024-11-30", ca: 38000, rdv: 160 }]
  }

  private async importFromEmail(source: any) {
    console.log(`📧 Import Email pour cabinet ${source.cabinetId}`)
    return []
  }

  private async validateImportedData(data: any[], cabinetId: number) {
    return data.map((item) => ({
      cabinetId,
      ...item,
      dateImport: new Date().toISOString(),
      statut: "validé",
    }))
  }

  private async saveImportedData(data: any[]) {
    console.log("💾 Sauvegarde données importées:", data.length)
  }

  private async getRecentCabinetData(cabinetId: number) {
    return {
      performanceCA: 75, // Performance en baisse
      tauxAbsence: 18, // Taux d'absence élevé
      nouveauxPatients: 5, // Baisse significative
    }
  }

  private async checkAlertThresholds(cabinet: any, data: any) {
    const alertes = []

    if (data.performanceCA < 80) {
      alertes.push({
        cabinetId: cabinet.id,
        type: "performance_ca",
        message: `Performance CA en baisse: ${data.performanceCA}%`,
        priorite: "haute",
        valeur: data.performanceCA,
        seuil: 80,
      })
    }

    if (data.tauxAbsence > 15) {
      alertes.push({
        cabinetId: cabinet.id,
        type: "taux_absence",
        message: `Taux d'absence élevé: ${data.tauxAbsence}%`,
        priorite: "moyenne",
        valeur: data.tauxAbsence,
        seuil: 15,
      })
    }

    if (data.nouveauxPatients < 10) {
      alertes.push({
        cabinetId: cabinet.id,
        type: "nouveaux_patients",
        message: `Baisse critique nouveaux patients: ${data.nouveauxPatients}`,
        priorite: "critique",
        valeur: data.nouveauxPatients,
        seuil: 10,
      })
    }

    return alertes
  }

  private async sendCriticalAlerts(cabinet: any, alertes: any[]) {
    const emailService = await import("@/lib/email-service-advanced")
    const template = {
      type: "alerte" as const,
      cabinet: {
        nom: cabinet.nom,
        email: cabinet.email,
      },
      data: { alertes },
    }

    await emailService.emailService.sendAlert(template)
    console.log(`🚨 Alertes critiques envoyées à ${cabinet.nom}`)
  }

  private async saveAlerts(alertes: any[]) {
    console.log("💾 Sauvegarde alertes:", alertes.length)
  }

  private async cleanTempFiles() {
    console.log("🧹 Nettoyage fichiers temporaires")
    return 15 // Nombre de fichiers supprimés
  }

  private async archiveOldReports() {
    console.log("📦 Archivage anciens rapports")
    return 8 // Nombre de rapports archivés
  }

  private async cleanOldLogs() {
    console.log("🗑️ Nettoyage anciens logs")
    return 25 // Nombre de logs supprimés
  }

  // Méthodes de contrôle des tâches
  startJob(jobName: string) {
    const job = this.jobs.get(jobName)
    if (job) {
      job.start()
      console.log(`▶️ Tâche démarrée: ${jobName}`)
      return true
    }
    return false
  }

  stopJob(jobName: string) {
    const job = this.jobs.get(jobName)
    if (job) {
      job.stop()
      console.log(`⏹️ Tâche arrêtée: ${jobName}`)
      return true
    }
    return false
  }

  getJobStatus(jobName: string) {
    const job = this.jobs.get(jobName)
    return job
      ? {
          name: jobName,
          running: job.running || false,
          scheduled: true,
        }
      : null
  }

  getAllJobsStatus() {
    const status: any = {}
    this.jobs.forEach((job, name) => {
      status[name] = {
        running: job.running || false,
        scheduled: true,
      }
    })
    return status
  }

  startAllJobs() {
    this.jobs.forEach((job, name) => {
      job.start()
      console.log(`▶️ Démarrage: ${name}`)
    })
    console.log("🚀 Toutes les tâches automatisées sont démarrées")
  }

  stopAllJobs() {
    this.jobs.forEach((job, name) => {
      job.stop()
      console.log(`⏹️ Arrêt: ${name}`)
    })
    console.log("⏸️ Toutes les tâches automatisées sont arrêtées")
  }
}

// Instance globale du scheduler
const scheduler = new AutomationScheduler()

// API Routes pour contrôler l'automatisation
export async function POST(request: NextRequest) {
  try {
    const { action, jobName } = await request.json()

    switch (action) {
      case "start-job":
        const started = scheduler.startJob(jobName)
        return NextResponse.json({
          success: started,
          message: started ? `Tâche ${jobName} démarrée` : `Tâche ${jobName} introuvable`,
        })

      case "stop-job":
        const stopped = scheduler.stopJob(jobName)
        return NextResponse.json({
          success: stopped,
          message: stopped ? `Tâche ${jobName} arrêtée` : `Tâche ${jobName} introuvable`,
        })

      case "start-all":
        scheduler.startAllJobs()
        return NextResponse.json({
          success: true,
          message: "Toutes les tâches ont été démarrées",
        })

      case "stop-all":
        scheduler.stopAllJobs()
        return NextResponse.json({
          success: true,
          message: "Toutes les tâches ont été arrêtées",
        })

      case "execute-now":
        let result
        switch (jobName) {
          case "monthly-reports":
            result = await scheduler.executeMonthlyReportsGeneration()
            break
          case "monthly-emails":
            result = await scheduler.executeMonthlyEmailSending()
            break
          case "daily-import":
            result = await scheduler.executeDailyDataImport()
            break
          case "alerts-check":
            result = await scheduler.executeAlertsCheck()
            break
          case "cleanup":
            result = await scheduler.executeCleanup()
            break
          default:
            return NextResponse.json(
              {
                success: false,
                error: "Tâche non reconnue",
              },
              { status: 400 },
            )
        }

        return NextResponse.json({
          success: true,
          message: `Tâche ${jobName} exécutée avec succès`,
          data: result,
        })

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Action non reconnue",
          },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("Erreur API scheduler:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'exécution de la tâche",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const status = scheduler.getAllJobsStatus()

    return NextResponse.json({
      success: true,
      data: {
        scheduler: "active",
        jobs: status,
        lastUpdate: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération du statut",
      },
      { status: 500 },
    )
  }
}

// Démarrer automatiquement toutes les tâches au lancement
if (process.env.NODE_ENV === "production") {
  scheduler.startAllJobs()
}
