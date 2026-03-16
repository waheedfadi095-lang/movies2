// MongoDB Native Client Connection (optional – app chal sakti hai bina iske)
// Jab MONGODB_URI nahi hoti to clientPromise = null resolve hota hai; TV/Series TMDB fallback use karein.

import { MongoClient, type MongoClient as MongoClientType } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let clientPromise: Promise<MongoClientType | null>;

if (!uri) {
  // Bina URI ke: reject nahi, null resolve – pages check karke skip karein
  clientPromise = Promise.resolve(null);
} else if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };
  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

