import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoiceMode } from '../hooks/useVoiceMode';

const VoiceInteraction: React.FC<{ onSpeechResult: (text: string) => void }> = ({ onSpeechResult }) => {
  const { transcript, isRecording, startRecording, stopRecording, error } = useVoiceMode();
  
  // Update parent component when transcript changes
  React.useEffect(() => {
    if (transcript && transcript !== '') {
      onSpeechResult(transcript);
    }
  }, [transcript, onSpeechResult]);

  const toggleListening = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSpeechSynthesis = (text: string) => {
    // DISABLED to prevent feedback loop
    console.log('Speech synthesis disabled to prevent feedback loop');
    return;
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div className="flex items-center space-x-4">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        className={`p-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
      >
        {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => handleSpeechSynthesis(transcript)}
        className={`p-2 rounded-full bg-blue-500 text-white`}
        disabled={!transcript}
      >
        <Volume2 size={24} />
      </motion.button>
      <p className="text-sm">{transcript}</p>
      {error && (
        <p className="text-sm text-red-500 mt-2">Error: {error}</p>
      )}
    </div>
  );
};

export default VoiceInteraction;