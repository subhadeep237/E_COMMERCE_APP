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
import {
  validateRegister,
  validateLogin,
  validateOTP,
  validateForgotPassword,
  validateResetPassword,
  validateAddToCart,
  validateUpdateCart,
} from "../middleware/validator.js";

const userRouter = express.Router();

// OTP-based signup
userRouter.post("/send-signup-otp", validateRegister, sendSignupOTP);
userRouter.post("/verify-signup-otp", validateOTP, verifySignupOTP);
userRouter.post("/resend-otp", resendOTP);

// Forgot password
userRouter.post("/forgot-password", validateForgotPassword, forgotPassword);
userRouter.post("/reset-password", validateResetPassword, resetPassword);

// Old auth (kept for compatibility)
userRouter.post("/register", validateRegister, registerUser);
userRouter.post("/login", validateLogin, loginUser);
userRouter.post("/admin", validateLogin, adminLogin);

// Cart
userRouter.post("/cart/add", authUser, validateAddToCart, addToCart);
userRouter.post("/cart/update", authUser, validateUpdateCart, updateCart);
userRouter.get("/cart", authUser, getCart);

export default userRouter;