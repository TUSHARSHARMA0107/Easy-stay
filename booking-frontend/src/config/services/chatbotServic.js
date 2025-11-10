import api from "../config/axios";

export const sendMessageToBot = async (message) => {
  const res = await api.post("/chatbot/message", { message });
  return res.data;
};