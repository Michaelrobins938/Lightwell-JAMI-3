/**
 * Audio Playback Service - TTS Response Playback
 * Handles playing audio responses from ChatGPT and feeding audio levels to the orb
 */

import { EventEmitter } from 'events';

export class AudioPlaybackService extends EventEmitter {
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private currentSource: AudioBufferSourceNode | null = null;

  constructor() {
    super();
  }

  /**
   * Initialize audio playback system
   */
  async initialize(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create analyser for orb visualization
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 1024;
      this.analyserNode.smoothingTimeConstant = 0.3;

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 0.8;

      // Connect audio graph: source -> gain -> analyser -> destination
      this.gainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioContext.destination);

      console.log('✅ Audio playback initialized');

    } catch (error) {
      console.error('❌ Failed to initialize audio playback:', error);
      throw error;
    }
  }

  /**
   * Play PCM16 audio data from ChatGPT
   */
  async playAudioChunk(audioData: Uint8Array): Promise<void> {
    if (!this.audioContext || !this.gainNode) {
      console.warn('⚠️ Audio playback not initialized');
      return;
    }

    try {
      // Convert PCM16 to AudioBuffer
      const audioBuffer = await this.pcm16ToAudioBuffer(audioData);
      
      // Create source
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      
      // Connect to audio graph
      source.connect(this.gainNode);
      
      // Set up end event
      source.onended = () => {
        this.isPlaying = false;
        this.currentSource = null;
        this.emit('playbackEnded');
      };

      // Start playback
      this.currentSource = source;
      source.start();
      this.isPlaying = true;

      this.emit('playbackStarted');
      console.log('🔊 Playing audio chunk:', audioData.length, 'bytes');

    } catch (error) {
      console.error('❌ Failed to play audio chunk:', error);
      this.emit('playbackError', error);
    }
  }

  /**
   * Stream multiple audio chunks for continuous playback
   */
  async streamAudioChunks(audioChunks: Uint8Array[]): Promise<void> {
    for (const chunk of audioChunks) {
      await this.playAudioChunk(chunk);
      
      // Wait for current chunk to finish before playing next
      await new Promise<void>((resolve) => {
        if (this.isPlaying) {
          this.once('playbackEnded', resolve);
        } else {
          resolve();
        }
      });
    }
  }

  /**
   * Convert PCM16 data to AudioBuffer
   */
  private async pcm16ToAudioBuffer(pcm16Data: Uint8Array): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    // Convert Uint8Array to Int16Array
    const int16Array = new Int16Array(pcm16Data.buffer, pcm16Data.byteOffset, pcm16Data.byteLength / 2);
    
    // Create AudioBuffer (assuming 16kHz mono)
    const audioBuffer = this.audioContext.createBuffer(1, int16Array.length, 16000);
    const channelData = audioBuffer.getChannelData(0);

    // Convert PCM16 to float32 (-1 to 1 range)
    for (let i = 0; i < int16Array.length; i++) {
      channelData[i] = int16Array[i] / 32768;
    }

    return audioBuffer;
  }

  /**
   * Get analyser node for orb visualization
   */
  getAnalyserNode(): AnalyserNode | null {
    return this.analyserNode;
  }

  /**
   * Get current audio level for orb animation
   */
  getCurrentAudioLevel(): number {
    if (!this.analyserNode || !this.isPlaying) return 0;

    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }

    return sum / dataArray.length / 255; // Normalize to 0-1
  }

  /**
   * Set playback volume
   */
  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Stop current playback
   */
  stop(): void {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource = null;
    }
    this.isPlaying = false;
  }

  /**
   * Check if audio is currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.stop();

    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }

    if (this.analyserNode) {
      this.analyserNode.disconnect();
      this.analyserNode = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.removeAllListeners();
    console.log('🧹 Audio playback disposed');
  }
}

// Create singleton instance
export const audioPlayback = new AudioPlaybackService();