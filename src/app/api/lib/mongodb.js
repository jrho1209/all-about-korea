import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  console.warn("Warning: MONGODB_URI is not defined");
  // 빌드 시에는 빈 Promise를 반환하여 에러 방지
  clientPromise = Promise.resolve(null);
} else if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Common function for connecting to database
export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(); // Uses default database
  return { client, db };
}