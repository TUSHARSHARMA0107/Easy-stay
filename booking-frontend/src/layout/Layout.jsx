import Navbar from "../components/Navbar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import ChatBubble from "../components/ChatBubble.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import { useChat } from "../context/ChatContext.jsx";

export default function Layout({ children }) {
  const { chatOpen } = useChat();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] transition">
      <Navbar />

      <main className="px-4 pt-4 pb-20">
        {children}
      </main>

      <ChatBubble />
      {chatOpen && <ChatWindow />}

      <BottomNav />
    </div>
  );
}