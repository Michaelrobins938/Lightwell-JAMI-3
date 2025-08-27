"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { motion } from "framer-motion";

export default function ChatInput({
  onSend,
  hasMessages,
}: {
  onSend: (text: string, files?: File[]) => void;
  hasMessages: boolean;
}) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim() && !files.length) return;
    onSend(text, files);
    setText("");
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ y: hasMessages ? 0 : "50%" }}
      animate={{ y: 0 }}
      className={`px-4 py-3 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] ${
        hasMessages ? "fixed bottom-0 left-0 right-0" : "flex-1 flex items-center"
      }`}
    >
      <div className="flex flex-col gap-2 max-w-3xl mx-auto w-full">
        {/* File previews */}
        {files.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 px-2 py-1 rounded text-sm"
              >
                <span>{f.name}</span>
                <button 
                  onClick={() => setFiles(files.filter((_, j) => j !== i))}
                  className="hover:bg-gray-300 dark:hover:bg-gray-600 rounded p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex items-end gap-2">
          <label className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer transition-colors">
            <Paperclip size={18} />
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <textarea
            ref={textareaRef}
            rows={1}
            className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message ChatGPT…"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() && !files.length}
            className="p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}