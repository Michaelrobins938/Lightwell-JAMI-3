import { useRef, useState, useCallback, useEffect } from 'react';
import { elevenLabsService } from '../../services/elevenLabsService';

interface UseJamieVoiceOptions {
  enableVoice?: boolean;
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
}

export function useJamieVoice(options: UseJamieVoiceOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioRef = useRef<AudioBufferSourceNode | null>(null);
  const audioLevelIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    enableVoice = true,
    voiceId,
    stability,
    similarityBoost
  } = options;

  // Update ElevenLabs configuration if provided
  useEffect(() => {
    if (voiceId || stability !== undefined || similarityBoost !== undefined) {
      elevenLabsService.updateConfig({
        voiceId,
        stability,
        similarityBoost
      });
    }
  }, [voiceId, stability, similarityBoost]);

  // Initialize audio context and analyser
  const initializeAudio = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 512;
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    } catch (err) {
      console.error('Failed to initialize audio context:', err);
      setError('Audio initialization failed');
    }
  }, []);

  // Update audio level from analyser
  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    setAudioLevel(average / 256);
  }, []);

  // Start audio level monitoring
  const startAudioMonitoring = useCallback(() => {
    if (audioLevelIntervalRef.current) {
      clearInterval(audioLevelIntervalRef.current);
    }
    
    audioLevelIntervalRef.current = setInterval(updateAudioLevel, 50);
  }, [updateAudioLevel]);

  // Stop audio level monitoring
  const stopAudioMonitoring = useCallback(() => {
    if (audioLevelIntervalRef.current) {
      clearInterval(audioLevelIntervalRef.current);
      audioLevelIntervalRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  // Breathing animation
  useEffect(() => {
    const breathingInterval = setInterval(() => {
      setBreathingPhase(prev => (prev + 0.1) % (Math.PI * 2));
    }, 100);
    
    return () => clearInterval(breathingInterval);
  }, []);

  // Speak text using ElevenLabs
  const speak = useCallback((text: string) => {
    if (!enableVoice || !text.trim()) return;
    
    // DISABLED to prevent feedback loop - manual control only
    console.log('Speech disabled to prevent feedback loop');
    return;
    
    // try {
    //   const response = await fetch('/api/elevenlabs/synthesize', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       text,
    //       voiceId: 'RILOU7YmBhvwJGDGjNmP'
    //     }),
    //   });

    //   if (response.ok) {
    //     const audioBlob = await response.blob();
    //     const audioUrl = URL.createObjectURL(audioBlob);
    //     const audio = new Audio(audioUrl);
    //     setIsSpeaking(true);
    //     audio.onended = () => {
    //       setIsSpeaking(false);
    //       URL.revokeObjectURL(audioUrl);
    //     };
    //     audio.onerror = () => {
    //       setIsSpeaking(false);
    //       URL.revokeObjectURL(audioUrl);
    //     };
    //     audio.play();
    //   } else {
    //     // Fallback to browser TTS
    //     if (window.speechSynthesis) {
    //       const utterance = new window.SpeechSynthesisUtterance(text);
    //       setIsSpeaking(true);
    //       utterance.onend = () => setIsSpeaking(false);
    //       utterance.onerror = () => setIsSpeaking(false);
    //       window.speechSynthesis.speak(utterance);
    //     }
    //   }
    // } catch (error) {
    //   console.error('Voice synthesis error:', error);
    //   setError('Failed to synthesize speech');
    //   // Fallback to browser TTS
    //   if (window.speechSynthesis) {
    //     const utterance = new window.SpeechSynthesisUtterance(text);
    //     setIsSpeaking(true);
    //     utterance.onend = () => setIsSpeaking(false);
    //     utterance.onerror = () => setIsSpeaking(false);
    //     window.speechSynthesis.speak(utterance);
    //   }
    // }
  }, [enableVoice]);

  // Stop current speech
  const stopSpeaking = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.stop();
      currentAudioRef.current = null;
    }
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    setIsSpeaking(false);
    stopAudioMonitoring();
  }, [stopAudioMonitoring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (audioLevelIntervalRef.current) {
        clearInterval(audioLevelIntervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopSpeaking]);

  return {
    speak,
    stopSpeaking,
    isSpeaking,
    audioLevel,
    breathingPhase,
    analyser: analyserRef.current,
    error,
    setError: (error: string | null) => setError(error)
  };
} 