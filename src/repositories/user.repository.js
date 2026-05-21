import User from "../models/user.model.js";

// FIND USER BY EMAIL
export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

// FIND USER BY EMAIL AND ROLE
export const findUserByEmailAndRole = async (email, role) => {
  const roleFilter = role === "patient"
    ? { $or: [{ role }, { role: { $exists: false } }] }
    : { role };

  return User.findOne({ email, ...roleFilter });
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

// FIND USER WITH PASSWORD BY EMAIL AND ROLE (FOR ROLE-AWARE LOGIN)
export const findUserByEmailAndRoleWithPassword = async (email, role) => {
  const roleFilter = role === "patient"
    ? { $or: [{ role }, { role: { $exists: false } }] }
    : { role };

  return User.findOne({ email, ...roleFilter }).select("+password");
};

// CREATE USER
export const createUser = async (payload) => {
  return User.create(payload);
};

// UPDATE USER
export const updateUser = async (id, payload) => {
  return User.findByIdAndUpdate(id, payload, { new: true }).select('-password');
};


export const updateUserAvatar = async (userId, profileImage) => {
  return await User.findByIdAndUpdate(
    userId,
    { profileImage },
    { new: true, runValidators: true }
  ).select('-password');
};

export const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};