const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate.middleware");

const { signupSchema } = require("../validators/auth.validator");

const {
  signupController,
  verifyEmailController,
  resendOTPController,
} = require("../controllers/auth.controller");

router.post("/signup", validate(signupSchema), signupController );

router.post("/verify-email", verifyEmailController);

router.post("/resend-otp", resendOTPController);

module.exports = router;