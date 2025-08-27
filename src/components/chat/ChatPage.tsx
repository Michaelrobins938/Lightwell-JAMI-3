"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { useChatStream } from "../../hooks/useChatStream";
import { useChatMemory } from "../../hooks/useChatMemory";
import ChatWindow from "./ChatWindow";

// Import overlays when ready
// import OrbMode from "./overlays/OrbMode";
// import MemoryStream from "./overlays/MemoryStream";
// import CommandPalette from "./overlays/CommandPalette";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-950 text-gray-200">
            <ChatWindow model="GPT-4o" markdown={true} />
    </div>
  );
}