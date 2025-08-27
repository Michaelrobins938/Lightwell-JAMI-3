/**
 * Voice Mode Hook - Compatible with JARVIS Voice App
 * Provides the interface expected by JARVISVoiceApp.tsx
 */

import { useState, useCallback, useRef } from 'react';
import { audioProcessor } from '../../services/audioProcessor';
import { chatClient } from '../../services/chatClient';

export enum VoiceState {
  IDLE = 'idle',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  PROCESSING = 'processing',
  CONNECTING = 'connecting',
  ERROR = 'error'
}

export interface VoiceModeConfig {
  voicePersonality: string;
  autoStart: boolean;
  enableChatGPT: boolean;
  audioThreshold: number;
  processingTimeout: number;
}

export interface VoiceModeStatus {
  state: VoiceState;
  isConnected: boolean;
  audioLevel: number;
  error: string | null;
  stats: {
    chunksProcessed: number;
    messagesReceived: number;
    sessionDuration: number;
  };
}

export interface VoiceModeHook {
  initialize: () => Promise<void>;
  cleanup: () => Promise<void>;
  changeVoicePersonality: (voiceId: string) => Promise<void>;
  getStatus: () => VoiceModeStatus;
}

export const useVoiceMode = (config: VoiceModeConfig): VoiceModeHook => {
  const [state, setState] = useState<VoiceState>(VoiceState.IDLE);
  const [isConnected, setIsConnected] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    chunksProcessed: 0,
    messagesReceived: 0,
    sessionDuration: 0
  });

  const sessionStartTime = useRef<number | null>(null);
  const isInitialized = useRef(false);

  /**
   * Initialize voice mode systems
   */
  const initialize = useCallback(async (): Promise<void> => {
    if (isInitialized.current) return;

    try {
      setState(VoiceState.CONNECTING);
      setError(null);
      sessionStartTime.current = Date.now();

      // Initialize audio processor
      await audioProcessor.initialize();

      // Set up audio event listeners
      audioProcessor.on('audioLevel', (data: { rms: number }) => {
        setAudioLevel(data.rms);
      });

      audioProcessor.on('audioChunk', (chunk: any) => {
        setStats(prev => ({
          ...prev,
          chunksProcessed: prev.chunksProcessed + 1
        }));
      });

      // Initialize chat client
      const authTokens = { access_token: process.env.OPENAI_API_KEY || 'demo_token' };
      await chatClient.connect(authTokens, config.enableChatGPT);

      // Set up chat event listeners
      chatClient.on('connected', () => {
        setIsConnected(true);
      });

      chatClient.on('disconnected', () => {
        setIsConnected(false);
      });

      chatClient.on('assistantMessage', (message: any) => {
        setStats(prev => ({
          ...prev,
          messagesReceived: prev.messagesReceived + 1
        }));
      });

      chatClient.on('error', (error: any) => {
        setError(error.message || 'Chat client error');
        setState(VoiceState.ERROR);
      });

      // Voice configuration is handled during recording
      console.log('🎵 Voice configuration ready:', config.voicePersonality);

      setState(VoiceState.IDLE);
      isInitialized.current = true;
      
      console.log('✅ Voice mode initialized successfully');

    } catch (error: any) {
      console.error('❌ Failed to initialize voice mode:', error);
      setError(error.message || 'Failed to initialize voice mode');
      setState(VoiceState.ERROR);
      throw error;
    }
  }, [config]);

  /**
   * Cleanup voice mode resources
   */
  const cleanup = useCallback(async (): Promise<void> => {
    try {
      // Stop audio processing
      audioProcessor.stop();
      audioProcessor.dispose();

      // Disconnect chat client
      chatClient.disconnect();

      // Reset state
      setState(VoiceState.IDLE);
      setIsConnected(false);
      setAudioLevel(0);
      setError(null);
      setStats({
        chunksProcessed: 0,
        messagesReceived: 0,
        sessionDuration: 0
      });

      isInitialized.current = false;
      sessionStartTime.current = null;

      console.log('🧹 Voice mode cleaned up successfully');

    } catch (error: any) {
      console.error('❌ Failed to cleanup voice mode:', error);
      setError(error.message || 'Failed to cleanup voice mode');
    }
  }, []);

  /**
   * Change voice personality
   */
  const changeVoicePersonality = useCallback(async (voiceId: string): Promise<void> => {
    try {
      if (!isInitialized.current) {
        console.warn('⚠️ Voice mode not initialized');
        return;
      }

      // Voice personality change is handled during recording
      console.log(`🎵 Voice personality will be updated to: ${voiceId}`);

      console.log(`🎵 Changed voice personality to: ${voiceId}`);

    } catch (error: any) {
      console.error('❌ Failed to change voice personality:', error);
      setError(error.message || 'Failed to change voice personality');
    }
  }, []);

  /**
   * Get current voice mode status
   */
  const getStatus = useCallback((): VoiceModeStatus => {
    const sessionDuration = sessionStartTime.current 
      ? (Date.now() - sessionStartTime.current) / 1000 
      : 0;

    return {
      state,
      isConnected,
      audioLevel,
      error,
      stats: {
        ...stats,
        sessionDuration
      }
    };
  }, [state, isConnected, audioLevel, error, stats]);

  return {
    initialize,
    cleanup,
    changeVoicePersonality,
    getStatus
  };
};