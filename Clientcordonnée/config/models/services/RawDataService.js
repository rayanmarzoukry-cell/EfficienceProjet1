// src/services/RawDataService.js
// Ce service MOCK est à remplacer par votre logique d'API ou de lecture de fichiers LOGOSW

async function fetchMonthlyData(cabinetId, month) {
    // Les données sont basées sur vos exemples pour le mois de mai
    
    // --- Analyse Devis ---
    const devis = {
        nbDevis: 60, // Exemple: 2/jour * 30 jours
        montantPropositionsTotal: 72000, // 60 devis * 1200€ (montant moyen haut)
        nbDevisAcceptes: 24, // 40% de 60
        montantAccepteTotal: 50400 // 70% de 72000, pour simuler la perte
    };
    
    // --- Analyse Jour Ouvert & Réalisation (pour CA et Heures) ---
    const realisation = {
        montantFactureTotal: 35000, // Votre CA
        nbPatientsVus: 65, // Nombre de patients uniques vus dans le mois
        nbHeuresTravaillees: 175 // Heures réelles (à partir de jourouvert)
    };
    
    // --- Analyse Rendez-vous ---
    const rdv = {
        nbRdvTotal: 300, 
        dureeTotaleRdvMinutes: 8750 // 145.8 heures, pour le taux de remplissage
    };

    return {
        devis,
        realisation,
        rdv
    };
}

// Service pour récupérer les objectifs personnalisés du cabinet (Objectifs en ROUGE)
async function getCabinetObjectives(cabinetId) {
    // Simuler la lecture d'une table de configuration
    return {
        ObjectifCAHoraire: 350, // Exemple: 350 €/h
        ObjectifTauxAcceptation: 0.50 // Exemple: 50%
        // ... autres objectifs
    };
}

module.exports = {
    fetchMonthlyData,
    getCabinetObjectives
};