/**
 * JARVIS Unified Voice Service
 * Integrates ALL voice functionality from Luna into a single JARVIS-powered system
 */

import { EventEmitter } from 'events';

// Import all existing voice services
import { VoiceService as JARVISVoiceService } from './JARVIS_VoiceService';
// TODO: Create missing voice service components
// import { VoiceService as LunaVoiceService } from '../components/voice/voiceService';
// import { AudioProcessor as LunaAudioProcessor } from '../components/voice/audioProcessor';

// TODO: Create missing voice hooks
// import { useVoiceMode } from '../components/voice/hooks/useVoiceMode';
// import { useVoice } from '../components/voice/hooks/useVoice';

// Import types
import { VoicePersonality, CHATGPT_VOICE_PERSONALITIES } from './googleTTSService';

export interface UnifiedVoiceConfig {
  // JARVIS settings
  enableJARVIS: boolean;
  jarvisSampleRate: number;
  jarvisBitDepth: number;
  
  // Luna voice settings
  enableLunaVoice: boolean;
  lunaSampleRate: number;
  lunaBitDepth: number;
  
  // Audio processing
  enableNoiseReduction: boolean;
  enableEchoCancellation: boolean;
  enableAutoGainControl: boolean;
  
  // Voice features
  enableTTS: boolean;
  enableSpeechRecognition: boolean;
  enableVoicePersonalities: boolean;
  
  // Communication
  enableWebSocket: boolean;
  enableProtocolBuffer: boolean;
  serverUrl?: string;
}

export interface VoiceState {
  isInitialized: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isConnected: boolean;
  currentVoice: string;
  currentLanguage: string;
  audioLevel: number;
  transcript: string;
  error: string | null;
}

export class JARVISUnifiedVoiceService extends EventEmitter {
  private config: UnifiedVoiceConfig;
  private state: VoiceState;
  
  // JARVIS services
  private jarvisVoiceService: JARVISVoiceService | null = null;
  private jarvisAudioProcessor: any = null;
  
  // Luna services
  private lunaVoiceService: LunaVoiceService | null = null;
  private lunaAudioProcessor: LunaAudioProcessor | null = null;
  
  // Audio processing
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private analyser: AnalyserNode | null = null;
  private websocket: WebSocket | null = null;
  
  // State management
  private isRecording = false;
  private audioChunks: Blob[] = [];
  private animationFrame: number | null = null;

  constructor(config: Partial<UnifiedVoiceConfig> = {}) {
    super();
    
    this.config = {
      enableJARVIS: true,
      jarvisSampleRate: 48000,
      jarvisBitDepth: 16,
      enableLunaVoice: true,
      lunaSampleRate: 16000,
      lunaBitDepth: 16,
      enableNoiseReduction: true,
      enableEchoCancellation: true,
      enableAutoGainControl: true,
      enableTTS: true,
      enableSpeechRecognition: true,
      enableVoicePersonalities: true,
      enableWebSocket: true,
      enableProtocolBuffer: true,
      ...config
    };

    this.state = {
      isInitialized: false,
      isListening: false,
      isSpeaking: false,
      isConnected: false,
      currentVoice: 'ember',
      currentLanguage: 'en-US',
      audioLevel: 0,
      transcript: '',
      error: null
    };
  }

  /**
   * Initialize the unified voice service
   */
  async initialize(): Promise<void> {
    try {
      this.emit('initializing');
      
      // Initialize JARVIS services
      if (this.config.enableJARVIS) {
        await this.initializeJARVIS();
      }
      
      // Initialize Luna services
      if (this.config.enableLunaVoice) {
        await this.initializeLunaVoice();
      }
      
      // Initialize audio processing
      await this.initializeAudioProcessing();
      
      // Initialize communication
      if (this.config.enableWebSocket) {
        await this.initializeWebSocket();
      }
      
      this.state.isInitialized = true;
      this.emit('initialized', this.state);
      
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Unknown error';
      this.emit('error', this.state.error);
      throw error;
    }
  }

  /**
   * Initialize JARVIS voice services
   */
  private async initializeJARVIS(): Promise<void> {
    try {
      // Dynamic import to avoid SSR issues
      const { VoiceService } = await import('./JARVIS_VoiceService');
      const { AudioProcessor } = await import('./JARVIS_audioProcessor');
      
      this.jarvisVoiceService = new VoiceService();
      this.jarvisAudioProcessor = new AudioProcessor();
      
      await this.jarvisVoiceService.initialize();
      await this.jarvisAudioProcessor.initialize();
      
      // Set up JARVIS event listeners
      this.jarvisAudioProcessor.on('audioChunk', (data: any) => {
        this.emit('jarvis_audio_chunk', data);
        this.handleAudioChunk(data);
      });
      
      this.jarvisAudioProcessor.on('audioLevel', (level: number) => {
        this.state.audioLevel = level;
        this.emit('audio_level_change', level);
      });
      
      console.log('✅ JARVIS services initialized');
      
    } catch (error) {
      console.warn('⚠️ JARVIS services failed to initialize:', error);
      this.config.enableJARVIS = false;
    }
  }

