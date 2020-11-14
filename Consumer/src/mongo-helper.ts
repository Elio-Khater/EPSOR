const { MongoClient } = require("mongodb");
const uri =
  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
const client = new MongoClient(uri);
export async function insert(document: any): Promise<boolean> {
  try {
    await client.connect();
    const database = client.db("epsor");
    const collection = database.collection("product");
    const result = await collection.insertOne(document);
    return result.insertedCount > 0;
  } finally {
    await client.close();
  }
  return false;
}
