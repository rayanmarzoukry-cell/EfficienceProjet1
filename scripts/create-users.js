const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI
const DATABASE_NAME = process.env.DATABASE_NAME || 'efficience'

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI non configuré dans .env.local')
  process.exit(1)
}

console.log('🔌 Utilisation de MONGODB_URI configuré')

// Schéma Admin
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
})

const Admin = mongoose.model('Admin', adminSchema, 'admins')

// Utilisateurs à créer
const users = [
  {
    email: 'admin@efficience-dentaire.fr',
    password: 'Efficience2026!',
    role: 'admin'
  },
  {
    email: 'user@efficience-dentaire.fr',
    password: 'User2026!',
    role: 'user'
  }
]

async function createUsers() {
  try {
    console.log('📝 Connexion à MongoDB...')
    
    await mongoose.connect(MONGODB_URI, {
      dbName: DATABASE_NAME,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    })
    
    console.log('✅ Connecté à MongoDB')
    
    // Supprimer les utilisateurs existants
    console.log('\n🗑️  Suppression des utilisateurs existants...')
    await Admin.deleteMany({})
    
    // Créer les nouveaux utilisateurs
    console.log('\n📊 Création des utilisateurs...\n')
    
    for (const user of users) {
      const created = await Admin.create(user)
      console.log(`✅ ${user.role.toUpperCase()} créé:`)
      console.log(`   Email: ${created.email}`)
      console.log(`   Mot de passe: ${user.password}`)
      console.log(`   Rôle: ${created.role}\n`)
    }
    
    console.log('\n✨ UTILISATEURS CRÉÉS AVEC SUCCÈS!\n')
    console.log('═══════════════════════════════════════════')
    console.log('📋 CREDENTIALS POUR LA CONNEXION')
    console.log('═══════════════════════════════════════════\n')
    
    console.log('👤 ADMINISTRATEUR:')
    console.log('   Email: admin@efficience-dentaire.fr')
    console.log('   Mot de passe: Efficience2026!')
    console.log('   Rôle: Administrator\n')
    
    console.log('👤 UTILISATEUR STANDARD:')
    console.log('   Email: user@efficience-dentaire.fr')
    console.log('   Mot de passe: User2026!')
    console.log('   Rôle: Standard User\n')
    
    console.log('═══════════════════════════════════════════')
    console.log('🌐 URL de connexion:')
    console.log('   http://localhost:3002/admin/login')
    console.log('═══════════════════════════════════════════\n')
    
    await mongoose.connection.close()
    console.log('🔌 Connexion MongoDB fermée')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

createUsers()
