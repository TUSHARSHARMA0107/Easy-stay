import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;
const prisma =
  globalForPrisma._prismaClient ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma._prismaClient = prisma;

export default prisma;


