import app from "./src/app";
import connectDB from "./src/config/db";
import dotenv from "dotenv";

dotenv.config();

const startServer = async () => {
  try {
    console.log("🚀 Server starting...");
    
    // Connect MongoDB Atlas
    await connectDB();

    const PORT = process.env.PORT || 7001;

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
