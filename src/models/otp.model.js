import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["patient", "doctor"],
      required: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["EMAIL_VERIFICATION", "PASSWORD_RESET"],
      default: "EMAIL_VERIFICATION",
    },

    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },

    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.index({ email: 1, role: 1, type: 1 }, { unique: true, name: "otp_identity_unique" });

export default mongoose.model("OTP", otpSchema);