import prisma from "../prisma/client.js";

// ✅ Add new review
export const addReview = async (req, res) => {
  try {
    const { userId, businessId, rating, comment } = req.body;

    if (!userId || !businessId || !rating)
      return res.status(400).json({ message: "Missing required fields" });

    const existing = await prisma.review.findFirst({ where: { userId, businessId } });
    if (existing) return res.status(400).json({ message: "You already reviewed this business" });

    const result = await prisma.$transaction(async (tx) => {
      await tx.review.create({ data: { userId, businessId, rating, comment } });
      const agg = await tx.review.aggregate({
        where: { businessId },
        _avg: { rating: true },
      });
      await tx.business.update({
        where: { id: businessId },
        data: { rating: agg._avg.rating || 0 },
      });
      return agg._avg.rating;
    });

    res.status(201).json({ message: "Review added", newAverage: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all reviews for a business
export const getBusinessReviews = async (req, res) => {
  try {
    const { businessId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { businessId },
      include: { user: { select: { name: true, profileImage: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏ Edit review
export const editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) return res.status(404).json({ message: "Review not found" });

    await prisma.$transaction(async (tx) => {
      await tx.review.update({
        where: { id: reviewId },
        data: { rating, comment },
      });

      const agg = await tx.review.aggregate({
        where: { businessId: review.businessId },
        _avg: { rating: true },
      });

      await tx.business.update({
        where: { id: review.businessId },
        data: { rating: agg._avg.rating || 0 },
      });
    });

    res.json({ message: "Review updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑 Delete review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) return res.status(404).json({ message: "Review not found" });

    await prisma.$transaction(async (tx) => {
      await tx.review.delete({ where: { id: reviewId } });

      const agg = await tx.review.aggregate({
        where: { businessId: review.businessId },
        _avg: { rating: true },
      });

      await tx.business.update({
        where: { id: review.businessId },
        data: { rating: agg._avg.rating || 0 },
      });
    });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};