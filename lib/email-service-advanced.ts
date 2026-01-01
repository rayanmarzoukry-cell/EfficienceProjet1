import nodemailer from "nodemailer"

// 📧 SERVICE D'ENVOI D'EMAILS AVANCÉ
export interface EmailTemplate {
  type: "rapport_mensuel" | "alerte" | "notification"
  cabinet: {
    nom: string
    email: string
    contact?: string
  }
  data: any
}

export class AdvancedEmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    // Configuration SMTP (à adapter selon le provider)
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  }

  async sendMonthlyReport(template: EmailTemplate, pdfPath: string): Promise<boolean> {
    try {
      const htmlContent = this.generateReportEmailHTML(template)

      const mailOptions = {
        from: `"Efficience-Dentaire" <${process.env.SMTP_FROM || "noreply@efficience-dentaire.fr"}>`,
        to: template.cabinet.email,
        subject: `📊 Rapport mensuel - ${template.cabinet.nom} - ${template.data.periode}`,
        html: htmlContent,
        attachments: [
          {
            filename: `rapport-${template.data.periode}.pdf`,
            path: pdfPath,
            contentType: "application/pdf",
          },
        ],
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log("Email envoyé:", result.messageId)

      return true
    } catch (error) {
      console.error("Erreur envoi email:", error)
      return false
    }
  }

  async sendAlert(template: EmailTemplate): Promise<boolean> {
    try {
      const htmlContent = this.generateAlertEmailHTML(template)

      const mailOptions = {
        from: `"Efficience-Dentaire Alertes" <${process.env.SMTP_FROM}>`,
        to: template.cabinet.email,
        subject: `🚨 Alerte Performance - ${template.cabinet.nom}`,
        html: htmlContent,
        priority: "high",
      }

      const result = await this.transporter.sendMail(mailOptions)
      return !!result.messageId
    } catch (error) {
      console.error("Erreur envoi alerte:", error)
      return false
    }
  }

  async sendBulkReports(templates: EmailTemplate[], pdfPaths: string[]): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0

    for (let i = 0; i < templates.length; i++) {
      try {
        const sent = await this.sendMonthlyReport(templates[i], pdfPaths[i])
        if (sent) success++
        else failed++

        // Délai entre les envois pour éviter le spam
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        failed++
        console.error(`Erreur envoi bulk ${i}:`, error)
      }
    }

    return { success, failed }
  }

  private generateReportEmailHTML(template: EmailTemplate): string {
    const { cabinet, data } = template

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rapport Mensuel - ${cabinet.nom}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .score-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
        .score-number { font-size: 48px; font-weight: bold; color: ${this.getScoreColor(data.scoreGlobal)}; margin: 10px 0; }
        .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
        .metric-card { background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #1e293b; }
        .metric-label { font-size: 12px; color: #64748b; margin-top: 5px; }
        .recommendations { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .alert { background: #fee2e2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin: 15px 0; }
        .alert-warning { background: #fef3c7; border-color: #fde68a; }
        .alert-success { background: #d1fae5; border-color: #a7f3d0; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">📊 Rapport Mensuel</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Efficience-Dentaire</p>
          <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 14px;">${cabinet.nom} - ${data.periode}</p>
        </div>

        <!-- Content -->
        <div class="content">
          <h2 style="color: #1f2937; margin-top: 0;">Bonjour ${cabinet.contact || "Docteur"},</h2>
          
          <p>Votre rapport d'analyse mensuel est maintenant disponible. Voici un aperçu de vos performances :</p>

          <!-- Score Global -->
          <div class="score-card">
            <div class="score-number">${data.scoreGlobal}/100</div>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-weight: 500;">Score de Performance Global</p>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Niveau: ${data.niveau}</p>
          </div>

          <!-- Métriques -->
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">${data.metriques?.performanceCA || 0}%</div>
              <div class="metric-label">Performance CA</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${data.metriques?.performanceRDV || 0}%</div>
              <div class="metric-label">Performance RDV</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${data.metriques?.tauxPresence || 0}%</div>
              <div class="metric-label">Taux de Présence</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${data.metriques?.nouveauxPatients || 0}</div>
              <div class="metric-label">Nouveaux Patients</div>
            </div>
          </div>

          <!-- Alertes -->
          ${
            data.alertes && data.alertes.length > 0
              ? `
          <div class="alert alert-warning">
            <h3 style="margin-top: 0; color: #92400e;">⚠️ Points d'Attention</h3>
            <ul style="margin: 10px 0;">
              ${data.alertes.map((alerte: any) => `<li>${alerte.message}</li>`).join("")}
            </ul>
          </div>
          `
              : ""
          }

          <!-- Recommandations -->
          <div class="recommendations">
            <h3 style="margin-top: 0; color: #92400e;">💡 Recommandations Clés</h3>
            <ul style="margin: 10px 0;">
              ${
                data.recommandations?.immediates
                  ?.slice(0, 3)
                  .map((rec: string) => `<li>${rec}</li>`)
                  .join("") || "<li>Continuez vos excellentes performances !</li>"
              }
            </ul>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" class="btn">📄 Télécharger le Rapport Complet</a>
          </div>

          <p>Le rapport PDF complet contient :</p>
          <ul style="color: #4b5563;">
            <li>✅ Analyse détaillée de vos performances</li>
            <li>📈 Graphiques d'évolution et tendances</li>
            <li>🎯 Comparaison avec vos objectifs</li>
            <li>🔮 Prévisions pour le mois suivant</li>
            <li>💡 Recommandations personnalisées</li>
          </ul>

          <p>Pour toute question ou accompagnement, notre équipe reste à votre disposition.</p>

          <p style="margin-top: 30px;">Cordialement,<br>
          <strong>L'équipe Efficience-Dentaire</strong></p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin: 0;">© 2024 Efficience-Dentaire. Tous droits réservés.</p>
          <p style="margin: 5px 0 0 0;">
            📧 support@efficience-dentaire.fr | 📞 01 23 45 67 89 | 🌐 www.efficience-dentaire.fr
          </p>
          <p style="margin: 10px 0 0 0; font-size: 10px;">
            Cet email a été envoyé automatiquement. Pour vous désabonner, <a href="#">cliquez ici</a>.
          </p>
        </div>
      </div>
    </body>
    </html>
    `
  }

  private generateAlertEmailHTML(template: EmailTemplate): string {
    const { cabinet, data } = template

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Alerte Performance - ${cabinet.nom}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #fef2f2; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .alert-box { background: #fee2e2; border: 1px solid #fecaca; border-radius: 6px; padding: 20px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Alerte Performance</h1>
          <p>${cabinet.nom}</p>
        </div>
        <div class="content">
          <h2>Attention requise</h2>
          <div class="alert-box">
            <h3>Alertes détectées :</h3>
            <ul>
              ${data.alertes?.map((alerte: any) => `<li><strong>${alerte.type.toUpperCase()}:</strong> ${alerte.message}</li>`).join("") || "<li>Performance en baisse détectée</li>"}
            </ul>
          </div>
          <p>Nous recommandons une action rapide pour corriger ces points.</p>
          <p>Notre équipe reste disponible pour vous accompagner.</p>
        </div>
      </div>
    </body>
    </html>
    `
  }

  private getScoreColor(score: number): string {
    if (score >= 90) return "#10b981"
    if (score >= 80) return "#3b82f6"
    if (score >= 70) return "#f59e0b"
    return "#ef4444"
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      console.log("✅ Connexion SMTP OK")
      return true
    } catch (error) {
      console.error("❌ Erreur connexion SMTP:", error)
      return false
    }
  }
}

export const emailService = new AdvancedEmailService()
