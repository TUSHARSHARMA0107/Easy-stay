import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * USER MAKES A BOOKING
 */
export const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut)
      return res.status(400).json({ message: "Missing required fields" });

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return res.status(404).json({ message: "Room not found" });

    const days =
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24);

    const totalPrice = days * room.price;

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        roomId,
        businessId: room.businessId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        totalPrice,
      },
    });

    return res.json({
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    console.log("Create booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * USER VIEW HIS BOOKINGS
 */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        room: true,
        business: true,
      },
      orderBy: { checkIn: "desc" },
    });

    return res.json({ bookings });
  } catch (err) {
    console.log("GetMyBookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};