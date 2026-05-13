console.log("=== DEBUG: Testing Module Loads ===\n");

try {
  console.log("1. Loading ApiError...");
  const ApiError = require("./src/utils/ApiError");
  console.log("   ✓ ApiError loaded");
} catch (e) {
  console.log("   ✗ ApiError Error:", e.message);
}

try {
  console.log("2. Loading hash.util...");
  const hashUtil = require("./src/utils/hash.util");
  console.log("   ✓ hash.util loaded:", Object.keys(hashUtil));
} catch (e) {
  console.log("   ✗ hash.util Error:", e.message);
}

try {
  console.log("3. Loading jwt.util...");
  const jwtUtil = require("./src/utils/jwt.util");
  console.log("   ✓ jwt.util loaded:", Object.keys(jwtUtil));
} catch (e) {
  console.log("   ✗ jwt.util Error:", e.message);
}

try {
  console.log("4. Loading otp.service...");
  const otpService = require("./src/services/otp.service");
  console.log("   ✓ otp.service loaded:", Object.keys(otpService));
} catch (e) {
  console.log("   ✗ otp.service Error:", e.message);
}

try {
  console.log("5. Loading mail.service...");
  const mailService = require("./src/services/mail.service");
  console.log("   ✓ mail.service loaded:", Object.keys(mailService));
} catch (e) {
  console.log("   ✗ mail.service Error:", e.message);
}

try {
  console.log("6. Loading user.repository...");
  const userRepo = require("./src/repositories/user.repository");
  console.log("   ✓ user.repository loaded:", Object.keys(userRepo));
} catch (e) {
  console.log("   ✗ user.repository Error:", e.message);
}

try {
  console.log("7. Loading auth.service...");
  const authService = require("./src/services/auth.service");
  console.log("   ✓ auth.service loaded:", Object.keys(authService));
  console.log("   - loginService:", typeof authService.loginService);
  console.log("   - signupService:", typeof authService.signupService);
} catch (e) {
  console.log("   ✗ auth.service Error:", e.message);
  console.log("   Stack:", e.stack);
}

try {
  console.log("8. Loading auth.controller...");
  const authController = require("./src/controllers/auth.controller");
  console.log("   ✓ auth.controller loaded:", Object.keys(authController));
} catch (e) {
  console.log("   ✗ auth.controller Error:", e.message);
}
