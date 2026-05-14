import { z } from "zod";

// SIGNUP VALIDATION
export const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30),

  email: z.string().email("Invalid email address").trim().toLowerCase(),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

// LOGIN VALIDATION
export const loginSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

// FORGOT PASSWORD
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
});

// VERIFY RESET OTP
export const verifyResetOTPSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  otp: z.string().min(4, "OTP must be valid"),
});

// RESET PASSWORD
export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  otp: z.string().min(4, "OTP must be valid"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});