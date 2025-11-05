import axios from "axios";
import prisma from "../prismaClient.js";
import dotenv from "dotenv";
import { redis } from "../config/redisClients.js";
dotenv.config();

const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY;
const CACHE_TTL = Number(process.env.GOOGLE_CACHE_TTL || 86400); // seconds (default 24h)

// Canonicalize query
const canonical = (s) => (s || "").trim().toLowerCase();

/**
 * Google Text Search API + DB cache */
// --- Redis cache first ---
const cacheKey = `google:${qcanon}`;
const cachedJson = await redis.get(cacheKey);
if (cachedJson) {
  return { fromCache: true, results: JSON.parse(cachedJson) };
}

// ... existing API call here ...

await redis.set(cacheKey, JSON.stringify(results), { ex: CACHE_TTL });
export const textSearch = async ({ query, location, radius = 50000, type }) => {
  const qcanon = canonical(`${query} ${location || ""} ${type || ""}`);

  // Check DB cache
  const cached = await prisma.googleCache.findFirst({ where: { query: qcanon } });
  if (cached) {
    const age = (Date.now() - new Date(cached.createdAt).getTime()) / 1000;
    if (age < cached.ttl) {
      return { fromCache: true, results: cached.results };
    }
  }
  // If cached data is older than 12 hours → refresh in background
if (cachedJson) {
  const cachedAge = (Date.now() - new Date(cachedAt).getTime()) / 1000;
  if (cachedAge > 43200) {
    (async () => {
      try {
        console.log("Background refreshing:", qcanon);
        const newData = await fetchFreshGoogleData(query, location, type);
        await setCache(cacheKey, newData, CACHE_TTL);
      } catch (err) {
        console.warn("Background refresh failed:", err.message);
      }
    })();
  }
}

  const params = new URLSearchParams();
  params.append("key", PLACES_KEY);
  if (query) params.append("query", query);
  if (location) params.append("location", location);
  if (radius) params.append("radius", radius);
  if (type) params.append("type", type);

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?${params.toString()}`;
  const resp = await axios.get(url, { timeout: 8000 });
  const results = resp.data;

  // Save in DB cache
  await prisma.googleCache.create({
    data: {
      query: qcanon,
      placeId: results.results?.[0]?.place_id || null,
      results,
      ttl: CACHE_TTL,
    },
  });

  return { fromCache: false, results };
};

/**
 * Google Place Details API + cache
 */
export const placeDetails = async (placeId) => {
  if (!placeId) throw new Error("placeId required");
  const qcanon = canonical(placeId);

  const cached = await prisma.googleCache.findFirst({ where: { placeId: qcanon } });
  if (cached) {
    const age = (Date.now() - new Date(cached.createdAt).getTime()) / 1000;
    if (age < cached.ttl) return { fromCache: true, results: cached.results };
  }

  const params = new URLSearchParams();
  params.append("key", PLACES_KEY);
  params.append("place_id", placeId);
  params.append(
    "fields",
    [
      "place_id",
      "name",
      "formatted_address",
      "geometry",
      "rating",
      "user_ratings_total",
      "photos",
      "reviews",
      "website",
      "formatted_phone_number",
      "opening_hours",
    ].join(",")
  );

  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`;
  const resp = await axios.get(url, { timeout: 8000 });
  const results = resp.data;

  await prisma.googleCache.create({
    data: {
      query: qcanon,
      placeId,
      results,
      ttl: CACHE_TTL,
    },
  });

  return { fromCache: false, results };
};

/**
 * Generate a photo URL
 */
export const getPhotoUrl = (photoReference, maxwidth = 800) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${photoReference}&key=${PLACES_KEY}`;
};