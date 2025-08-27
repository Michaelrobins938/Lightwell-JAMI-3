/**
 * Chat Client Service - Backend API Integration
 * Handles voice communication through backend API endpoints
 */

import { EventEmitter } from 'events';

export enum MessageType {
  USER_MESSAGE = 'user_message',
  ASSISTANT_MESSAGE = 'assistant_message',
  AUDIO_CHUNK = 'audio_chunk',
  SESSION_START = 'session_start',
  SESSION_END = 'session_end',
  ERROR = 'error'
}

export interface VoiceConfig {
  voice_id: string;
  sample_rate: number;
  channels: number;
  format: number; // 1 = PCM16
  chunk_size_ms: number;
}

export interface SessionConfig {
  voice_config: VoiceConfig;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface AuthTokens {
  access_token: string;
}

export class ChatClientService extends EventEmitter {
  private isConnected = false;
  private currentSessionId: string | null = null;
  private authTokens: AuthTokens | null = null;
  private isInitialized = false;
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor() {
    super();
  }

  /**
   * Initialize connection to backend voice API
   */
  async connect(authTokens: AuthTokens, useWebSocket = false): Promise<void> {
    this.authTokens = authTokens;

    try {
      console.log('🔧 Initializing backend API connection...');
      
      // Check API health first
      const healthResponse = await fetch('/api/voice/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access_token}`
        }
      });

      if (!healthResponse.ok) {
        throw new Error(`Voice API health check failed: ${healthResponse.status}`);
      }

      const healthData = await healthResponse.json();
      console.log('🏥 Voice API health:', healthData);

      if (!healthData.healthy) {
        throw new Error('Voice API is not healthy');
      }

      // Initialize microphone access
      await this.initializeMicrophone();
      
      this.isInitialized = true;
      this.isConnected = true;
      
      this.emit('connected');
      console.log('✅ Connected to backend voice API');
      
    } catch (error) {
      console.error('❌ Failed to connect to backend voice API:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Initialize microphone access
   */
  private async initializeMicrophone(): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      console.log('🎤 Microphone access granted');
    } catch (error) {
      console.error('❌ Failed to access microphone:', error);
      throw new Error('Microphone access denied');
    }
  }

