'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { NarratorOrbComponent } from '../visuals/NarratorOrb';

interface FirstEncounterProps {
  onComplete: () => void;
}

const jamiMessages = [
  {
    text: "Hello.",
    delay: 1000,
    duration: 2000
  },
  {
    text: "I'm JAMI-3.",
    delay: 3000,  
    duration: 2500
  },
  {
    text: "I'm here to support your mental wellness journey with personalized, clinical-grade therapeutic conversations.",
    delay: 5500,
    duration: 4000
  },
  {
    text: "Shall we begin?",
    delay: 9500,
    duration: 3000
  }
];

export default function FirstEncounter({ onComplete }: FirstEncounterProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);
  const [showOrb, setShowOrb] = useState(false);
  const [showInterface, setShowInterface] = useState(false);
  const [orbIntensity, setOrbIntensity] = useState(0.3);

  useEffect(() => {
    // Show orb first
    const orbTimer = setTimeout(() => {
      setShowOrb(true);
      setOrbIntensity(0.8);
    }, 500);

    // Schedule messages
    jamiMessages.forEach((message, index) => {
      setTimeout(() => {
        setCurrentMessageIndex(index);
        setOrbIntensity(1.2); // Pulse brighter when speaking
        
        // Return to normal intensity after message
        setTimeout(() => {
          setOrbIntensity(0.8);
        }, 1000);
      }, message.delay);
    });

    // Show chat interface after all messages
    const interfaceTimer = setTimeout(() => {
      setShowInterface(true);
    }, 13000);

    return () => {
      clearTimeout(orbTimer);
      clearTimeout(interfaceTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gpt5-slate-950 via-gpt5-slate-900 to-gpt5-black text-white relative overflow-hidden">
      {/* Enhanced GPT-5 Cinematic Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gpt5-beam-radial opacity-10"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 1, 0.6],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-radial from-gpt5-amber-start/8 via-gpt5-pink/6 to-transparent"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-radial from-gpt5-purple/6 via-gpt5-purple-end/4 to-transparent"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        
        {/* JAMI-3 Orb */}
        <AnimatePresence>
          {showOrb && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 1.5, 
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="relative mb-12"
            >
              <div className="w-40 h-40 relative">
                {/* Main Orb Container */}
                <motion.div
                  className="w-full h-full rounded-full overflow-hidden shadow-2xl shadow-blue-500/30"
                  animate={{
                    scale: currentMessageIndex >= 0 ? [1, 1.05, 1] : 1
                  }}
                  transition={{
                    duration: 2,
                    repeat: currentMessageIndex >= 0 ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <NarratorOrbComponent 
                    isVisible={true}
                    intensity={orbIntensity}
                    audioLevel={currentMessageIndex >= 0 ? 0.6 : 0.2}
                  />
                </motion.div>

                {/* Ambient Glow Rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border border-blue-400/20 rounded-full"
                    animate={{
                      scale: [1, 1.4 + i * 0.2],
                      opacity: [0.5, 0]
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>

              {/* JAMI-3 Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="text-center mt-6"
              >
                <h3 className="text-2xl font-light text-white tracking-wide">JAMI-3</h3>
                <p className="text-sm text-slate-400 mt-1">AI Therapeutic Companion</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Display */}
        <div className="w-full max-w-2xl mx-auto mb-12">
          <AnimatePresence mode="wait">
            {currentMessageIndex >= 0 && (
              <motion.div
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center"
              >
                <div className="bg-gpt5-slate-900/40 backdrop-blur-2xl rounded-3xl p-8 border border-white/8 shadow-2xl">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-10 h-10 bg-gpt5-beam-gradient rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                      animate={{
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 4px 14px 0 rgba(245, 158, 11, 0.2)",
                          "0 4px 14px 0 rgba(236, 72, 153, 0.3)",
                          "0 4px 14px 0 rgba(245, 158, 11, 0.2)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <MessageCircle className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="flex-1 text-left">
                      <motion.p
                        key={jamiMessages[currentMessageIndex]?.text}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xl text-white leading-relaxed font-light"
                      >
                        {jamiMessages[currentMessageIndex]?.text}
                      </motion.p>
                    </div>
                  </div>
                </div>

                {/* Typing Indicator */}
                {currentMessageIndex < jamiMessages.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                    className="flex justify-center mt-4"
                  >
                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                      <span>JAMI-3 is thinking</span>
                      <div className="flex gap-1 ml-2">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`w-1 h-1 rounded-full ${
                              i === 0 ? 'bg-gpt5-amber-start' : 
                              i === 1 ? 'bg-gpt5-pink' : 'bg-gpt5-purple'
                            }`}
                            animate={{ 
                              opacity: [0.3, 1, 0.3],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Interface Transition */}
        <AnimatePresence>
          {showInterface && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="w-full max-w-2xl mx-auto"
            >
              {/* Enhanced GPT-5 Chat Interface Preview */}
              <div className="bg-gpt5-slate-900/50 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="w-8 h-8 bg-gpt5-beam-gradient rounded-full flex items-center justify-center shadow-lg"
                        animate={{
                          boxShadow: [
                            "0 4px 14px 0 rgba(245, 158, 11, 0.2)",
                            "0 4px 14px 0 rgba(236, 72, 153, 0.3)",
                            "0 4px 14px 0 rgba(139, 92, 246, 0.2)",
                            "0 4px 14px 0 rgba(245, 158, 11, 0.2)"
                          ]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <MessageCircle className="w-4 h-4 text-white" />
                      </motion.div>
                      <div>
                        <h4 className="text-white font-semibold">JAMI-3</h4>
                        <div className="flex items-center gap-1 text-xs text-gpt5-amber-start">
                          <motion.div 
                            className="w-1.5 h-1.5 bg-gpt5-amber-start rounded-full"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span>Online</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4 text-gpt5-pink" />
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-center gap-4 py-8">
                    <div className="w-12 h-0.5 bg-gpt5-beam-gradient opacity-60" />
                    <span className="text-slate-300 text-sm font-medium">Ready to chat</span>
                    <div className="w-12 h-0.5 bg-gpt5-beam-gradient opacity-60" />
                  </div>
                  
                  {/* Enhanced CTA Button */}
                  <motion.button
                    onClick={onComplete}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 px-6 bg-gpt5-beam-gradient hover:opacity-90 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10 text-lg">Start Your Journey with JAMI-3</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="relative z-10"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                  
                  <motion.p 
                    className="text-center text-xs text-slate-500 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                  >
                    <span className="inline-flex items-center gap-1">
                      <motion.div 
                        className="w-1 h-1 bg-gpt5-amber-start rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      Your conversations are private, secure, and HIPAA-compliant
                    </span>
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}