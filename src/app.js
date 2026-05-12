const express = require("express");

const authRoutes = require("./routes/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// Built-in middleware
app.use(express.json());

// Debug (remove later in production)
console.log("authRoutes loaded:", typeof authRoutes);
console.log("errorMiddleware loaded:", typeof errorMiddleware);

// Routes
app.use("/api/v1/auth", authRoutes);

// Global error handler (must be last)
app.use(errorMiddleware);

module.exports = app;