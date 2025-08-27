"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X } from "lucide-react";

interface VoiceOrbProps {
  recording: boolean;
  onToggleRecording: () => void;
  onVoiceModeToggle: () => void;
  isVoiceMode: boolean;
}

export default function VoiceOrb({ 
  recording, 
  onToggleRecording, 
  onVoiceModeToggle, 
  isVoiceMode 
}: VoiceOrbProps) {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const orbRef = useRef<HTMLDivElement>(null);

  // Handle voice mode toggle
  const handleVoiceModeToggle = () => {
    if (isVoiceMode) {
      setShowFullscreen(false);
      onVoiceModeToggle();
    } else {
      onVoiceModeToggle();
      setShowFullscreen(true);
    }
  };

  // Close fullscreen when recording stops
  useEffect(() => {
    if (!recording && showFullscreen) {
      setShowFullscreen(false);
    }
  }, [recording, showFullscreen]);

  return (
    <>
      {/* Compact Voice Orb (in input bar) */}
      <div className="relative">
        <motion.div
          ref={orbRef}
          className={`voice-orb ${recording ? "recording" : ""}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleRecording}
        >
          <Mic className={`w-4 h-4 ${recording ? 'text-red-500' : 'text-white'}`} />
        </motion.div>

        {/* Voice Mode Toggle Button */}
        <motion.button
          className="absolute -right-8 top-0 w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleVoiceModeToggle}
          title="Toggle voice mode"
        >
          <div className="w-2 h-2 bg-blue-400 rounded-full" />
        </motion.button>
      </div>

      {/* Fullscreen Voice Mode */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.2 }}
              onClick={() => setShowFullscreen(false)}
              className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Main Orb */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 300,
                delay: 0.1 
              }}
              className="relative"
            >
              {/* Pulsing Background Rings */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 w-48 h-48 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30"
              />
              
              <motion.div
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.2, 0.05, 0.2]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2.5,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute inset-0 w-48 h-48 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20"
              />

              {/* Main Orb */}
              <motion.div
                animate={{ 
                  scale: recording ? [1, 1.05, 1] : 1,
                  boxShadow: recording 
                    ? "0 0 40px rgba(59, 130, 246, 0.5)" 
                    : "0 0 20px rgba(59, 130, 246, 0.3)"
                }}
                transition={{ 
                  scale: { repeat: recording ? Infinity : 0, duration: 1.5 },
                  boxShadow: { duration: 0.3 }
                }}
                className="relative w-48 h-48 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl cursor-pointer"
                onClick={onToggleRecording}
              >
                <motion.div
                  animate={{ 
                    scale: recording ? [1, 1.2, 1] : 1,
                    rotate: recording ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ 
                    scale: { repeat: recording ? Infinity : 0, duration: 1 },
                    rotate: { repeat: recording ? Infinity : 0, duration: 2 }
                  }}
                >
                  {recording ? (
                    <MicOff className="w-16 h-16 text-white" />
                  ) : (
                    <Mic className="w-16 h-16 text-white" />
                  )}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Status Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-32 text-center"
            >
              <motion.p
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-white/80 text-lg font-medium"
              >
                {recording ? "Listening..." : "Click to start recording"}
              </motion.p>
              <p className="text-white/60 text-sm mt-2">
                {recording ? "Click the orb to stop" : "Voice mode activated"}
              </p>
            </motion.div>

            {/* Waveform Visualization */}
            {recording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-16 flex items-center gap-1"
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: [4, 20, 4],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.2,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                    className="w-1 bg-blue-400 rounded-full"
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

