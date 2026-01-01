// src/services/AnalyticsService.js

const KpiThresholds = require('../../config/kpi_thresholds.json');
const KpiResult = require('../models/KpiResult');
const RawDataService = require('./RawDataService');

// ==================================================================
// FONCTIONS UTILITAIRES
// ==================================================================

/**
 * Fonction d'aide pour formater le résultat avant l'enregistrement
 */
function formatKpiResult(kpiName, result, cabinetId, month) {
    // Utilise la valeur réelle comme seuil si la cible est manquante ou zéro pour éviter les erreurs.
    const seuilCible = (result.seuilCible && result.seuilCible > 0) ? result.seuilCible : result.valeurReelle; 
    const ecartPourcentage = seuilCible > 0 ? (result.valeurReelle / seuilCible) - 1 : 0;
    
    return {
        cabinetId: cabinetId,
        moisAnalyse: new Date(month),
        kpiName: kpiName,
        valeurReelle: result.valeurReelle,
        seuilCible: result.seuilCible,
        ecartPourcentage: parseFloat(ecartPourcentage.toFixed(4)), // 4 décimales pour la précision
        scoreEvaluation: result.scoreEvaluation,
        recommandation: result.recommandation
    };
}


// ==================================================================
// CALCULS DES KPI (Logique Métier et Scoring)
// ==================================================================

/**
 * Calcule et score le Panier Moyen par Patient.
 */
function calculatePanierMoyen(ca, nbPatients) {
    const thresholds = KpiThresholds.analyse_activite_ca.PanierMoyenPatient;
    const panierMoyen = (nbPatients > 0) ? ca / nbPatients : 0;
    
    const ideal = thresholds.ideal;    // 800
    const standard = thresholds.standard; // 400

    let score = 'Faible';
    let recommandation = '';

    if (panierMoyen >= ideal) {
        score = 'Excellent';
    } else if (panierMoyen >= standard) {
        score = 'Bon';
        recommandation = `Le Panier Moyen (${panierMoyen.toFixed(0)}€) est bon mais doit atteindre l'objectif de ${ideal}€ (cible de développement majeure).`;
    } else {
        score = 'Alerte Critique';
        recommandation = 'Le Panier Moyen est très faible. Mettre l\'accent sur la systématisation des plans de traitement complets et la communication diagnostique.';
    }

    return {
        valeurReelle: panierMoyen,
        seuilCible: ideal,
        scoreEvaluation: score,
        recommandation: recommandation
    };
}

/**
 * Calcule et score la Production Horaire Réelle.
 */
function calculateProductionHoraire(ca, heuresTravaillees, objectifCabinet) {
    const thresholds = KpiThresholds.analyse_activite_ca.ProductionHoraireReelle;
    const prodHoraire = (heuresTravaillees > 0) ? ca / heuresTravaillees : 0;
    
    // Seuil de référence : Objectif personnalisé du cabinet (en rouge) ou seuil idéal global
    const seuilReference = objectifCabinet || thresholds.ideal_min; 
    const standard = thresholds.standard; // 180 €/h

    let score = 'Faible';
    let recommandation = '';

    if (prodHoraire >= seuilReference) {
        score = 'Excellent';
    } else if (prodHoraire >= standard) {
        score = 'Moyen';
        recommandation = `La Production Horaire réelle (${prodHoraire.toFixed(0)}€/h) est sous l'objectif de ${seuilReference}€/h. Vérifier l'organisation du travail et le respect des heures à haut potentiel (HP).`;
    } else {
        score = 'Alerte Critique';
        recommandation = 'La Production Horaire est très faible (< 180€/h). Indique un problème de désorganisation, de temps perdu, ou un manque sévère d\'actes à valeur ajoutée.';
    }

    return {
        valeurReelle: prodHoraire,
        seuilCible: seuilReference,
        scoreEvaluation: score,
        recommandation: recommandation
    };
}

/**
 * Calcule et score le Montant Moyen des Devis Proposés.
 */
function calculateMontantMoyenDevis(montantTotalPropositions, nbDevis) {
    const thresholds = KpiThresholds.analyse_devis_vente.MontantMoyenDevisPropose;
    const montantMoyen = (nbDevis > 0) ? montantTotalPropositions / nbDevis : 0;
    
    const idealMin = thresholds.ideal_min; // 800 €

    let score = 'Faible';
    let recommandation = '';

    if (montantMoyen >= idealMin) {
        score = 'Excellent';
    } else if (montantMoyen >= 400) { // Hypothèse: 400€ est un seuil bas mais acceptable.
        score = 'Moyen';
        recommandation = `Le montant moyen des devis proposés (${montantMoyen.toFixed(0)}€) est sous la cible de ${idealMin}€. Cela suggère que le diagnostic n'est pas toujours complet ou systématisé.`;
    } else {
        score = 'Alerte Critique';
        recommandation = 'Le montant moyen des devis est très bas. Revoir la capacité de diagnostic et la systématisation des plans de traitement complets.';
    }

    return {
        valeurReelle: montantMoyen,
        seuilCible: idealMin,
        scoreEvaluation: score,
        recommandation: recommandation
    };
}

/**
 * Calcule et score le Taux d'Acceptation (en Nombre et en Montant).
 * Retourne un objet complexe qui doit être formaté en deux KpiResults distincts.
 */
