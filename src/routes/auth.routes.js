const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate.middleware");

const { signupSchema } = require("../validators/auth.validator");

const {
  signupController,
} = require("../controllers/auth.controller");

router.post(
  "/signup",
  validate(signupSchema),
  signupController
);

module.exports = router;