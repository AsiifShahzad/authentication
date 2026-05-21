import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import {
  signupService,
  loginService,
  profileUpdateService,
  forgotPasswordService,
  verifyResetOTPService,
  resetPasswordService,
  deleteUserService,
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
  const { email, role, otp } = req.validatedData;
  const normalizedEmail = email.trim().toLowerCase();
  const roleFilter = role === "patient"
    ? { $or: [{ role }, { role: { $exists: false } }] }
    : { role };

  const result = await verifyOTP(normalizedEmail, role, otp);

  if (!result.valid) {
    return res.status(400).json(
      new ApiResponse(400, result.message, null)
    );
  }

  const [, user] = await Promise.all([
    User.updateOne({ email: normalizedEmail, ...roleFilter }, { isVerified: true }),
    User.findOne({ email: normalizedEmail, ...roleFilter }),
    OTP.deleteOne({ email: normalizedEmail, role, type: "EMAIL_VERIFICATION" })
  ]);

  sendEmail({
    to: normalizedEmail,
    type: "WELCOME_EMAIL",
    data: { username: user.username },
  }).catch((err) => {
    console.error(`Failed to send welcome email to ${normalizedEmail}:`, err);
  });

  return res.status(200).json(
    new ApiResponse(200, "Email verified successfully", null)
  );
});

//RESEND OTP CONTROLLER
export const resendOTPController = asyncHandler(async (req, res) => {
  const { email, role } = req.validatedData;
  const normalizedEmail = email.trim().toLowerCase();

  const otp = await resendOTPService(normalizedEmail, role);

  sendEmail({
    to: normalizedEmail,
    type: "OTP_VERIFICATION",
    data: { otp, expiryMinutes: 15, role },
  }).catch((err) => {
    console.error(`Failed to send OTP to ${normalizedEmail}:`, err);
  });

  return res.status(200).json(
    new ApiResponse(200, "OTP resent successfully", null)
  );
});

//PROFILE UPDATE CONTROLLER
export const profileUpdateController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await profileUpdateService(userId, req.validatedData);
  return res.status(200).json(
    new ApiResponse(200, "Profile updated successfully", result)
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

// DELETE ACCOUNT CONTROLLER
export const deleteUserController = asyncHandler(async (req, res) => {
  const result = await deleteUserService(req.user.id);
  return res.status(200).json(
    new ApiResponse(200, result.message, null)
  );
});