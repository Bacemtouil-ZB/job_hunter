import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri: string = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // En mode développement, utiliser une variable globale pour préserver la connexion
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // En mode production, créer une nouvelle connexion
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase(): Promise<Db> {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB_NAME || 'test';
  
  console.log(' Connecting to database:', dbName);
  console.log(' MONGODB_DB_NAME from env:', process.env.MONGODB_DB_NAME);
  
  const db = client.db(dbName);
  return db;
}

export default clientPromise;