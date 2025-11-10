import { useState } from "react";
import ChatWindow from "./ChatWindow";

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="
          fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl flex items-center justify-center
          transition-all hover:scale-110 border-2 border-transparent bg-white/80 backdrop-blur-xl
          [background:linear-gradient(#ffffffbb,#ffffffbb) padding-box,linear-gradient(135deg,#FF6B6B,#FF9154,#9D4EDD,#2979FF) border-box]
        ">
        <img src="/images/support-icon.svg" alt="support" className="w-7 h-7 opacity-80" />
      </button>
      {open && <ChatWindow onClose={() => setOpen(false)} />}
    </>
  );
}