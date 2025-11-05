import { redis } from "../config/redisClient.js";
import prisma from "../prismaClient.js";

export const setCache = async (key, data, ttl = 3600) => {
  try {
    await redis.set(key, JSON.stringify(data), { ex: ttl });
  } catch (err) {
    console.warn("Redis setCache failed:", err.message);
  }
};

export const getCache = async (key) => {
  try {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.warn("Redis getCache failed:", err.message);
    return null;
  }
};

export const invalidateCache = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => redis.del(key)));
      console.log(`Invalidated ${keys.length} cache entries for pattern: ${pattern}`);
    }
  } catch (err) {
    console.warn("Redis invalidateCache failed:", err.message);
  }
};

// Optional: periodic cleanup for Prisma cache fallback
export const cleanupOldPrismaCache = async () => {
  const now = Date.now();
  const old = new Date(now - 24 * 60 * 60 * 1000); // older than 24h
  await prisma.googleCache.deleteMany({ where: { createdAt: { lt: old } } });
  await prisma.externalPrice.deleteMany({ where: { fetchedAt: { lt: old } } });
};