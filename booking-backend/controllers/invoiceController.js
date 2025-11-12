import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import prisma from "../prismaClient.js";
import fetch from "node-fetch";

export const generateInvoice = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        unit: { include: { business: true } }
      }
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const nights =
      (new Date(booking.endDate) - new Date(booking.startDate)) /
      (1000 * 60 * 60 * 24);

    const total = nights * booking.unit.pricePerNight;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 750]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Title
    page.drawText("Booking Confirmation Invoice", {
      x: 150,
      y: 700,
      size: 18,
      font,
      color: rgb(0, 0.4, 0.9)
    });

    // Content
    const lines = [
     ` Invoice ID: ${booking.id},
      Guest: ${booking.user.name} (${booking.user.email}),
      Business: ${booking.unit.business.name},
      Address: ${booking.unit.business.address || "N/A"},
      Room Type: ${booking.unit.name},
      Check-In: ${booking.startDate.toISOString().substring(0, 10)},
      Check-Out: ${booking.endDate.toISOString().substring(0, 10)},
      Nights: ${nights},
      Price/Night: ₹${booking.unit.pricePerNight},
      Total: ₹${total},
      Status: ${booking.status}`
    ];

    let y = 650;
    lines.forEach((line) => {
      page.drawText(line, { x: 50, y, size: 12, font });
      y -= 25;
    });

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=invoice.pdf");
    res.send(Buffer.from(pdfBytes));

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error generating invoice" });
  }
};