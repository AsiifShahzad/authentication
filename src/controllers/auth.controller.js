import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  signupService,
  loginService,
  forgotPasswordService,
  verifyResetOTPService,
  resetPasswordService,
} from "../services/auth.service.js";

import {
  verifyOTP,
  resendOTPService,
} from "../services/otp.service.js";


import User from "../models/user.model.js";

import { sendEmail } from "../services/mail.service.js";

import OTP from "../models/otp.model.js";

//SIGNUP CONTROLLER
export const signupController = asyncHandler(async (req, res) => {
  const result = await signupService(req.validatedData);

  return res.status(201).json(
    new ApiResponse(201, "User registered successfully", result)
  );
});

//LOGIN CONTROLLER
export const loginController = asyncHandler(async (req, res) => {
  const result = await loginService(req.validatedData);

  return res.status(200).json(
    new ApiResponse(200, "Login successful", result)
  );
});

//VERIFY EMAIL CONTROLLER
export const verifyEmailController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Normalize email (lowercase and trim)
  const normalizedEmail = email.trim().toLowerCase();

  const result = await verifyOTP(normalizedEmail, otp);

  if (!result.valid) {
    return res.status(400).json(
      new ApiResponse(400, result.message, null)
    );
  }

  // Parallelize: updateOne, findOne, deleteOne together (instead of sequential)
  const [, user] = await Promise.all([
    User.updateOne({ email: normalizedEmail }, { isVerified: true }),
    User.findOne({ email: normalizedEmail }),
    OTP.deleteOne({ email: normalizedEmail, type: "EMAIL_VERIFICATION" })
  ]);

  // Fire-and-forget: send welcome email asynchronously (remove await)
  sendEmail({
    to: normalizedEmail,
    type: "WELCOME_EMAIL",
    data: {
      username: user.username,
    },
  }).catch((err) => {
    console.error(`Failed to send welcome email to ${normalizedEmail}:`, err);
  });

  return res.status(200).json(
    new ApiResponse(200, "Email verified successfully", null)
  );
});

//RESEND OTP CONTROLLER
export const resendOTPController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Normalize email (lowercase and trim)
  const normalizedEmail = email.trim().toLowerCase();

  const otp = await resendOTPService(normalizedEmail);

  sendEmail({
    to: normalizedEmail,
    type: "OTP_VERIFICATION",
    data: {
      otp,
      expiryMinutes: 15,
    },
  }).catch((err) => {
    console.error(`Failed to send OTP to ${normalizedEmail}:`, err);
  });

  return res.status(200).json(
    new ApiResponse(200, "OTP resent successfully", null)
  );
});

//FORGOT PASSWORD CONTROLLER
export const forgotPasswordController = asyncHandler(async (req, res) => {
  const result = await forgotPasswordService(req.validatedData);

  return res.status(200).json(
    new ApiResponse(200, result.message, null)
  );
});

//VERIFY RESET OTP CONTROLLER
export const verifyResetOTPController = asyncHandler(async (req, res) => {
  const result = await verifyResetOTPService(req.validatedData);

  return res.status(200).json(
    new ApiResponse(200, result.message, null)
  );
});

//RESET PASSWORD CONTROLLER
export const resetPasswordController = asyncHandler(async (req, res) => {
  const result = await resetPasswordService(req.validatedData);

  return res.status(200).json(
    new ApiResponse(200, result.message, null)
  );
});