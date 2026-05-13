const ApiError = require("../utils/ApiError");

const {
  findUserByEmail,
  createUser,
} = require("../repositories/user.repository");

const { hashPassword } = require("../utils/hash.util");

const { createOTP } = require("./otp.service");

const { sendEmail } = require("./mail.service");

const { welcomeTemplate } = require("../templates"); 
const signupService = async ({ username, email, password }) => {
  // 1. Check if user already exists
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  // 2. Hash password
  const hashedPassword = await hashPassword(password);

  // 3. Create user (unverified)
  const user = await createUser({
    username,
    email,
    password: hashedPassword,
    isVerified: false,
  });

  // 4. Generate OTP
  const otp = await createOTP(email);

  // 5. Send OTP using TEMPLATE ROUTER
  await sendEmail({
    to: email,
    type: "OTP_VERIFICATION",
    data: {
      username,
      otp,
      expiryMinutes: 15,
    },
  });

  // 6. Return safe response
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    message: "OTP sent to email. Please verify your account.",
  };
};

module.exports = {
  signupService,
};