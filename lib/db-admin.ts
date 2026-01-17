import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://user:password@cluster.mongodb.net/efficience'
const DB_NAME = process.env.MONGODB_DB || process.env.DATABASE_NAME || 'efficience-db'

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  try {
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db(DB_NAME)

    cachedClient = client
    cachedDb = db

    console.log('✅ Connecté à MongoDB')
    return { client, db }
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error)
    throw error
  }
}

export async function getUsersCollection() {
  const { db } = await connectToDatabase()
  return db.collection('users')
}

export async function getAdminCollection() {
  const { db } = await connectToDatabase()
  return db.collection('admins')
}
