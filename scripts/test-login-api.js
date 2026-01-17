/**
 * Test de l'API login directement
 */

const bcrypt = require('bcryptjs')

async function testLogin() {
  console.log('\n🧪 TEST DE L\'API LOGIN\n')

  const adminEmail = 'admin@efficience-dentaire.fr'
  const adminPassword = 'Efficience2026!'

  // Test 1: Faire la requête à l'API
  console.log('1️⃣  Test de la requête POST /api/admin/login')
  console.log(`   Email: ${adminEmail}`)
  console.log(`   Mot de passe: ${adminPassword}\n`)

  try {
    const response = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
      }),
    })

    console.log(`   Status: ${response.status}`)
    console.log(`   Status Text: ${response.statusText}\n`)

    const data = await response.json()

    if (response.ok) {
      console.log('✅ LOGIN RÉUSSI!')
      console.log(`   Message: ${data.message}`)
      console.log(`   Admin Email: ${data.admin?.email}`)
      console.log(`   Admin Name: ${data.admin?.name}`)
      console.log(`   Admin Role: ${data.admin?.role}\n`)

      // Vérifier les cookies
      console.log('🍪 Cookies reçus:')
      const setCookie = response.headers.get('set-cookie')
      if (setCookie) {
        console.log(`   ✅ admin_token présent`)
      } else {
        console.log(`   ❌ Pas de cookie admin_token`)
      }
    } else {
      console.log('❌ LOGIN ÉCHOUÉ!')
      console.log(`   Erreur: ${data.error}`)
      console.log(`   Response complète: ${JSON.stringify(data, null, 2)}\n`)
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message)
    console.log('\n⚠️  Assurez-vous que le serveur est en cours d\'exécution:')
    console.log('   npm run dev')
  }
}

testLogin()
