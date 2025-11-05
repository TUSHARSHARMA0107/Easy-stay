// services/comparePriceService.js
import axios from "axios";

/**
 * Dummy price comparators using publicly accessible or demo endpoints
 * (In real integration, you’d replace these with official affiliate APIs)
 */
export const fetchExternalPrices = async (name, location) => {
  try {
    const encoded = encodeURIComponent(`${name} ${location}`);

    // Mock / Demo APIs (to be replaced later)
    const [booking, agoda, trip] = await Promise.all([
      fakePriceAPI("Booking.com", encoded),
      fakePriceAPI("Agoda", encoded),
      fakePriceAPI("Trip.com", encoded),
    ]);

    return [booking, agoda, trip].filter(Boolean);
  } catch (error) {
    console.error("Price comparison error:", error.message);
    return [];
  }
};

// Temporary simulated API call
const fakePriceAPI = async (source, encodedName) => {
  const basePrice = Math.floor(3000 + Math.random() * 4000);
  return {
    source,
    price: basePrice,
    currency: "INR",
    link: `https://www.${source.toLowerCase().replace(".com", "")}.com/search?query=${encodedName}`,
  };
};