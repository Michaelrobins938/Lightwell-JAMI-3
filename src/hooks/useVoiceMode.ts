import { useState, useEffect, useCallback } from 'react';

interface VoiceModeState {
  listening: boolean;
  transcript: string;
  isSpeaking: boolean;
  isProcessing: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

interface VoiceModeActions {
  toggleMic: () => void;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
}

export const useVoiceMode = (): VoiceModeState & VoiceModeActions => {
  const [state, setState] = useState<VoiceModeState>({
    listening: false,
    transcript: '',
    isSpeaking: false,
    isProcessing: false,
    connectionStatus: 'disconnected'
  });

  const toggleMic = useCallback(() => {
    if (state.listening) {
      stopListening();
    } else {
      startListening();
    }
  }, [state.listening]);

  const startListening = useCallback(() => {
    try {
      setState(prev => ({ ...prev, connectionStatus: 'connecting' }));

      // Check if browser supports speech recognition
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('Speech recognition not supported');
        setState(prev => ({ ...prev, connectionStatus: 'error' }));
        return;
      }

      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setState(prev => ({ ...prev, listening: true, connectionStatus: 'connected' }));
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setState(prev => ({ ...prev, transcript: finalTranscript }));
        }
      };

      recognition.onend = () => {
        setState(prev => ({ ...prev, listening: false, connectionStatus: 'disconnected' }));
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setState(prev => ({ ...prev, listening: false, connectionStatus: 'error' }));
      };

      recognition.start();

    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setState(prev => ({ ...prev, connectionStatus: 'error' }));
    }
  }, []);

  const stopListening = useCallback(() => {
    setState(prev => ({ ...prev, listening: false, connectionStatus: 'disconnected' }));
  }, []);

  const clearTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '' }));
  }, []);

  const speakText = useCallback((text: string) => {
    try {
      setState(prev => ({ ...prev, isSpeaking: true }));

      // Check if browser supports speech synthesis
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        setState(prev => ({ ...prev, isSpeaking: false }));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.onend = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
      };

      utterance.onerror = () => {
        setState(prev => ({ ...prev, isSpeaking: false }));
      };

      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('Failed to speak text:', error);
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setState(prev => ({ ...prev, isSpeaking: false }));
  }, []);

  useEffect(() => {
    return () => {
      if (state.listening) {
        stopListening();
      }
      if (state.isSpeaking) {
        stopSpeaking();
      }
    };
  }, [state.listening, state.isSpeaking, stopListening, stopSpeaking]);

  return {
    ...state,
    toggleMic,
    startListening,
    stopListening,
    clearTranscript,
    speakText,
    stopSpeaking
  };
};