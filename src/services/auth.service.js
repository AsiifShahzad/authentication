import ApiError from "../utils/ApiError.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/hash.util.js";

import { formatUserResponse } from "../utils/user.util.js";
import {
  reconcileStaleAvatar,
  deleteAvatarFile,
} from "../utils/avatar.util.js";

import {
  createOTP,
  verifyOTP,
} from "./otp.service.js";

import { sendEmail } from "./mail.service.js";
import { generateToken } from "../utils/jwt.util.js";
import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import {
  findUserByEmail,
  findUserByEmailAndRoleWithPassword,
  findUserByUsername,
  findUserById,
  createUser,
  deleteUser,
} from "../repositories/user.repository.js";

//SIGNUP SERVICE
export const signupService = async ({ username, email, password, role }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingEmail = await findUserByEmail(normalizedEmail);
  if (existingEmail) {
    throw new ApiError(409, "This email is already registered.", {
      code: "DUPLICATE_EMAIL",
      fieldErrors: {
        email: "Already registered",
      },
      existingUser: {
        email: existingEmail.email,
        role: existingEmail.role || "patient",
      },
    });
  }

  const existingUsername = await findUserByUsername(username);
  if (existingUsername) {
    throw new ApiError(409, "This username is already taken");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({
    username,
    email: normalizedEmail,
    password: hashedPassword,
    role,
    isVerified: false,
    dateOfBirth: null,
    country: null,
    gender: null,
    profileCompletionStatus: false,
  });

  const otp = await createOTP(normalizedEmail, role, "EMAIL_VERIFICATION");

  sendEmail({
    to: normalizedEmail,
    type: "OTP_VERIFICATION",
    data: { username, otp, expiryMinutes: 15, role },
  }).catch((err) => {
    console.error(`Failed to send signup OTP to ${normalizedEmail}:`, err);
  });

  const token = generateToken({ id: user._id, email: user.email, role: user.role });

  return { token, user: formatUserResponse(user) };
};

//LOGIN SERVICE
export const loginService = async ({ email, password, role }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmailAndRoleWithPassword(normalizedEmail, role);

  if (!user) {
    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      throw new ApiError(403, "Selected role does not match this account.", {
        code: "ROLE_MISMATCH",
        expectedRole: existingUser.role || "patient",
      });
    }

    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accountRole = user.role || "patient";

  if (accountRole !== role) {
    throw new ApiError(403, "Selected role does not match your account role");
  }

  const reconciledUser = await reconcileStaleAvatar(user);

  const token = generateToken({ id: reconciledUser._id, email: reconciledUser.email, role: reconciledUser.role || accountRole });

  return { token, user: formatUserResponse(reconciledUser) };
};

//PROFILE UPDATE SERVICE
export const profileUpdateService = async (
  userId,
  { username, dateOfBirth, country, gender }
) => {
  let user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user = await reconcileStaleAvatar(user);

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
      ...(updateData.username !== undefined && { username: updateData.username }),
      ...(updateData.dateOfBirth !== undefined && { dateOfBirth: updateData.dateOfBirth }),
      ...(updateData.country !== undefined && { country: updateData.country }),
      ...(updateData.gender !== undefined && { gender: updateData.gender }),
      profileCompletionStatus: updateData.profileCompletionStatus,
    },
    { new: true }
  );

  const reconciledFinal = await reconcileStaleAvatar(finalUser);
  return formatUserResponse(reconciledFinal);
};

//FORGOT PASSWORD
export const forgotPasswordService = async ({ email }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = await createOTP(normalizedEmail, user.role || "patient", "PASSWORD_RESET");

  sendEmail({
    to: normalizedEmail,
    type: "PASSWORD_RESET",
    data: { username: user.username, otp, expiryMinutes: 15, role: user.role || "patient" },
  }).catch((err) => {
    console.error(`Failed to send password reset email to ${normalizedEmail}:`, err);
  });

  return { message: "Password reset OTP sent to email" };
};

//VERIFY RESET OTP
export const verifyResetOTPService = async ({ email, otp }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const result = await verifyOTP(normalizedEmail, user.role || "patient", otp, "PASSWORD_RESET");

  if (!result.valid) {
    throw new ApiError(400, result.message);
  }

  return { message: "OTP verified successfully" };
};

//RESET PASSWORD
export const resetPasswordService = async ({ email, otp, newPassword }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accountRole = user.role || "patient";
  const result = await verifyOTP(normalizedEmail, accountRole, otp, "PASSWORD_RESET");

  if (!result.valid) {
    throw new ApiError(400, result.message);
  }

  const hashed = await hashPassword(newPassword);
  const roleFilter = accountRole === "patient"
    ? { $or: [{ role: accountRole }, { role: { $exists: false } }] }
    : { role: accountRole };

  await Promise.all([
    User.updateOne({ email: normalizedEmail, ...roleFilter }, { password: hashed }),
    OTP.deleteOne({ email: normalizedEmail, role: accountRole, type: "PASSWORD_RESET" })
  ]);

  return { message: "Password reset successful" };
};

// DELETE USER
export const deleteUserService = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.profileImage) {
    await deleteAvatarFile(user.profileImage);
  }

  await deleteUser(userId);

  return { message: "User deleted successfully" };
};