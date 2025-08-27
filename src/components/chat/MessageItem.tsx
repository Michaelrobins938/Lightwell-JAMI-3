"use client";
import { Copy, Maximize2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import MarkdownRenderer from "./MarkdownRenderer";
import { sanitizeUserInput } from "../../middleware/outputSanitization";

export default function MessageItem({ who, text, isStreaming = false }:{ who:"user"|"assistant"|"system"; text:string; isStreaming?: boolean }) {
  const [hovering, setHovering] = useState(false);

  const copy = () => navigator.clipboard.writeText(text || "");
  const isList = /^\s*(-|\d+\.)\s/m.test(text);

  return (
    <div 
      className={`flex ${who === "user" ? "flex-row-reverse" : "flex-row"}`}
      style={{ 
        gap: who === "assistant" ? '12px' : '16px',
        marginBottom: '16px',
        alignItems: 'flex-start'
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Avatar - Only show for assistant */}
      {who === "assistant" && (
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-gray-600 to-gray-700"
          style={{ marginTop: '2px' }}
        >
          AI
        </div>
      )}

      {/* Message Content */}
      <div className={`flex-1 ${who === "user" ? "text-right max-w-[720px] ml-auto" : "text-left max-w-[720px]"}`}>
        <motion.div 
          className={who === "user" ? "inline-block" : "inline-block"}
          style={{
            backgroundColor: who === "user" ? '#3A3A3A' : '#202020',
            color: who === "user" ? '#FFFFFF' : '#EDEDED',
            borderRadius: '12px',
            padding: '12px 16px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            fontWeight: 400,
            lineHeight: '1.4',
            margin: '0 0 16px 0'
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {who === "assistant" ? (
            <MarkdownRenderer content={sanitizeUserInput(text)}/>
          ) : (
            <div style={{ whiteSpace:"pre-wrap" }}>{sanitizeUserInput(text)}</div>
          )}
        </motion.div>
        
        {/* Hover Controls - Only for assistant messages */}
        {who === "assistant" && (
          <motion.div 
            className="mt-2 flex gap-2 justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: hovering ? 1 : 0 }}
            transition={{ duration: 0.2, ease: "easeIn" }}
          >
            <button 
              onClick={copy}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            >
              <Copy size={12}/> Copy
            </button>
            <button 
              onClick={()=>alert("Expand coming soon")}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            >
              <Maximize2 size={12}/> Expand
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}


