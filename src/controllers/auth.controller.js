const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const { signupService } = require("../services/auth.service");

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

module.exports = {
  signupController,
};