import express from "express";
import { logoutUser } from "../controllers/logoutController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, logoutUser);

export default logoutRoutes;