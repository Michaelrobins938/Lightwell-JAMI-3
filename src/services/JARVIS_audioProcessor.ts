/**
 * PCM16 Audio Processing Pipeline - ChatGPT Compatible
 * Real-time audio capture, downsampling, and RMS calculation
 * Connects JARVIS orb to ChatGPT's audio processing system
 */

import { EventEmitter } from 'events';

export interface AudioChunk {
  data: Uint8Array;           // PCM16 audio data
  rmsAmplitude: number;       // RMS amplitude (0-1)
  sampleRate: number;         // Sample rate (16kHz)
  channels: number;           // Channel count (1 for mono)
  timestamp: number;          // Timestamp in ms
  format: 'PCM16';
}

export interface AudioConfig {
  // Input configuration
  inputSampleRate: number;    // Usually 48kHz from mic
  targetSampleRate: number;   // 16kHz for ChatGPT
  channels: number;           // 1 for mono
  
  // Processing configuration
  chunkSizeMs: number;        // Chunk duration in milliseconds
  smoothingFactor: number;    // RMS smoothing (0-1)
  silenceThreshold: number;   // Silence threshold for RMS
  
  // Performance configuration
  processingInterval: number; // Processing interval in ms
  bufferSize: number;         // Internal buffer size
}

// Default configuration matching ChatGPT's specifications
const DEFAULT_CONFIG: AudioConfig = {
  inputSampleRate: 48000,      // Standard web audio
  targetSampleRate: 16000,     // ChatGPT requirement
  channels: 1,                 // Mono audio
  chunkSizeMs: 1000,          // 1 second chunks
  smoothingFactor: 0.3,        // Smooth RMS transitions
  silenceThreshold: 0.01,      // Silence threshold
  processingInterval: 16.67,   // ~60fps for orb animation
  bufferSize: 4096            // Audio buffer size
};

/**
 * Audio Worklet Processor for PCM16 downsampling
 * Runs in audio thread for real-time processing
 */
const WORKLET_CODE = `
class PCM16Processor extends AudioWorkletProcessor {
  constructor() {
    super();
    
    this.sampleRate = globalThis.sampleRate || 48000;
    this.targetRate = 16000;
    this.ratio = this.sampleRate / this.targetRate;
    this.channels = 1;
    
    // Downsampling state
    this.inputIndex = 0;
    this.outputBuffer = [];
    this.rmsBuffer = [];
    this.rmsBufferSize = 1024;
    
    // Chunk management
    this.chunkBuffer = [];
    this.chunkSamples = this.targetRate; // 1 second chunks
    this.lastChunkTime = 0;
    
    console.log(\`PCM16Processor: \${this.sampleRate}Hz → \${this.targetRate}Hz\`);
  }
  
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0]) return true;
    
    const inputData = input[0]; // First channel
    const currentTime = currentFrame / this.sampleRate * 1000;
    
    // Process each input sample
    for (let i = 0; i < inputData.length; i++) {
      // Simple downsampling with linear interpolation
      if (this.inputIndex >= this.ratio) {
        const sample = inputData[i];
        
        // Convert to PCM16 range (-32768 to 32767)
        const pcm16Sample = Math.max(-32768, Math.min(32767, Math.round(sample * 32767)));
        this.chunkBuffer.push(pcm16Sample);
        
        // Add to RMS buffer
        this.rmsBuffer.push(Math.abs(sample));
        if (this.rmsBuffer.length > this.rmsBufferSize) {
          this.rmsBuffer.shift();
        }
        
        this.inputIndex -= this.ratio;
        
        // Send chunk when buffer is full
        if (this.chunkBuffer.length >= this.chunkSamples) {
          this.sendAudioChunk(currentTime);
        }
      }
      this.inputIndex += 1;
    }
    
    // Send periodic RMS updates for orb animation
    if (currentTime - this.lastChunkTime > 16.67) { // ~60fps
      this.sendRMSUpdate(currentTime);
      this.lastChunkTime = currentTime;
    }
    
    return true;
  }
  
  sendAudioChunk(timestamp) {
    // Calculate RMS amplitude
    const rmsAmplitude = this.calculateRMS();
    
    // Convert PCM16 samples to Uint8Array (little-endian)
    const audioBytes = new Uint8Array(this.chunkBuffer.length * 2);
    const dataView = new DataView(audioBytes.buffer);
    
    for (let i = 0; i < this.chunkBuffer.length; i++) {
      dataView.setInt16(i * 2, this.chunkBuffer[i], true); // little-endian
    }
    
    // Send complete audio chunk
    this.port.postMessage({
      type: 'audio_chunk',
      data: audioBytes,
      rmsAmplitude: rmsAmplitude,
      sampleRate: this.targetRate,
      channels: this.channels,
      timestamp: timestamp,
      format: 'PCM16'
    });
    
    // Clear buffer for next chunk
    this.chunkBuffer = [];
  }
  
  sendRMSUpdate(timestamp) {
    const rmsAmplitude = this.calculateRMS();
    
    this.port.postMessage({
      type: 'rms_update',
      rmsAmplitude: rmsAmplitude,
      timestamp: timestamp
    });
  }
  
  calculateRMS() {
    if (this.rmsBuffer.length === 0) return 0;
    
    const sum = this.rmsBuffer.reduce((acc, val) => acc + val * val, 0);
    const rms = Math.sqrt(sum / this.rmsBuffer.length);
    
    // Apply silence threshold
    return rms < 0.01 ? 0 : rms;
  }
}

registerProcessor('pcm16-processor', PCM16Processor);
`;

/**
 * Main Audio Processor Class
 * Manages audio capture, processing, and ChatGPT integration
 */
