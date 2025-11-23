// controllers/businessController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


// ---------------------------------------------------
// 1) REGISTER BUSINESS
// ---------------------------------------------------
export const registerBusiness = async (req, res) => {
  try {
    const { name, description, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: "Name and address are required" });
    }

    const imagePaths = req.files?.map((f) => f.path) || [];

    const business = await prisma.business.create({
      data: {
        name,
        description,
        address,
        ownerId: req.user.id,
        images: imagePaths,
      },
    });

    return res.json({ message: "Business registered successfully", business });
  } catch (err) {
    console.error("Register Business Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ---------------------------------------------------
// 2) GET ALL BUSINESSES OF LOGGED-IN OWNER
// ---------------------------------------------------
export const getMyBusinesses = async (req, res) => {
  try {
    const businesses = await prisma.business.findMany({
      where: { ownerId: req.user.id },
      include: { rooms: true },
    });

    return res.json({ businesses });
  } catch (err) {
    console.error("GetMyBusinesses Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ---------------------------------------------------
// 3) ADD BUSINESS IMAGE
// ---------------------------------------------------
export const addBusinessImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Image file missing" });
    }

    const business = await prisma.business.findUnique({ where: { id } });
    if (!business) return res.status(404).json({ message: "Business not found" });

    const updated = await prisma.business.update({
      where: { id },
      data: {
        images: [...business.images, req.file.path],
      },
    });

    return res.json({ message: "Image added", images: updated.images });
  } catch (err) {
    console.error("AddBusinessImage Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ---------------------------------------------------
// 4) DELETE BUSINESS IMAGE
// ---------------------------------------------------
export const deleteBusinessImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const business = await prisma.business.findUnique({ where: { id } });
    if (!business) return res.status(404).json({ message: "Business not found" });

    const updated = await prisma.business.update({
      where: { id },
      data: {
        images: business.images.filter((img) => img !== imageUrl),
      },
    });

    return res.json({ message: "Image removed", images: updated.images });
  } catch (err) {
    console.error("DeleteBusinessImage Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ---------------------------------------------------
// 5) ADD ROOM (with IMAGES)
// ---------------------------------------------------
export const addRoom = async (req, res) => {
  try {
    const { id } = req.params; // businessId
    const { title, price, maxGuests, beds, description } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required" });
    }

    const roomImages = req.files?.map((f) => f.path) || [];

    const room = await prisma.room.create({
      data: {
        title,
        price: parseFloat(price),
        maxGuests: Number(maxGuests) || 1,
        beds: Number(beds) || 1,
        description,
        businessId: id,
        images: roomImages,
      },
    });

    return res.json({ message: "Room added", room });
  } catch (err) {
    console.error("AddRoom Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ---------------------------------------------------
// 6) DELETE ROOM
// ---------------------------------------------------
export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    await prisma.booking.deleteMany({ where: { roomId } });
    await prisma.room.delete({ where: { id: roomId } });

    return res.json({ message: "Room deleted" });
  } catch (err) {
    console.error("DeleteRoom Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ---------------------------------------------------
// 7) DELETE FULL BUSINESS
// ---------------------------------------------------
export const deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.booking.deleteMany({ where: { businessId: id } });
    await prisma.room.deleteMany({ where: { businessId: id } });
    await prisma.business.delete({ where: { id } });

    return res.json({ message: "Business deleted" });
  } catch (err) {
    console.error("DeleteBusiness Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ---------------------------------------------------
// 8) GET SINGLE BUSINESS WITH ROOMS (Missing Fix)
// ---------------------------------------------------
export const getBusinessDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await prisma.business.findUnique({
      where: { id },
      include: { rooms: true },
    });

    if (!business)
      return res.status(404).json({ message: "Business not found" });

    return res.json({ business });
  } catch (err) {
    console.error("GetBusinessDetails Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ---------------------------------------------------
// 9) GET ALL BUSINESSES FOR USER VIEW (AllHotels)
// ---------------------------------------------------
export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await prisma.business.findMany({
      include: { rooms: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ businesses });
  } catch (err) {
    console.error("GetAllBusinesses Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ---------------------------------------------------
// 10) UPDATE BUSINESS (name / desc / address)
// ---------------------------------------------------
export const updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, address } = req.body;

    const updated = await prisma.business.update({
      where: { id },
      data: {
        name,
        description,
        address,
      },
    });

    return res.json({
      message: "Business updated successfully",
      business: updated,
    });
  } catch (err) {
    console.error("UpdateBusiness Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------------------------------
// 11) UPDATE ROOM (title / price / guests / beds / desc / available)
// ---------------------------------------------------
export const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { title, price, maxGuests, beds, description, available } = req.body;

    const updated = await prisma.room.update({
      where: { id: roomId },
      data: {
        title,
        price: price ? parseFloat(price) : undefined,
        maxGuests: maxGuests ? Number(maxGuests) : undefined,
        beds: beds ? Number(beds) : undefined,
        description,
        available: available !== undefined ? Boolean(available) : undefined,
      },
    });

    return res.json({
      message: "Room updated successfully",
      room: updated,
    });
  } catch (err) {
    console.error("UpdateRoom Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//---------------------------------------------------
// OWNER: See all bookings for their business
//---------------------------------------------------
export const getBusinessBookings = async (req, res) => {
  try {
    const { id } = req.params; // businessId

    const bookings = await prisma.booking.findMany({
      where: { businessId: id },
      include: {
        user: true,
        room: true,
      },
      orderBy: { checkIn: "asc" }
    });

    return res.json({ bookings });
  } catch (err) {
    console.error("GetBusinessBookings Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//---------------------------------------------------
// OWNER: Update booking status (confirm / cancel)
//---------------------------------------------------
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "cancelled" }
    });

    return res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error("CancelBooking Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};