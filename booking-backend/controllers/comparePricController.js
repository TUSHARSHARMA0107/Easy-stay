import axios from "axios";
import prisma from "../config/prismaClient.js"; // your database connection
import dotenv from "dotenv";
dotenv.config();

const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HEADERS = { "x-rapidapi-key": RAPID_API_KEY };

/**
 * Compare hotel prices from multiple sources + your DB
 */
export const compareHotelPrices = async (req, res) => {
  try {
    const { hotelName, location } = req.query;

    if (!hotelName && !location) {
      return res.status(400).json({
        success: false,
        message: "Please provide hotel name or location.",
      });
    }

    // 🏨 1️⃣ Try to find hotel from your database first
    const ourHotel = await prisma.hotel.findFirst({
      where: {
        OR: [
          { name: { contains: hotelName || "", mode: "insensitive" } },
          { location: { contains: location || "", mode: "insensitive" } },
        ],
      },
    });

    const results = [];

    // 🏨 Add your DB price if found
    if (ourHotel && ourHotel.price) {
      results.push({
        source: "Our Platform",
        price: ourHotel.price,
        link: `https://yourdomain.com/hotels/${ourHotel.id}`,
        image: ourHotel.images?.[0] || null,
        rating: ourHotel.rating || null,
      });
    }

    // 🌐 2️⃣ Fetch from Booking.com
    try {
      const bookingRes = await axios.get(
        "https://booking-com-api4.p.rapidapi.com/list-hotels/",
        {
          headers: {
            "x-rapidapi-host": "booking-com-api4.p.rapidapi.com",
            ...RAPID_API_HEADERS,
          },
          params: { city_name: location || hotelName, items_per_page: 5 },
        }
      );
      const bookingData = bookingRes.data?.hotels || [];

      bookingData.slice(0, 1).forEach((h) =>
        results.push({
          source: "Booking.com",
          price: h.price || h.min_total_price || null,
          link: h.url || h.link || "https://booking.com",
          image: h.photo_main || null,
          rating: h.review_score || null,
        })
      );
    } catch (err) {
      console.log("Booking API failed:", err.message);
    }

    // 🌐 3️⃣ Agoda
    try {
      const agodaRes = await axios.get(
        "https://agoda-com.p.rapidapi.com/hotels/search-overnight",
        {
          headers: {
            "x-rapidapi-host": "agoda-com.p.rapidapi.com",
            ...RAPID_API_HEADERS,
          },
          params: { id: "1_318" },
        }
      );
      const agodaData = agodaRes.data?.properties || [];
      agodaData.slice(0, 1).forEach((h) =>
        results.push({
          source: "Agoda",
          price: h.lowRate || null,
          link: h.link || "https://agoda.com",
          image: h.thumbnailUrl || null,
          rating: h.rating || null,
        })
      );
    } catch (err) {
      console.log("Agoda API failed:", err.message);
    }

    // 🌐 4️⃣ TripAdvisor
    try {
      const tripRes = await axios.get(
        "https://travel-advisor.p.rapidapi.com/locations/search",
        {
          headers: {
            "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
            ...RAPID_API_HEADERS,
          },
          params: { query: hotelName || location, limit: 1, lang: "en_US" },
        }
      );
      const tripData = tripRes.data?.data || [];
      tripData.slice(0, 1).forEach((h) =>
        results.push({
          source: "TripAdvisor",
          price: h.price_level || null,
          link: h.web_url || "https://tripadvisor.com",
          image: h.photo?.images?.large?.url || null,
          rating: h.rating || null,
        })
      );
    } catch (err) {
      console.log("TripAdvisor API failed:", err.message);
    }

    // 🌐 5️⃣ Airbnb
    try {
      const airbnbRes = await axios.get(
        "https://airbnb19.p.rapidapi.com/api/v2/searchPropertyByPlaceId",
        {
          headers: {
            "x-rapidapi-host": "airbnb19.p.rapidapi.com",
            ...RAPID_API_HEADERS,
          },
          params: {
            placeId: "ChIJ7cv00DwsDogRAMDACa2m4K8",
            adults: 1,
            currency: "USD",
          },
        }
      );
      const airbnbData = airbnbRes.data?.data || [];
      airbnbData.slice(0, 1).forEach((h) =>
        results.push({
          source: "Airbnb",
          price: h.price?.total || null,
          link: h.url || "https://airbnb.com",
          image: h.picture?.url || null,
          rating: h.rating || null,
        })
      );
    } catch (err) {
      console.log("Airbnb API failed:", err.message);
    }

    // ⚙ 6️⃣ Sort all prices (cheapest first)
    const validResults = results.filter((r) => r.price);
    validResults.sort((a, b) => a.price - b.price);

    if (validResults.length === 0)
      return res.json({ success: true, message: "No results found" });

    validResults[0].isCheapest = true;

    // 🚦 Wrap each link in redirect route
    const finalResults = validResults.map((r) => ({
      ...r,
      safeRedirect:` /api/redirect?url=${encodeURIComponent(r.link)}`,
    }));

    res.json({
      success: true,
      total: finalResults.length,
      cheapest: finalResults[0],
      results: finalResults,
    });
  } catch (error) {
    console.error("Error comparing prices:", error);
    res.status(500).json({ error: "Failed to compare prices" });
  }
};