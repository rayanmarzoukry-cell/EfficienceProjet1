import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default clientPromise;
