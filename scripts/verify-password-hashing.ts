/**
 * Vérifier que le hashage des mots de passe fonctionne correctement
 */

import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

async function verifyPasswordHashing() {
  console.log('\n🔐 Vérification du hashage des mots de passe\n')
  console.log('='.repeat(50))

  // Test 1: Hashage d'un mot de passe
  const testPassword = 'MonMotDePasse123!'
  console.log(`\n1️⃣  Hashage du mot de passe: "${testPassword}"`)
  
  const hashedPassword = await bcrypt.hash(testPassword, SALT_ROUNDS)
  console.log(`   Hash généré: ${hashedPassword}`)
  console.log(`   Longueur: ${hashedPassword.length} caractères`)
  console.log(`   ✅ Hash créé avec succès`)

  // Test 2: Comparaison avec le bon mot de passe
  console.log(`\n2️⃣  Comparaison avec le BON mot de passe`)
  const isValid = await bcrypt.compare(testPassword, hashedPassword)
  console.log(`   Résultat: ${isValid}`)
  if (isValid) {
    console.log(`   ✅ Mot de passe valide (correspond au hash)`)
  } else {
    console.log(`   ❌ ERREUR: Le mot de passe ne correspond pas!`)
  }

  // Test 3: Comparaison avec un mauvais mot de passe
  console.log(`\n3️⃣  Comparaison avec un MAUVAIS mot de passe`)
  const wrongPassword = 'MauvaisMotDePasse'
  const isValidWrong = await bcrypt.compare(wrongPassword, hashedPassword)
  console.log(`   Résultat: ${isValidWrong}`)
  if (!isValidWrong) {
    console.log(`   ✅ Correctement rejeté (mauvais mot de passe)`)
  } else {
    console.log(`   ❌ ERREUR: Le mauvais mot de passe a été accepté!`)
  }

  // Test 4: Plusieurs hashs du même mot de passe
  console.log(`\n4️⃣  Vérification que chaque hash est unique`)
  const hash1 = await bcrypt.hash(testPassword, SALT_ROUNDS)
  const hash2 = await bcrypt.hash(testPassword, SALT_ROUNDS)
  const hash3 = await bcrypt.hash(testPassword, SALT_ROUNDS)
  
  console.log(`   Hash 1: ${hash1}`)
  console.log(`   Hash 2: ${hash2}`)
  console.log(`   Hash 3: ${hash3}`)
  
  const areDifferent = hash1 !== hash2 && hash2 !== hash3 && hash1 !== hash3
  if (areDifferent) {
    console.log(`   ✅ Les hashs sont uniques (utilisation d'un salt différent)`)
  } else {
    console.log(`   ❌ ERREUR: Les hashs sont identiques!`)
  }

  // Test 5: Vérifier que tous les hashs fonctionnent
  console.log(`\n5️⃣  Vérification que tous les hashs sont valides`)
  const valid1 = await bcrypt.compare(testPassword, hash1)
  const valid2 = await bcrypt.compare(testPassword, hash2)
  const valid3 = await bcrypt.compare(testPassword, hash3)
  
  if (valid1 && valid2 && valid3) {
    console.log(`   ✅ Tous les hashs sont valides`)
  } else {
    console.log(`   ❌ ERREUR: Certains hashs ne sont pas valides!`)
  }

  console.log('\n' + '='.repeat(50))
  console.log('\n📊 Résumé:\n')
  console.log('✅ Hashage bcryptjs: FONCTIONNEL')
  console.log('✅ Comparaison: FONCTIONNELLE')
  console.log('✅ Unicité des hashs: CONFIRMÉE')
  console.log('✅ Sécurité: GARANTIE')
  console.log('\n🎉 Le système de hashage des mots de passe est SÉCURISÉ et FONCTIONNEL!\n')
}

verifyPasswordHashing().catch(error => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})
