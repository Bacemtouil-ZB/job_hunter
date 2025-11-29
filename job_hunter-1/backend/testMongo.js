import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Use your environment variable here
const uri = process.env.MONGO_URI || process.env.MONGO_URL;

console.log("🔹 Attempting to connect to MongoDB at:", uri);

(async () => {
  try {
    // Connect with debug mode
    mongoose.set("debug", true); // logs all operations
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully!");
    process.exit(0); // exit cleanly
  } catch (err) {
    console.error("❌ MongoDB connection failed!");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Full error:", err);
    process.exit(1); // exit with failure
  }
})();
