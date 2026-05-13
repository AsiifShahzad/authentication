console.log("OTP SERVICE LOADED");

const OTP = require("../models/otp.model");
const { generateOTP } = require("../utils/otp.util");

const createOTP = async (email) => {
  const otp = generateOTP();

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await OTP.findOneAndUpdate(
    { email },
    { otp, expiresAt, attempts: 0 },
    { upsert: true, new: true }
  );

  return otp;
};

const verifyOTP = async (email, otp) => {
  const record = await OTP.findOne({ email });

  if (!record) return { valid: false, message: "OTP not found" };

  if (record.expiresAt < new Date()) {
    return { valid: false, message: "OTP expired" };
  }

  if (record.otp !== otp) {
    return { valid: false, message: "Invalid OTP" };
  }

  await OTP.deleteOne({ email });

  return { valid: true };
};

const resendOTPService = async (email) => {
  const otp = generateOTP();
  console.log("RESEND FUNCTION EXISTS");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  // overwrite existing OTP
  await OTP.findOneAndUpdate(
    { email },
    {
      otp,
      expiresAt,
      attempts: 0,
    },
    {
      upsert: true,
      new: true,
    }
  );

  return otp;
};

module.exports = {
  createOTP,
  verifyOTP,
  resendOTPService,
};
