import { useState } from "react";
import api from "../../config/axios";

function openBookingPopup(url) {
  const w = 560, h = 760;
  const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
  const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);
  const popup = window.open(url, "_blank", `popup=yes,width=${w},height=${h},left=${x},top=${y},noopener,noreferrer`);
  if (!popup || popup.closed || typeof popup.closed === "undefined") window.location.href = url;
}

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hiii~ I’m your Support Assistant! Need help finding or booking? 💖" }]);
  const [input, setInput] = useState("");

  const sendMessage = async (preset) => {
    const text = typeof preset === "string" ? preset : input;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text }]);
    setInput("");

    const lower = text.toLowerCase();
    const isBookingIntent = /(book|reserve|lock)/.test(lower);

    if (isBookingIntent) {
      try {
        const { data } = await api.post("/chat/resolve-booking", { message: text });
        const { businessId, unitId, start, end } = data || {};
        if (!businessId || !unitId) {
          setMessages(prev => [...prev, { sender: "bot", text: "Tell me the hotel & room name, pretty please ✨" }]);
          return;
        }
        const params = new URLSearchParams({ start: new Date(start).toISOString(), end: new Date(end).toISOString() }).toString();
        const url = `/book/${businessId}/${unitId}?${params}`;
        setMessages(prev => [...prev, { sender: "bot", text: "Opening booking in a cozy popup! 🛏💖" }]);
        openBookingPopup(url);
        return;
      } catch {
        setMessages(prev => [...prev, { sender: "bot", text: "Couldn’t prepare booking. Try again? 💗" }]);
        return;
      }
    }

    try {
      const res = await api.post("/chat", { message: text });
      setMessages(prev => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { sender: "bot", text: "Network hiccup—try again? 💗" }]);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-2xl border flex flex-col">
      <div className="p-3 border-b flex justify-between items-center bg-white/80 backdrop-blur">
        <strong className="text-gray-700">Support Assistant</strong>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✖</button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
        {messages.map((m, i) => (
          <div key={i} className={m.sender === "user" ? "text-right" : "text-left text-blue-600"}>
            <span className="inline-block bg-gray-100 p-2 rounded-xl">{m.text}</span>
          </div>
        ))}
      </div>

      {/* Quick Replies */}
      <div className="px-3 pb-2 flex flex-wrap gap-2">
        {[
          { text: "Find stays nearby", value: "show nearby stays" },
          { text: "Hotel under budget", value: "hotels under 1500" },
          { text: "Compare prices", value: "compare price" },
          { text: "My bookings", value: "show my bookings" },
        ].map((chip, i) => (
          <button key={i} onClick={() => sendMessage(chip.value)}
            className="text-xs px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-white/40 hover:bg-white text-gray-700 transition">
            {chip.text}
          </button>
        ))}
      </div>

      <div className="p-3 border-t flex gap-2">
        <input className="flex-1 border p-2 rounded-xl" placeholder="Type message..." value={input}
          onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==="Enter" && sendMessage()} />
        <button onClick={() => sendMessage()} className="px-3 py-2 bg-blue-600 text-white rounded-xl">➤</button>
      </div>
    </div>
  );
}