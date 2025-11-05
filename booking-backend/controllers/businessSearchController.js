// controllers/businessSearchController.js
import { prisma } from "../lib/prisma.js";

/**
 * Compare names ignoring case and punctuation
 */
const normalize = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, "");

export const searchBusinesses = async (req, res) => {
  try {
    const { query, type } = req.query;
    if (!query) return res.status(400).json({ message: "Search query required" });

    // 1️⃣ Get internal businesses
    const internal = await prisma.business.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
        ...(type ? { type } : {}),
      },
    });

    // 2️⃣ Get cached external (Google) businesses
    const external = await prisma.externalBusiness.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
        ...(type ? { type } : {}),
      },
    });

    // 3️⃣ Merge based on name/location similarity
    const merged = [];

    internal.forEach((i) => {
      const match = external.find(
        (e) =>
          normalize(e.name).includes(normalize(i.name)) ||
          normalize(i.name).includes(normalize(e.name))
      );

      if (match) {
        merged.push({
          id: i.id,
          name: i.name,
          address: i.address || match.address,
          location: i.location || match.location,
          rating: i.rating || match.rating,
          images: [...new Set([...i.images, ...match.images])],
          type: i.type,
          source: "internal+google",
        });
      } else {
        merged.push({ ...i, source: "internal" });
      }
    });

    // Add unmatched external results
    external.forEach((e) => {
      if (!merged.find((m) => normalize(m.name) === normalize(e.name))) {
        merged.push({ ...e, source: "google" });
      }
    });

    res.json(merged);
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ message: "Failed to search businesses" });
  }
};