  /**
   * Initialize Luna voice services
   */
  private async initializeLunaVoice(): Promise<void> {
    try {
      this.lunaVoiceService = new LunaVoiceService({
        apiEndpoint: '/api/voice',
        sessionTimeout: 300000,
        chunkSize: 1024,
        enableCompression: true,
        enableEncryption: false
      });
      
      this.lunaAudioProcessor = new LunaAudioProcessor({
        sampleRate: this.config.lunaSampleRate,
        targetSampleRate: 16000,
        bitDepth: this.config.lunaBitDepth,
        channels: 1,
        bufferSize: 4096,
        enableNoiseReduction: this.config.enableNoiseReduction,
        enableEchoCancellation: this.config.enableEchoCancellation,
        enableAutoGainControl: this.config.enableAutoGainControl
      });
      
      await this.lunaVoiceService.initialize();
      await this.lunaAudioProcessor.initialize(new MediaStream());
      
      console.log('✅ Luna voice services initialized');
      
    } catch (error) {
      console.warn('⚠️ Luna voice services failed to initialize:', error);
      this.config.enableLunaVoice = false;
    }
  }

  /**
   * Initialize audio processing
   */
  private async initializeAudioProcessing(): Promise<void> {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: Math.max(this.config.jarvisSampleRate, this.config.lunaSampleRate),
          channelCount: 1,
          echoCancellation: this.config.enableEchoCancellation,
          noiseSuppression: this.config.enableNoiseReduction,
          autoGainControl: this.config.enableAutoGainControl
        }
      });

      // Initialize AudioContext
      this.audioContext = new AudioContext({
        sampleRate: Math.max(this.config.jarvisSampleRate, this.config.lunaSampleRate)
      });

      // Create analyser for audio level monitoring
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      // Connect microphone to analyser
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);

      // Initialize MediaRecorder
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.mediaRecorder.ondataavailable = this.handleMediaRecorderData.bind(this);
      this.mediaRecorder.onstart = () => this.emit('recording_started');
      this.mediaRecorder.onstop = () => this.emit('recording_stopped');

      // Start audio level monitoring
      this.startAudioLevelMonitoring();

      console.log('✅ Audio processing initialized');
      
    } catch (error) {
      throw new Error(`Failed to initialize audio processing: ${error}`);
    }
  }

  /**
   * Initialize WebSocket connection
   */
  private async initializeWebSocket(): Promise<void> {
    if (!this.config.serverUrl) {
      console.warn('⚠️ No server URL provided, skipping WebSocket initialization');
      return;
    }

    try {
      this.websocket = new WebSocket(this.config.serverUrl);
      
      this.websocket.onopen = () => {
        this.state.isConnected = true;
        this.emit('connected');
      };
      
      this.websocket.onclose = () => {
        this.state.isConnected = false;
        this.emit('disconnected');
      };
      
      this.websocket.onerror = (error) => {
        this.emit('websocket_error', error);
      };
      
      this.websocket.onmessage = (event) => {
        this.handleWebSocketMessage(event.data);
      };
      
      console.log('✅ WebSocket connection initialized');
      
    } catch (error) {
      console.warn('⚠️ WebSocket connection failed:', error);
    }
  }

  /**
   * Start voice recording
   */
  async startRecording(): Promise<void> {
    if (this.isRecording) {
      throw new Error('Already recording');
    }

    try {
      this.isRecording = true;
      this.audioChunks = [];
      this.state.isListening = true;
      
      // Start JARVIS recording
      if (this.jarvisVoiceService) {
        await this.jarvisVoiceService.startRecording();
      }
      
      // Start Luna recording
      if (this.lunaVoiceService) {
        await this.lunaVoiceService.startRecording();
      }
      
      // Start MediaRecorder
      if (this.mediaRecorder) {
        this.mediaRecorder.start();
      }
      
      this.emit('recording_started');
      
    } catch (error) {
      this.isRecording = false;
      this.state.isListening = false;
      throw error;
    }
  }

  /**
   * Stop voice recording
   */
  async stopRecording(): Promise<Blob | null> {
    if (!this.isRecording) {
      return null;
    }

    try {
      this.isRecording = false;
      this.state.isListening = false;
      
      // Stop JARVIS recording
      if (this.jarvisVoiceService) {
        await this.jarvisVoiceService.stopRecording();
      }
      
      // Stop Luna recording
      if (this.lunaVoiceService) {
        await this.lunaVoiceService.stopRecording();
      }
      
      // Stop MediaRecorder
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
      }
      
      this.emit('recording_stopped');
      
      // Return the recorded audio
      if (this.audioChunks.length > 0) {
        return new Blob(this.audioChunks, { type: 'audio/webm' });
      }
      
      return null;
      
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle MediaRecorder data
   */
  private handleMediaRecorderData(event: BlobEvent): void {
    if (event.data.size > 0) {
      this.audioChunks.push(event.data);
    }
  }

  /**
   * Handle audio chunks from JARVIS
   */
  private handleAudioChunk(data: any): void {
    // Process audio data through Luna services if available
    if (this.lunaAudioProcessor) {
      this.lunaAudioProcessor.processAudioChunk(data);
    }
    
    // Send to WebSocket if connected
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({
        type: 'audio_chunk',
        data: data,
        timestamp: Date.now()
      }));
    }
  }

  /**
   * Handle WebSocket messages
   */
  private handleWebSocketMessage(data: any): void {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'transcript_update':
          this.state.transcript = message.transcript;
          this.emit('transcript_update', message.transcript);
          break;
          
        case 'voice_response':
          this.emit('voice_response', message.response);
          break;
          
        case 'error':
          this.state.error = message.error;
          this.emit('error', message.error);
          break;
          
        default:
          console.log('Unknown WebSocket message type:', message.type);
      }
      
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  /**
   * Start audio level monitoring
   */
  private startAudioLevelMonitoring(): void {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    const updateAudioLevel = () => {
      if (!this.analyser) return;
      
      this.analyser.getByteFrequencyData(dataArray);
      
      // Calculate RMS level
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / dataArray.length) / 255;
      
      this.state.audioLevel = rms;
      this.emit('audio_level_change', rms);
      
      this.animationFrame = requestAnimationFrame(updateAudioLevel);
    };
    
    updateAudioLevel();
  }

  /**
   * Set voice personality
   */
  setVoicePersonality(personalityId: string): void {
    const personality = CHATGPT_VOICE_PERSONALITIES.find(p => p.id === personalityId);
    if (personality) {
      this.state.currentVoice = personalityId;
      
      // Update JARVIS voice personality
      if (this.jarvisVoiceService) {
        this.jarvisVoiceService.setVoicePersonality(personalityId);
      }
      
      // Update Luna voice personality
      if (this.lunaVoiceService) {
        this.lunaVoiceService.setVoicePersonality(personalityId);
      }
      
      this.emit('voice_personality_changed', personality);
    }
  }

  /**
   * Set language
   */
  setLanguage(language: string): void {
    this.state.currentLanguage = language;
    
    // Update JARVIS language
    if (this.jarvisVoiceService) {
      this.jarvisVoiceService.setLanguage(language);
    }
    
    // Update Luna language
    if (this.lunaVoiceService) {
      this.lunaVoiceService.setLanguage(language);
    }
    
    this.emit('language_changed', language);
  }

  /**
   * Get current state
   */
  getState(): VoiceState {
    return { ...this.state };
  }

  /**
   * Get configuration
   */
  getConfig(): UnifiedVoiceConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<UnifiedVoiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit('config_updated', this.config);
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.state.isInitialized && !this.state.error;
  }

  /**
   * Cleanup and dispose
   */
  dispose(): void {
    // Stop recording if active
    if (this.isRecording) {
      this.stopRecording();
    }
    
    // Cancel animation frame
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    // Close WebSocket
    if (this.websocket) {
      this.websocket.close();
    }
    
    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    // Dispose services
    if (this.jarvisVoiceService) {
      this.jarvisVoiceService.dispose?.();
    }
    
    if (this.lunaVoiceService) {
      this.lunaVoiceService.dispose?.();
    }
    
    if (this.lunaAudioProcessor) {
      this.lunaAudioProcessor.dispose?.();
    }
    
    // Reset state
    this.state.isInitialized = false;
    this.state.isListening = false;
    this.state.isSpeaking = false;
    this.state.isConnected = false;
    
    this.emit('disposed');
  }
}

// Export singleton instance
export const jarvisUnifiedVoiceService = new JARVISUnifiedVoiceService();

// Export default
export default JARVISUnifiedVoiceService;

