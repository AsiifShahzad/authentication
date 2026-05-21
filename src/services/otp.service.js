console.log("OTP SERVICE LOADED");

import OTP from "../models/otp.model.js";
import { generateOTP } from "../utils/otp.util.js";

//CREATE OTP

export const createOTP = async (email, role, type = "EMAIL_VERIFICATION") => {
  const otp = generateOTP();

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await OTP.findOneAndUpdate(
    { email, role, type },
    {
      otp,
      expiresAt,
      attempts: 0,
    },
    { upsert: true, new: true }
  );

  return otp;
};

//VERIFY OTP
export const verifyOTP = async (email, role, otp, type = "EMAIL_VERIFICATION") => {
  const record = await OTP.findOne({ email, role, type });

  if (!record) {
    return { valid: false, message: "OTP not found" };
  }

  if (record.expiresAt < new Date()) {
    return { valid: false, message: "OTP expired" };
  }

  if (record.otp !== otp) {
    return { valid: false, message: "Invalid OTP" };
  }

  return { valid: true };
};

//RESEND OTP
export const resendOTPService = async (email, role, type = "EMAIL_VERIFICATION") => {
  const otp = generateOTP();

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await OTP.findOneAndUpdate(
    { email, role, type },
    {
      otp,
      expiresAt,
      attempts: 0,
    },
    { upsert: true, new: true }
  );

  return otp;
};