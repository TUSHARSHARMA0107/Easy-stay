import prisma from "../prismaClient.js";

export const getOwnerAnalytics = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // all businesses owned by the logged owner
    const businesses = await prisma.business.findMany({
      where: { ownerId },
      select: { id: true },
    });

    const businessIds = businesses.map(b => b.id);

    // total bookings
    const totalBookings = await prisma.booking.count({
      where: { businessId: { in: businessIds } },
    });

    // total revenue (only confirmed)
    const revenueData = await prisma.booking.findMany({
      where: { status: "CONFIRMED", businessId: { in: businessIds } },
      select: { totalAmount: true },
    });
    const totalRevenue = revenueData.reduce((sum, b) => sum + b.totalAmount, 0);

    // bookings per month
    const bookingStats = await prisma.$queryRaw`
      SELECT DATE_TRUNC('month', "createdAt") AS month, COUNT(*)::int AS count
      FROM "Booking"
      WHERE "businessId" = ANY (${businessIds})
      GROUP BY month
      ORDER BY month ASC;
    `;

    return res.json({
      success: true,
      totalBookings,
      totalRevenue,
      bookingsPerMonth: bookingStats,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};