import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getMyBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create", authMiddleware, createBooking);
router.get("/mine", authMiddleware, getMyBookings);

export default router;