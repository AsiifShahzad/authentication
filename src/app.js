const express = require("express");

const authRoutes = require("./routes/auth.routes");

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());

console.log("authRoutes loaded:", typeof authRoutes);
console.log("errorMiddleware loaded:", typeof errorMiddleware);

app.use("/api/v1/auth", authRoutes);
app.use(errorMiddleware);

module.exports = app;