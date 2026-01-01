// seed-kpis.ts - Seed script pour insérer des données KPI test dans MongoDB

import mongoose from 'mongoose';

// Define the schema inline to avoid circular dependencies
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

const KpiResultModel = mongoose.models.KpiResult || mongoose.model('KpiResult', KpiResultSchema, 'kpiresults');

async function seedData() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set');
    
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[SEED] MongoDB connected');

    // Insert sample KPI documents for cabinetId 'demo'
    const docs = [
      {
        cabinetId: 'demo',
        moisAnalyse: new Date('2025-11-01'),
        kpiName: 'PanierMoyenPatient',
        valeurReelle: 120,
        seuilCible: 150,
        scoreEvaluation: 'Moyen' as const,
        recommandation: 'Augmenter le panier moyen par patient',
      },
      {
        cabinetId: 'demo',
        moisAnalyse: new Date('2025-11-01'),
        kpiName: 'ProductionHoraireReelle',
        valeurReelle: 85,
        seuilCible: 100,
        scoreEvaluation: 'Bon' as const,
        recommandation: 'Maintenir la productivité actuelle',
      },
      {
        cabinetId: 'demo',
        moisAnalyse: new Date('2025-11-01'),
        kpiName: 'TauxAcceptationNombre',
        valeurReelle: 45,
        seuilCible: 70,
        scoreEvaluation: 'Faible' as const,
        recommandation: 'Améliorer le taux d\'acceptation des devis',
      },
    ];

    await KpiResultModel.insertMany(docs);
    console.log(`[SEED] Inserted ${docs.length} documents`);
    
    await mongoose.connection.close();
    console.log('[SEED] Connection closed');
  } catch (error) {
    console.error('[SEED] Error:', error);
    process.exit(1);
  }
}

seedData();
