import mongoose from 'mongoose';

// 1. Déclaration globale pour le cache (évite de saturer les connexions avec Next.js)
declare global {
  var mongoose: { 
    conn: typeof import('mongoose') | null; 
    promise: Promise<typeof import('mongoose')> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Veuillez définir la variable d\'environnement MONGODB_URI dans .env.local'
  );
}

// 2. Initialisation du cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Fonction principale pour se connecter à MongoDB
 */
export async function initializeApp() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, 
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('[INIT] Connexion MongoDB réussie.');
      return mongooseInstance;
    }).catch((error) => {
      console.error('[INIT] Échec de la connexion à MongoDB:', error);
      cached.promise = null; 
      throw error;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

// --- LES EXPORTS POUR LA COMPATIBILITÉ ---

// Export standard pour le projet
export const connectDB = initializeApp;

// Export spécifique pour corriger ton erreur "connectToDatabase is not a function"
export const connectToDatabase = initializeApp;

// Export par défaut
export default initializeApp;