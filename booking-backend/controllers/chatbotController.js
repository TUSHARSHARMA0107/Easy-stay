import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Simple chatbot logic — using AI API if key is present
export const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    // Simple static fallback responses
    const faqResponses = {
      booking: "To book a place, search for your desired business and click 'Book Now'.",
      cancel: "You can cancel your booking from your account dashboard under 'My Bookings'.",
      refund: "Refunds are processed automatically within 5–7 business days after cancellation.",
      payment: "We accept major credit/debit cards and UPI payments.",
      contact: "You can contact the business owner via their page under 'Contact Info'."
    };

    // Check keywords
    const lower = message.toLowerCase();
    let response = "I'm here to help! Could you please clarify your question?";

    if (lower.includes("book")) response = faqResponses.booking;
    else if (lower.includes("cancel")) response = faqResponses.cancel;
    else if (lower.includes("refund")) response = faqResponses.refund;
    else if (lower.includes("payment")) response = faqResponses.payment;
    else if (lower.includes("contact")) response = faqResponses.contact;

    // Optional: if you want to connect OpenAI later
    // if (process.env.OPENAI_API_KEY) { ...use model }

    return res.json({ success: true, reply: response });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};