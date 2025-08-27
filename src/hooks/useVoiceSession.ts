"use client";

import { useState, useRef, useCallback } from 'react';
import { useChat } from './useChat';

export function useVoiceSession() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { sendMessage } = useChat();

  const startVoiceRecording = useCallback(async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      setIsVoiceActive(true);
      setTranscript('');
      setIsAssistantSpeaking(false);

      // Initialize speech recognition for local transcription
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();

        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              interimTranscript += result[0].transcript;
            }
          }

          setTranscript(finalTranscript + interimTranscript);
        };

        recognitionRef.current.onend = () => {
          // Restart recognition if still active
          if (isVoiceActive && recognitionRef.current) {
            recognitionRef.current.start();
          }
        };

        recognitionRef.current.start();
      }

      // TODO: Initialize WebRTC connection to OpenAI Realtime API
      // This would require server-side token generation and WebRTC setup

    } catch (error) {
      console.error('Voice recording error:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  }, [isVoiceActive]);

  const stopVoiceRecording = useCallback(() => {
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    // Close WebRTC connection
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    setIsVoiceActive(false);
    setIsAssistantSpeaking(false);

    // Send the final transcript as a message
    if (transcript.trim()) {
      sendMessage(transcript.trim());
    }

    setTranscript('');
  }, [transcript, sendMessage]);

  return {
    isVoiceActive,
    transcript,
    startVoiceRecording,
    stopVoiceRecording,
    isAssistantSpeaking
  };
}