import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addReview,
  getBusinessReviews,
  editReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// Public routes
router.get("/:businessId", getBusinessReviews);

// Protected routes (later we’ll add auth middleware)
router.post("/add", authMiddleware,addReview);
router.put("/edit/:reviewId", editReview);
router.delete("/delete/:reviewId",authMiddleware, deleteReview);

export default reviewRoutes;