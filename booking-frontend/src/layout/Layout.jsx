import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import ChatBubble from "../components/ChatBubble";
import ChatWindow from "../components/ChatWindow";
import { useChat } from "../context/ChatContext";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const { chatOpen } = useChat();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] transition">
      <Navbar />

      <main className="px-4 pt-4 pb-20">
        <Outlet />   {/* 👉 SAARE ROUTES YAHAN RENDER HONGE */}
      </main>

      <ChatBubble />
      {chatOpen && <ChatWindow />}

      <BottomNav />
    </div>
  );
}