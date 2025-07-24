import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI not set in environment');

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise: Promise<MongoClient> = global._mongoClientPromise ?? (global._mongoClientPromise = new MongoClient(uri).connect());

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
} 