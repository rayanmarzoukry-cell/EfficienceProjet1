// src/services/ReportService.js

// Supposez que vous avez installé et configuré Puppeteer ou un outil similaire
// const PDFGenerator = require('puppeteer'); 
const KpiResultModel = require('../models/KpiResult');

// Mappage des KPIs pour l'affichage lisible dans le rapport
const KPI_DISPLAY_MAP = {
    'PanierMoyenPatient': 'Panier Moyen par Patient (€)',
    'ProductionHoraireReelle': 'Production Horaire Réelle (€/h)',
    'MontantMoyenDevisPropose': 'Montant Moyen Devis (€)',
    'TauxAcceptationNombre': 'Taux d\'Acceptation (Nb)',
    'TauxAcceptationMontant': 'Taux d\'Acceptation (Montant)',
    // Ajoutez ici les autres KPIs (Encours, Nouveaux Patients, etc.)
};

// ==================================================================
// FONCTIONS UTILITAIRES POUR LA PRÉPARATION DES DONNÉES
// ==================================================================

/**
 * Attribue un poids au score pour calculer une performance globale.
 */
function getScoreWeight(score) {
    switch (score) {
        case 'Excellent': return 3;
        case 'Bon': return 2;
        case 'Moyen': return 1;
        case 'Faible': return -1;
        case 'Alerte Critique': return -3;
        default: return 0;
    }
}

/**
 * Organise les KpiResults en catégories logiques et calcule la performance globale.
 */
function structureReportData(kpiResults) {
    const data = {
        meta: { 
            totalKpis: kpiResults.length,
            totalScoreWeight: 0,
            syntheseRecommandation: [] 
        },
        sections: {
            'Performance & Rentabilité': [],
            'Gestion des Devis & Vente': [],
            'Planification & Activité': [] 
        }
    };
    
    kpiResults.forEach(kpi => {
        // Ajout à la synthèse des problèmes majeurs
        if (kpi.scoreEvaluation !== 'Excellent' && kpi.scoreEvaluation !== 'Bon') {
             data.meta.syntheseRecommandation.push({
                 kpiName: KPI_DISPLAY_MAP[kpi.kpiName] || kpi.kpiName,
                 score: kpi.scoreEvaluation,
                 reco: kpi.recommandation
             });
        }

        // Calcul du score global
        data.meta.totalScoreWeight += getScoreWeight(kpi.scoreEvaluation);

        const displayItem = {
            nom: KPI_DISPLAY_MAP[kpi.kpiName] || kpi.kpiName,
            valeur: (kpi.kpiName.includes('TauxAcceptation')) ? (kpi.valeurReelle * 100).toFixed(1) + '%' : kpi.valeurReelle.toFixed(0),
            cible: (kpi.kpiName.includes('TauxAcceptation')) ? (kpi.seuilCible * 100).toFixed(0) + '%' : kpi.seuilCible ? kpi.seuilCible.toFixed(0) : 'N/A',
            score: kpi.scoreEvaluation,
            recommandation: kpi.recommandation
        };

        // Assignation à la bonne section
        if (['PanierMoyenPatient', 'ProductionHoraireReelle'].includes(kpi.kpiName)) {
            data.sections['Performance & Rentabilité'].push(displayItem);
        } else if (kpi.kpiName.includes('Devis') || kpi.kpiName.includes('Acceptation')) {
            data.sections['Gestion des Devis & Vente'].push(displayItem);
        } else {
            data.sections['Planification & Activité'].push(displayItem);
        }
    });

    // Calcule la moyenne (simplifiée)
    data.meta.performanceGlobaleMoyenne = data.meta.totalKpis > 0 
        ? data.meta.totalScoreWeight / data.meta.totalKpis 
        : 0;
    
    return data;
}

// ==================================================================
// GÉNÉRATION DE L'HTML POUR LE PDF
// ==================================================================

/**
 * Construit le corps HTML stylisé du rapport.
 */
