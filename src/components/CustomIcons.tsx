import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const BrainIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9C63FF" />
        <stop offset="100%" stopColor="#5e35b1" />
      </linearGradient>
    </defs>
    <path d="M12 2C8.5 2 6 4.5 6 8c0 2.5 1.5 4.5 3.5 5.5C7.5 14.5 6 16.5 6 19c0 2.5 2.5 3 6 3s6-0.5 6-3c0-2.5-1.5-4.5-3.5-5.5C16.5 12.5 18 10.5 18 8c0-3.5-2.5-6-6-6z" fill="url(#brainGrad)" />
    <path d="M9 8c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3z" fill="rgba(255,255,255,0.3)" />
    <circle cx="10" cy="7" r="1" fill="rgba(255,255,255,0.8)" />
    <circle cx="14" cy="7" r="1" fill="rgba(255,255,255,0.8)" />
  </svg>
);

export const CloudIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b39ddb" />
        <stop offset="100%" stopColor="#7e57c2" />
      </linearGradient>
    </defs>
    <path d="M19.5 12c0-3.5-2.5-6-6-6-2.5 0-4.5 1.5-5.5 3.5C5.5 10.5 3 12.5 3 15c0 2.5 2.5 3 6 3h10.5c1.5 0 2.5-1 2.5-2.5S21 12 19.5 12z" fill="url(#cloudGrad)" />
    <path d="M7 15c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3z" fill="rgba(255,255,255,0.2)" />
    <circle cx="8" cy="14" r="0.8" fill="rgba(255,255,255,0.6)" />
    <circle cx="12" cy="14" r="0.8" fill="rgba(255,255,255,0.6)" />
  </svg>
);

export const HandshakeIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="handshakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <path d="M8 12c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z" fill="url(#handshakeGrad)" />
    <path d="M16 12c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z" fill="url(#handshakeGrad)" />
    <path d="M12 8c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z" fill="rgba(255,255,255,0.15)" />
    <path d="M10 10c0-0.5 0.5-1 1-1s1 0.5 1 1-0.5 1-1 1-1-0.5-1-1z" fill="rgba(255,255,255,0.8)" />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="lockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <rect x="6" y="10" width="12" height="8" rx="2" fill="url(#lockGrad)" />
    <path d="M8 10V7c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5v3" stroke="url(#lockGrad)" strokeWidth="2" fill="none" />
    <circle cx="12" cy="14" r="1" fill="rgba(255,255,255,0.8)" />
  </svg>
);

export const ChartIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4facfe" />
        <stop offset="100%" stopColor="#00f2fe" />
      </linearGradient>
    </defs>
    <path d="M4 20h16" stroke="url(#chartGrad)" strokeWidth="2" />
    <path d="M4 4v16" stroke="url(#chartGrad)" strokeWidth="2" />
    <path d="M8 12l3-3 3 3 4-4" stroke="url(#chartGrad)" strokeWidth="2" fill="none" />
    <circle cx="8" cy="12" r="1" fill="rgba(255,255,255,0.8)" />
    <circle cx="11" cy="9" r="1" fill="rgba(255,255,255,0.8)" />
    <circle cx="14" cy="12" r="1" fill="rgba(255,255,255,0.8)" />
    <circle cx="18" cy="8" r="1" fill="rgba(255,255,255,0.8)" />
  </svg>
);

export const GlobeIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#globeGrad)" />
    <path d="M2 12h20" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    <path d="M12 2c2.5 0 4.5 1.5 5.5 3.5C15.5 7.5 13.5 9 11 9s-4.5-1.5-6.5-3.5C5.5 3.5 7.5 2 10 2z" fill="rgba(255,255,255,0.1)" />
    <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.2)" />
    <circle cx="12" cy="12" r="1" fill="rgba(255,255,255,0.8)" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#heartGrad)" />
    <path d="M12 18c-2.5-2.5-4.5-4.5-4.5-7.5 0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5c0 3-2 5-4.5 7.5z" fill="rgba(255,255,255,0.2)" />
  </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <path d="M12 2L3 6v6c0 5.5 3.5 10.5 9 12s9-6.5 9-12V6l-9-4z" fill="url(#shieldGrad)" />
    <path d="M9 12l2 2 4-4" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none" />
    <path d="M12 4c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z" fill="rgba(255,255,255,0.1)" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd700" />
        <stop offset="100%" stopColor="#ffb300" />
      </linearGradient>
    </defs>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#starGrad)" />
    <path d="M12 4l2.5 5 5.5 0.8-4 3.9 0.9 5.3L12 16.5l-4.9 2.5 0.9-5.3-4-3.9 5.5-0.8L12 4z" fill="rgba(255,255,255,0.2)" />
  </svg>
);

export const MessageIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="messageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9C63FF" />
        <stop offset="100%" stopColor="#5e35b1" />
      </linearGradient>
    </defs>
    <path d="M20 2H4c-1.1 0-2 0.9-2 2v12c0 1.1 0.9 2 2 2h4l4 4 4-4h4c1.1 0 2-0.9 2-2V4c0-1.1-0.9-2-2-2z" fill="url(#messageGrad)" />
    <path d="M6 8h12M6 12h8" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" />
    <circle cx="8" cy="8" r="1" fill="rgba(255,255,255,0.6)" />
    <circle cx="8" cy="12" r="1" fill="rgba(255,255,255,0.6)" />
  </svg>
); 