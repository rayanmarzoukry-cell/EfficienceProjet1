// app/init.js (Assurez-vous que les chemins d'importation sont corrects)

const AutomationService = require('./automation/AutomationService'); 
const mongoose = require('mongoose');

// Le drapeau pour garantir l'exécution unique du Cron Job.
global.isAutomationInitialized = global.isAutomationInitialized || Symbol('AutomationInit');

async function initializeApp() {
    if (global.isAutomationInitialized === true) {
        console.log('[INIT] Automation & DB déjà initialisées.');
        return;
    }

    try {
        // 1. Initialisation de la Base de Données (MongoDB)
        if (mongoose.connection.readyState !== 1) {
            console.log('[INIT] Connexion à MongoDB...');
            await mongoose.connect(process.env.MONGODB_URI); 
            console.log('[INIT] Connexion MongoDB réussie.');
        }

        // 2. Lancement de l'Automatisation (le Cron Job)
        AutomationService.startMonthlyAutomation(); 
        
        // 3. Marquer comme initialisé
        global.isAutomationInitialized = true;
        
        console.log('[INIT] Démarrage des services backend et Cron Job réussi.');

    } catch (error) {
        console.error('[INIT] ERREUR FATALE à l\'initialisation du backend:', error);
    }
}

module.exports = {
    initializeApp
};