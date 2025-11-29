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
  const dbName = process.env.MONGODB_DB_NAME || 'jobfinder';
  
  console.log('🔌 Connecting to database:', dbName);
  console.log('📝 MONGODB_DB_NAME from env:', process.env.MONGODB_DB_NAME);
  
  const db = client.db(dbName);
  
  // Vérifier les collections disponibles
  try {
    const collections = await db.listCollections().toArray();
    console.log('📚 Available collections:', collections.map(c => c.name));
    
    // Compter les documents dans la collection jobs
    const jobCount = await db.collection('jobs').countDocuments();
    console.log('📊 Total jobs in collection:', jobCount);
  } catch (error) {
    console.error('❌ Error listing collections:', error);
  }
  
  return db;
}

export default clientPromise;