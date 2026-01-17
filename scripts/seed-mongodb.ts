// scripts/seed-mongodb.ts
// Exécutez avec: npx ts-node scripts/seed-mongodb.ts

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Cabinet from '../models/Cabinet';
import Patient from '../models/Patient';
import RendezVous from '../models/RendezVous';

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

console.log('✅ MONGODB_URI loaded:', MONGODB_URI.substring(0, 50) + '...');

async function seedDatabase() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Vider les collections existantes
    console.log('🗑️ Nettoyage des collections...');
    await Cabinet.deleteMany({});
    await Patient.deleteMany({});
    await RendezVous.deleteMany({});

    // Données d'exemple pour cabinets
    const cabinetsData = [
      {
        id: 1,
        nom: "Dental Care Bordeaux",
        email: "contact@cabinetb.fr",
        phone: "05 56 12 34 56",
        score: 94,
        statut: "performant",
        caActuel: 52000,
        caObjectif: 50000,
        trend: "+5%",
        rapport: "Envoyé",
        rapportStatut: "sent",
      },
      {
        id: 2,
        nom: "Cabinet Dr. Martin",
        email: "dr.martin@cabinet.fr",
        phone: "05 67 89 01 23",
        score: 92,
        statut: "performant",
        caActuel: 45000,
        caObjectif: 40000,
        trend: "+3%",
        rapport: "Envoyé",
        rapportStatut: "sent",
      },
      {
        id: 3,
        nom: "Dr. Emmanuel (ER)",
        email: "emmanuel@cabinet.fr",
        phone: "06 12 34 56 78",
        score: 88,
        statut: "surveiller",
        caActuel: 38000,
        caObjectif: 40000,
        trend: "-1%",
        rapport: "À générer",
        rapportStatut: "pending",
      },
      {
        id: 4,
        nom: "Dr. Jean-Claude (JC)",
        email: "jc@cabinet.fr",
        phone: "05 98 76 54 32",
        score: 87,
        statut: "surveiller",
        caActuel: 45000,
        caObjectif: 45000,
        trend: "+2%",
        rapport: "Envoyé",
        rapportStatut: "sent",
      },
      {
        id: 5,
        nom: "Cabinet Sourire",
        email: "sourire@cabinet.fr",
        phone: "05 45 67 89 01",
        score: 76,
        statut: "alerte",
        caActuel: 32000,
        caObjectif: 40000,
        trend: "-8%",
        rapport: "À générer",
        rapportStatut: "pending",
      },
    ];

    // Données d'exemple pour patients
    const patientsData = [
      {
        name: "Jean Dupont",
        dateRDV: new Date('2026-01-15'),
        time: "09:00",
        type: "CONTRÔLE",
        status: "PRESENT",
        phone: "06 12 34 56 78",
        email: "jean@email.fr",
        cabinetId: "1",
      },
      {
        name: "Marie Martin",
        dateRDV: new Date('2026-01-15'),
        time: "09:30",
        type: "DÉTARTRAGE",
        status: "PRESENT",
        phone: "06 23 45 67 89",
        email: "marie@email.fr",
        cabinetId: "1",
      },
      {
        name: "Pierre Bernard",
        dateRDV: new Date('2026-01-15'),
        time: "10:00",
        type: "DÉTARTRAGE",
        status: "ATTENTE",
        phone: "06 34 56 78 90",
        email: "pierre@email.fr",
        cabinetId: "1",
      },
      {
        name: "Sophie Lefevre",
        dateRDV: new Date('2026-01-15'),
        time: "10:30",
        type: "DÉVITALISATION",
        status: "PRESENT",
        phone: "06 45 67 89 01",
        email: "sophie@email.fr",
        cabinetId: "2",
      },
      {
        name: "Luc Durand",
        dateRDV: new Date('2026-01-15'),
        time: "11:00",
        type: "CONTRÔLE",
        status: "ABSENT",
        phone: "06 56 78 90 12",
        email: "luc@email.fr",
        cabinetId: "2",
      },
    ];

    // Insérer les cabinets
    console.log('📝 Ajout des cabinets...');
    const createdCabinets = await Cabinet.insertMany(cabinetsData);
    console.log(`✅ ${createdCabinets.length} cabinets ajoutés`);

    // Insérer les patients
    console.log('📝 Ajout des patients...');
    const createdPatients = await Patient.insertMany(patientsData);
    console.log(`✅ ${createdPatients.length} patients ajoutés`);

    // Créer des rendez-vous
    console.log('📝 Ajout des rendez-vous...');
    const rendezvousData = createdPatients.map((patient, index) => ({
      patientId: patient._id,
      cabinetId: patient.cabinetId,
      dateRDV: patient.dateRDV,
      time: patient.time,
      type: patient.type,
      status: 'COMPLETED',
      duration: 30,
      notes: `RDV pour ${patient.type}`,
    }));

    const createdRDV = await RendezVous.insertMany(rendezvousData);
    console.log(`✅ ${createdRDV.length} rendez-vous ajoutés`);

    console.log('\n✨ Seed complété avec succès !');
    console.log(`📊 Résumé:`);
    console.log(`   - Cabinets: ${createdCabinets.length}`);
    console.log(`   - Patients: ${createdPatients.length}`);
    console.log(`   - RDV: ${createdRDV.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
}

seedDatabase();
