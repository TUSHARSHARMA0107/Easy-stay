import prisma from "../prismaClient.js";

// ADD REVIEW
export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { businessId, rating, comment } = req.body;

    const exists = await prisma.review.findFirst({
      where: { userId, businessId }
    });
    if (exists) {
      return res.status(400).json({ message: "You already reviewed this place." });
    }

    const review = await prisma.review.create({
      data: { userId, businessId, rating: Number(rating), comment }
    });

    // Update business rating
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

// GET ALL REVIEWS FOR A BUSINESS
export const getBusinessReviews = async (req, res) => {
  try {
    const businessId = req.params.businessId;

    const reviews = await prisma.review.findMany({
      where: { businessId },
      include: { user: { select: { name: true, photo: true }}},
      orderBy: { createdAt: "desc" }
    });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// EDIT REVIEW
export const editReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.reviewId;
    const { rating, comment } = req.body;

    const review = await prisma.review.findUnique({ where: { id: reviewId }});
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.userId !== userId)
      return res.status(403).json({ message: "Not allowed to edit this review" });

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { rating: Number(rating), comment }
    });

    // Update business rating again
    const stats = await prisma.review.aggregate({
      where: { businessId: review.businessId },
      _avg: { rating: true }
    });

    await prisma.business.update({
      where: { id: review.businessId },
      data: { rating: stats._avg.rating }
    });

    res.json({ success: true, review: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE REVIEW
export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.reviewId;

    const review = await prisma.review.findUnique({ where: { id: reviewId }});
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.userId !== userId)
      return res.status(403).json({ message: "Not allowed to delete this review" });

    await prisma.review.delete({ where: { id: reviewId }});

    // Recalculate rating
    const stats = await prisma.review.aggregate({
      where: { businessId: review.businessId },
      _avg: { rating: true }
    });

    await prisma.business.update({
      where: { id: review.businessId },
      data: { rating: stats._avg.rating }
    });

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};