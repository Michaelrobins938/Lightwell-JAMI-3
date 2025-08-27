import React from 'react';
import { useVoiceMode } from '../../hooks/useVoiceMode';

interface VoiceButtonProps {
  onTranscriptUpdate?: (text: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ 
  onTranscriptUpdate, 
  className = '',
  size = 'md'
}) => {
  const { isRecording, startRecording, stopRecording, error } = useVoiceMode(onTranscriptUpdate);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          flex items-center justify-center 
          transition-all duration-200 
          ${isRecording 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-blue-500 hover:bg-blue-600'
          } 
          ${className}
        `}
        title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
      >
        {isRecording ? (
          <svg 
            width={iconSizes[size]} 
            height={iconSizes[size]} 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className="text-white"
          >
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg 
            width={iconSizes[size]} 
            height={iconSizes[size]} 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className="text-white"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        )}
      </button>

      {/* Error indicator */}
      {error && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      )}
    </div>
  );
};
