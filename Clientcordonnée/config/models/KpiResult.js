// src/models/KpiResult.js

const mongoose = require('mongoose');

const KpiResultSchema = new mongoose.Schema({
    cabinetId: { type: String, required: true },
    moisAnalyse: { type: Date, required: true },
    kpiName: { type: String, required: true, index: true }, // Index pour recherche rapide
    valeurReelle: { type: Number, required: true },
    seuilCible: { type: Number },
    ecartPourcentage: { type: Number },
    scoreEvaluation: { 
        type: String, 
        enum: ['Excellent', 'Bon', 'Moyen', 'Faible', 'Alerte Critique'],
        required: true 
    },
    recommandation: { type: String }
}, { timestamps: true });

// Exportez le modèle
module.exports = mongoose.model('KpiResult', KpiResultSchema);