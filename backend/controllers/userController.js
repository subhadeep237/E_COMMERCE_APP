import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js";
import { sendOTPEmail } from "../services/emailService.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ================= SEND SIGNUP OTP =================
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
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await otpModel.deleteMany({ email, purpose: "signup" });
    await otpModel.create({
      email,
      otp,
      purpose: "signup",
      userData: { name, password: hashedPassword },
    });

    const emailResult = await sendOTPEmail(email, otp, "verification");
    if (!emailResult.success) {
      return res.json({ success: false, message: "Failed to send OTP email" });
    }

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= VERIFY SIGNUP OTP =================
const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.json({ success: false, message: "Email and OTP are required" });
    }

    const otpRecord = await otpModel.findOne({ email, purpose: "signup" });
    if (!otpRecord) {
      return res.json({ success: false, message: "OTP expired or not found" });
    }

    if (otpRecord.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    const newUser = new userModel({
      name: otpRecord.userData.name,
      email,
      password: otpRecord.userData.password,
    });

    const user = await newUser.save();
    await otpModel.deleteOne({ _id: otpRecord._id });

    const token = createToken(user._id);
    res.json({ success: true, message: "Account created successfully!", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= RESEND OTP =================
const resendOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body;
    if (!email || !purpose) {
      return res.json({ success: false, message: "Email and purpose required" });
    }

    const otpRecord = await otpModel.findOne({ email, purpose });
    if (!otpRecord) {
      return res.json({ success: false, message: "No active OTP request" });
    }

    const newOTP = generateOTP();
    otpRecord.otp = newOTP;
    otpRecord.createdAt = new Date();
    await otpRecord.save();

    const emailPurpose = purpose === "signup" ? "verification" : "reset";
    await sendOTPEmail(email, newOTP, emailPurpose);

    res.json({ success: true, message: "New OTP sent" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= FORGOT PASSWORD =================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.json({ success: false, message: "Email required" });

    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "No account found" });

    const otp = generateOTP();
    await otpModel.deleteMany({ email, purpose: "reset-password" });
    await otpModel.create({ email, otp, purpose: "reset-password" });

    const emailResult = await sendOTPEmail(email, otp, "reset");
    if (!emailResult.success) {
      return res.json({ success: false, message: "Failed to send OTP" });
    }

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= RESET PASSWORD =================
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.json({ success: false, message: "All fields required" });
    }

    if (newPassword.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const otpRecord = await otpModel.findOne({ email, purpose: "reset-password" });
    if (!otpRecord) return res.json({ success: false, message: "OTP expired" });
    if (otpRecord.otp !== otp) return res.json({ success: false, message: "Invalid OTP" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userModel.findOneAndUpdate({ email }, { password: hashedPassword });
    await otpModel.deleteOne({ _id: otpRecord._id });

    res.json({ success: true, message: "Password reset successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================= REGISTER USER (OLD - for compatibility) =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) return res.json({ success: false, message: "User already exists" });

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
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
    if (!user) return res.json({ success: false, message: "User does not exist" });

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

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
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

// ================= 🔧 FIXED: ADD TO CART =================
const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, size } = req.body;

    if (!productId || !size) {
      return res.json({ success: false, message: "productId and size are required" });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    // Get current cart (or empty object)
    let cartData = user.cartData || {};

    // Initialize product entry if it doesn't exist
    if (!cartData[productId]) {
      cartData[productId] = {};
    }

    // Increment quantity for the size
    if (cartData[productId][size]) {
      cartData[productId][size] += 1;
    } else {
      cartData[productId][size] = 1;
    }

    // 🔧 CRITICAL FIX: Use findByIdAndUpdate to force save
    await userModel.findByIdAndUpdate(
      userId,
      { cartData: cartData },
      { new: true }
    );

    res.json({ success: true, message: "Added to cart", cartData });
  } catch (error) {
    console.log("Add to cart error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ================= 🔧 FIXED: UPDATE CART =================
const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, size, quantity } = req.body;

    if (!productId || !size || quantity === undefined) {
      return res.json({ success: false, message: "All fields required" });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    let cartData = user.cartData || {};

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

    // 🔧 CRITICAL FIX: Use findByIdAndUpdate
    await userModel.findByIdAndUpdate(
      userId,
      { cartData: cartData },
      { new: true }
    );

    res.json({ success: true, message: "Cart updated", cartData });
  } catch (error) {
    console.log("Update cart error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ================= GET CART =================
const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

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