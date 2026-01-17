const testCreds = {
  admin: {
    email: "admin@efficience-dentaire.fr",
    password: "Efficience2026!"
  },
  user: {
    email: "user@efficience-dentaire.fr",
    password: "User2026!"
  }
}

console.log('🧪 Test de connexion API...\n')

async function testLogin(email, password, label) {
  try {
    console.log(`📧 Test ${label}:`)
    console.log(`   Email: "${email}"`)
    console.log(`   Password: "${password}"`)
    
    const response = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log(`   ✅ SUCCESS (${response.status})`)
      console.log(`   Token: ${data.token.substring(0, 30)}...`)
      console.log(`   Role: ${data.user.role}`)
    } else {
      console.log(`   ❌ FAILED (${response.status})`)
      console.log(`   Error: ${data.error}`)
    }
  } catch (err) {
    console.log(`   ❌ Exception: ${err.message}`)
  }
  console.log()
}

async function runTests() {
  await testLogin(testCreds.admin.email, testCreds.admin.password, "ADMIN")
  await testLogin(testCreds.user.email, testCreds.user.password, "USER")
  process.exit(0)
}

setTimeout(runTests, 1000)
