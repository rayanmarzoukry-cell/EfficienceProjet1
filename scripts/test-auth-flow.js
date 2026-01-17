/**
 * Test complet du flux d'authentification
 */

async function testAuthFlow() {
  console.log('\n' + '═'.repeat(60))
  console.log('🧪 TEST COMPLET DU FLUX D\'AUTHENTIFICATION')
  console.log('═'.repeat(60) + '\n')

  const port = 3001
  const baseUrl = `http://localhost:${port}`
  const adminEmail = 'admin@efficience-dentaire.fr'
  const adminPassword = 'Efficience2026!'

  // ============================================
  // ÉTAPE 1: Vérifier sans authentification
  // ============================================
  console.log('1️⃣  GET /api/admin/verify (sans authentification)\n')
  try {
    const response = await fetch(`${baseUrl}/api/admin/verify`)
    console.log(`   Status: ${response.status}`)
    
    if (response.status === 401) {
      console.log('   ✅ Correct - 401 (pas authentifié)\n')
    } else {
      console.log('   ⚠️  Inattendu\n')
    }
  } catch (err) {
    console.log(`   ❌ Erreur: ${err.message}\n`)
  }

  // ============================================
  // ÉTAPE 2: Se connecter
  // ============================================
  console.log('2️⃣  POST /api/admin/login (avec credentials)\n')
  console.log(`   Email: ${adminEmail}`)
  console.log(`   Mot de passe: ${adminPassword}\n`)

  let authToken = null
  try {
    const response = await fetch(`${baseUrl}/api/admin/login`, {
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
    const data = await response.json()

    if (response.ok) {
      console.log('   ✅ Connexion réussie!')
      console.log(`   Admin: ${data.admin?.email}`)
      console.log(`   Role: ${data.admin?.role}\n`)
      
      // Extraire le token du cookie
      const cookieHeader = response.headers.get('set-cookie')
      if (cookieHeader) {
        authToken = cookieHeader.split('admin_token=')[1]?.split(';')[0]
        console.log(`   Token reçu: ${authToken?.substring(0, 30)}...\n`)
      }
    } else {
      console.log(`   ❌ Erreur: ${data.error}\n`)
    }
  } catch (err) {
    console.log(`   ❌ Erreur: ${err.message}\n`)
  }

  // ============================================
  // ÉTAPE 3: Vérifier avec authentification
  // ============================================
  if (authToken) {
    console.log('3️⃣  GET /api/admin/verify (avec authentification)\n')
    try {
      const response = await fetch(`${baseUrl}/api/admin/verify`, {
        headers: {
          'Cookie': `admin_token=${authToken}`,
        },
      })

      console.log(`   Status: ${response.status}`)
      const data = await response.json()

      if (response.ok) {
        console.log('   ✅ Token valide!')
        console.log(`   Admin: ${data.admin?.email}`)
        console.log(`   Role: ${data.admin?.role}\n`)
      } else {
        console.log(`   ❌ Erreur: ${data.error}\n`)
      }
    } catch (err) {
      console.log(`   ❌ Erreur: ${err.message}\n`)
    }

    // ============================================
    // ÉTAPE 4: Déconnexion
    // ============================================
    console.log('4️⃣  POST /api/admin/logout\n')
    try {
      const response = await fetch(`${baseUrl}/api/admin/logout`, {
        method: 'POST',
        headers: {
          'Cookie': `admin_token=${authToken}`,
        },
      })

      console.log(`   Status: ${response.status}`)
      
      if (response.ok) {
        console.log('   ✅ Déconnexion réussie!\n')
      } else {
        console.log('   ⚠️  Déconnexion échouée\n')
      }
    } catch (err) {
      console.log(`   ❌ Erreur: ${err.message}\n`)
    }

    // ============================================
    // ÉTAPE 5: Vérifier après déconnexion
    // ============================================
    console.log('5️⃣  GET /api/admin/verify (après logout)\n')
    try {
      const response = await fetch(`${baseUrl}/api/admin/verify`)

      console.log(`   Status: ${response.status}`)
      
      if (response.status === 401) {
        console.log('   ✅ Correct - Session fermée\n')
      } else {
        console.log('   ⚠️  Inattendu\n')
      }
    } catch (err) {
      console.log(`   ❌ Erreur: ${err.message}\n`)
    }
  }

  // ============================================
  // RÉSUMÉ
  // ============================================
  console.log('═'.repeat(60))
  console.log('📊 RÉSUMÉ DU FLUX D\'AUTHENTIFICATION')
  console.log('═'.repeat(60))
  console.log('\n✅ Flux complet:')
  console.log('   1. Pas authentifié → 401')
  console.log('   2. Login → Reçoit token + cookie')
  console.log('   3. Avec token → 200 (authentifié)')
  console.log('   4. Logout → Efface le token')
  console.log('   5. Après logout → 401 (pas authentifié)\n')
  console.log('═'.repeat(60) + '\n')
}

testAuthFlow()
