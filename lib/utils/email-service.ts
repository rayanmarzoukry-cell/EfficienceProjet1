// Service d'envoi d'emails (simulation)
// En production, utiliser Nodemailer ou SendGrid

export interface EmailConfig {
  from: string
  to: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    path: string
  }>
}

export class EmailService {
  private static config = {
    smtp: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    },
  }

  static async sendEmail(config: EmailConfig): Promise<boolean> {
    try {
      console.log("Envoi d'email:", {
        to: config.to,
        subject: config.subject,
        attachments: config.attachments?.length || 0,
      })

      // Simulation de l'envoi
      // En production, utiliser Nodemailer:
      /*
      const transporter = nodemailer.createTransporter(this.config.smtp)
      const result = await transporter.sendMail(config)
      return !!result.messageId
      */

      return true
    } catch (error) {
      console.error("Erreur envoi email:", error)
      return false
    }
  }

  static generateReportEmail(cabinetNom: string, scoreGlobal: number): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Efficience-Dentaire</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Votre rapport mensuel est disponible</p>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #1f2937; margin-top: 0;">Bonjour ${cabinetNom},</h2>
        
        <p>Votre rapport d'analyse mensuel est maintenant disponible.</p>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <div style="text-align: center;">
            <div style="font-size: 48px; font-weight: bold; color: ${scoreGlobal >= 80 ? "#10b981" : scoreGlobal >= 60 ? "#f59e0b" : "#ef4444"};">
              ${scoreGlobal}/100
            </div>
            <p style="margin: 5px 0 0 0; color: #6b7280;">Score de Performance</p>
          </div>
        </div>
        
        <p>Ce rapport contient :</p>
        <ul style="color: #4b5563;">
          <li>Analyse détaillée de vos performances</li>
          <li>Comparaison avec vos objectifs</li>
          <li>Recommandations personnalisées</li>
          <li>Prévisions pour le mois suivant</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Télécharger le rapport
          </a>
        </div>
        
        <p>Pour toute question, n'hésitez pas à nous contacter.</p>
        
        <p>Cordialement,<br>
        <strong>L'équipe Efficience-Dentaire</strong></p>
      </div>
      
      <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 12px; color: #6b7280;">
          © 2024 Efficience-Dentaire. Tous droits réservés.<br>
          Cet email a été envoyé automatiquement, merci de ne pas répondre.
        </p>
      </div>
    </div>
    `
  }
}
