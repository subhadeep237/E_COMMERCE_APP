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
import {
  validatePlaceOrder,
  validateCancelOrder,
  validateUpdateOrderStatus,
  validateMongoId,
} from "../middleware/validator.js";

const orderRouter = express.Router();

// USER routes
orderRouter.post("/place", authUser, validatePlaceOrder, placeOrder);
orderRouter.post("/razorpay", authUser, validatePlaceOrder, placeOrderRazorpay);
orderRouter.post("/verify-razorpay", authUser, verifyRazorpay);
orderRouter.post("/user-orders", authUser, getUserOrders);
orderRouter.post("/cancel", authUser, validateCancelOrder, cancelOrder);

// ADMIN routes
orderRouter.get("/admin/all", authAdmin, getAllOrders);
orderRouter.post("/admin/status", authAdmin, validateUpdateOrderStatus, updateOrderStatus);

// USER: track a single order
orderRouter.get("/:id", authUser, validateMongoId("id"), getOrderDetails);

export default orderRouter;