'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';

interface CinematicBuildUpProps {
  onComplete: () => void;
}

const buildUpSequence = [
  {
    id: 'initialization',
    text: 'Initializing JAMI-3...',
    subtext: 'Connecting to secure therapeutic AI network',
    duration: 2000,
    icon: Zap
  },
  {
    id: 'calibration',
    text: 'Calibrating your profile...',
    subtext: 'Personalizing your therapeutic experience',
    duration: 2500,
    icon: Sparkles
  },
  {
    id: 'ready',
    text: 'JAMI-3 is ready to meet you',
    subtext: 'Your AI therapeutic companion awaits',
    duration: 1500,
    icon: ArrowRight
  }
];

export default function CinematicBuildUp({ onComplete }: CinematicBuildUpProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, delay: number }>>([]);

  useEffect(() => {
    // Create floating particles
    const particleArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setParticles(particleArray);

    // Start the sequence
    let phaseTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const runSequence = () => {
      const currentSequence = buildUpSequence[currentPhase];
      if (!currentSequence) {
        setTimeout(onComplete, 1000);
        return;
      }

      // Progress bar animation
      setProgress(0);
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + (100 / (currentSequence.duration / 50));
        });
      }, 50);

      // Move to next phase
      phaseTimer = setTimeout(() => {
        if (currentPhase < buildUpSequence.length - 1) {
          setCurrentPhase(prev => prev + 1);
        } else {
          setTimeout(onComplete, 800);
        }
      }, currentSequence.duration);
    };

    runSequence();

    return () => {
      if (phaseTimer) clearTimeout(phaseTimer);
      if (progressTimer) clearTimeout(progressTimer);
    };
  }, [currentPhase, onComplete]);

  const currentSequenceData = buildUpSequence[currentPhase];
  const IconComponent = currentSequenceData?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gpt5-slate-950 via-gpt5-slate-900 to-gpt5-black text-white relative overflow-hidden flex items-center justify-center">
      {/* Enhanced GPT-5 Beam Dynamic Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gpt5-beam-radial opacity-12"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 1.2, 0.8],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-radial from-gpt5-amber-start/10 via-gpt5-pink/8 to-transparent"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-radial from-gpt5-purple/8 via-gpt5-purple-end/6 to-transparent"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(245,158,11,0.04)_60deg,transparent_120deg,rgba(236,72,153,0.03)_180deg,transparent_240deg,rgba(139,92,246,0.04)_300deg,transparent_360deg)]" />
      </div>

      {/* Enhanced GPT-5 Beam Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-gpt5-beam-gradient rounded-full shadow-lg"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -120, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
        <AnimatePresence mode="wait">
          {currentSequenceData && (
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 1.1 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {/* Enhanced GPT-5 Central Orb */}
              <div className="relative mb-12">
                <motion.div
                  className="w-36 h-36 mx-auto bg-gpt5-beam-gradient rounded-full flex items-center justify-center shadow-2xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360],
                    boxShadow: [
                      "0 25px 50px -12px rgba(245, 158, 11, 0.3)",
                      "0 25px 50px -12px rgba(236, 72, 153, 0.4)",
                      "0 25px 50px -12px rgba(139, 92, 246, 0.3)",
                      "0 25px 50px -12px rgba(245, 158, 11, 0.3)"
                    ]
                  }}
                  transition={{
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    rotate: {
                      duration: 12,
                      repeat: Infinity,
                      ease: "linear"
                    },
                    boxShadow: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <motion.div
                    className="w-32 h-32 bg-gradient-to-r from-white/20 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm"
                    animate={{ rotate: [0, -360] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {IconComponent && (
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          rotate: {
                            duration: 6,
                            repeat: Infinity,
                            ease: "linear"
                          },
                          scale: {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                      >
                        <IconComponent className="w-14 h-14 text-white drop-shadow-lg" />
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Enhanced Pulsing Rings */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border-2 rounded-full"
                    style={{
                      borderColor: i % 2 === 0 
                        ? 'rgba(245, 158, 11, 0.15)' 
                        : 'rgba(236, 72, 153, 0.12)'
                    }}
                    animate={{
                      scale: [1, 1.6 + i * 0.25],
                      opacity: [0.8, 0]
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

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-wide">
                  {currentSequenceData.text}
                </h1>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  {currentSequenceData.subtext}
                </p>

                {/* Enhanced GPT-5 Progress Bar */}
                <div className="w-full max-w-md mx-auto mb-8">
                  <div className="h-1.5 bg-slate-700/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                    <motion.div
                      className="h-full bg-gpt5-beam-gradient rounded-full shadow-sm"
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(245, 158, 11, 0.3)",
                          "0 0 15px rgba(236, 72, 153, 0.4)",
                          "0 0 10px rgba(245, 158, 11, 0.3)"
                        ]
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-slate-400">
                    <span className="font-medium">Initializing</span>
                    <span className="font-mono">{Math.round(progress)}%</span>
                  </div>
                </div>

                {/* Enhanced Status Indicators */}
                <div className="flex justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 bg-gpt5-amber-start rounded-full shadow-sm"
                      animate={{ 
                        opacity: [1, 0.4, 1],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-slate-300 font-medium">Secure Connection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 bg-gpt5-pink rounded-full shadow-sm"
                      animate={{ 
                        opacity: [1, 0.4, 1],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                    <span className="text-slate-300 font-medium">AI Ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 bg-gpt5-purple rounded-full shadow-sm"
                      animate={{ 
                        opacity: [1, 0.4, 1],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 2.1, repeat: Infinity }}
                    />
                    <span className="text-slate-300 font-medium">Profile Synced</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip Option (appears after first phase) */}
        {currentPhase > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
            onClick={onComplete}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-400 hover:text-white transition-colors duration-300 text-sm"
          >
            Skip to JAMI-3 →
          </motion.button>
        )}
      </div>
    </div>
  );
}