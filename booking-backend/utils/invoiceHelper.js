import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoice = async (booking) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `invoice-${booking.id}.pdf`;
      const filePath = path.join("invoices", fileName);

      // Ensure invoices folder exists
      if (!fs.existsSync("invoices")) fs.mkdirSync("invoices");

      const doc = new PDFDocument({ margin: 40 });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Header
      doc
        .fontSize(20)
        .text("StayEase Booking Invoice", { align: "center" })
        .moveDown();

      // Booking details
      doc.fontSize(12).text(`Booking ID: ${booking.id}`);
      doc.text(`Customer: ${booking.user.name} (${booking.user.email})`);
      doc.text(`Business: ${booking.unit.business.name}`);
      doc.text(`Unit: ${booking.unit.name}`);
      doc.text(`Check-In: ${new Date(booking.checkInDate).toDateString()}`);
      doc.text(`Check-Out: ${new Date(booking.checkOutDate).toDateString()}`);
      doc.text(`Guests: ${booking.guests}`);
      doc.moveDown();
      doc.fontSize(14).text(`Total Price: ₹${booking.totalPrice}`, {
        align: "right",
      });
      doc.moveDown();

      doc
        .fontSize(10)
        .text(
          "Thank you for booking with StayEase. Please contact us for any support.",
          { align: "center" }
        );

      doc.end();

      writeStream.on("finish", () => resolve(filePath));
      writeStream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};