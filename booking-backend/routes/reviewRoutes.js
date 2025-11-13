import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addReview,
  getBusinessReviews,
  editReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:businessId", getBusinessReviews);
router.post("/add", authMiddleware, addReview);
router.put("/edit/:reviewId", authMiddleware, editReview);
router.delete("/delete/:reviewId", authMiddleware, deleteReview);

export default router;