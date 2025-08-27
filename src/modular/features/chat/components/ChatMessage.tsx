"use client";

import MessageActions from "./MessageActions";
import MarkdownRenderer from "./MarkdownRenderer";
import { motion } from "framer-motion";

export default function ChatMessage({
  role,
  content,
  isStreaming,
  attachments,
}: {
  role: "user" | "assistant" | "system";
  content: string;
  isStreaming?: boolean;
  attachments?: { name: string; url: string; type: string }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex ${
        role === "user" ? "justify-end" : role === "system" ? "justify-center" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[740px] w-fit rounded-2xl px-4 py-3 shadow-sm ${
          role === "user"
            ? "bg-gpt5-beam-gradient text-white shadow-lg"
            : role === "system"
            ? "bg-gpt5-amber-start/10 border border-gpt5-amber-start/20 text-gpt5-amber-start"
            : "bg-gpt5-slate-800/50 backdrop-blur-sm border border-white/10 text-white"
        }`}
      >
        {/* Attachments */}
        {attachments?.length ? (
          <div className="mb-3 space-y-2">
            {attachments.map((a, i) =>
              a.type.startsWith("image/") ? (
                <img
                  key={i}
                  src={a.url}
                  alt={a.name}
                  className="rounded-lg max-h-64 object-cover border border-white/20 shadow-lg"
                />
              ) : (
                <a
                  key={i}
                  href={a.url}
                  download={a.name}
                  className="block text-sm underline text-gpt5-pink hover:text-gpt5-purple transition-colors"
                >
                  📎 {a.name}
                </a>
              )
            )}
          </div>
        ) : null}

        {/* Message text */}
        <MarkdownRenderer content={content} isStreaming={isStreaming} />
      </div>

      {role === "assistant" && <MessageActions />}
    </motion.div>
  );
}