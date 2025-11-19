import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log("Prisma working:", users);
  } catch (e) {
    console.error(e);
  }
}

test();