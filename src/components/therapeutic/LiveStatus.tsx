import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

// Presence state type as specified in the spec
export type PresenceState = 
  | "neutral"
  | "calm"
  | "warm" 
  | "attentive"
  | "concerned";

// Component props interface
interface LiveStatusProps {
  state: PresenceState;
  intensity: number; // 0..10
  onEnterOrb: () => void;
  onFullscreen: () => void;
  loading?: boolean;
  disabled?: boolean;
  a11yLabel?: string;
  isConnected?: boolean;
}

// State to visual mapping as specified
const STATE_CONFIG = {
  neutral: { 
    subtitle: "Neutral • Calm",
    hue: 245,
    particleSpeed: 1.0,
    glowAlpha: 0.28,
    color: "#7c4dff"
  },
  calm: { 
    subtitle: "Calm • Steady",
    hue: 220,
    particleSpeed: 0.9,
    glowAlpha: 0.26,
    color: "#4ea7ff"
  },
  warm: { 
    subtitle: "Warm • Reassuring",
    hue: 300,
    particleSpeed: 1.1,
    glowAlpha: 0.32,
    color: "#b794f6"
  },
  attentive: { 
    subtitle: "Balanced • Attentive",
    hue: 195,
    particleSpeed: 1.15,
    glowAlpha: 0.34,
    color: "#63b3ed"
  },
  concerned: { 
    subtitle: "Concerned • Focused",
    hue: 10,
    particleSpeed: 1.2,
    glowAlpha: 0.36,
    color: "#ff477e"
  }
};

// Orb Preview Component with idle animations
const OrbPreview: React.FC<{ 
  state: PresenceState; 
  intensity: number; 
  loading: boolean; 
}> = ({ state, intensity, loading }) => {
  const config = STATE_CONFIG[state];
  
  if (loading) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,.02),_rgba(0,0,0,0))]">
        <div className="size-[120px] rounded-full bg-gray-600/20 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,.04),_rgba(0,0,0,0))]">
      {/* Animated orb with idle breathing */}
      <motion.div
        className="size-[120px] rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${config.color}40 0%, ${config.color}20 50%, transparent 100%)`,
          filter: "blur(24px)"
        }}
        animate={{
          scale: [1, 1.015, 1],
          opacity: [config.glowAlpha, config.glowAlpha + 0.1, config.glowAlpha]
        }}
        transition={{
          duration: 3.5,
          ease: [0.4, 0, 0.2, 1],
          repeat: Infinity
        }}
      />
      
      {/* Core orb */}
      <motion.div
        className="absolute size-[80px] rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${config.color}60 0%, ${config.color}40 70%, transparent 100%)`,
          filter: "blur(12px)"
        }}
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 360]
        }}
        transition={{
          scale: {
            duration: 4,
            ease: "easeInOut", 
            repeat: Infinity
          },
          rotate: {
            duration: 20,
            ease: "linear",
            repeat: Infinity
          }
        }}
      />
      
      {/* Intensity indicator ring */}
      <motion.div
        className="absolute size-[140px] rounded-full border"
        style={{ 
          borderColor: `${config.color}30`,
          borderWidth: '2px'
        }}
        animate={{
          scale: [1, 1 + (intensity * 0.02), 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2.5,
          ease: [0.4, 0, 0.2, 1],
          repeat: Infinity
        }}
      />
    </div>
  );
};

