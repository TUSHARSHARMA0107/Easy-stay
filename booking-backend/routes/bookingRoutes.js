import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createBooking, getMyBookings, getOwnerBookings } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/create", authMiddleware, createBooking);
router.get("/my", authMiddleware, getMyBookings);
router.get("/owner/:businessId", authMiddleware, getOwnerBookings);

export default router;