function generateHtmlReport(cabinetId, month, reportData) {
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Rapport Efficience - ${month}</title>
            <style>
                body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; color: #333; }
                h1 { color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
                h2 { color: #555; margin-top: 25px; }
                .score-excellent { color: #28a745; font-weight: bold; } /* Vert */
                .score-bon { color: #ffc107; font-weight: bold; } /* Jaune */
                .score-moyen { color: #fd7e14; } /* Orange */
                .score-faible, .score-alerte-critique { color: #dc3545; font-weight: bold; } /* Rouge */
                .kpi-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                .kpi-table th, .kpi-table td { border: 1px solid #dee2e6; padding: 8px; text-align: left; font-size: 14px; }
                .kpi-table th { background-color: #f8f9fa; }
                .reco-box { border: 1px dashed #007bff; padding: 15px; margin-top: 20px; background-color: #e9f7ff; }
            </style>
        </head>
        <body>
            <h1>Rapport Mensuel d'Analyse - ${month}</h1>
            <p>Cabinet Analysé: <b>${cabinetId}</b></p>
            
            <h2>Synthèse des Résultats Clés</h2>
            
            <div class="reco-box">
                <p><strong>Performance Globale (Score Moyen Pondéré) : ${reportData.meta.performanceGlobaleMoyenne.toFixed(2)}</strong></p>
                <h3>Focus Recommandé :</h3>
                ${reportData.meta.syntheseRecommandation.length > 0 
                    ? reportData.meta.syntheseRecommandation.map(item => 
                        `<p><strong>${item.score} sur ${item.kpiName} :</strong> ${item.reco}</p>`
                      ).join('')
                    : '<p>Bonne performance ! Tous les indicateurs majeurs sont "Bon" ou "Excellent".</p>'}
            </div>
            
            `;

    for (const sectionName in reportData.sections) {
        if (reportData.sections[sectionName].length === 0) continue;
        
        html += `<h2>${sectionName}</h2>`;
        html += `<table class="kpi-table">
                    <thead>
                        <tr>
                            <th>Indicateur</th>
                            <th>Réalisé</th>
                            <th>Cible/Idéal</th>
                            <th>Évaluation</th>
                            <th>Recommandation d'Action</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        reportData.sections[sectionName].forEach(item => {
            const scoreClass = 'score-' + item.score.toLowerCase().replace(/\s/g, '-');
            html += `
                <tr>
                    <td>${item.nom}</td>
                    <td>${item.valeur}</td>
                    <td>${item.cible}</td>
                    <td class="${scoreClass}"> ${item.score} </td>
                    <td>${item.recommandation || 'N/A'}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
        `;
    }

    html += `
        </body>
        </html>
    `;
    
    return html;
}

// ==================================================================
// FONCTION PRINCIPALE
// ==================================================================

/**
 * Fonction principale pour générer le rapport PDF
 */
async function generateMonthlyReport(cabinetId, month) {
    
    // 1. Récupérer les résultats de KPIs pour le mois donné (nécessite l'analyse préalable)
    const kpiResults = await KpiResultModel.find({ 
        cabinetId: cabinetId, 
        moisAnalyse: new Date(month) 
    }).lean();
    
    if (kpiResults.length === 0) {
        console.warn(`[ReportService] Aucun résultat KPI trouvé pour ${cabinetId} / ${month}.`);
        return null;
    }

    // 2. Structurer et organiser les données
    const reportData = structureReportData(kpiResults);
    
    // 3. Générer le contenu HTML du rapport
    const htmlContent = generateHtmlReport(cabinetId, month, reportData);

    // 4. Convertir l'HTML en PDF (fonction MOCK à implémenter avec Puppeteer/jsPDF)
    const pdfBuffer = await convertHtmlToPdf(htmlContent);

    return pdfBuffer; 
}

// MOCK de la fonction de conversion PDF (à implémenter)
async function convertHtmlToPdf(htmlContent) {
    //
    // ATTENTION : Remplacer ce MOCK par la logique Puppeteer/jsPDF
    //
    console.log('[ReportService] --- DEBUG : Conversion HTML en PDF (MOCK) ---');
    // Si vous voulez voir le HTML généré:
    // console.log(htmlContent); 
    console.log('Utiliser Puppeteer pour générer le buffer PDF final.');
    
    // Simuler un buffer PDF
    return Buffer.from("Contenu PDF généré"); 
}


module.exports = {
    generateMonthlyReport
};