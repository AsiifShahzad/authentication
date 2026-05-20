import User from "../models/user.model.js";

// FIND USER BY EMAIL
export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

// FIND USER BY USERNAME
export const findUserByUsername = async (username) => {
  return User.findOne({ username });
};

// FIND USER BY ID
export const findUserById = async (id) => {
  return User.findById(id);
};

// FIND USER WITH PASSWORD (FOR LOGIN)
export const findUserByEmailWithPassword = async (email) => {
  return User.findOne({ email }).select("+password");
};

// CREATE USER
export const createUser = async (payload) => {
  return User.create(payload);
};

// UPDATE USER
export const updateUser = async (id, payload) => {
  return User.findByIdAndUpdate(id, payload, { new: true });
};

// UPDATE USER PROFILE
export const updateUserProfile = async (id, { username, dateOfBirth, country, gender }) => {
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

  return User.findByIdAndUpdate(id, updateData, { new: true });
};