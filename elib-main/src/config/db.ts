import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");

    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI not found in .env");
    }

    await mongoose.connect(uri);

    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.log("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
