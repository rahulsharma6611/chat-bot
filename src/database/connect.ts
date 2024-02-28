import { DB_NAME } from '@/constants';
import { MongoClient } from 'mongodb';

export const connectMongoDB = async () => {
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  const db = client.db(DB_NAME);
  return { client, db };
};

export const insertMongoDB = async (collectionName: string, data: any[]) => {
  const mongoDB = await connectMongoDB();
  const result = await mongoDB.db.collection(collectionName).insertMany(data);
  await mongoDB.client.close();
  return result;
};
