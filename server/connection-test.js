const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://richard42smb:ikHhKIHxXiWKkjIH@cluster0.czlntoe.mongodb.net/finance-share?retryWrites=true&w=majority";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully!");
    const db = client.db("finance-share");
    console.log("- Database name:", db.databaseName);
  } catch (err) {
    console.error("Connection failed:", err.message);
  } finally {
    await client.close();
  }
}

run();
