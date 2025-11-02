import nodemailer from "nodemailer";
import fs from "fs";

export const sendEmail = async (to, subject, html, attachmentPath = null) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"StayEase Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments: attachmentPath
        ? [
            {
              filename: attachmentPath.split("/").pop(),
              path: attachmentPath,
              contentType: "application/pdf",
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};