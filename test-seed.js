// test-seed.js - Simple test to insert KPI data (CommonJS)

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efficience-db';

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

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connected');

    const docs = [
      {
        cabinetId: 'demo',
        moisAnalyse: new Date('2025-11-01'),
        kpiName: 'PanierMoyenPatient',
        valeurReelle: 120,
        seuilCible: 150,
        scoreEvaluation: 'Moyen',
        recommandation: 'Augmenter le panier moyen par patient',
      },
      {
        cabinetId: 'demo',
        moisAnalyse: new Date('2025-11-01'),
        kpiName: 'ProductionHoraireReelle',
        valeurReelle: 85,
        seuilCible: 100,
        scoreEvaluation: 'Bon',
        recommandation: 'Maintenir la productivité actuelle',
      },
      {
        cabinetId: 'demo',
        moisAnalyse: new Date('2025-11-01'),
        kpiName: 'TauxAcceptationNombre',
        valeurReelle: 45,
        seuilCible: 70,
        scoreEvaluation: 'Faible',
        recommandation: 'Améliorer le taux d\'acceptation des devis',
      },
    ];

    // First, clear existing data for demo
    await KpiResultModel.deleteMany({ cabinetId: 'demo' });
    console.log('✅ Cleared existing demo data');

    // Then insert new data
    const result = await KpiResultModel.insertMany(docs);
    console.log(`✅ Inserted ${result.length} documents`);

    // Verify by querying back
    const verify = await KpiResultModel.find({ cabinetId: 'demo' });
    console.log(`✅ Verified: ${verify.length} documents in database`);

    await mongoose.connection.close();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
