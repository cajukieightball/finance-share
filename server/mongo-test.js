// Updated test script (server/mongo-test.js)
import { MongoClient } from "mongodb";

const testConnection = async () => {
  console.log("Starting connection test...");
  const uri = "mongodb+srv://richard42smb:ikHhKIHxXiWKkjIH@cluster0.czlntoe.mongodb.net/finance-share?retryWrites=true&w=majority";
  
  try {
    console.log("Attempting connection...");
    const client = await MongoClient.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: "majority"
    });
    
    console.log("Connection successful!");
    console.log("Available collections:", await client.db().listCollections().toArray());
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    process.exit(1);
  }
};

testConnection();