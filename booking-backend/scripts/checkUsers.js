import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function checkUsers() {
  console.log("\n========== USER + PROPERTY REPORT ==========\n");

  try {
    const users = await prisma.user.findMany({
      include: {
        business: true,  // FIXED (your schema supports Business[])
        bookings: true,
      },
    });

    users.forEach((u) => {
      console.log(`
--------------------------------------------
USER: ${u.name}
EMAIL: ${u.email}
ROLE: ${u.role}
PHONE: ${u.phone}
TOTAL PROPERTIES: ${u.business.length}
BOOKINGS MADE: ${u.bookings.length}
--------------------------------------------`);

      if (u.business.length > 0) {
        console.log(" → PROPERTIES:");
        u.business.forEach((b, i) => {
          console.log(
            `    ${i + 1}. ${b.name} — ${b.address || "No Address"}`
          );
        });
      } else {
        console.log(" → No properties registered.");
      }

      console.log("\n");
    });

    console.log("============================================\n");
  } catch (err) {
    console.error("ERROR FETCHING USERS:", err);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();



/////node scripts/checkUsers.js