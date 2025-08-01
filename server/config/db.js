
import mongoose from "mongoose";

export async function connectDB() {
  console.log("🔍 Connection Debug:");
  console.log("- Using URI:", process.env.MONGODB_URI?.slice(0, 25) + "...");

  const options = {
    serverSelectionTimeoutMS: 3000,
    socketTimeoutMS: 20000,
    family: 4, 
  };

  try {
    await mongoose.connect(process.env.MONGODB_URI, options);

    mongoose.connection.on("connected", () => {
      console.log("MongoDB Connected!");
      console.log("- Host:", mongoose.connection.host);
      console.log("- DB:", mongoose.connection.name);
      console.log("- State:", mongoose.connection.readyState); 
    });

    mongoose.connection.on("error", (err) => {
      console.error("Connection error:", err.message);
    });
  } catch (err) {
    console.error("FATAL DB ERROR:", err);
    process.exit(1);
  }
}
