import express from "express";
import {
  addReview,
  getProductReviews,
  getAllReviewsStats,
  deleteReview,
  adminDeleteReview,
} from "../controllers/reviewController.js";
import authUser from "../middleware/auth.js";
import authAdmin from "../middleware/adminAuth.js";

const reviewRouter = express.Router();

// USER routes
reviewRouter.post("/add", authUser, addReview);
reviewRouter.delete("/:id", authUser, deleteReview);

// PUBLIC routes (anyone can see reviews)
reviewRouter.get("/product/:productId", getProductReviews);
reviewRouter.get("/stats", getAllReviewsStats);

// ADMIN routes
reviewRouter.delete("/admin/:id", authAdmin, adminDeleteReview);

export default reviewRouter;