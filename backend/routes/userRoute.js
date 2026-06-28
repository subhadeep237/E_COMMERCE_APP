import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  addToCart,
  updateCart,
  getCart,
  sendSignupOTP,
  verifySignupOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

import authUser from "../middleware/auth.js";

const userRouter = express.Router();

// OTP-based signup (NEW)
userRouter.post("/send-signup-otp", sendSignupOTP);
userRouter.post("/verify-signup-otp", verifySignupOTP);
userRouter.post("/resend-otp", resendOTP);

// Forgot password (NEW)
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

// Old auth (kept for compatibility)
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

// Cart (user must be logged in)
userRouter.post("/cart/add", authUser, addToCart);
userRouter.post("/cart/update", authUser, updateCart);
userRouter.get("/cart", authUser, getCart);

export default userRouter;