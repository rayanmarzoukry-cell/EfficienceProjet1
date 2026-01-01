// src/automation/AutomationService.js

const cron = require('node-cron');
const AnalyticsService = require('../services/AnalyticsService');
const ReportService = require('../services/ReportService');
const EmailService = require('../services/EmailService'); // À créer
const CabinetRepository = require('../repositories/CabinetRepository'); // Pour obtenir la liste des cabinets

/**
 * Fonction pour démarrer la planification mensuelle.
 */
function startMonthlyAutomation() {
    // Planifie la tâche pour s'exécuter le 1er jour de chaque mois à 02:00 du matin.
    // Crontab: minutes (0-59) heure (0-23) jour_du_mois (1-31) mois (1-12) jour_de_la_semaine (0-7)
    // '0 2 1 * *' -> 0 minutes, 2 heures, 1er jour du mois, tous les mois, tous les jours de la semaine.
    cron.schedule('0 2 1 * *', () => {
        console.log('[AutomationService] Déclenchement de la tâche mensuelle de reporting...');
        processAllCabinetsReport();
    });

    console.log('[AutomationService] Tâche mensuelle de reporting planifiée (tous les 1ers du mois à 02:00).');
    
    // NOTE: Pour les tests, vous pouvez appeler la fonction directement:
    // processAllCabinetsReport();
}


/**
 * Traite le rapport pour tous les cabinets enregistrés.
 */
async function processAllCabinetsReport() {
    const today = new Date();
    // Nous analysons le mois précédent (Ex: le 1er décembre, nous analysons novembre)
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const monthString = lastMonth.toISOString().substring(0, 7); // Format AAAA-MM
    
    // 1. Récupérer la liste de tous les cabinets clients
    const cabinets = await CabinetRepository.getAllActiveCabinets(); 
    
    for (const cabinet of cabinets) {
        console.log(`[AutomationService] Traitement du cabinet : ${cabinet.id} (${cabinet.email})`);
        
        try {
            // A. Analyse des données et Scoring
            await AnalyticsService.generateKpiResults(cabinet.id, monthString);
            
            // B. Génération du Rapport PDF
            const pdfBuffer = await ReportService.generateMonthlyReport(cabinet.id, monthString);
            
            if (pdfBuffer) {
                // C. Envoi du Rapport par E-mail
                await EmailService.sendReportEmail({
                    recipientEmail: cabinet.email,
                    subject: `Rapport d'Efficience Dentaire - Analyse du mois de ${monthString}`,
                    attachmentName: `Rapport_Efficience_${monthString}_${cabinet.id}.pdf`,
                    pdfBuffer: pdfBuffer
                });
                console.log(`[AutomationService] Rapport envoyé avec succès au cabinet ${cabinet.id}.`);
            }
            
        } catch (error) {
            console.error(`[AutomationService] ERREUR fatale lors du traitement de ${cabinet.id} :`, error.message);
            // Loguer l'erreur ou envoyer une alerte à l'équipe interne
            await EmailService.sendInternalAlert({
                 error: error.message,
                 cabinetId: cabinet.id,
                 month: monthString
            });
        }
    }
    
    console.log('[AutomationService] Tâche de reporting mensuel terminée.');
}

module.exports = {
    startMonthlyAutomation
};