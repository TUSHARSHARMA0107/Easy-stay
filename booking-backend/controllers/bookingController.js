import prisma from "../config/prisma.js";

// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests } = req.body;

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return res.status(404).json({ message: "Room not found" });

    const nights =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    if (nights <= 0)
      return res.status(400).json({ message: "Invalid date selection" });

    const totalPrice = nights * room.price;

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        roomId,
        businessId: room.businessId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: parseInt(guests),
        totalPrice,
      },
    });

    return res.json({ message: "Booking confirmed", booking });
  } catch (err) {
    return res.status(500).json({ message: "Booking failed" });
  }
};

// GET USER BOOKINGS
export const getMyBookings = async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user.id },
    include: { room: true },
  });

  return res.json(bookings);
};

// GET OWNER BOOKINGS
export const getOwnerBookings = async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { businessId: req.params.businessId },
    include: { user: true, room: true },
  });

  return res.json(bookings);
};