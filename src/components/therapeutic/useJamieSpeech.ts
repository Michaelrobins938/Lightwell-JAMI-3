import { useRef, useState, useCallback } from 'react';

export function useJamieSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Speak text - DISABLED to prevent feedback loops
  const speak = useCallback(async (text: string, voice?: SpeechSynthesisVoice) => {
    // DISABLED to prevent feedback loops
    console.log('Speech synthesis disabled to prevent feedback loops');
    return;
    
    // if (!window.speechSynthesis) return;
    // if (isSpeaking) window.speechSynthesis.cancel();
    // const utterance = new window.SpeechSynthesisUtterance(text);
    // if (voice) utterance.voice = voice;
    // utterance.rate = 1.0;
    // utterance.pitch = 1.0;
    // utterance.volume = 1.0;
    // setIsSpeaking(true);
    // utterance.onend = () => setIsSpeaking(false);
    // utterance.onerror = () => setIsSpeaking(false);
    // window.speechSynthesis.speak(utterance);
  }, []);

  return {
    speak,
    isSpeaking,
    analyser: analyserRef.current,
  };
} 