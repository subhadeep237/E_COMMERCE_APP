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
import { validateAddReview, validateMongoId } from "../middleware/validator.js";

const reviewRouter = express.Router();

// USER routes
reviewRouter.post("/add", authUser, validateAddReview, addReview);
reviewRouter.delete("/:id", authUser, validateMongoId("id"), deleteReview);

// PUBLIC routes
reviewRouter.get("/product/:productId", validateMongoId("productId"), getProductReviews);
reviewRouter.get("/stats", getAllReviewsStats);

// ADMIN routes
reviewRouter.delete("/admin/:id", authAdmin, validateMongoId("id"), adminDeleteReview);

export default reviewRouter;