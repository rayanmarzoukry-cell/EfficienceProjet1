// src/services/EmailService.js

const nodemailer = require('nodemailer');
// Configurer votre transporteur SMTP (utiliser les variables d'environnement)
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // Ex: 'SendGrid' ou 'Gmail'
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Envoie le rapport PDF au cabinet client.
 */
async function sendReportEmail({ recipientEmail, subject, attachmentName, pdfBuffer }) {
    
    const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: recipientEmail,
        subject: subject,
        html: `
            <p>Cher Partenaire,</p>
            <p>Veuillez trouver ci-joint votre rapport d'analyse d'efficience dentaire pour le mois dernier. Ce rapport contient vos scores, vos indicateurs clés de performance et des recommandations personnalisées.</p>
            <p>N'hésitez pas à nous contacter si vous avez des questions.</p>
            <p>Cordialement,<br/>L'équipe Efficience-Dentaire</p>
        `,
        attachments: [
            {
                filename: attachmentName,
                content: pdfBuffer,
                contentType: 'application/pdf'
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[EmailService] E-mail envoyé à ${recipientEmail}`);
        return true;
    } catch (error) {
        console.error(`[EmailService] Échec de l'envoi à ${recipientEmail}: ${error.message}`);
        throw error;
    }
}

/**
 * Envoie une alerte interne en cas d'erreur de traitement.
 */
async function sendInternalAlert({ error, cabinetId, month }) {
    // Logique d'envoi à une adresse interne (ex: support@efficience.com)
    console.warn(`[EmailService] Alerte interne envoyée : Erreur de traitement pour le cabinet ${cabinetId}.`);
    // Laissez vide pour l'exemple, mais implémentez ici une notification critique.
}

module.exports = {
    sendReportEmail,
    sendInternalAlert
};