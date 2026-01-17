// Test rapide de la configuration OpenAI
const key = process.env.OPENAI_API_KEY || 'NOT SET';
console.log('OPENAI_API_KEY status:');
console.log('- Exists:', key !== 'NOT SET');
console.log('- Starts with sk-proj:', key.startsWith('sk-proj'));
console.log('- Length:', key.length);
console.log('- First 20 chars:', key.substring(0, 20));

if (key === 'NOT SET') {
  console.log('\n⚠️  PROBLEM: OPENAI_API_KEY is not set!');
  console.log('Solution: Create/update .env.local with:');
  console.log('OPENAI_API_KEY=sk-proj-your-actual-key');
} else if (!key.startsWith('sk-proj')) {
  console.log('\n⚠️  PROBLEM: Key format looks wrong (should start with sk-proj)');
} else {
  console.log('\n✅ Key appears to be configured correctly');
}
