import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { sendEmail } from "../utils/emailHelper.js";
import { generateInvoice } from "../utils/invoiceHelper.js";
import fs from "fs";


/**
 * ✅ Create new booking (with total price calculation)
 */
export const createBooking = async (req, res) => {
  try {
    const { unitId, checkInDate, checkOutDate, guests } = req.body;
    const userId = req.user?.id;

    // Fetch the unit with its price and owner info
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: { business: true },
    });

    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    // Calculate number of days
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    // Calculate total price (per night × days)
    const totalPrice = unit.price * days;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        ownerId: unit.business.ownerId,
        businessId: unit.businessId,
        unitId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests,
        totalPrice,
      },
      include: {
        unit: { include: { business: true } },
      },
    });

    res.status(201).json({
      message: "Booking created successfully",
      totalDays: days,
      totalPrice,
      booking,
    });
  } catch (error) {
    console.error("❌ Booking creation failed:", error);
    res.status(500).json({ message: "Server error while creating booking" });
  }
};

/**
 * 🧾 Get all bookings for a logged-in user (active + pending)
 */
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        unit: { include: { business: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("❌ Error fetching user bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

/**
 * 🧾 Get all bookings for a business owner (pending + confirmed)
 */
export const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { ownerId: req.user.id },
      include: {
        user: { select: { name: true, email: true, profileImage: true } },
        unit: { include: { business: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("❌ Error fetching owner bookings:", error);
    res.status(500).json({ message: "Error fetching owner bookings" });
  }
};

/**
 * ✅ Confirm a booking (owner side)
 */
export const confirmBooking = async (req, res) => {
try {
    const { id } = req.params;

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: "CONFIRMED" },
      include: {
        user: true,
        unit: { include: { business: true } },
      },
    });

    // ✅ Generate invoice PDF
    const invoicePath = await generateInvoice(booking);

    // ✅ Send email with invoice attached
    const userMessage = `
      <h2>Your booking is confirmed 🎉</h2>
      <p>Dear ${booking.user.name},</p>
      <p>Your booking at <b>${booking.unit.business.name}</b> (Unit: ${booking.unit.name}) is confirmed.</p>
      <p>Check-in: ${new Date(booking.checkInDate).toDateString()}</p>
      <p>Check-out: ${new Date(booking.checkOutDate).toDateString()}</p>
      <p>Total Price: ₹${booking.totalPrice}</p>
      <p>Your invoice is attached below.</p>
    `;

    await sendEmail(
      booking.user.email,
      "Booking Confirmed – StayEase",
      userMessage,
      invoicePath // 📎 attach invoice
    );

    // Delete the temporary invoice file after sending
    fs.unlinkSync(invoicePath);

    res.status(200).json({
      message: "Booking confirmed, invoice sent to user",
      booking,
    });
  } catch (error) {
    console.error("❌ Error confirming booking:", error);
    res.status(500).json({ message: "Error confirming booking" });
  }

};

/**
 * ❌ Reject a booking (owner side)
 */
export const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    res.status(200).json({
      message: "Booking rejected",
      booking,
    });
  } catch (error) {
    console.error("❌ Error rejecting booking:", error);
    res.status(500).json({ message: "Error rejecting booking" });
  }
};

/**
 * 📜 Full Booking History for User
 */
export const getUserBookingHistory = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        unit: { include: { business: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("❌ Error fetching user booking history:", error);
    res.status(500).json({ message: "Error fetching booking history" });
  }
};

/**
 * 📜 Full Booking History for Owner
 */
export const getOwnerBookingHistory = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { ownerId: req.user.id },
      include: {
        user: { select: { name: true, email: true, profileImage: true } },
        unit: { include: { business: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("❌ Error fetching owner booking history:", error);
    res.status(500).json({ message: "Error fetching booking history" });
  }
};