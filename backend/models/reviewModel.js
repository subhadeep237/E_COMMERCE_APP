import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
    index: true, // 🚀 Fast lookup by product
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    index: true,
  },
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    index: true, // 🚀 Fast filtering by rating
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // 🚀 For sorting
  },
});

// Prevent same user from reviewing same product twice
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;