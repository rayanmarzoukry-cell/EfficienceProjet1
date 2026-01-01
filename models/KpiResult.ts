// models/KpiResult.ts (Le seul fichier restant)

import mongoose from 'mongoose';

const KpiResultSchema = new mongoose.Schema({
  cabinetId: { type: String, required: true, index: true },
  moisAnalyse: { type: Date, required: true, index: true },
  kpiName: { type: String, required: true },
  valeurReelle: { type: Number, required: true },
  seuilCible: { type: Number, required: true },
  scoreEvaluation: { type: String, enum: ['Bon', 'Moyen', 'Faible', 'Alerte Critique'], required: true },
  recommandation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// CRUCIAL : Utilisez mongoose.models ou mongoose.model
const KpiResult = (mongoose.models && mongoose.models.KpiResult) 
    ? mongoose.models.KpiResult 
    : mongoose.model('KpiResult', KpiResultSchema, 'kpiresults');

export default KpiResult;