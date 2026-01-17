/**
 * Script pour initialiser une NOUVELLE base de données MongoDB
 * Crée: admin, cabinets, patients, rendez-vous, etc.
 */

const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

// =========================================
// CONFIGURATION - MODIFIEZ CES VALEURS
// =========================================
const MONGODB_URI = 'mongodb+srv://rayan_admin:Efficience2026@efficienceprojet.s1rcmkw.mongodb.net'
const NEW_DATABASE_NAME = 'efficience-prod'  // Changez le nom ici

// =========================================
// DONNÉES INITIALES
// =========================================
const initialData = {
  // Administrateur
  admin: {
    email: 'admin@efficience-dentaire.fr',
    name: 'Admin Efficience',
    password: 'Efficience2026!',
    role: 'admin',
    cabinet: '',
    isActive: true,
  },

  // Cabinets dentaires
  cabinets: [
    {
      nom: 'Cabinet Dentaire Centre',
      adresse: '123 Rue de Paris, 75000 Paris',
      telephone: '01 23 45 67 89',
      email: 'contact@cabinet-centre.fr',
      directeur: 'Dr. Jean Dupont',
      caActuel: 45000,
      caObjectif: 50000,
      dateCreation: new Date(),
      isActive: true,
    },
    {
      nom: 'Cabinet Smile',
      adresse: '456 Avenue des Champs, 75008 Paris',
      telephone: '01 98 76 54 32',
      email: 'contact@smile.fr',
      directeur: 'Dr. Marie Laurent',
      caActuel: 35000,
      caObjectif: 45000,
      dateCreation: new Date(),
      isActive: true,
    },
    {
      nom: 'Cabinet Dent Plus',
      adresse: '789 Boulevard Saint-Germain, 75005 Paris',
      telephone: '01 45 67 89 00',
      email: 'contact@dentplus.fr',
      directeur: 'Dr. Pierre Martin',
      caActuel: 28000,
      caObjectif: 40000,
      dateCreation: new Date(),
      isActive: true,
    },
  ],

  // Patients
  patients: [
    {
      nom: 'Dupont',
      prenom: 'Alice',
      email: 'alice.dupont@email.com',
      telephone: '06 12 34 56 78',
      dateNaissance: new Date('1990-05-15'),
      adresse: '10 Rue de la Paix, 75000 Paris',
      cabinet: 'Cabinet Dentaire Centre',
      dateInscription: new Date('2023-01-15'),
      dateLastVisite: new Date('2025-01-10'),
      dossierMedical: 'Détartrage, détection carie molaire gauche',
      isActive: true,
    },
    {
      nom: 'Martin',
      prenom: 'Bruno',
      email: 'bruno.martin@email.com',
      telephone: '06 23 45 67 89',
      dateNaissance: new Date('1985-08-22'),
      adresse: '20 Avenue de Rome, 75002 Paris',
      cabinet: 'Cabinet Smile',
      dateInscription: new Date('2022-06-20'),
      dateLastVisite: new Date('2025-01-05'),
      dossierMedical: 'Nettoyage, détartrage',
      isActive: true,
    },
    {
      nom: 'Bernard',
      prenom: 'Claire',
      email: 'claire.bernard@email.com',
      telephone: '06 34 56 78 90',
      dateNaissance: new Date('1992-03-10'),
      adresse: '30 Rue de Lyon, 75012 Paris',
      cabinet: 'Cabinet Dent Plus',
      dateInscription: new Date('2023-11-05'),
      dateLastVisite: new Date('2024-12-20'),
      dossierMedical: 'Détartrage, suivi orthodontie',
      isActive: true,
    },
  ],

  // Rendez-vous
  appointments: [
    {
      patient: 'Alice Dupont',
      cabinet: 'Cabinet Dentaire Centre',
      date: new Date('2025-01-20T09:00:00'),
      duree: 30,
      type: 'Nettoyage',
      statut: 'Confirmé',
      notes: 'RDV de routine',
      createdAt: new Date(),
    },
    {
      patient: 'Bruno Martin',
      cabinet: 'Cabinet Smile',
      date: new Date('2025-01-21T14:00:00'),
      duree: 45,
      type: 'Traitement',
      statut: 'En attente',
      notes: 'Dévitalisation carie',
      createdAt: new Date(),
    },
  ],

  // KPIs (métriques)
  kpis: [
    {
      cabinet: 'Cabinet Dentaire Centre',
      mois: '2025-01',
      revenu: 45000,
      nombrePatients: 150,
      nombreRdv: 200,
      tauxConversion: 85,
      tauxFidelite: 90,
    },
    {
      cabinet: 'Cabinet Smile',
      mois: '2025-01',
      revenu: 35000,
      nombrePatients: 120,
      nombreRdv: 160,
      tauxConversion: 80,
      tauxFidelite: 88,
    },
  ],
}

