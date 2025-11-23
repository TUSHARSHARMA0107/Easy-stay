import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getUser() {
  const user = await prisma.user.findUnique({
    where: { email: "tushar@gmail.com" },
  });

  console.log("USER ID =", user?.id || "Not Found");

  await prisma.$disconnect();
}

getUser();



/////node scripts/getUserId.js