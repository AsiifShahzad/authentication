import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import app from "./app.js";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

startServer();