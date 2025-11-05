import express from "express";
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
router.post("/add", addReview);
router.put("/edit/:reviewId", editReview);
router.delete("/delete/:reviewId", deleteReview);

export default reviewRoutes;