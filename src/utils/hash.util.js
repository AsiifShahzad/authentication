import bcrypt from "bcryptjs";

// HASH PASSWORD
export const hashPassword = async (password) => {
  return bcrypt.hash(password, 12);
};

// COMPARE PASSWORD
export const comparePassword = async (
  plainPassword,
  hashedPassword
) => {
  return bcrypt.compare(
    plainPassword,
    hashedPassword
  );
};