const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const mongoose = require("mongoose");

async function connectDB() {
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

    console.log("MongoDB connected successfully");
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);

  } catch (error) {
    console.error("MongoDB connection failed");
    console.error(error.message);

    process.exit(1);
  }
}

module.exports = connectDB;