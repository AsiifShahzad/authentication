import User from "../models/user.model.js";

// FIND USER BY EMAIL
export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

// FIND USER WITH PASSWORD (FOR LOGIN)
export const findUserByEmailWithPassword = async (email) => {
  return User.findOne({ email }).select("+password");
};

// CREATE USER
export const createUser = async (payload) => {
  return User.create(payload);
};