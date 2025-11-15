import { useChat } from "../context/ChatContext";
import { useState } from "react";

export default function ChatWindow() {
  const { messages, sendUserMessage, toggleChat } = useChat();
  const [text, setText] = useState("");

  return (
    <div className="fixed bottom-24 right-4 bg-white dark:bg-gray-900 w-80 h-96 rounded-2xl shadow-xl border dark:border-gray-700 flex flex-col overflow-hidden">
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="font-semibold">EasyStay Assistant</h3>
        <button onClick={toggleChat}>✖</button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "bg-blue-600 text-white ml-auto"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <form
        className="p-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendUserMessage(text);
          setText("");
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 rounded-lg border dark:bg-gray-800"
          placeholder="Type a message..."
        />
        <button className="bg-blue-600 text-white px-3 rounded-lg">→</button>
      </form>
    </div>
  );
}