// Main Live Status component
export const LiveStatus: React.FC<LiveStatusProps> = ({
  state = "neutral",
  intensity = 5,
  onEnterOrb,
  onFullscreen,
  loading = false,
  disabled = false,
  a11yLabel = "Jamie — Live Status",
  isConnected = true
}) => {
  const config = STATE_CONFIG[state];
  
  // Handle disconnected state
  if (!isConnected) {
    return (
      <section
        aria-label={a11yLabel}
        className="w-80 rounded-2xl p-5 border"
        style={{
          backgroundColor: 'var(--ls-bg-soft)',
          borderColor: 'var(--ls-border-soft)',
          boxShadow: 'var(--ls-shadow-panel)'
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <WifiOff className="w-5 h-5 text-red-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-400">
              Live status unavailable
            </h3>
            <button 
              className="text-xs text-blue-400 hover:text-blue-300 underline"
              onClick={() => window.location.reload()}
            >
              retry
            </button>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section
      aria-label={a11yLabel}
      className="w-80 rounded-2xl p-5 border"
      style={{
        backgroundColor: 'var(--ls-bg-soft)',
        borderColor: 'var(--ls-border-soft)',
        boxShadow: 'var(--ls-shadow-panel)'
      }}
    >
      {/* Header */}
      <header className="mb-3">
        <h3 className="text-[16px] font-semibold" style={{ color: 'var(--ls-fg-strong)' }}>
          Jamie — Live Status
        </h3>
        <div className="text-[13px] mt-1 flex items-center gap-2" style={{ color: 'var(--ls-fg-muted)' }}>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
              <span>Loading...</span>
            </div>
          ) : (
            <>
              <span className="px-3 py-1 rounded-lg text-xs font-medium"
                    style={{ 
                      backgroundColor: 'var(--ls-bg)',
                      color: 'var(--ls-fg-muted)'
                    }}>
                {config.subtitle}
              </span>
              <span className="text-[13px]" style={{ color: 'var(--ls-fg-subtle)' }}>
                Intensity: <span className="font-semibold">{intensity}/10</span>
              </span>
            </>
          )}
        </div>
      </header>

      {/* Orb Preview Card */}
      <motion.div
        className="relative rounded-[24px] border overflow-hidden mb-4"
        style={{ 
          height: 260,
          borderColor: 'var(--ls-border-soft)'
        }}
        initial={{ boxShadow: "none" }}
        animate={{ boxShadow: loading ? "none" : "var(--ls-glow-orb)" }}
        transition={{ 
          duration: 0.4, 
          ease: [0.4, 0, 0.2, 1] 
        }}
      >
        <OrbPreview 
          state={state} 
          intensity={intensity} 
          loading={loading} 
        />
      </motion.div>

      {/* Actions */}
      <div className="grid gap-3">
        <motion.button
          onClick={onEnterOrb}
          disabled={disabled || loading}
          className="h-11 rounded-xl font-medium text-white transition-transform disabled:opacity-60"
          style={{ background: 'var(--ls-grad-brand)' }}
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
          transition={{ duration: 0.12 }}
        >
          Enter Orb Mode
        </motion.button>
        
        <motion.button
          onClick={onFullscreen}
          disabled={disabled || loading}
          className="h-11 rounded-xl border transition-colors"
          style={{ 
            backgroundColor: 'var(--ls-bg)',
            color: 'var(--ls-fg-strong)',
            borderColor: 'var(--ls-border-soft)'
          }}
          whileHover={{ 
            backgroundColor: 'rgba(255,255,255,.03)' 
          }}
          transition={{ duration: 0.12 }}
        >
          Fullscreen Mode
        </motion.button>
      </div>
      
      {/* Optional: Below the fold sections */}
      {!loading && (
        <motion.div
          className="mt-4 pt-4 border-t space-y-3"
          style={{ borderColor: 'var(--ls-border-soft)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Emotional Analysis mini-section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium" style={{ color: 'var(--ls-fg-muted)' }}>
                Primary Emotion
              </span>
              <span className="text-xs" style={{ color: 'var(--ls-fg-strong)' }}>
                {config.subtitle.split(' • ')[0]}
              </span>
            </div>
            
            {/* Intensity progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--ls-fg-muted)' }}>
                  Intensity Level
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--ls-fg-strong)' }}>
                  {intensity}/10
                </span>
              </div>
              <div className="h-1 rounded-full" style={{ backgroundColor: 'var(--ls-bg)' }}>
                <motion.div
                  className="h-1 rounded-full"
                  style={{ background: 'var(--ls-grad-brand)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(intensity / 10) * 100}%` }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default LiveStatus;