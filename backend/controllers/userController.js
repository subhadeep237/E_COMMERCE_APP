import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js";
import { sendOTPEmail } from "../services/emailService.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ================= 🆕 SEND SIGNUP OTP =================
// POST /api/user/send-signup-otp
// Body: { name, email, password }
const sendSignupOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Hash password (so we don't store plain password in OTP collection)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Delete any existing OTP for this email
    await otpModel.deleteMany({ email, purpose: "signup" });

    // Save OTP with user data
    await otpModel.create({
      email,
      otp,
      purpose: "signup",
      userData: {
        name,
        password: hashedPassword,
      },
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, "verification");

    if (!emailResult.success) {
      return res.json({
        success: false,
        message: "Failed to send OTP email. Please try again.",
      });
    }

    res.json({
      success: true,
      message: "OTP sent to your email. Please verify to complete signup.",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= 🆕 VERIFY SIGNUP OTP & CREATE ACCOUNT =================
// POST /api/user/verify-signup-otp
// Body: { email, otp }
const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.json({ success: false, message: "Email and OTP are required" });
    }

    // Find OTP record
    const otpRecord = await otpModel.findOne({
      email,
      purpose: "signup",
    });

    if (!otpRecord) {
      return res.json({
        success: false,
        message: "OTP expired or not found. Please request a new one.",
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // Create user account
    const newUser = new userModel({
      name: otpRecord.userData.name,
      email,
      password: otpRecord.userData.password,
    });

    const user = await newUser.save();

    // Delete OTP record
    await otpModel.deleteOne({ _id: otpRecord._id });

    // Generate token & auto-login
    const token = createToken(user._id);

    res.json({
      success: true,
      message: "Account created successfully!",
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= 🆕 RESEND OTP =================
// POST /api/user/resend-otp
// Body: { email, purpose }
const resendOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body;

    if (!email || !purpose) {
      return res.json({ success: false, message: "Email and purpose required" });
    }

    // Find existing OTP record
    const otpRecord = await otpModel.findOne({ email, purpose });

    if (!otpRecord) {
      return res.json({
        success: false,
        message: "No active OTP request. Please start over.",
      });
    }

    // Generate new OTP
    const newOTP = generateOTP();

    // Update OTP & reset timer
    otpRecord.otp = newOTP;
    otpRecord.createdAt = new Date();
    await otpRecord.save();

    // Send email
    const emailPurpose = purpose === "signup" ? "verification" : "reset";
    await sendOTPEmail(email, newOTP, emailPurpose);

    res.json({ success: true, message: "New OTP sent to your email" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= 🆕 FORGOT PASSWORD - SEND OTP =================
// POST /api/user/forgot-password
// Body: { email }
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "No account found with this email" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP
    await otpModel.deleteMany({ email, purpose: "reset-password" });

    // Save OTP
    await otpModel.create({
      email,
      otp,
      purpose: "reset-password",
    });

    // Send email
    const emailResult = await sendOTPEmail(email, otp, "reset");

    if (!emailResult.success) {
      return res.json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      });
    }

    res.json({
      success: true,
      message: "OTP sent to your email to reset password",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= 🆕 RESET PASSWORD WITH OTP =================
// POST /api/user/reset-password
// Body: { email, otp, newPassword }
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (newPassword.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Find OTP record
    const otpRecord = await otpModel.findOne({
      email,
      purpose: "reset-password",
    });

    if (!otpRecord) {
      return res.json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }

    if (otpRecord.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    await userModel.findOneAndUpdate({ email }, { password: hashedPassword });

    // Delete OTP record
    await otpModel.deleteOne({ _id: otpRecord._id });

    res.json({ success: true, message: "Password reset successfully! Please login." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= REGISTER USER (OLD - keeping for compatibility) =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= LOGIN USER =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= ADMIN LOGIN =================
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= CART LOGIC =================
const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, size } = req.body;

    if (!productId || !size) {
      return res.json({
        success: false,
        message: "productId and size are required",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const cartData = user.cartData || {};

    if (!cartData[productId]) {
      cartData[productId] = {};
    }
    if (!cartData[productId][size]) {
      cartData[productId][size] = 0;
    }

    cartData[productId][size] += 1;

    user.cartData = cartData;
    await user.save();

    res.json({ success: true, message: "Added to cart", cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, size, quantity } = req.body;

    if (!productId || !size || quantity === undefined) {
      return res.json({
        success: false,
        message: "productId, size and quantity are required",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const cartData = user.cartData || {};

    if (!cartData[productId]) {
      cartData[productId] = {};
    }

    if (quantity <= 0) {
      delete cartData[productId][size];
      if (Object.keys(cartData[productId]).length === 0) {
        delete cartData[productId];
      }
    } else {
      cartData[productId][size] = quantity;
    }

    user.cartData = cartData;
    await user.save();

    res.json({ success: true, message: "Cart updated", cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, cartData: user.cartData || {} });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
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
};