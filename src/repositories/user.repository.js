const User = require("../models/user.model");

const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

const createUser = async (payload) => {
  return User.create(payload);
};

module.exports = {
  findUserByEmail,
  createUser,
};