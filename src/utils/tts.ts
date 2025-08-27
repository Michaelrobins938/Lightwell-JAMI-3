// TTS Utility - Web Speech API fallback and utility functions
// Can be used alongside your existing speakWithCartesia function

export interface TTSOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
}

export interface TTSState {
  isSpeaking: boolean;
  isPaused: boolean;
  currentText: string;
}

class TTSService {
  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private state: TTSState = {
    isSpeaking: false,
    isPaused: false,
    currentText: ''
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.setupEventListeners();
    }
  }

  private setupEventListeners() {
    // Event listeners are attached to individual SpeechSynthesisUtterance objects
    // in the speak() method, not to the SpeechSynthesis interface
  }

  /**
   * Speak text using Web Speech API
   */
  speak(text: string, options: TTSOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Stop any current speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set options
      utterance.lang = options.lang || 'en-US';
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      // Set voice if specified
      if (options.voice) {
        const voices = this.synthesis.getVoices();
        const selectedVoice = voices.find(v => v.name === options.voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      // Event handlers
      utterance.onstart = () => {
        this.state.isSpeaking = true;
        this.state.isPaused = false;
      };
      utterance.onend = () => {
        this.state.isSpeaking = false;
        this.state.isPaused = false;
        this.state.currentText = '';
        this.currentUtterance = null;
        resolve();
      };
      utterance.onpause = () => {
        this.state.isPaused = true;
      };
      utterance.onresume = () => {
        this.state.isPaused = false;
      };
      utterance.onerror = (event) => {
        this.state.isSpeaking = false;
        this.state.isPaused = false;
        this.state.currentText = '';
        this.currentUtterance = null;
        reject(new Error(event.error));
      };

      // Store current utterance and speak
      this.currentUtterance = utterance;
      this.state.currentText = text;
      this.synthesis.speak(utterance);
    });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    this.state.isSpeaking = false;
    this.state.isPaused = false;
    this.state.currentText = '';
    this.currentUtterance = null;
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.synthesis && this.state.isSpeaking) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synthesis && this.state.isPaused) {
      this.synthesis.resume();
    }
  }

  /**
   * Get current TTS state
   */
  getState(): TTSState {
    return { ...this.state };
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  /**
   * Check if TTS is supported
   */
  isSupported(): boolean {
    return !!this.synthesis;
  }
}

// Create singleton instance
const ttsService = new TTSService();

// Export utility functions
export const speak = (text: string, options?: TTSOptions) => ttsService.speak(text, options);
export const stopTTS = () => ttsService.stop();
export const pauseTTS = () => ttsService.pause();
export const resumeTTS = () => ttsService.resume();
export const getTTSState = () => ttsService.getState();
export const getTTSVoices = () => ttsService.getVoices();
export const isTTSSupported = () => ttsService.isSupported();

// Export the service instance
export default ttsService;
