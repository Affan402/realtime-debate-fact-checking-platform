import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load .env relative to this file (Backend/.env) so the server works
// regardless of the current working directory.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

// Connect to MongoDB using the URI from .env (variable name: URI).
// Replaces the old JSON-file storage initialization.
const DBconfig = async () => {
  try {
    const uri = process.env.URI;
    if (!uri) {
      throw new Error(
        "Missing MongoDB URI: add URI=mongodb+srv://... to Backend/.env"
      );
    }

    mongoose.set("strictQuery", true);

    await mongoose.connect(uri);

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);

    // Warn when the connection drops so issues are visible in logs.
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    return mongoose.connection;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default DBconfig;