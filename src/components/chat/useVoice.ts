import { useState } from "react";

export function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  return { speak, isSpeaking };
}
