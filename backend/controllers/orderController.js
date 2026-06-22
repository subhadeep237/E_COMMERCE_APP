import mongoose from "mongoose";
import razorpay from "razorpay";
import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

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

// ========== USER: PLACE ORDER (COD) ==========
const placeOrder = async (req, res) => {
  try {
    const userIdStr = req.userId;
    const { items, amount, address, paymentMethod } = req.body;

    if (!userIdStr) {
      return res.json({ success: false, message: "User ID missing from request" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.json({ success: false, message: "Items are required" });
    }

    if (!amount || amount <= 0) {
      return res.json({ success: false, message: "Amount is required" });
    }

    if (!address) {
      return res.json({ success: false, message: "Address is required" });
    }

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

    if (!userIdStr) {
      return res.json({ success: false, message: "User ID missing from request" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.json({ success: false, message: "Items are required" });
    }

    if (!amount || amount <= 0) {
      return res.json({ success: false, message: "Amount is required" });
    }

    if (!address) {
      return res.json({ success: false, message: "Address is required" });
    }

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
      return res.json({
        success: false,
        message: "Missing payment details",
      });
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

      return res.json({
        success: false,
        message: "Payment verification failed",
      });
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

    if (!userIdStr) {
      return res.json({ success: false, message: "User ID missing from request" });
    }

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
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (String(order.userId) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: "Not authorized for this order" });
    }

    res.json({ success: true, order });
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
      return res.json({ success: false, message: "orderId and status are required" });
    }

    const allowed = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.json({ success: false, message: "Invalid status value" });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
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
  getAllOrders,
  updateOrderStatus,
};