import express from "express";
import {
  placeOrder,
  placeOrderRazorpay,
  verifyRazorpay,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import authUser from "../middleware/auth.js";
import authAdmin from "../middleware/adminAuth.js";

const orderRouter = express.Router();

// USER routes
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);
orderRouter.post("/verify-razorpay", authUser, verifyRazorpay);
orderRouter.post("/user-orders", authUser, getUserOrders);
orderRouter.post("/cancel", authUser, cancelOrder);

// ADMIN routes
orderRouter.get("/admin/all", authAdmin, getAllOrders);
orderRouter.post("/admin/status", authAdmin, updateOrderStatus);

// USER: track a single order
orderRouter.get("/:id", authUser, getOrderDetails);

export default orderRouter;