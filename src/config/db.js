import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

import mongoose from "mongoose";
import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";

export async function connectDB() {
  console.log(
    "MONGO_URI loaded:",
    process.env.MONGO_URI ? "Found" : "MISSING"
  );

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    await Promise.all([
      User.syncIndexes(),
      OTP.syncIndexes(),
    ]);

    console.log("MongoDB connected successfully");
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);

  } catch (error) {
    console.error("MongoDB connection failed");
    console.error(error.message);

    process.exit(1);
  }
}