const ApiError = require("../utils/ApiError");

const {
  findUserByEmail,
  createUser,
} = require("../repositories/user.repository");

const { hashPassword } = require("../utils/hash.util");

const signupService = async ({ username, email, password }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({
    username,
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
};

module.exports = {
  signupService,
};