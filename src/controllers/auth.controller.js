const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");
console.log("OTP SERVICE:", require("../services/otp.service"));
const { signupService } = require("../services/auth.service");

const {
  verifyOTP,
  resendOTPService,
} = require("../services/otp.service");

const User = require("../models/user.model");

const { sendEmail } = require("../services/mail.service");

/**
 * SIGNUP
 */
const signupController = asyncHandler(async (req, res) => {
  const result = await signupService(req.validatedData);

  return res.status(201).json(
    new ApiResponse(
      201,
      "User registered successfully",
      result
    )
  );
});

const verifyEmailController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const result = await verifyOTP(email, otp);

  if (!result.valid) {
    return res.status(400).json(result);
  }

  // mark user as verified
  await User.updateOne(
    { email },
    { isVerified: true }
  );

  const user = await User.findOne({ email });

  await sendEmail({
    to: email,
    type: "WELCOME_EMAIL",
    data: {
      username: user.username,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

const resendOTPController = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log("🔥 RESEND OTP API HIT");
  console.log("EMAIL:", email);
  // generate new OTP
  const otp = await resendOTPService(email);

  // send OTP email
  await sendEmail({
    to: email,
    type: "OTP_VERIFICATION",
    data: {
      otp,
      expiryMinutes: 15,
    },
  });

  return res.status(200).json({
    success: true,
    message: "OTP resent successfully",
  });
});

module.exports = {
  signupController,
  verifyEmailController,
  resendOTPController,
};