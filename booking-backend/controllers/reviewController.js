import prisma from "../prismaClient.js";

export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { businessId, rating, comment } = req.body;

    // Prevent multiple reviews by same user for same business
    const exists = await prisma.review.findFirst({ where: { userId, businessId } });
    if (exists) return res.status(400).json({ message: "You already reviewed this place." });

    const review = await prisma.review.create({
      data: { userId, businessId, rating: Number(rating), comment }
    });

    // Recalculate business rating
    const stats = await prisma.review.aggregate({
      where: { businessId },
      _avg: { rating: true }
    });

    await prisma.business.update({
      where: { id: businessId },
      data: { rating: stats._avg.rating }
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviews = async (req, res) => {
  const businessId = req.params.id;

  const reviews = await prisma.review.findMany({
    where: { businessId },
    include: { user: { select: { name: true, photo: true }}},
    orderBy: { createdAt: "desc" }
  });

  res.json({ success: true, reviews });
};