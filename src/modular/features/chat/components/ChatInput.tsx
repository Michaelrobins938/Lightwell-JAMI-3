"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Paperclip, Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSend: (text: string, files?: File[]) => void;
  hasMessages?: boolean;
}

export default function ChatInput({ onSend, hasMessages = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    if (message.trim() || files.length > 0) {
      onSend(message.trim(), files);
      setMessage("");
      setFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [message, files, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  // Auto-resize textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessage(textarea.value);
    
    // Reset height to auto to get proper scrollHeight
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  return (
    <div className="border-t border-white/10 bg-gpt5-slate-900/50 backdrop-blur-sm p-4">
      {/* File attachments preview */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 bg-gpt5-slate-800/50 px-3 py-2 rounded-lg border border-white/20"
            >
              <span className="text-xs text-slate-300 truncate max-w-32">
                {file.name}
              </span>
              <button
                onClick={() => removeFile(index)}
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                ×
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-3">
        {/* File upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 p-2 text-slate-400 hover:text-gpt5-amber-start transition-colors rounded-lg hover:bg-white/5"
          title="Attach files"
        >
          <Paperclip size={20} />
        </button>

        {/* Message input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={hasMessages ? "Continue the conversation..." : "Start a conversation with JAMI-3..."}
            className="w-full resize-none rounded-xl bg-gpt5-slate-800/50 border border-white/20 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gpt5-amber-start/50 focus:border-gpt5-amber-start/50 transition-all"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
        </div>

        {/* Voice recording button */}
        <button
          onClick={toggleRecording}
          className={`flex-shrink-0 p-2 transition-colors rounded-lg ${
            isRecording 
              ? "text-red-400 bg-red-400/10" 
              : "text-slate-400 hover:text-gpt5-pink hover:bg-white/5"
          }`}
          title={isRecording ? "Stop recording" : "Voice message"}
        >
          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {/* Send button */}
        <motion.button
          onClick={handleSubmit}
          disabled={!message.trim() && files.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-shrink-0 p-2 rounded-lg transition-all ${
            message.trim() || files.length > 0
              ? "bg-gpt5-beam-gradient text-white shadow-lg hover:shadow-xl"
              : "bg-gpt5-slate-700/50 text-slate-500 cursor-not-allowed"
          }`}
        >
          <Send size={20} />
        </motion.button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,text/*,.pdf,.doc,.docx"
      />
      
      {/* Hint text */}
      <p className="text-xs text-slate-500 mt-2 text-center">
        Press Enter to send • Shift+Enter for new line • JAMI-3 can help with mental health support
      </p>
    </div>
  );
}