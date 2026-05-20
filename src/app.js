import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Serve static uploads folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use("/api/v1/auth", authRoutes);

app.use(errorMiddleware);

export default app;