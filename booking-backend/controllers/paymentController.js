// src/controllers/paymentController.js
import Stripe from "stripe";
import prisma from "../prismaClient.js";
import dotenv from "dotenv";
dotenv.config();

// Lazy-initialize Stripe so server can start even when STRIPE_SECRET_KEY is not set.
let stripeInstance = null;
function getStripe() {
  if (stripeInstance) return stripeInstance;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  stripeInstance = new Stripe(key, { apiVersion: "2023-08-16" });
  return stripeInstance;
}

/**
 * POST /api/payments/create-intent
 * Body: { bookingId }
 * Returns: { clientSecret, paymentId }
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ message: "bookingId required" });

    // load booking and ensure it exists and is pending
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { unit: true },
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "PENDING") return res.status(400).json({ message: "Booking not in pending state" });

    // amount in smallest currency unit (cents / paise)
    // We'll send currency and amount from booking.totalPrice (float)
    const amount = Math.round(Number(booking.totalPrice) * 100); // INR paise or USD cents
    const currency = process.env.STRIPE_CURRENCY || "INR";

    // Create a PaymentIntent
    const stripe = getStripe();
    if (!stripe) return res.status(501).json({ message: "Stripe not configured" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { bookingId: booking.id },
      description: `Payment for booking ${booking.id}`,
    });

    // create Payment record in DB
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        gateway: "STRIPE",
        amount: booking.totalPrice,
        currency,
        status: "created",
        gatewayRef: paymentIntent.id,
        payload: { paymentIntent }, // optional snapshot
      },
    });

    return res.json({ clientSecret: paymentIntent.client_secret, paymentId: payment.id });
  } catch (err) {
    console.error("createPaymentIntent error:", err);
    return res.status(500).json({ message: "Failed to create payment intent" });
  }
};

/**
 * POST /api/payments/webhook
 * Expects raw body. Use stripe.webhooks.constructEvent to verify.
 */
export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    const stripe = getStripe();
    if (!stripe) {
      console.error("Stripe webhook received but STRIPE_SECRET_KEY is not configured");
      return res.status(501).send("Stripe not configured");
    }
    // req.rawBody must be the raw Buffer — server should set up body-parser.raw for this route
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("⚠  Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  const type = event.type;
  const data = event.data.object;

  try {
    if (type === "payment_intent.succeeded") {
      const intent = data;
      const gatewayRef = intent.id;
      const bookingId = intent.metadata?.bookingId;

      // update payment record
      const payment = await prisma.payment.findFirst({
        where: { gatewayRef },
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "succeeded", payload: intent },
        });
      } else if (bookingId) {
        // if not found by gatewayRef, try update by bookingId+gateway
        await prisma.payment.updateMany({
          where: { bookingId: bookingId },
          data: { status: "succeeded", gatewayRef, payload: intent },
        });
      }

      // mark booking as CONFIRMED (business logic: auto-confirm on payment)
      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "CONFIRMED" },
        });
      }
    } else if (type === "payment_intent.payment_failed") {
      const intent = data;
      const gatewayRef = intent.id;
      // mark payment failed
      await prisma.payment.updateMany({
        where: { gatewayRef },
        data: { status: "failed", payload: intent },
      });
    }
    // ... handle other events if needed

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook handling error:", err);
    res.status(500).send();
  }
};