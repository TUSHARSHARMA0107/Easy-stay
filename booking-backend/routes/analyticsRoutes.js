import express from "express";
import { protect } from "../middleware/auth.js";
import { getOwnerAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/owner", protect, getOwnerAnalytics);

export default router;