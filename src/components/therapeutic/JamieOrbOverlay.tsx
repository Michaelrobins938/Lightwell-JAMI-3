import React from 'react';

interface JamieOrbOverlayProps {
  emotionalState: {
    state: string;
    intensity: number;
  };
  showMoodLabel?: boolean;
}

// Color mapping for moods
const moodColors: Record<string, string> = {
  calm: '#0ea5e9',
  anxious: '#fbbf24',
  depressed: '#7c3aed',
  angry: '#3b82f6',
  joyful: '#ec4899',
  creative: '#d946ef',
  empowered: '#10b981',
  vulnerable: '#f472b6',
  default: '#0ea5e9',
};

// Mood glyphs/icons (abstract)
const moodGlyphs: Record<string, string> = {
  calm: '◯',
  anxious: '⚡',
  depressed: '⬤',
  angry: '✦',
  joyful: '✿',
  creative: '✧',
  empowered: '▲',
  vulnerable: '❍',
  default: '◯',
};

export const JamieOrbOverlay: React.FC<JamieOrbOverlayProps> = ({ emotionalState, showMoodLabel = true }) => {
  const color = moodColors[emotionalState.state] || moodColors.default;
  const glyph = moodGlyphs[emotionalState.state] || moodGlyphs.default;
  const auraOpacity = 0.25 + 0.05 * emotionalState.intensity;
  const pulseDuration = 2.5 - 0.15 * emotionalState.intensity;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Aura ring */}
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        <circle
          cx="50%"
          cy="50%"
          r="48%"
          fill="none"
          stroke={color}
          strokeWidth="8"
          opacity={auraOpacity}
          style={{
            filter: `blur(4px) drop-shadow(0 0 16px ${color})`,
            transformOrigin: '50% 50%',
            animation: `jamie-aura-pulse ${pulseDuration}s ease-in-out infinite`,
          }}
        />
      </svg>
      {/* Abstract face cues (eyes, mouth) */}
      <svg width="120" height="120" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
        {/* Eyes */}
        <ellipse cx="40" cy="60" rx="8" ry="12" fill={color} opacity="0.7" />
        <ellipse cx="80" cy="60" rx="8" ry="12" fill={color} opacity="0.7" />
        {/* Mouth (arc, changes with mood) */}
        {emotionalState.state === 'joyful' ? (
          <path d="M45 85 Q60 100 75 85" stroke={color} strokeWidth="4" fill="none" opacity="0.8" />
        ) : emotionalState.state === 'depressed' ? (
          <path d="M45 95 Q60 80 75 95" stroke={color} strokeWidth="4" fill="none" opacity="0.8" />
        ) : emotionalState.state === 'angry' ? (
          <path d="M45 90 Q60 75 75 90" stroke={color} strokeWidth="4" fill="none" opacity="0.8" />
        ) : emotionalState.state === 'anxious' ? (
          <ellipse cx="60" cy="90" rx="12" ry="4" fill={color} opacity="0.5" />
        ) : (
          <ellipse cx="60" cy="90" rx="10" ry="6" fill={color} opacity="0.4" />
        )}
      </svg>
      {/* Mood label/glyph */}
      {showMoodLabel && (
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          color,
          fontWeight: 700,
          fontSize: 32,
          textShadow: `0 0 12px ${color}, 0 0 32px #000`,
          letterSpacing: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          {glyph}
        </div>
      )}
      {/* Keyframes for aura pulse */}
      <style>{`
        @keyframes jamie-aura-pulse {
          0%, 100% { r: 48%; opacity: ${auraOpacity}; }
          50% { r: 52%; opacity: ${auraOpacity * 1.2}; }
        }
      `}</style>
    </div>
  );
}; 