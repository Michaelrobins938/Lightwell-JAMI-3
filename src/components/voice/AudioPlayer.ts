// src/components/AudioPlayer.ts

/**
 * AudioPlayer
 * ----------
 * Centralized audio playback manager for voice mode.
 * - Plays streaming audio chunks from OpenAI.
 * - Cleans up on stop/close to prevent duplicate voices.
 * - Exposes start/stop functions to useVoiceSession.ts.
 */

class AudioPlayer {
  private static instance: AudioPlayer;
  private audioContext: AudioContext | null = null;
  private sourceNodes: AudioBufferSourceNode[] = [];
  private gainNode: GainNode | null = null;

  private constructor() {}

  public static getInstance(): AudioPlayer {
    if (!AudioPlayer.instance) {
      AudioPlayer.instance = new AudioPlayer();
    }
    return AudioPlayer.instance;
  }

  private ensureContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      console.log("🎵 AudioContext initialized");
    }
  }

  public async playAudioChunk(arrayBuffer: ArrayBuffer) {
    this.ensureContext();

    if (!this.audioContext) return;

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.gainNode!);
      source.start();

      // Track this source so we can stop it later
      this.sourceNodes.push(source);

      // Clean up when finished
      source.onended = () => {
        this.sourceNodes = this.sourceNodes.filter((n) => n !== source);
      };
    } catch (err) {
      console.error("🎵 Failed to play audio chunk:", err);
    }
  }

  public stopAll() {
    console.log("🎵 Stopping all audio playback and cleaning up elements...");

    this.sourceNodes.forEach((src) => {
      try {
        src.stop();
      } catch {}
    });
    this.sourceNodes = [];

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {}
      this.gainNode = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
    }

    console.log("🎵 All audio cleaned up successfully");
  }
}

export default AudioPlayer.getInstance();