"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Heart } from 'lucide-react';
import { useRouter } from 'next/router';

const FloatingChatButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  // Don't show on chat page itself
  if (router.pathname === '/chat') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-20 right-0 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-4 shadow-2xl w-64"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">Need Support?</h3>
              <p className="text-zinc-400 text-xs">Begin your personalized mental health journey</p>
            </div>
                          <button
              onClick={() => {
                setIsExpanded(false);
                router.push('/onboarding');
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="relative w-14 h-14 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Quick access to therapy chat"
      >
        {/* Pulse animation ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-emerald-400/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap">
            Get Started
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-l-4 border-l-zinc-700/50 border-y-2 border-y-transparent" />
          </div>
        </div>
      </motion.button>
    </div>
  );
};

export default FloatingChatButton;
