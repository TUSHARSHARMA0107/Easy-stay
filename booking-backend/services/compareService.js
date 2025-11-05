import axios from "axios";
import prisma from "../prismaClient.js";
import dotenv from "dotenv";
import { redis } from "../config/redisClients.js";
dotenv.config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || "";

/**
 * Fetch external prices from a RapidAPI provider*/

const cacheKey = `compare:${listingHash}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// After fetching results:
await redis.set(cacheKey, JSON.stringify(saved), { ex: 3600 }); // 1h
///
export const fetchExternalPrices = async ({ name, location, placeId }) => {
  const listingHash = `${(name || "").toLowerCase()}|${(location || "").toLowerCase()}|${placeId || ""}`;

  // Cached results (1 hour)
  const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);
  const cached = await prisma.externalPrice.findMany({
    where: { listingHash, fetchedAt: { gte: oneHourAgo } },
  });
  if (cached.length > 0) return cached;

  if (!RAPIDAPI_KEY) return [];

  try {
    const options = {
      method: "GET",
      url:` https://${RAPIDAPI_HOST}/some-hotel-search-endpoint`,
      params: { query: name, location },
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
      timeout: 8000,
    };

    const resp = await axios.request(options);
    const items = resp.data?.results || [];

    const saved = [];
    for (const it of items) {
      const price = Number(it.price || it.rate || 0);
      const url = it.url || it.link;
      const source = it.source || RAPIDAPI_HOST;
      const created = await prisma.externalPrice.create({
        data: {
          listingHash,
          source,
          price,
          url,
        },
      });
      saved.push(created);
    }

    return saved;
  } catch (err) {
    console.warn("compareService.fetchExternalPrices failed:", err.message);
    return [];
  }
};