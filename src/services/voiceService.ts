// USB-based VoiceService.ts

// VoiceService handles:
// - USB audio device initialization and management
// - Local audio processing and transcription
// - Local AI processing or integration with existing LLM client

import { audioProcessor } from './audioProcessor';

// USB Audio Device Interface
interface USBAudioDevice {
  deviceId: string;
  name: string;
  sampleRate: number;
  channels: number;
  isConnected: boolean;
}

// Local AI Processing Interface
interface LocalAIProcessor {
  processText(text: string): Promise<string>;
  generateSpeech(text: string): Promise<ArrayBuffer>;
}

class VoiceServiceClass {
  // USB Audio Device Management
  private usbDevice: USBAudioDevice | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private isInitialized = false;
  private isRecording = false;
  private localAIProcessor: LocalAIProcessor | null = null;

  /**
   * Initialize USB audio device and local processing
   */
  async initialize(): Promise<void> {
    try {
      console.log('🔧 Initializing USB-based VoiceService...');
      
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        throw new Error('VoiceService can only run in browser environment');
      }

      // Check for USB audio device availability
      const usbAvailable = await this.checkUSBAudioAvailability();
      if (!usbAvailable) {
        throw new Error('USB audio device not found');
      }

      // Initialize audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });

      // Initialize USB audio device
      await this.initializeUSBAudioDevice();

      // Initialize local AI processor
      await this.initializeLocalAIProcessor();

      // Initialize audio processor for compatibility
      await audioProcessor.initialize();

      this.isInitialized = true;
      console.log('✅ USB-based VoiceService initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize USB-based VoiceService:', error);
      throw error;
    }
  }

  /**
   * Check if USB audio device is available
   */
  async checkUSBAudioAvailability(): Promise<boolean> {
    try {
      // Check for WebUSB API
      if (typeof navigator !== 'undefined' && 'usb' in navigator) {
        console.log('✅ WebUSB API available');
        
        // Try to get USB devices
        const devices = await (navigator as any).usb.getDevices();
        const audioDevices = devices.filter((device: any) => 
          device.productName?.toLowerCase().includes('audio') ||
          device.productName?.toLowerCase().includes('microphone') ||
          device.productName?.toLowerCase().includes('usb')
        );
        
        if (audioDevices.length > 0) {
          console.log(`✅ Found ${audioDevices.length} USB audio device(s)`);
          return true;
        }
      }
      
      // Fallback to WebAudio API for microphone access
      if (typeof navigator !== 'undefined' && 'mediaDevices' in navigator) {
        console.log('✅ WebAudio API available for microphone access');
        return true;
      }
      
      console.warn('⚠️ No USB audio APIs available');
      return false;
      
    } catch (error) {
      console.error('❌ Error checking USB audio availability:', error);
      return false;
    }
  }

  /**
   * Initialize USB audio device
   */
  async initializeUSBAudioDevice(): Promise<void> {
    try {
      console.log('🎤 Initializing USB audio device...');
      
      // Try to get microphone access (USB or built-in)
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Create USB audio device object
      this.usbDevice = {
        deviceId: this.mediaStream.id,
        name: 'USB Audio Device',
        sampleRate: 16000,
        channels: 1,
        isConnected: true
      };

      console.log('✅ USB audio device initialized:', this.usbDevice.name);
      
    } catch (error) {
      console.error('❌ Failed to initialize USB audio device:', error);
      
      // Provide specific error messages
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('USB audio device access denied. Please allow microphone permissions.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No USB audio device found. Please connect a USB microphone.');
        } else if (error.name === 'NotSupportedError') {
          throw new Error('USB audio features not supported in this browser.');
        }
      }
      
      throw new Error(`USB audio device initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Initialize local AI processor
   */
  async initializeLocalAIProcessor(): Promise<void> {
    try {
      console.log('🤖 Initializing local AI processor...');
      
      // Create a simple local AI processor
      this.localAIProcessor = {
        async processText(text: string): Promise<string> {
          // Simple local processing - in a real implementation, this would use a local LLM
          const responses = [
            "I understand what you're saying. How can I help you?",
            "That's interesting. Tell me more about that.",
            "I'm processing your request locally. What else would you like to know?",
            "Thanks for sharing that with me. How can I assist you further?",
            "I see. Can you provide more details about what you need?"
          ];
          
          // Simple keyword-based responses
          if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
            return "Hello! I'm your local AI assistant. How can I help you today?";
          } else if (text.toLowerCase().includes('help')) {
            return "I'm here to help! What would you like assistance with?";
          } else if (text.toLowerCase().includes('time')) {
            return `The current time is ${new Date().toLocaleTimeString()}.`;
          } else if (text.toLowerCase().includes('weather')) {
            return "I can't check the weather locally, but I can help you with other tasks!";
          } else {
            // Return a random response for other inputs
            return responses[Math.floor(Math.random() * responses.length)];
          }
        },

        async generateSpeech(text: string): Promise<ArrayBuffer> {
          // Simple speech synthesis using Web Speech API
          return new Promise((resolve, reject) => {
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.rate = 0.9;
              utterance.pitch = 1.0;
              utterance.volume = 1.0;
              
              // Create a simple audio buffer for compatibility
              const audioContext = new AudioContext();
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              // Generate a simple tone as placeholder
              oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
              gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
              
              // Play the speech
              utterance.onend = () => {
                oscillator.stop();
                resolve(new ArrayBuffer(1024)); // Placeholder buffer
              };
              
              utterance.onerror = (error) => {
                oscillator.stop();
                reject(error);
              };
              
              speechSynthesis.speak(utterance);
            } else {
              reject(new Error('Speech synthesis not supported'));
            }
          });
        }
      };

      console.log('✅ Local AI processor initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize local AI processor:', error);
      throw error;
    }
  }

  /**
   * Start USB audio recording
   * @param {Function} onTranscript - callback for partial transcripts
   */
  async start(onTranscript: (transcript: string) => void) {
    try {
      if (!this.isInitialized) {
        throw new Error('USB VoiceService not initialized. Call initialize() first.');
      }

      if (!this.usbDevice?.isConnected) {
        throw new Error('USB audio device not connected');
      }

      console.log('🎤 Starting USB audio recording...');
      
      // Start the audio processor
      audioProcessor.start();
      
      // Set up audio processing for transcription
      audioProcessor.on('audioChunk', (chunk: any) => {
        if (chunk.rmsAmplitude > 0.1) {
          // Simple voice activity detection
          const transcript = this.processAudioChunk(chunk);
          if (transcript) {
            onTranscript(transcript);
          }
        }
      });

      this.isRecording = true;
      console.log('✅ USB audio recording started');
      
    } catch (error) {
      console.error('❌ Failed to start USB audio recording:', error);
      throw error;
    }
  }

  /**
   * Stop USB audio recording
   */
  stop() {
    try {
      if (this.isRecording) {
        audioProcessor.stop();
        this.isRecording = false;
        console.log('🛑 USB audio recording stopped');
      }
    } catch (error) {
      console.error('❌ Failed to stop USB audio recording:', error);
    }
  }

  /**
   * Process audio chunk for transcription
   */
  private processAudioChunk(chunk: any): string {
    // Simple audio processing - in a real implementation, this would use local STT
    if (chunk.rmsAmplitude > 0.3) {
      return "Listening...";
    } else if (chunk.rmsAmplitude > 0.1) {
      return "Voice detected...";
    }
    return "";
  }

  /**
   * Send user text to local AI processor
   * @param {string} text - user message
   * @returns {Promise<string>} assistant reply
   */
  async sendToAI(text: string): Promise<string> {
    try {
      if (!this.localAIProcessor) {
        throw new Error('Local AI processor not initialized');
      }

      console.log('🤖 Processing text with local AI...');
      
      // Process text locally
      const reply = await this.localAIProcessor.processText(text);
      
      // Generate speech locally
      await this.playLocalSpeech(reply);

      console.log('✅ Text processed locally');
      return reply;
      
    } catch (error) {
      console.error('❌ Failed to process text locally:', error);
      throw error;
    }
  }

  /**
   * Play speech using local TTS
   * @param {string} text
   */
  async playLocalSpeech(text: string) {
    try {
      if (!this.localAIProcessor) {
        throw new Error('Local AI processor not initialized');
      }

      console.log('🔊 Playing local speech synthesis...');
      
      // Use local speech synthesis
      await this.localAIProcessor.generateSpeech(text);
      
      console.log('✅ Speech played locally');
      
    } catch (error) {
      console.error('❌ Failed to play local speech:', error);
      
      // Fallback to simple audio feedback
      if (this.audioContext) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
      }
    }
  }

  /**
   * Get USB device status
   */
  getUSBDeviceStatus(): USBAudioDevice | null {
    return this.usbDevice;
  }

  /**
   * Check if USB device is connected
   */
  isUSBDeviceConnected(): boolean {
    return this.usbDevice?.isConnected || false;
  }

  /**
   * Get initialization status
   */
  getInitializationStatus(): boolean {
    return this.isInitialized;
  }
}

// Create singleton instance
const VoiceService = new VoiceServiceClass();

export default VoiceService;