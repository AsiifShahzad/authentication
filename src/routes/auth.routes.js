import express from "express";

const router = express.Router();

import validate from "../middlewares/validate.middleware.js";
import authenticate from "../middlewares/auth.middleware.js";

import {
  signupSchema,
  loginSchema,
  profileUpdateSchema,
  forgotPasswordSchema,
  verifyResetOTPSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";

import {
  signupController,
  loginController,
  profileUpdateController,
  verifyEmailController,
  resendOTPController,
  forgotPasswordController,
  verifyResetOTPController,
  resetPasswordController,
} from "../controllers/auth.controller.js";

// SIGNUP
router.post("/signup", validate(signupSchema), signupController);

// LOGIN
router.post("/login", validate(loginSchema), loginController);

// VERIFY EMAIL (OTP)
router.post("/verify-email", verifyEmailController);

// RESEND OTP
router.post("/resend-otp", resendOTPController);

// PROFILE UPDATE (Protected Route)
router.put("/profile", authenticate, validate(profileUpdateSchema), profileUpdateController);

// FORGOT PASSWORD FLOW
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPasswordController);
router.post("/verify-reset-otp", validate(verifyResetOTPSchema), verifyResetOTPController);
router.post("/reset-password", validate(resetPasswordSchema), resetPasswordController);

export default router;