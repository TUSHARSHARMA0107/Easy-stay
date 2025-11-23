import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function deleteAll(userId) {
  try {
    // FETCH
    const businesses = await prisma.business.findMany({ where: { ownerId: userId } });

    if (businesses.length === 0) {
      console.log("No properties found.");
      return;
    }

    const ids = businesses.map(b => b.id);

    // DELETE BOOKINGS
    await prisma.booking.deleteMany({ where: { businessId: { in: ids } } });

    // DELETE ROOMS
    await prisma.room.deleteMany({ where: { businessId: { in: ids } } });

    // DELETE PROPERTIES
    await prisma.business.deleteMany({ where: { ownerId: userId } });

    console.log("Deleted:", businesses.length, "properties");

  } catch (e) {
    console.log(e);
  } finally {
    await prisma.$disconnect();
  }
}

// 👉 is ID ko replace kar (user ID)
///node scripts/deleteUserProperties.js
deleteAll("cmi66il4j0000znl48zcoobzm");