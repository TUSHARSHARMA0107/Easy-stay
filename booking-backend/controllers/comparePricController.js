// controllers/comparePriceController.js
import { fetchExternalPrices } from "../services/comparePriceService.js";
import { prisma } from "../lib/prisma.js";

export const comparePrices = async (req, res) => {
  try {
    const { name, location } = req.query;
    if (!name || !location)
      return res.status(400).json({ message: "Name and location required" });

    // Get internal business price if exists
    const business = await prisma.business.findFirst({
      where: { name: { contains: name, mode: "insensitive" } },
    });

    const internalPrice = business
      ? [{ source: "OurApp", price: 2999, currency: "INR", link: /book/${business.id} }]
      : [];

    // Fetch external prices
    const externalPrices = await fetchExternalPrices(name, location);

    const results = [...internalPrice, ...externalPrices];
    return res.json({ name, location, prices: results });
  } catch (error) {
    console.error("Compare price error:", error.message);
    res.status(500).json({ message: "Failed to compare prices" });
  }
};