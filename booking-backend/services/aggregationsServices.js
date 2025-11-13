import prisma from "../prismaClient.js";
import { textSearch, placeDetails } from "./googleService.js";
import { comparePrices } from "./compareService.js";
import { getCache, setCache } from "../utils/cachemanager.js";

/**
 * Aggregate businesses from internal DB, Google, and external APIs.
 */
export const aggregateBusinesses = async ({ query, location, sortBy = "rating" }) => {
  const cacheKey = `aggregate:${query}:${location}:${sortBy}`;
  const cached = await getCache(cacheKey);
  if (cached) return { fromCache: true, results: cached };

  // --- 1️⃣ Internal businesses ---
  const internal = await prisma.business.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { location: { contains: location, mode: "insensitive" } },
      ],
    },
    include: { units: true },
  });

  // --- 2️⃣ Google data ---
  const google = (await textSearch({ query, location })).results.results || [];

  // --- 3️⃣ Optional external prices ---
  const external = [];
  for (const biz of internal.slice(0, 3)) {
    const prices = await fetchExternalPrices({
      name: biz.name,
      location: biz.location,
    });
    if (prices.length) external.push({ businessId: biz.id, prices });
  }

  // --- 4️⃣ Normalize & merge ---
  const normalized = [
    ...internal.map((b) => ({
      source: "internal",
      name: b.name,
      location: b.location,
      rating: b.rating || 0,
      price: b.units?.[0]?.pricePerNight || null,
      id: b.id,
      image: b.images?.[0] || null,
    })),
    ...google.map((g) => ({
      source: "google",
      name: g.name,
      location: g.formatted_address,
      rating: g.rating || 0,
      price: null,
      placeId: g.place_id,
      image:
        g.photos?.length > 0
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${g.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
          : null,
    })),
  ];

  // --- 5️⃣ Ranking / sorting ---
  let sorted = normalized;
  if (sortBy === "price")
    sorted = normalized.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
  else if (sortBy === "rating")
    sorted = normalized.sort((a, b) => b.rating - a.rating);
  else if (sortBy === "name")
    sorted = normalized.sort((a, b) => a.name.localeCompare(b.name));

  await setCache(cacheKey, sorted, 3600); // 1h cache
  return { fromCache: false, results: sorted, external };
};