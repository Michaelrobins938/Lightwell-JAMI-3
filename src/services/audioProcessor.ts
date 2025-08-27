/**
 * Audio Processor Service - Simplified for ChatGPT Voice Mode
 * Handles microphone input, PCM16 conversion, and real-time audio levels
 */

import { EventEmitter } from 'events';

export interface AudioChunk {
  data: Uint8Array;
  rmsAmplitude: number;
  timestamp: number;
}

export class AudioProcessorService extends EventEmitter {
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private isInitialized = false;
  private isRecording = false;

  constructor() {
    super();
  }

  /**
   * Initialize audio processor with microphone access
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('🔄 Audio processor already initialized');
      return;
    }

    try {
      console.log('🔧 Initializing audio processor...');
      
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        throw new Error('Audio processor can only be initialized in browser environment');
      }

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported in this browser');
      }

      console.log('🎤 Requesting microphone access...');
      
      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      console.log('✅ Microphone access granted');

      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });

      console.log('🔊 Audio context created');

      // Create analyser node for real-time audio level detection
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 1024;
      this.analyserNode.smoothingTimeConstant = 0.3;

      // Create source from microphone stream
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Create script processor for audio data extraction
      this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);

      // Connect the audio graph
      this.sourceNode.connect(this.analyserNode);
      this.analyserNode.connect(this.processorNode);
      this.processorNode.connect(this.audioContext.destination);

      console.log('🔗 Audio graph connected');

      // Set up audio processing
      this.setupAudioProcessing();

      this.isInitialized = true;
      console.log('✅ Audio processor initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize audio processor:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Microphone access denied. Please allow microphone permissions in your browser.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No microphone found. Please connect a microphone and try again.');
        } else if (error.name === 'NotSupportedError') {
          throw new Error('Audio features not supported in this browser. Please use a modern browser.');
        }
      }
      
      throw new Error(`Microphone access required for voice mode: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Set up real-time audio processing
   */
  private setupAudioProcessing(): void {
    if (!this.processorNode || !this.analyserNode) return;

    // Start continuous audio level monitoring
    this.startAudioLevelMonitoring();

    // Set up audio chunk processing
    this.processorNode.onaudioprocess = (event) => {
      if (!this.isRecording) return;

      const inputBuffer = event.inputBuffer;
      const inputData = inputBuffer.getChannelData(0);

      // Convert to PCM16
      const pcm16Data = this.convertToPCM16(inputData);
      
      // Calculate RMS amplitude
      const rmsAmplitude = this.calculateRMS(inputData);

      // Create audio chunk
      const audioChunk: AudioChunk = {
        data: new Uint8Array(pcm16Data.buffer),
        rmsAmplitude,
        timestamp: Date.now()
      };

      // Emit audio chunk event
      this.emit('audioChunk', audioChunk);
    };
  }

  /**
   * Start continuous audio level monitoring
   */
  private startAudioLevelMonitoring(): void {
    if (!this.analyserNode) return;

    const updateAudioLevel = () => {
      if (!this.analyserNode) return;

      const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
      this.analyserNode.getByteFrequencyData(dataArray);

      // Calculate average level
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const averageLevel = sum / dataArray.length / 255; // Normalize to 0-1

      // Emit audio level event
      this.emit('audioLevel', {
        rms: averageLevel,
        timestamp: Date.now()
      });

      // Continue monitoring
      if (this.isInitialized) {
        requestAnimationFrame(updateAudioLevel);
      }
    };

    // Start monitoring
    updateAudioLevel();
  }

  /**
   * Convert Float32Array to PCM16
   */
  private convertToPCM16(inputData: Float32Array): Int16Array {
    const pcm16Data = new Int16Array(inputData.length);
    
    for (let i = 0; i < inputData.length; i++) {
      // Clamp to [-1, 1] range
      const sample = Math.max(-1, Math.min(1, inputData[i]));
      // Convert to 16-bit integer
      pcm16Data[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }
    
    return pcm16Data;
  }

  /**
   * Calculate RMS (Root Mean Square) amplitude
   */
  private calculateRMS(inputData: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < inputData.length; i++) {
      sum += inputData[i] * inputData[i];
    }
    return Math.sqrt(sum / inputData.length);
  }

  /**
   * Start recording audio chunks
   */
  start(): void {
    if (!this.isInitialized) {
      console.warn('Audio processor not initialized');
      return;
    }
    
    this.isRecording = true;
    console.log('🎙️ Started audio recording');
  }

  /**
   * Stop recording audio chunks
   */
  stop(): void {
    this.isRecording = false;
    console.log('🛑 Stopped audio recording');
  }

  /**
   * Get the analyser node for Three.js orb
   */
  getAnalyserNode(): AnalyserNode | null {
    return this.analyserNode;
  }

  /**
   * Get current audio level
   */
  getCurrentAudioLevel(): number {
    if (!this.analyserNode) return 0;

    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }

    return sum / dataArray.length / 255; // Normalize to 0-1
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.isRecording = false;
    this.isInitialized = false;

    // Disconnect audio nodes
    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }

    if (this.analyserNode) {
      this.analyserNode.disconnect();
      this.analyserNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    // Stop media stream
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    // Close audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Remove all listeners
    this.removeAllListeners();

    console.log('🧹 Audio processor disposed');
  }
}

// Create singleton instance
export const audioProcessor = new AudioProcessorService();