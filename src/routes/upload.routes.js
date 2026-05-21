import express from "express";

import authenticate from "../middlewares/auth.middleware.js";
import { avatarUpload } from "../middlewares/upload.middleware.js";
import { avatarController } from "../controllers/upload.controller.js";

const router = express.Router();

// AVATAR UPLOAD (Protected Route)
router.post("/avatar", authenticate, avatarUpload, avatarController);

export default router;