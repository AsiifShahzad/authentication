import express from "express";

import authRoutes from "./routes/auth.routes.js";

import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

console.log("authRoutes loaded:", typeof authRoutes);
console.log("errorMiddleware loaded:", typeof errorMiddleware);

app.use("/api/v1/auth", authRoutes);
app.use(errorMiddleware);

export default app;