import mongoose from "mongoose";
import razorpay from "razorpay";
import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from "../services/emailService.js";

// ========== RAZORPAY INSTANCE (lazy load) ==========
let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    razorpayInstance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// Helper: Send order confirmation email
const sendOrderEmail = async (order, userId) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) return;

    // Get product details
    const productIds = order.items.map(item => item.productId);
    const products = await productModel.find({ _id: { $in: productIds } });

    await sendOrderConfirmationEmail(user.email, order, user.name, products);
  } catch (error) {
    console.log("Failed to send order email:", error.message);
  }
};

// ========== USER: PLACE ORDER (COD) ==========
const placeOrder = async (req, res) => {
  try {
    const userIdStr = req.userId;
    const { items, amount, address, paymentMethod } = req.body;

    if (!userIdStr) return res.json({ success: false, message: "User ID missing" });
    if (!items || items.length === 0) return res.json({ success: false, message: "Items required" });
    if (!amount || amount <= 0) return res.json({ success: false, message: "Amount required" });
    if (!address) return res.json({ success: false, message: "Address required" });

    const userId = new mongoose.Types.ObjectId(userIdStr);

    const formattedItems = items.map(item => ({
      productId: new mongoose.Types.ObjectId(item.productId),
      size: item.size,
      quantity: Number(item.quantity)
    }));

    const paymentStatus = paymentMethod === "ONLINE" ? "Paid" : "Pending";

    const newOrder = new orderModel({
      userId,
      items: formattedItems,
      amount,
      address,
      paymentMethod: paymentMethod || "COD",
      paymentStatus,
    });

    const savedOrder = await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Send confirmation email (don't wait, fire and forget)
    sendOrderEmail(savedOrder, userId);

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ========== USER: PLACE ORDER WITH RAZORPAY ==========
const placeOrderRazorpay = async (req, res) => {
  try {
    const userIdStr = req.userId;
    const { items, amount, address } = req.body;

    if (!userIdStr) return res.json({ success: false, message: "User ID missing" });
    if (!items || items.length === 0) return res.json({ success: false, message: "Items required" });
    if (!amount || amount <= 0) return res.json({ success: false, message: "Amount required" });
    if (!address) return res.json({ success: false, message: "Address required" });

    const userId = new mongoose.Types.ObjectId(userIdStr);

    const formattedItems = items.map(item => ({
      productId: new mongoose.Types.ObjectId(item.productId),
      size: item.size,
      quantity: Number(item.quantity)
    }));

    const newOrder = new orderModel({
      userId,
      items: formattedItems,
      amount,
      address,
      paymentMethod: "ONLINE",
      paymentStatus: "Pending",
    });

    const savedOrder = await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: savedOrder._id.toString(),
    };

    getRazorpayInstance().orders.create(options, async (error, razorpayOrder) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
      }

      await orderModel.findByIdAndUpdate(savedOrder._id, {
        razorpayOrderId: razorpayOrder.id,
      });

      res.json({
        success: true,
        order: razorpayOrder,
        orderId: savedOrder._id,
      });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ========== VERIFY RAZORPAY PAYMENT ==========
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.json({ success: false, message: "Missing payment details" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      await orderModel.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentStatus: "Failed" }
      );
      return res.json({ success: false, message: "Payment verification failed" });
    }

    const order = await orderModel.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        paymentStatus: "Paid",
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

    // Send confirmation email after successful payment
    sendOrderEmail(order, order.userId);

    res.json({
      success: true,
      message: "Payment verified successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ========== USER: GET OWN ORDERS ==========
const getUserOrders = async (req, res) => {
  try {
    const userIdStr = req.userId;
    if (!userIdStr) return res.json({ success: false, message: "User ID missing" });

    const userId = new mongoose.Types.ObjectId(userIdStr);
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ========== USER: GET ORDER DETAILS ==========
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderModel.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (String(order.userId) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ========== USER: CANCEL OWN ORDER ==========
const cancelOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.body;

    if (!orderId) return res.json({ success: false, message: "Order ID required" });

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    if (String(order.userId) !== String(userId)) {
      return res.json({ success: false, message: "Not authorized" });
    }

    const nonCancellable = ["Shipped", "Delivered", "Cancelled"];
    if (nonCancellable.includes(order.orderStatus)) {
      return res.json({
        success: false,
        message: `Cannot cancel order. Current status: ${order.orderStatus}`,
      });
    }

    order.orderStatus = "Cancelled";

    if (order.paymentStatus === "Paid") {
      order.paymentStatus = "Refund Pending";
    }

    await order.save();

    // Send cancellation email
    try {
      const user = await userModel.findById(userId);
      if (user) {
        sendOrderStatusEmail(user.email, order, user.name, "Cancelled");
      }
    } catch (e) {
      console.log("Cancel email failed:", e.message);
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ========== ADMIN: GET ALL ORDERS ==========
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ========== ADMIN: UPDATE ORDER STATUS ==========
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.json({ success: false, message: "orderId and status required" });
    }

    const allowed = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Send status update email
    try {
      const user = await userModel.findById(order.userId);
      if (user) {
        sendOrderStatusEmail(user.email, order, user.name, status);
      }
    } catch (e) {
      console.log("Status email failed:", e.message);
    }

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderRazorpay,
  verifyRazorpay,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};