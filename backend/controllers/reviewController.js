import mongoose from "mongoose";
import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

// ========== ADD REVIEW ==========
// POST /api/review/add
// Body: { productId, rating, comment }
const addReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Get user name
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if user already reviewed this product
    const existing = await reviewModel.findOne({ productId, userId });
    if (existing) {
      return res.json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const newReview = new reviewModel({
      productId: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(userId),
      userName: user.name,
      rating: Number(rating),
      comment,
    });

    await newReview.save();

    res.json({
      success: true,
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ========== GET REVIEWS FOR A PRODUCT ==========
// GET /api/review/product/:productId
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await reviewModel
      .find({ productId })
      .sort({ createdAt: -1 });

    // Calculate average rating
    let averageRating = 0;
    if (reviews.length > 0) {
      const total = reviews.reduce((sum, r) => sum + r.rating, 0);
      averageRating = (total / reviews.length).toFixed(1);
    }

    res.json({
      success: true,
      reviews,
      averageRating: Number(averageRating),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ========== GET ALL REVIEWS STATS (for products list) ==========
// GET /api/review/stats
const getAllReviewsStats = async (req, res) => {
  try {
    const stats = await reviewModel.aggregate([
      {
        $group: {
          _id: "$productId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    res.json({ success: true, stats });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ========== DELETE OWN REVIEW ==========
// DELETE /api/review/:id
const deleteReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const review = await reviewModel.findById(id);
    if (!review) {
      return res.json({ success: false, message: "Review not found" });
    }

    // Only the owner can delete
    if (String(review.userId) !== String(userId)) {
      return res.json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    await reviewModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ========== ADMIN: DELETE ANY REVIEW ==========
// DELETE /api/review/admin/:id
const adminDeleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await reviewModel.findByIdAndDelete(id);
    if (!review) {
      return res.json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, message: "Review deleted by admin" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addReview,
  getProductReviews,
  getAllReviewsStats,
  deleteReview,
  adminDeleteReview,
};