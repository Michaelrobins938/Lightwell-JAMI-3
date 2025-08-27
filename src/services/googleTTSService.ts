/**
 * Google TTS Service - Extracted from ChatGPT Resources
 * Provides 19 voice configurations with multi-language support
 */

export interface GoogleTTSVoice {
  eventTypes: string[];
  gender: 'male' | 'female';
  lang: string;
  voiceName: string;
  remote: boolean;
}

export interface VoicePersonality {
  id: string;
  name: string;
  description: string;
  personality: string;
  lang: string;
  gender: 'male' | 'female';
}

// Google TTS Voice Configurations (extracted from ChatGPT resources.pak)
export const GOOGLE_TTS_VOICES: GoogleTTSVoice[] = [
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "en-US",
    voiceName: "Google US English",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "de-DE",
    voiceName: "Google Deutsch",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "en-GB",
    voiceName: "Google UK English Female",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "male",
    lang: "en-GB",
    voiceName: "Google UK English Male",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "es-ES",
    voiceName: "Google español",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "es-US",
    voiceName: "Google español de Estados Unidos",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "fr-FR",
    voiceName: "Google français",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "hi-IN",
    voiceName: "Google हिन्दी",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "id-ID",
    voiceName: "Google Bahasa Indonesia",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "it-IT",
    voiceName: "Google italiano",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "ja-JP",
    voiceName: "Google 日本語",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "ko-KR",
    voiceName: "Google 한국의",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "nl-NL",
    voiceName: "Google Nederlands",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "pl-PL",
    voiceName: "Google polski",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "pt-BR",
    voiceName: "Google português do Brasil",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "ru-RU",
    voiceName: "Google русский",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "zh-CN",
    voiceName: "Google 普通话（中国大陆）",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "zh-HK",
    voiceName: "Google 粤語（香港）",
    remote: true
  },
  {
    eventTypes: ["start", "end", "error"],
    gender: "female",
    lang: "zh-TW",
    voiceName: "Google 國語（臺灣）",
    remote: true
  }
];

// ChatGPT Voice Personalities (inspired by voice mode images)
export const CHATGPT_VOICE_PERSONALITIES: VoicePersonality[] = [
  {
    id: 'vale',
    name: 'Vale',
    description: 'Bright and inquisitive',
    personality: 'Curious and enthusiastic, perfect for creative conversations',
    lang: 'en-US',
    gender: 'female'
  },
  {
    id: 'ember',
    name: 'Ember',
    description: 'Confident and optimistic',
    personality: 'Warm and encouraging, great for motivation and support',
    lang: 'en-US',
    gender: 'female'
  },
  {
    id: 'cove',
    name: 'Cove',
    description: 'Composed and direct',
    personality: 'Clear and focused, ideal for professional discussions',
    lang: 'en-US',
    gender: 'male'
  },
  {
    id: 'spruce',
    name: 'Spruce',
    description: 'Calm and affirming',
    personality: 'Peaceful and reassuring, perfect for therapeutic conversations',
    lang: 'en-US',
    gender: 'male'
  },
  {
    id: 'maple',
    name: 'Maple',
    description: 'Cheerful and candid',
    personality: 'Friendly and authentic, great for casual interactions',
    lang: 'en-US',
    gender: 'female'
  },
  {
    id: 'arbor',
    name: 'Arbor',
    description: 'Easygoing and versatile',
    personality: 'Adaptable and natural, works well for any conversation',
    lang: 'en-US',
    gender: 'male'
  }
];

export class GoogleTTSService {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private currentVoice: VoicePersonality | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices(): void {
    this.voices = this.synthesis.getVoices();
    
    if (this.voices.length === 0) {
      // Wait for voices to load
      this.synthesis.onvoiceschanged = () => {
        this.voices = this.synthesis.getVoices();
      };
    }
  }

  public setVoicePersonality(personalityId: string): boolean {
    const personality = CHATGPT_VOICE_PERSONALITIES.find(p => p.id === personalityId);
    if (personality) {
      this.currentVoice = personality;
      return true;
    }
    return false;
  }

  public getCurrentVoice(): VoicePersonality | null {
    return this.currentVoice;
  }

  public getAvailableVoices(): VoicePersonality[] {
    return CHATGPT_VOICE_PERSONALITIES;
  }

  public speak(text: string, options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: SpeechSynthesisErrorEvent) => void;
  } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.currentVoice) {
        // Default to Ember
        this.setVoicePersonality('ember');
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Find matching system voice
      const systemVoice = this.voices.find(voice => 
        voice.lang.startsWith(this.currentVoice?.lang || 'en-US')
      );
      
      if (systemVoice) {
        utterance.voice = systemVoice;
      }

      // Configure speech parameters
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Set event handlers
      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        options.onError?.(event);
        reject(event);
      };

      // Cancel any ongoing speech
      this.synthesis.cancel();
      
      // Start speaking
      this.synthesis.speak(utterance);
    });
  }

  public stop(): void {
    this.synthesis.cancel();
  }

  public pause(): void {
    this.synthesis.pause();
  }

  public resume(): void {
    this.synthesis.resume();
  }

  public isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  public isPaused(): boolean {
    return this.synthesis.paused;
  }
}

// Singleton instance
export const googleTTSService = new GoogleTTSService();