import { z } from "zod";
import { isValidCountry } from "../utils/countries.util.js";

// SIGNUP VALIDATION
export const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be 3-50 characters with letters and spaces only")
    .max(50, "Username must be 3-50 characters with letters and spaces only")
    .regex(/^[a-zA-Z\s]{3,50}$/, "Username must be 3-50 characters with letters and spaces only"),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// LOGIN VALIDATION
export const loginSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// PROFILE UPDATE VALIDATION
export const profileUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be 3-50 characters with letters and spaces only")
    .max(50, "Username must be 3-50 characters with letters and spaces only")
    .regex(/^[a-zA-Z\s]{3,50}$/, "Username must be 3-50 characters with letters and spaces only")
    .optional(),

  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format")
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return date < new Date();
      },
      "Date of birth cannot be in the future"
    ),

  country: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        return isValidCountry(val);
      },
      "Invalid country. Please select from the provided list"
    )
    .optional(),

  gender: z
    .enum(["male", "female", "other"], {
      errorMap: () => ({ message: "Gender must be one of: male, female, other" }),
    })
    .optional(),
})
.refine(
  (data) => Object.values(data).some(val => val !== undefined && val !== null),
  "At least one field must be provided"
);

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