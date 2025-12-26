import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB,
  MONGO_USER,
  MONGO_PASSWORD,
} = process.env;

const uri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

const client = new MongoClient(uri);

export async function connectDB() {
  await client.connect();
  console.log("MongoDB connected");
}

export function getDB() {
  return client.db(MONGO_DB);
}
