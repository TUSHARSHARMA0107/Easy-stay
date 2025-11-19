import prisma from "../config/prisma.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

// 1) CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const amountInPaise = Math.round(booking.totalPrice * 100);

    // Razorpay Order create
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${booking.id}`,
    });

    // Payment record create
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.totalPrice,
        currency: "INR",
        status: "created",
        razorpayOrderId: order.id,
      },
    });

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      paymentId: payment.id,
    });
  } catch  {
    console.error("Create order error:", err);
    return res.status(500).json({ message: "Could not create order" });
  }
};

// 2) VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: "failed", razorpayPaymentId, razorpaySignature },
      });

      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Payment success
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "paid",
        razorpayPaymentId,
        razorpaySignature,
      },
      include: { booking: true },
    });

    // Booking status update
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: "paid" },
    });

    return res.json({ message: "Payment successful", payment });
  } catch (err) {
    console.error("Verify payment error:", err);
    return res.status(500).json({ message: "Payment verification error" });
  }
};