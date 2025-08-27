import React, { useState } from "react";
import VoiceMode from "./VoiceMode";

const InputBar: React.FC = () => {
  const [voiceOpen, setVoiceOpen] = useState(false);

  return (
    <div className="p-4 border-t border-gray-200 flex items-center">
      {/* Text input */}
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-grow border rounded px-3 py-2 mr-2"
      />

      {/* Voice button */}
      <button
        onClick={() => setVoiceOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        🎤
      </button>

      {/* Voice mode modal */}
      <VoiceMode isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
};

export default InputBar;