import http from "../api/http";

// Send message to AI Chatbot
export const sendChatMessage = async (message) => {
  try {
    const res = await http.post("/api/chatbot/message", { message });
    return res.data; // { reply: "..." }
  } catch (err) {
    throw err.response?.data || { message: "Chatbot request failed" };
  }
};