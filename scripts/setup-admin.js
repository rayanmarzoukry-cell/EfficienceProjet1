/**
 * Script pour créer l'admin directement en MongoDB
 * Exécutez avec: node scripts/setup-admin.js
 */

const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

const MONGODB_URI = 'mongodb+srv://rayan_admin:Efficience2026@efficienceprojet.s1rcmkw.mongodb.net/efficience-db?retryWrites=true&w=majority'
const DATABASE_NAME = 'efficience-db'

async function setupAdmin() {
  let client = null

  try {
    console.log('\n🚀 Configuration de l\'administrateur...\n')

    // Connexion à MongoDB
    console.log('🔗 Connexion à MongoDB...')
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connecté à MongoDB\n')

    const db = client.db(DATABASE_NAME)
    const usersCollection = db.collection('users')

    // Vérifier si un admin existe
    console.log('🔍 Vérification des administrateurs existants...')
    const adminExists = await usersCollection.findOne({ role: 'admin' })

    if (adminExists) {
      console.log('⚠️  Un administrateur existe déjà!')
      console.log(`   Email: ${adminExists.email}`)
      console.log(`   Nom: ${adminExists.name}`)
      console.log('   Rien à faire.\n')
      return
    }

    // Créer l'admin par défaut
    const adminEmail = 'admin@efficience-dentaire.fr'
    const adminPassword = 'Efficience2026!'
    const adminName = 'Admin Efficience'

    console.log('📝 Création du nouvel administrateur:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Nom: ${adminName}`)
    console.log(`   Mot de passe: ${adminPassword}\n`)

    // Hash le mot de passe
    console.log('🔐 Hashage du mot de passe avec bcryptjs...')
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    console.log('✅ Mot de passe hashé\n')

    // Document admin
    const adminDoc = {
      email: adminEmail,
      name: adminName,
      password: hashedPassword,
      role: 'admin',
      cabinet: '',
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
    }

    // Insérer en base
    console.log('💾 Insertion en base de données...')
    const result = await usersCollection.insertOne(adminDoc)
    console.log(`✅ Administrateur créé avec succès!`)
    console.log(`   ID MongoDB: ${result.insertedId}\n`)

    // Vérifier le hashage
    console.log('✔️  Vérification du hashage...')
    const passwordValid = await bcrypt.compare(adminPassword, hashedPassword)
    if (passwordValid) {
      console.log('✅ Vérification réussie - le mot de passe est correct\n')
    } else {
      console.log('❌ ERREUR: Le mot de passe ne correspond pas!\n')
    }

    // Résumé
    console.log('═'.repeat(50))
    console.log('🎉 SUCCÈS! Administrateur configuré et prêt!')
    console.log('═'.repeat(50))
    console.log('\n📱 Vous pouvez maintenant vous connecter:\n')
    console.log('   🔗 URL: http://localhost:3000/admin/login')
    console.log(`   📧 Email: ${adminEmail}`)
    console.log(`   🔑 Mot de passe: ${adminPassword}`)
    console.log('\n')

  } catch (error) {
    console.error('\n❌ Erreur:', error.message, '\n')
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log('🔌 Déconnecté de MongoDB\n')
    }
  }
}

setupAdmin()
