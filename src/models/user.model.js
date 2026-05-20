import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      match: /^[a-zA-Z\s]{3,50}$/,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    dateOfBirth: {
      type: String,
      default: null,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },

    country: {
      type: String,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;