import { useState } from "react";
import ChatWindow from "../components/ChatWindow";

export default function ChatBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-50 bg-white dark:bg-gray-800 
                   shadow-xl rounded-full p-3 border border-gray-200 
                   dark:border-gray-700 hover:scale-105 transition"
      >
        <img
          src="../assets/animations/customersupport.gif"   
           
          className="w-12 h-12 rounded-full object-cover"
          alt="Chatbot"
        />
      </button>

      {/* Chat Window */}
      <ChatWindow open={open} onClose={() => setOpen(false)} />
    </>
  );
}