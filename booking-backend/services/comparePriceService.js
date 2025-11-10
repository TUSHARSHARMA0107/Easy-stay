import { comparePrices } from "../services/compareService.js";
import prisma from "../config/prismaClient.js";

export const comparePricesController = async (req, res) => {
  try {
    const { name, location, type } = req.query;
    if (!name && !location) {
      return res.status(400).json({ message: "Name or location is required" });
    }

    const local = await prisma.business.findFirst({
      where: { name: { contains: name, mode: "insensitive" } },
      select: { name: true, price: true },
    });

    const results = await comparePrices(name, location, type, local?.price || null);

    res.status(200).json({
      place: name,
      location,
      results,
    });
  } catch (err) {
    console.error("Compare Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};