async function initializeDatabase() {
  let client = null

  try {
    console.log('\n' + '═'.repeat(70))
    console.log('🚀 INITIALISATION D\'UNE NOUVELLE BASE DE DONNÉES MONGODB')
    console.log('═'.repeat(70) + '\n')

    console.log(`📊 Base de données cible: ${NEW_DATABASE_NAME}\n`)

    // Connexion à MongoDB
    console.log('🔗 Connexion à MongoDB Atlas...')
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connecté\n')

    const db = client.db(NEW_DATABASE_NAME)

    // Vérifier si la base existe déjà
    console.log('🔍 Vérification des collections existantes...')
    const collections = await db.listCollections().toArray()

    if (collections.length > 0) {
      console.log('⚠️  La base contient déjà des collections!')
      console.log('   Voulez-vous continuer? (Cela ajoutera les données)\n')
    } else {
      console.log('✅ Base nouvelle - prête à être initialisée\n')
    }

    // ===================================
    // 1. CRÉER L'ADMINISTRATEUR
    // ===================================
    console.log('1️⃣  Création de l\'administrateur...')
    const usersCollection = db.collection('users')
    
    const adminExists = await usersCollection.findOne({ role: 'admin' })
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(initialData.admin.password, 10)
      const adminResult = await usersCollection.insertOne({
        ...initialData.admin,
        password: hashedPassword,
        createdAt: new Date(),
        lastLogin: null,
      })
      console.log(`   ✅ Admin créé: ${adminResult.insertedId}\n`)
    } else {
      console.log(`   ⚠️  Admin existe déjà\n`)
    }

    // ===================================
    // 2. CRÉER LES CABINETS
    // ===================================
    console.log('2️⃣  Création des cabinets dentaires...')
    const cabinetsCollection = db.collection('cabinets')
    
    const cabinetResult = await cabinetsCollection.insertMany(initialData.cabinets, { ordered: false })
    console.log(`   ✅ ${Object.keys(cabinetResult.insertedIds).length} cabinets créés\n`)

    // ===================================
    // 3. CRÉER LES PATIENTS
    // ===================================
    console.log('3️⃣  Création des patients...')
    const patientsCollection = db.collection('patients')
    
    const patientResult = await patientsCollection.insertMany(initialData.patients, { ordered: false })
    console.log(`   ✅ ${Object.keys(patientResult.insertedIds).length} patients créés\n`)

    // ===================================
    // 4. CRÉER LES RENDEZ-VOUS
    // ===================================
    console.log('4️⃣  Création des rendez-vous...')
    const appointmentsCollection = db.collection('rendezvous')
    
    const appointmentResult = await appointmentsCollection.insertMany(initialData.appointments, { ordered: false })
    console.log(`   ✅ ${Object.keys(appointmentResult.insertedIds).length} rendez-vous créés\n`)

    // ===================================
    // 5. CRÉER LES KPIs
    // ===================================
    console.log('5️⃣  Création des KPIs...')
    const kpisCollection = db.collection('kpis')
    
    const kpiResult = await kpisCollection.insertMany(initialData.kpis, { ordered: false })
    console.log(`   ✅ ${Object.keys(kpiResult.insertedIds).length} KPIs créés\n`)

    // ===================================
    // RÉSUMÉ
    // ===================================
    console.log('═'.repeat(70))
    console.log('✅ BASE DE DONNÉES INITIALISÉE AVEC SUCCÈS!')
    console.log('═'.repeat(70) + '\n')

    console.log('📊 Données créées:')
    console.log(`   ✓ 1 administrateur`)
    console.log(`   ✓ ${initialData.cabinets.length} cabinets`)
    console.log(`   ✓ ${initialData.patients.length} patients`)
    console.log(`   ✓ ${initialData.appointments.length} rendez-vous`)
    console.log(`   ✓ ${initialData.kpis.length} KPIs\n`)

    console.log('🔐 Credentials d\'accès:')
    console.log(`   Email: ${initialData.admin.email}`)
    console.log(`   Mot de passe: ${initialData.admin.password}\n`)

    console.log('📝 Mise à jour du .env.local:')
    console.log(`   MONGODB_URI: ${MONGODB_URI}/${NEW_DATABASE_NAME}`)
    console.log(`   MONGODB_DB: ${NEW_DATABASE_NAME}\n`)

    console.log('═'.repeat(70) + '\n')

  } catch (error) {
    if (error.code === 11000) {
      console.error('\n⚠️  Erreur: Les données existent déjà (doublon)')
      console.error('   Vous pouvez relancer avec une nouvelle base de données\n')
    } else {
      console.error('\n❌ Erreur:', error.message, '\n')
    }
  } finally {
    if (client) {
      await client.close()
      console.log('🔌 Déconnecté de MongoDB\n')
    }
  }
}

initializeDatabase()
