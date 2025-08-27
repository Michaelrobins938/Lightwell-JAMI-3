"use client";

import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceButtonProps {
  onClick: () => void;
  isActive: boolean;
}

export default function VoiceButton({ onClick, isActive }: VoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
      }`}
      title={isActive ? 'Stop voice recording' : 'Start voice recording'}
    >
      {isActive ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}
