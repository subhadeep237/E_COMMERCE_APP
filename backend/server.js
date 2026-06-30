import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import logger from "./config/logger.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import reviewRouter from "./routes/reviewRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// ============ TRUST PROXY (for Render/Vercel) ============
app.set("trust proxy", 1);

// ============ SECURITY HEADERS ============
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ============ COMPRESSION (gzip - smaller responses) ============
app.use(compression());

// ============ CORS ============
app.use(cors());

// ============ JSON PARSER (with size limit) ============
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============ RATE LIMITING ============
// General API rate limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per IP per 15 minutes
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for auth (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Only 10 attempts per IP per 15 minutes
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
  skipSuccessfulRequests: true,
});

// ============ REQUEST LOGGING ============
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// ============ DATABASE & CLOUDINARY ============
connectDB();
connectCloudinary();

// ============ ROUTES ============
app.use("/api/user", authLimiter, userRouter); // Stricter limit for auth
app.use("/api/product", generalLimiter, productRouter);
app.use("/api/order", generalLimiter, orderRouter);
app.use("/api/review", generalLimiter, reviewRouter);

// ============ HEALTH CHECK ============
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Working",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ============ GLOBAL ERROR HANDLER ============
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ============ START SERVER ============
app.listen(port, () => {
  logger.info(`🚀 Server Started on port ${port}`);
});

// ============ GRACEFUL SHUTDOWN ============
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
});