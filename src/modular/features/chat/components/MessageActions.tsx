"use client";

import { useState } from "react";
import { Copy, RotateCcw, ThumbsUp, ThumbsDown, MoreHorizontal, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MessageActionsProps {
  onRegenerate?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onFeedback?: (type: 'positive' | 'negative') => void;
  messageContent?: string;
}

export default function MessageActions({
  onRegenerate,
  onDelete,
  onCopy,
  onFeedback,
  messageContent
}: MessageActionsProps) {
  const [showActions, setShowActions] = useState(false);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  const handleCopy = () => {
    if (messageContent) {
      navigator.clipboard.writeText(messageContent);
    }
    onCopy?.();
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
    onFeedback?.(type);
  };

  return (
    <div className="relative">
      {/* Main Actions - Always Visible on Hover */}
      <motion.div
        className="absolute right-0 top-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gpt5-slate-800/80 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 px-2 py-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Copy */}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          title="Copy message"
        >
          <Copy size={14} className="text-slate-300 hover:text-white" />
        </button>

        {/* Regenerate */}
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            title="Regenerate response"
          >
            <RotateCcw size={14} className="text-slate-300 hover:text-white" />
          </button>
        )}

        {/* Thumbs Up */}
        <button
          onClick={() => handleFeedback('positive')}
          className={`p-1.5 rounded transition-colors ${
            feedback === 'positive'
              ? 'bg-gpt5-amber-start/20 text-gpt5-amber-start border border-gpt5-amber-start/40'
              : 'hover:bg-white/10 text-slate-300 hover:text-white'
          }`}
          title="Good response"
        >
          <ThumbsUp size={14} />
        </button>

        {/* Thumbs Down */}
        <button
          onClick={() => handleFeedback('negative')}
          className={`p-1.5 rounded transition-colors ${
            feedback === 'negative'
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'hover:bg-white/10 text-slate-300 hover:text-white'
          }`}
          title="Poor response"
        >
          <ThumbsDown size={14} />
        </button>

        {/* More Actions */}
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
          title="More actions"
        >
          <MoreHorizontal size={14} className="text-slate-300 hover:text-white" />
        </button>
      </motion.div>

      {/* Extended Actions Menu */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-10 bg-gpt5-slate-800/90 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 py-1 z-10 min-w-[120px]"
          >
            {onDelete && (
              <button
                onClick={() => {
                  onDelete();
                  setShowActions(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
}