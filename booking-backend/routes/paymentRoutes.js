import express from "express";
import bodyParser from "body-parser";
import { createPaymentIntent, stripeWebhookHandler } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/create-intent", protect, allowRoles("USER"), createPaymentIntent);

// Stripe requires raw body for webhook
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhookHandler
);

export default paymentRoutes;
