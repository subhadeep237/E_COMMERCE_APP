import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ["signup", "reset-password"],
    required: true,
  },
  // Temporary user data (for signup)
  userData: {
    name: String,
    password: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Auto-delete after 10 minutes (600 seconds)
  },
});

const otpModel = mongoose.models.otp || mongoose.model("otp", otpSchema);

export default otpModel;