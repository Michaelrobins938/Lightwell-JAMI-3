import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MemoryStreamProps {
  isVisible: boolean;
  memoryEvents?: Array<{
    id: string;
    type: string;
    content: string;
    timestamp: number;
  }>;
}

export default function MemoryStream({ isVisible, memoryEvents = [] }: MemoryStreamProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-4 right-4 w-80 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 z-40"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
    >
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white font-medium text-sm">Memory Stream</h3>
        <p className="text-gray-400 text-xs">Real-time memory formation</p>
      </div>
      
      <div className="p-4 max-h-96 overflow-y-auto space-y-3">
        <AnimatePresence>
          {memoryEvents.length === 0 ? (
            <div className="text-gray-500 text-xs text-center py-4">
              No memory events yet
            </div>
          ) : (
            memoryEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-700/50 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-blue-400">{event.type}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {event.content}
                </p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}