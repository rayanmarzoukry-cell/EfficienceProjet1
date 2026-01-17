const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI
const DATABASE_NAME = process.env.DATABASE_NAME || 'efficience'

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI non configuré')
  process.exit(1)
}

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
}, { collection: 'admins' })

const Admin = mongoose.model('Admin', adminSchema)

async function checkUsers() {
  try {
    console.log('🔍 Vérification des utilisateurs en MongoDB...\n')
    
    await mongoose.connect(MONGODB_URI, {
      dbName: DATABASE_NAME,
    })
    
    const users = await Admin.find({})
    
    console.log(`📊 Total d'utilisateurs trouvés: ${users.length}\n`)
    console.log('═══════════════════════════════════════════════════════')
    
    users.forEach((user, index) => {
      console.log(`\n👤 Utilisateur ${index + 1}:`)
      console.log(`   Email: "${user.email}"`)
      console.log(`   Password: "${user.password}"`)
      console.log(`   Role: "${user.role}"`)
      console.log(`   _id: ${user._id}`)
    })
    
    console.log('\n═══════════════════════════════════════════════════════')
    
    // Test de connexion avec chaque user
    console.log('\n🔐 Test de connexion:')
    
    for (const user of users) {
      console.log(`\n📧 Test avec email: "${user.email}"`)
      
      const found = await Admin.findOne({ email: user.email.toLowerCase() })
      
      if (found) {
        console.log(`   ✅ Utilisateur trouvé`)
        console.log(`   Email en BD: "${found.email}"`)
        console.log(`   Password en BD: "${found.password}"`)
        
        // Test password match
        if (found.password === user.password) {
          console.log(`   ✅ Password MATCH`)
        } else {
          console.log(`   ❌ Password MISMATCH`)
          console.log(`   Expected: "${user.password}"`)
          console.log(`   Got: "${found.password}"`)
        }
      } else {
        console.log(`   ❌ Utilisateur NOT FOUND`)
      }
    }
    
    await mongoose.connection.close()
    console.log('\n✅ Vérification terminée')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

checkUsers()