export class AudioProcessor extends EventEmitter {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyserNode: AnalyserNode | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  
  private config: AudioConfig;
  private isProcessing = false;
  private lastRMS = 0;
  private rmsHistory: number[] = [];
  
  // Performance monitoring
  private stats = {
    chunksProcessed: 0,
    totalLatency: 0,
    averageLatency: 0
  };

  constructor(config: Partial<AudioConfig> = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize audio processing pipeline
   */
  async initialize(): Promise<void> {
    try {
      console.log('🎵 Initializing PCM16 audio processor...');
      
      // Request microphone access with optimal settings
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: this.config.channels,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: { ideal: this.config.inputSampleRate }
        }
      });

      // Create audio context with optimal settings
      this.audioContext = new AudioContext({
        latencyHint: 'interactive',
        sampleRate: this.config.inputSampleRate
      });

      // Resume context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create analyser for orb visualization
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.8;

      // Load and create PCM16 worklet
      await this.loadAudioWorklet();

      // Connect audio graph: Source → Analyser → Worklet
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyserNode);
      this.sourceNode.connect(this.workletNode!);

      console.log(`✅ Audio processor initialized`);
      console.log(`🎯 ${this.config.inputSampleRate}Hz → ${this.config.targetSampleRate}Hz PCM16`);
      
      this.emit('initialized', { 
        analyserNode: this.analyserNode,
        audioContext: this.audioContext 
      });

    } catch (error) {
      console.error('❌ Failed to initialize audio processor:', error);
      throw error;
    }
  }

  /**
   * Load PCM16 processing worklet
   */
  private async loadAudioWorklet(): Promise<void> {
    try {
      // Create worklet from inline code
      const workletBlob = new Blob([WORKLET_CODE], { type: 'application/javascript' });
      const workletURL = URL.createObjectURL(workletBlob);
      
      await this.audioContext!.audioWorklet.addModule(workletURL);
      
      // Create worklet node
      this.workletNode = new AudioWorkletNode(this.audioContext!, 'pcm16-processor');
      
      // Handle worklet messages
      this.workletNode.port.onmessage = (event) => {
        this.handleWorkletMessage(event.data);
      };

      // Cleanup URL
      URL.revokeObjectURL(workletURL);
      
      console.log('✅ PCM16 worklet loaded');

    } catch (error) {
      console.error('❌ Failed to load audio worklet:', error);
      throw error;
    }
  }

  /**
   * Handle messages from audio worklet
   */
  private handleWorkletMessage(data: any): void {
    const timestamp = Date.now();

    if (data.type === 'audio_chunk') {
      // Process complete audio chunk for ChatGPT
      const audioChunk: AudioChunk = {
        data: data.data,
        rmsAmplitude: data.rmsAmplitude,
        sampleRate: data.sampleRate,
        channels: data.channels,
        timestamp: timestamp,
        format: 'PCM16'
      };

      this.stats.chunksProcessed++;
      this.emit('audioChunk', audioChunk);
      
      console.log(`🎵 Audio chunk: ${audioChunk.data.byteLength} bytes, RMS: ${audioChunk.rmsAmplitude.toFixed(3)}`);

    } else if (data.type === 'rms_update') {
      // Handle RMS updates for orb animation
      this.updateRMS(data.rmsAmplitude, timestamp);
    }
  }

  /**
   * Update RMS with smoothing for orb animation
   */
  private updateRMS(newRMS: number, timestamp: number): void {
    // Apply smoothing
    this.lastRMS = this.lastRMS * (1 - this.config.smoothingFactor) + 
                   newRMS * this.config.smoothingFactor;

    // Update history for analysis
    this.rmsHistory.push(this.lastRMS);
    if (this.rmsHistory.length > 100) {
      this.rmsHistory.shift();
    }

    // Emit for orb animation
    this.emit('audioLevel', {
      rms: this.lastRMS,
      raw: newRMS,
      timestamp: timestamp
    });
  }

  /**
   * Start audio processing
   */
  start(): void {
    if (!this.audioContext || !this.workletNode) {
      throw new Error('Audio processor not initialized');
    }

    this.isProcessing = true;
    this.emit('started');
    console.log('🎵 Audio processing started');
  }

  /**
   * Stop audio processing
   */
  stop(): void {
    this.isProcessing = false;
    this.emit('stopped');
    console.log('🎵 Audio processing stopped');
  }

  /**
   * Get current audio level for orb animation
   */
  getCurrentAudioLevel(): number {
    return this.lastRMS;
  }

  /**
   * Get analyser node for Three.js orb integration
   */
  getAnalyserNode(): AnalyserNode | null {
    return this.analyserNode;
  }

  /**
   * Get audio context
   */
  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  /**
   * Get processing statistics
   */
  getStats() {
    return {
      ...this.stats,
      isProcessing: this.isProcessing,
      currentRMS: this.lastRMS,
      averageRMS: this.rmsHistory.length > 0 
        ? this.rmsHistory.reduce((a, b) => a + b, 0) / this.rmsHistory.length 
        : 0
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AudioConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔧 Audio config updated:', newConfig);
  }

  /**
   * Cleanup resources
   */
  async destroy(): Promise<void> {
    try {
      this.stop();

      if (this.sourceNode) {
        this.sourceNode.disconnect();
      }

      if (this.workletNode) {
        this.workletNode.disconnect();
      }

      if (this.analyserNode) {
        this.analyserNode.disconnect();
      }

      if (this.audioContext && this.audioContext.state !== 'closed') {
        await this.audioContext.close();
      }

      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
      }

      console.log('🧹 Audio processor destroyed');

    } catch (error) {
      console.error('❌ Error destroying audio processor:', error);
    }
  }
}

// Export singleton instance for easy use
export const audioProcessor = new AudioProcessor();