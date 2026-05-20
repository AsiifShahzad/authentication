import ApiError from "../utils/ApiError.js";

import {
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserByUsername,
  findUserById,
  createUser,
} from "../repositories/user.repository.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/hash.util.js";

import { formatUserResponse } from "../utils/user.util.js";

import {
  createOTP,
  verifyOTP,
} from "./otp.service.js";

import { sendEmail } from "./mail.service.js";
import { generateToken } from "../utils/jwt.util.js";
import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";

//SIGNUP SERVICE
export const signupService = async ({ username, email, password }) => {
  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    throw new ApiError(409, "Email already registered");
  }

  const existingUsername = await findUserByUsername(username);
  if (existingUsername) {
    throw new ApiError(409, "This username is already taken");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({
    username,
    email,
    password: hashedPassword,
    isVerified: false,
    dateOfBirth: null,
    country: null,
    gender: null,
    profileCompletionStatus: false,
  });

  const otp = await createOTP(email, "EMAIL_VERIFICATION");

  sendEmail({
    to: email,
    type: "OTP_VERIFICATION",
    data: { username, otp, expiryMinutes: 15 },
  }).catch((err) => {
    console.error(`Failed to send signup OTP to ${email}:`, err);
  });

  const token = generateToken({ id: user._id, email: user.email });

  return { token, user: formatUserResponse(user) };
};

//LOGIN SERVICE
export const loginService = async ({ email, password }) => {
  const user = await findUserByEmailWithPassword(email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken({ id: user._id, email: user.email });

  return { token, user: formatUserResponse(user) };
};

//PROFILE UPDATE SERVICE
export const profileUpdateService = async (
  userId,
  { username, dateOfBirth, country, gender }
) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (username !== undefined && username !== null) {
    const existingUsername = await findUserByUsername(username);
    if (existingUsername && existingUsername._id.toString() !== userId.toString()) {
      throw new ApiError(409, "This username is already taken");
    }
  }

  const updateData = {};

  if (username !== undefined && username !== null) {
    updateData.username = username;
  }
  if (dateOfBirth !== undefined && dateOfBirth !== null) {
    updateData.dateOfBirth = dateOfBirth;
  }
  if (country !== undefined && country !== null) {
    updateData.country = country;
  }
  if (gender !== undefined && gender !== null) {
    updateData.gender = gender.toLowerCase();
  }

  const finalDOB = updateData.dateOfBirth !== undefined ? updateData.dateOfBirth : user.dateOfBirth;
  const finalCountry = updateData.country !== undefined ? updateData.country : user.country;
  const finalGender = updateData.gender !== undefined ? updateData.gender : user.gender;

  updateData.profileCompletionStatus = !!(finalDOB && finalCountry && finalGender);

  const finalUser = await User.findByIdAndUpdate(
    userId,
    {
      ...(updateData.username && { username: updateData.username }),
      ...(updateData.dateOfBirth && { dateOfBirth: updateData.dateOfBirth }),
      ...(updateData.country && { country: updateData.country }),
      ...(updateData.gender && { gender: updateData.gender }),
      profileCompletionStatus: updateData.profileCompletionStatus,
    },
    { new: true }
  );

  // TEMPORARY DEBUG
  console.log("🔍 finalUser from DB:", JSON.stringify(finalUser));

  return formatUserResponse(finalUser);
};

//FORGOT PASSWORD
export const forgotPasswordService = async ({ email }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = await createOTP(email, "PASSWORD_RESET");

  sendEmail({
    to: email,
    type: "PASSWORD_RESET",
    data: { username: user.username, otp, expiryMinutes: 15 },
  }).catch((err) => {
    console.error(`Failed to send password reset email to ${email}:`, err);
  });

  return { message: "Password reset OTP sent to email" };
};

//VERIFY RESET OTP
export const verifyResetOTPService = async ({ email, otp }) => {
  const result = await verifyOTP(email, otp, "PASSWORD_RESET");

  if (!result.valid) {
    throw new ApiError(400, result.message);
  }

  return { message: "OTP verified successfully" };
};

//RESET PASSWORD
export const resetPasswordService = async ({ email, otp, newPassword }) => {
  const result = await verifyOTP(email, otp, "PASSWORD_RESET");

  if (!result.valid) {
    throw new ApiError(400, result.message);
  }

  const hashed = await hashPassword(newPassword);

  await Promise.all([
    User.updateOne({ email }, { password: hashed }),
    OTP.deleteOne({ email, type: "PASSWORD_RESET" })
  ]);

  return { message: "Password reset successful" };
};