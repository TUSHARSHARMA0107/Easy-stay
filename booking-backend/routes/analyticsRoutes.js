import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getOwnerAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/owner", authMiddleware, getOwnerAnalytics);

export default analyticsRoutes;