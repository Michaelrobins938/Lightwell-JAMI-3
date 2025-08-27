import React from "react";
import { useChatStore } from "../state/chatStore";

const ChatGPTInterface: React.FC = () => {
  const messages = useChatStore((state) => state.messages);

  return (
    <div className="flex flex-col flex-grow overflow-y-auto p-4 space-y-2">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`p-2 rounded-lg ${
            msg.role === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default ChatGPTInterface;