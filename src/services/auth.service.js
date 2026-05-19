import ApiError from "../utils/ApiError.js";

import {
  findUserByEmail,
  findUserByEmailWithPassword,
  createUser,
} from "../repositories/user.repository.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/hash.util.js";

import {
  createOTP,
  verifyOTP,
} from "./otp.service.js";

import { sendEmail } from "./mail.service.js";

import { generateToken } from "../utils/jwt.util.js";

import OTP from "../models/otp.model.js";

import User from "../models/user.model.js";

//SIGNUP SERVICE
export const signupService = async ({
  username,
  email,
  password,
}) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(
      409,
      "Email already registered"
    );
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({
    username,
    email,
    password: hashedPassword,
    isVerified: false,
  });

  const otp = await createOTP(email, "EMAIL_VERIFICATION");

  sendEmail({
    to: email,
    type: "OTP_VERIFICATION",
    data: {
      username,
      otp,
      expiryMinutes: 15,
    },
  }).catch((err) => {
    console.error(`Failed to send signup OTP to ${email}:`, err);
  });

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    message: "OTP sent to email. Please verify your account.",
  };
};

//LOGIN SERVICE

export const loginService = async ({
  email,
  password,
}) => {
  const user =
    await findUserByEmailWithPassword(email);

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  if (!user.isVerified) {
    throw new ApiError(
      403,
      "Please verify your email first"
    );
  }

  const isPasswordValid =
    await comparePassword(
      password,
      user.password
    );

  if (!isPasswordValid) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  const token = generateToken({
    id: user._id,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  };
};

//FORGOT PASSWORD
export const forgotPasswordService = async ({
  email,
}) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  const otp = await createOTP(
    email,
    "PASSWORD_RESET"
  );

  sendEmail({
    to: email,
    type: "PASSWORD_RESET",
    data: {
      username: user.username,
      otp,
      expiryMinutes: 15,
    },
  }).catch((err) => {
    console.error(`Failed to send password reset email to ${email}:`, err);
  });

  return {
    message:
      "Password reset OTP sent to email",
  };
};

//VERIFY RESET OTP
export const verifyResetOTPService = async ({
  email,
  otp,
}) => {
  const result = await verifyOTP(
    email,
    otp,
    "PASSWORD_RESET"
  );

  if (!result.valid) {
    throw new ApiError(
      400,
      result.message
    );
  }

  return {
    message: "OTP verified successfully",
  };
};

//RESET PASSWORD
export const resetPasswordService = async ({
  email,
  otp,
  newPassword,
}) => {
  const result = await verifyOTP(
    email,
    otp,
    "PASSWORD_RESET"
  );

  if (!result.valid) {
    throw new ApiError(
      400,
      result.message
    );
  }

  const hashed = await hashPassword(newPassword);

  await Promise.all([
    User.updateOne(
      { email },
      { password: hashed }
    ),
    OTP.deleteOne({ email, type: "PASSWORD_RESET" })
  ]);

  return {
    message: "Password reset successful",
  };
};