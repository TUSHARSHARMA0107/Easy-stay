import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const sendMessage = (text) => {
    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    // Simple auto-reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Let me help you!" },
      ]);
    }, 500);
  };

  return (
    <ChatContext.Provider
      value={{ isOpen, setIsOpen, messages, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);