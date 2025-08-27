interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

interface VoiceResponse {
  audio: ArrayBuffer;
  audioLevel: number;
  duration: number;
}

class ElevenLabsService {
  private config: ElevenLabsConfig;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private isPlaying = false;

  constructor(config: ElevenLabsConfig) {
    this.config = {
      modelId: 'eleven_monolingual_v1',
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.0,
      useSpeakerBoost: true,
      ...config
    };
  }

  async initializeAudioContext(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.connect(this.audioContext.destination);
    }
  }

  async synthesizeSpeech(text: string): Promise<VoiceResponse> {
    if (!this.config.apiKey) {
      throw new Error('ElevenLabs API key is required');
    }

    await this.initializeAudioContext();

    const requestBody = {
      text,
      model_id: this.config.modelId,
      voice_settings: {
        stability: this.config.stability,
        similarity_boost: this.config.similarityBoost,
        style: this.config.style,
        use_speaker_boost: this.config.useSpeakerBoost
      }
    };

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${this.config.voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.config.apiKey
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      
      // Create audio source and connect to analyser
      if (this.audioContext && this.analyser) {
        const audioSource = this.audioContext.createBufferSource();
        const audioBufferNode = await this.audioContext.decodeAudioData(audioBuffer);
        
        audioSource.buffer = audioBufferNode;
        audioSource.connect(this.analyser);
        
        // Calculate average audio level
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        const audioLevel = average / 256;

        return {
          audio: audioBuffer,
          audioLevel,
          duration: audioBufferNode.duration
        };
      }

      return {
        audio: audioBuffer,
        audioLevel: 0.5,
        duration: 0
      };

    } catch (error) {
      console.error('ElevenLabs synthesis error:', error);
      throw error;
    }
  }

  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    if (!this.audioContext) {
      await this.initializeAudioContext();
    }

    try {
      const decodedBuffer = await this.audioContext!.decodeAudioData(audioBuffer);
      const source = this.audioContext!.createBufferSource();
      source.buffer = decodedBuffer;
      
      if (this.analyser) {
        source.connect(this.analyser);
      }
      
      this.isPlaying = true;
      source.onended = () => {
        this.isPlaying = false;
      };
      
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
      this.isPlaying = false;
    }
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  isAudioPlaying(): boolean {
    return this.isPlaying;
  }

  async stopAudio(): Promise<void> {
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
      this.analyser = null;
      this.isPlaying = false;
    }
  }

  // Get available voices from ElevenLabs
  async getVoices(): Promise<any[]> {
    if (!this.config.apiKey) {
      throw new Error('ElevenLabs API key is required');
    }

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': this.config.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<ElevenLabsConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Default Jamie voice configuration
const defaultJamieVoice = {
  apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || 'sk_23270c44e87f14b501355572bd9d73a88fed51f59a3bb702',
  voiceId: 'RILOU7YmBhvwJGDGjNmP', // Updated with provided voice ID
  stability: 0.5,
  similarityBoost: 0.75,
  style: 0.0,
  useSpeakerBoost: true
};

export const elevenLabsService = new ElevenLabsService(defaultJamieVoice);
export type { ElevenLabsConfig, VoiceResponse }; 