function calculateTauxAcceptation(rawData, objectifCabinet) {
    const devisData = rawData.devis;
    const thresholds = KpiThresholds.analyse_devis_vente;
    
    const nbDevis = devisData.nbDevis;
    const montantTotal = devisData.montantPropositionsTotal;

    const tauxAcceptationNb = (nbDevis > 0) ? devisData.nbDevisAcceptes / nbDevis : 0;
    const tauxAcceptationMontant = (montantTotal > 0) ? devisData.montantAccepteTotal / montantTotal : 0;

    // Seuil de référence : Objectif personnalisé du cabinet (en rouge)
    const objectifNb = objectifCabinet.ObjectifTauxAcceptation || thresholds.TauxAcceptationNb.ideal_min; 

    let score = 'Faible';
    let recommandation = '';

    // 1. Scoring du Taux en Nombre
    if (tauxAcceptationNb >= objectifNb) {
        score = 'Excellent';
    } else if (tauxAcceptationNb >= thresholds.TauxAcceptationNb.ideal_min) {
        score = 'Bon';
    } else {
        score = 'Alerte Critique';
        recommandation = `Le taux d'acceptation en nombre (${(tauxAcceptationNb * 100).toFixed(1)}%) est sous l'objectif de ${objectifNb * 100}%. Améliorer la communication et la présentation des devis.`;
    }

    // 2. Vérification de l'écart (Taux Montant vs. Taux Nombre)
    const ecartNbMontant = tauxAcceptationNb - tauxAcceptationMontant;
    if (ecartNbMontant > thresholds.TauxAcceptationMontant_EcartNb.ecart_max) { // Si l'écart est supérieur à 20%
        // Dégrade le score si l'écart est trop grand
        score = (score === 'Excellent') ? 'Bon' : 'Alerte Critique'; 
        recommandation += ` ALERTE : La perte d'acceptation en montant est trop élevée (${(ecartNbMontant * 100).toFixed(1)}% d'écart). Les gros devis sont refusés ou réduits.`;
    }

    return {
        valeurReelleNb: tauxAcceptationNb,
        valeurReelleMontant: tauxAcceptationMontant,
        seuilCible: objectifNb,
        scoreEvaluation: score,
        recommandation: recommandation
    };
}

// ==================================================================
// FONCTION PRINCIPALE (Orchestration)
// ==================================================================

/**
 * Orchestre la récupération des données, les calculs, le scoring et l'enregistrement
 */
async function generateKpiResults(cabinetId, month = '2024-05-01') {
    
    console.log(`[AnalyticsService] Démarrage de l'analyse pour le cabinet ${cabinetId} au mois de ${month}`);
    
    const rawData = await RawDataService.fetchMonthlyData(cabinetId, month);
    const objectives = await RawDataService.getCabinetObjectives(cabinetId);

    const ca = rawData.realisation.montantFactureTotal; 
    const nbPatients = rawData.realisation.nbPatientsVus; 
    const heuresTravaillees = rawData.realisation.nbHeuresTravaillees;

    const results = [];

    // --- 1. Calculs CA et Activité ---
    
    // Panier Moyen par Patient
    const pmResult = calculatePanierMoyen(ca, nbPatients);
    results.push(formatKpiResult('PanierMoyenPatient', pmResult, cabinetId, month));
    
    // Production Horaire Réelle
    const phrResult = calculateProductionHoraire(
        ca, 
        heuresTravaillees,
        objectives.ObjectifCAHoraire
    );
    results.push(formatKpiResult('ProductionHoraireReelle', phrResult, cabinetId, month));

    // --- 2. Calculs Devis et Vente ---
    
    // Montant Moyen des Devis Proposés
    const mmdResult = calculateMontantMoyenDevis(
        rawData.devis.montantPropositionsTotal,
        rawData.devis.nbDevis
    );
    results.push(formatKpiResult('MontantMoyenDevisPropose', mmdResult, cabinetId, month));

    // Taux d'Acceptation (en Nombre et Montant)
    const taResult = calculateTauxAcceptation(rawData, objectives);
    
    // Enregistrement du Taux en Nombre (pour le scoring principal)
    results.push(formatKpiResult('TauxAcceptationNombre', {
        valeurReelle: taResult.valeurReelleNb, 
        seuilCible: taResult.seuilCible,
        scoreEvaluation: taResult.scoreEvaluation,
        recommandation: taResult.recommandation
    }, cabinetId, month));
    
    // Enregistrement du Taux en Montant (pour l'affichage détaillé)
    results.push(formatKpiResult('TauxAcceptationMontant', {
        valeurReelle: taResult.valeurReelleMontant, 
        seuilCible: taResult.seuilCible,
        scoreEvaluation: taResult.scoreEvaluation, 
        recommandation: taResult.recommandation 
    }, cabinetId, month));

    // --- 3. Sauvegarder les résultats dans la base de données ---
    // Supprimez les anciens résultats pour ce mois avant d'insérer, si nécessaire
    // await KpiResult.deleteMany({ cabinetId: cabinetId, moisAnalyse: new Date(month) }); 
    
    await KpiResult.insertMany(results);
    console.log(`[AnalyticsService] Analyse terminée. ${results.length} KPIs enregistrés.`);

    return results;
}

module.exports = {
    generateKpiResults
};