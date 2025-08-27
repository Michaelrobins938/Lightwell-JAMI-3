// src/components/VoiceMode.tsx
import React, { useEffect } from "react";
import { useChatStore } from "../state/chatStore";   // ✅ Correct path
import { useVoiceSession } from "../hooks/useVoiceSession"; // ✅ Correct path to hooks directory
import NarratorOrb from "./NarratorOrb";




interface VoiceModeProps {
  onClose: () => void;
  isOpen: boolean;
}

const VoiceMode: React.FC<VoiceModeProps> = ({ onClose, isOpen }) => {
  const voiceSession = useVoiceSession(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      {/* Orb */}
      <NarratorOrb isSpeaking={false} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl"
      >
        ✕
      </button>
    </div>
  );
};

export default VoiceMode;