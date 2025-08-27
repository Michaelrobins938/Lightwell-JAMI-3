import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface OrbModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrbMode({ isOpen, onClose }: OrbModeProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black z-50 flex flex-col"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800">
            <div className="text-sm text-gray-300">
              ChatGPT ·{" "}
              <span className="bg-gray-700 text-white px-2 py-0.5 rounded text-xs">
                GPT-4o
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Orb Area */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              className="w-40 h-40 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-6 py-6 border-t border-gray-800">
            <button className="p-5 rounded-full bg-blue-600 hover:bg-blue-500 transition">
              🎤
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-full bg-gray-700 hover:bg-gray-600 transition text-white"
            >
              Stop
            </button>
            <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition">
              ⚙️
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}