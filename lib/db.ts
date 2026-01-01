// lib/db.ts (Code Corrigé)

import mongoose from 'mongoose';

// 1. Déclaration globale pour le cache (requis pour TypeScript)
declare global {
  // Le type de 'conn' doit être l'instance de Mongoose ou null
  var mongoose: { 
    conn: typeof import('mongoose') | null; 
    promise: Promise<typeof import('mongoose')> | null;
  };
}

// 2. Vérification de la variable d'environnement
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Veuillez définir la variable d\'environnement MONGODB_URI dans .env.local'
  );
}

// 3. Initialisation du cache
// On utilise la propriété 'mongoose' de l'objet global (qui est conservé entre les recharges)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Fonction principale pour se connecter ou réutiliser la connexion MongoDB.
 */
export async function initializeApp() {
  // A. Si la connexion existe déjà (cache), la réutiliser.
  if (cached.conn) {
    // console.log('[DB] Utilisation de la connexion MongoDB existante.');
    return cached.conn;
  }

  // B. Si aucune promesse de connexion n'est en cours, en créer une nouvelle.
  if (!cached.promise) {
    console.log('[INIT] Connexion MongoDB en cours...');
    
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, 
    };

    // Mongoose.connect retourne une promesse qui résout à l'instance Mongoose (typeof mongoose)
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('[INIT] Connexion MongoDB réussie.');
        return mongooseInstance;
      })
      .catch((error) => {
        console.error('[INIT] Échec de la connexion à MongoDB:', error);
        cached.promise = null; 
        throw error;
      });
  }
  
  // C. Attendre la résolution de la promesse
  // Le type est géré par l'inférence de Mongoose.connect()
  cached.conn = await cached.promise;
  return cached.conn;
}