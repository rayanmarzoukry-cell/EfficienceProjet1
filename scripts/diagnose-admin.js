/**
 * Script de diagnostic - vérifie si l'admin existe en base
 */

const { MongoClient } = require('mongodb')

const MONGODB_URI = 'mongodb+srv://rayan_admin:Efficience2026@efficienceprojet.s1rcmkw.mongodb.net/efficience-db?retryWrites=true&w=majority'
const DATABASE_NAME = 'efficience-db'

async function diagnose() {
  let client = null

  try {
    console.log('\n🔍 DIAGNOSTIC - Vérification de l\'administrateur\n')

    // Connexion
    console.log('🔗 Connexion à MongoDB...')
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connecté\n')

    const db = client.db(DATABASE_NAME)
    console.log(`📊 Base de données: ${DATABASE_NAME}\n`)

    // Liste les collections
    console.log('📋 Collections disponibles:')
    const collections = await db.listCollections().toArray()
    collections.forEach(col => {
      console.log(`   - ${col.name}`)
    })
    console.log()

    // Vérifier l'admin
    const usersCollection = db.collection('users')
    const admin = await usersCollection.findOne({ role: 'admin' })

    if (admin) {
      console.log('✅ ADMINISTRATEUR TROUVÉ!')
      console.log(`   Email: ${admin.email}`)
      console.log(`   Nom: ${admin.name}`)
      console.log(`   Role: ${admin.role}`)
      console.log(`   Actif: ${admin.isActive}`)
      console.log(`   ID: ${admin._id}`)
      console.log(`   Hash du password: ${admin.password.substring(0, 30)}...`)
    } else {
      console.log('❌ AUCUN ADMINISTRATEUR TROUVÉ!')
      console.log('   Action: Créez l\'admin avec: node scripts/setup-admin.js')
    }

    console.log('\n')

  } catch (error) {
    console.error('\n❌ Erreur:', error.message, '\n')
  } finally {
    if (client) {
      await client.close()
    }
  }
}

diagnose()
