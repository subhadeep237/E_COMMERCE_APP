import express from "express";
import {
  placeOrder,
  placeOrderRazorpay,
  verifyRazorpay,
  getUserOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import authUser from "../middleware/auth.js";
import authAdmin from "../middleware/adminAuth.js";

const orderRouter = express.Router();

// USER routes
orderRouter.post("/place", authUser, placeOrder);

// 🆕 RAZORPAY routes
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);
orderRouter.post("/verify-razorpay", authUser, verifyRazorpay);

// USER ORDERS: Handled via POST request
orderRouter.post("/user-orders", authUser, getUserOrders);

// ADMIN routes
orderRouter.get("/admin/all", authAdmin, getAllOrders);
orderRouter.post("/admin/status", authAdmin, updateOrderStatus);

// USER: track a single order (Must come after admin routes to avoid path parameter overlap)
orderRouter.get("/:id", authUser, getOrderDetails);

export default orderRouter;