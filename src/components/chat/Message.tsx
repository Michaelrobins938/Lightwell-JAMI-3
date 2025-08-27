"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, RefreshCcw, ThumbsUp, ThumbsDown } from "lucide-react";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function Message({ role, content, isStreaming }: MessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`w-full flex mb-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {isUser ? (
        // USER MESSAGE (bubble)
        <div className="bg-[#2a2a2a] text-white rounded-2xl px-4 py-2 max-w-[75%] text-[15px] leading-relaxed font-medium animate-fadeIn">
          {content}
        </div>
      ) : (
        // ASSISTANT MESSAGE (markdown block)
        <div className="group relative max-w-[48rem] text-[15px] leading-relaxed text-gray-100 animate-fadeIn prose prose-invert prose-pre:bg-[#1e1e1e] prose-pre:rounded-lg prose-pre:px-4 prose-pre:py-3 prose-pre:text-sm prose-code:bg-[#2d2d2d] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px]">
          {isStreaming ? <StreamingText text={content} /> : <ReactMarkdown>{content}</ReactMarkdown>}

          {/* Hover Toolbar */}
          <div className="absolute -top-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button className="p-1 hover:bg-neutral-800 rounded" aria-label="Like">
              <ThumbsUp size={16} />
            </button>
            <button className="p-1 hover:bg-neutral-800 rounded" aria-label="Dislike">
              <ThumbsDown size={16} />
            </button>
            <button className="p-1 hover:bg-neutral-800 rounded" aria-label="Regenerate">
              <RefreshCcw size={16} />
            </button>
            <button
              className="p-1 hover:bg-neutral-800 rounded"
              onClick={() => navigator.clipboard.writeText(content)}
              aria-label="Copy"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Streaming text effect for AI
function StreamingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 20); // ~20ms per char
    return () => clearInterval(interval);
  }, [text]);
  return <ReactMarkdown>{displayed}</ReactMarkdown>;
}

// Typing indicator (3-dot pulse)
export function TypingIndicator() {
  return (
    <div className="flex space-x-1 bg-[#2a2a2a] px-3 py-1.5 rounded-2xl max-w-fit animate-fadeIn">
      <span className="dot bg-gray-400 w-2 h-2 rounded-full animate-pulseDot delay-[0ms]" />
      <span className="dot bg-gray-400 w-2 h-2 rounded-full animate-pulseDot delay-[150ms]" />
      <span className="dot bg-gray-400 w-2 h-2 rounded-full animate-pulseDot delay-[300ms]" />
    </div>
  );
}