  /**
   * Start recording and create voice session
   */
  async startRecording(onTranscript?: (transcript: string) => void): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Voice service not initialized. Call connect() first.');
    }

    try {
      console.log('🎤 Starting voice recording...');
      
      // Start a new voice session
      const sessionResponse = await fetch('/api/voice/session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authTokens?.access_token}`
        },
        body: JSON.stringify({
          language: 'en-US',
          personality: null,
          userId: 'user_' + Date.now()
        })
      });

      if (!sessionResponse.ok) {
        throw new Error(`Failed to start voice session: ${sessionResponse.status}`);
      }

      const sessionData = await sessionResponse.json();
      this.currentSessionId = sessionData.sessionId;
      console.log('📝 Voice session started:', this.currentSessionId);

      // Set up media recorder
      if (!this.mediaStream) {
        throw new Error('Microphone not initialized');
      }

      this.mediaRecorder = new MediaRecorder(this.mediaStream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          this.sendAudioChunkToAPI(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        console.log('🛑 Recording stopped');
      };

      // Start recording with 1 second intervals
      this.mediaRecorder.start(1000);
      
      this.emit('recordingStarted');
      console.log('✅ Voice recording started');
      
    } catch (error) {
      console.error('❌ Failed to start voice recording:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Send audio chunk to backend API
   */
  private async sendAudioChunkToAPI(audioBlob: Blob): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('chunk', audioBlob, `chunk_${Date.now()}.webm`);
      formData.append('metadata', JSON.stringify({
        id: `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId: this.currentSessionId, // Include session ID
        timestamp: Date.now(),
        duration: 1000, // 1 second chunks
        sampleRate: 16000,
        channels: 1,
        format: 'webm'
      }));

      const response = await fetch('/api/voice/chunk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authTokens?.access_token}`
        },
        body: formData
      });

      if (!response.ok) {
        console.warn(`⚠️ Failed to send audio chunk: ${response.status}`);
        return;
      }

      const result = await response.json();
      console.log('📤 Audio chunk sent:', result.chunk?.id);

      // Emit transcription if available
      if (result.chunk?.transcription) {
        this.emit('audioChunk', {
          transcript: result.chunk.transcription,
          timestamp: Date.now()
        });
      }

    } catch (error) {
      console.warn('⚠️ Failed to send audio chunk to API:', error);
    }
  }

  /**
   * Stop recording and end voice session
   */
  async stopRecording(): Promise<void> {
    try {
      console.log('🛑 Stopping voice recording...');
      
      // Stop the media recorder
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }

      // End the voice session
      if (this.currentSessionId) {
        const sessionResponse = await fetch('/api/voice/session/end', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authTokens?.access_token}`
          },
          body: JSON.stringify({
            id: this.currentSessionId,
            endTime: new Date(),
            transcript: '', // Would contain the full transcript
            audioChunks: this.audioChunks.length
          })
        });

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          console.log('📝 Voice session ended:', sessionData.session);
        } else {
          console.warn('⚠️ Failed to end voice session properly');
        }

        this.currentSessionId = null;
      }
      
      this.emit('recordingStopped');
      console.log('✅ Voice recording stopped');
      
    } catch (error) {
      console.error('❌ Failed to stop voice recording:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Send text message to AI through chat API
   */
  async sendMessage(message: string): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Voice service not initialized. Call connect() first.');
    }

    try {
      console.log('📤 Sending message to AI...');
      
      // Send message to the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authTokens?.access_token}`
        },
        body: JSON.stringify({
          message: message,
          sessionId: this.currentSessionId
        })
      });

      if (!response.ok) {
        throw new Error(`Chat API failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response || data.message || 'No response from AI';
      
      // Emit assistant message event
      this.emit('assistantMessage', {
        content: aiResponse,
        timestamp: Date.now()
      });
      
      console.log('✅ Message processed by AI');
      return aiResponse;
      
    } catch (error) {
      console.error('❌ Failed to send message to AI:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Send audio chunk (deprecated - chunks are sent automatically during recording)
   */
  async sendAudioChunk(audioData: ArrayBuffer): Promise<void> {
    // This method is maintained for API compatibility
    // Audio chunks are now sent automatically during recording
    console.log('📡 Audio chunk handling is automatic during recording');
  }

  /**
   * Disconnect from voice service
   */
  async disconnect(): Promise<void> {
    try {
      console.log('🔌 Disconnecting from voice service...');
      
      // Stop any active recording
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        await this.stopRecording();
      }

      // Stop media stream
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
      }

      this.isConnected = false;
      this.isInitialized = false;
      this.currentSessionId = null;
      this.audioChunks = [];
      
      this.emit('disconnected');
      console.log('✅ Disconnected from voice service');
      
    } catch (error) {
      console.error('❌ Failed to disconnect from voice service:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): { connected: boolean; initialized: boolean } {
    return {
      connected: this.isConnected,
      initialized: this.isInitialized
    };
  }

  /**
   * Check if audio APIs are available
   */
  async checkAudioAvailability(): Promise<boolean> {
    try {
      // Check if WebAudio API is available
      if (typeof navigator !== 'undefined' && 'mediaDevices' in navigator) {
        console.log('✅ WebAudio API available for microphone access');
        return true;
      }
      
      console.warn('⚠️ WebAudio APIs not available');
      return false;
      
    } catch (error) {
      console.error('❌ Error checking audio device availability:', error);
      return false;
    }
  }

  /**
   * Get detailed status for debugging
   */
  getDetailedStatus(): object {
    return {
      connected: this.isConnected,
      initialized: this.isInitialized,
      sessionId: this.currentSessionId,
      hasAuthTokens: !!this.authTokens,
      hasMediaStream: !!this.mediaStream,
      isRecording: this.mediaRecorder?.state === 'recording',
      timestamp: Date.now()
    };
  }

  /**
   * Test voice service connection
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing voice service connection...');
      
      // Test API health
      const healthResponse = await fetch('/api/voice/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!healthResponse.ok) {
        throw new Error(`Voice API health check failed: ${healthResponse.status}`);
      }

      const healthData = await healthResponse.json();
      if (!healthData.healthy) {
        throw new Error('Voice API is not healthy');
      }

      // Test audio availability
      const audioAvailable = await this.checkAudioAvailability();
      if (!audioAvailable) {
        throw new Error('Audio APIs not available');
      }
      
      console.log('✅ Voice service connection test passed');
      return true;
      
    } catch (error) {
      console.error('❌ Voice service connection test failed:', error);
      return false;
    }
  }
}

// Create singleton instance
export const chatClient = new ChatClientService();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).chatClient = chatClient;
}