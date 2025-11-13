// booking-backend/services/googleService.js
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
 * Google Text Search API + Cache (Redis + DB)
 */
export const textSearch = async ({ query, location, radius = 50000, type }) => {
  const qcanon = canonical(`${query} ${location || ""} ${type || ""}`);
  const cacheKey = `google:${qcanon}`;

  // --- Redis Cache First ---
  const cachedJson = await redis.get(cacheKey);
  if (cachedJson) {
    return { fromCache: true, results: JSON.parse(cachedJson) };
  }

  // --- Prisma DB Cache ---
  const cached = await prisma.googleCache.findFirst({ where: { query: qcanon } });
  if (cached) {
    const age = (Date.now() - new Date(cached.createdAt).getTime()) / 1000;
    if (age < cached.ttl) {
      return { fromCache: true, results: cached.results };
    }

    // Background refresh for old cache (>12h)
    if (age > 43200) {
      (async () => {
        try {
          console.log("Background refreshing:", qcanon);
          const newData = await fetchFreshGoogleData(query, location, type);
          await redis.set(cacheKey, JSON.stringify(newData), { EX: CACHE_TTL });
        } catch (err) {
          console.warn("Background refresh failed:", err.message);
        }
      })();
    }
  }

  // --- Google API Call ---
  const params = new URLSearchParams();
  params.append("key", PLACES_KEY);
  if (query) params.append("query", query);
  if (location) params.append("location", location);
  if (radius) params.append("radius", radius);
  if (type) params.append("type", type);

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?${params.toString()}`;
  const resp = await axios.get(url, { timeout: 8000 });
  const results = resp.data;

  // Save in Redis cache
  await redis.set(cacheKey, JSON.stringify(results), { EX: CACHE_TTL });

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
 * Google Place Details API + Cache
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

  const url =` https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`;
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
 * Generate a Google Places photo URL
 */
export const getPhotoUrl = (photoReference, maxwidth = 800) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${photoReference}&key=${PLACES_KEY}`;
};

/**
 * Helper: Fetch fresh Google data (used in background refresh)
 */
async function fetchFreshGoogleData(query, location, type) {
  const params = new URLSearchParams();
  params.append("key", PLACES_KEY);
  if (query) params.append("query", query);
  if (location) params.append("location", location);
  if (type) params.append("type", type);

  const url =` https://maps.googleapis.com/maps/api/place/textsearch/json?${params.toString()}`;
  const resp = await axios.get(url, { timeout: 8000 });
  return resp.data;
}