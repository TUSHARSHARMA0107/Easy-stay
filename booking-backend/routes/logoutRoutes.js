import express from "express";
import { logoutUser } from "../controllers/logoutController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, logoutUser);

export default router;