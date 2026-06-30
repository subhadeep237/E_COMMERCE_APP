import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    index: true, // 🚀 Fast lookup by user
  },

  items: {
    type: [orderItemSchema],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "ONLINE"],
    default: "COD",
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refund Pending"],
    default: "Pending",
    index: true, // 🚀 For filtering by payment status
  },

  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
    index: true, // 🚀 For filtering by order status
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // 🚀 For sorting by date
  },

  razorpayOrderId: {
    type: String,
    default: null,
  },
  razorpayPaymentId: {
    type: String,
    default: null,
  },
});

// 🚀 Compound index for user orders sorted by date
orderSchema.index({ userId: 1, createdAt: -1 });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;