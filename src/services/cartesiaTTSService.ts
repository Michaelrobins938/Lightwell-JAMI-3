export interface CartesiaTTSRequest {
  transcript: string;
  voiceId?: string;
  modelId?: string;
  outputFormat?: {
    container: 'wav' | 'mp3';
    encoding: 'pcm_f32le' | 'pcm_s16le' | 'mp3';
    sample_rate: number;
  };
  language?: string;
}

export interface CartesiaTTSResponse {
  audio: ArrayBuffer;
  contentType: string;
}

export class CartesiaTTSService {
  private apiKey: string;
  private baseUrl: string;
  private isServer: boolean;

  constructor() {
    this.apiKey = process.env.CARTESIA_API_KEY || 'sk_car_XeHPtbq4FA4E63DPzQNcXX';
    this.baseUrl = 'https://api.cartesia.ai/tts/bytes';
    this.isServer = typeof window === 'undefined';
  }

  async synthesizeSpeech(
    text: string,
    voiceId: string = 'bf0a246a-8642-498a-9950-80c35e9276b5', // Sophie voice
    options: Partial<CartesiaTTSRequest> = {}
  ): Promise<CartesiaTTSResponse> {
    try {
      console.log('🔑 Cartesia service check:', {
        hasApiKey: !!this.apiKey,
        apiKeyLength: this.apiKey?.length || 0,
        isServer: this.isServer,
        baseUrl: this.baseUrl
      });

      if (!this.apiKey) {
        throw new Error('Cartesia API key not configured. Please set CARTESIA_API_KEY environment variable.');
      }

      if (!this.isServer) {
        throw new Error('Cartesia TTS service is only available on the server side');
      }

      const requestBody = {
        model_id: options.modelId || 'sonic-2',
        transcript: text,
        voice: {
          mode: 'id',
          id: voiceId
        },
        output_format: {
          container: 'wav',
          encoding: 'pcm_s16le', // Changed from pcm_f32le for faster processing
          sample_rate: 22050,    // Reduced from 44100 for faster generation
          ...options.outputFormat
        },
        language: options.language || 'en'
      };

      console.log('🔊 Cartesia TTS request:', { 
        text: text.substring(0, 50) + '...', 
        voiceId,
        modelId: requestBody.model_id,
        outputFormat: requestBody.output_format
      });

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Cartesia-Version': '2025-08-20',
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('🔊 Cartesia API response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Cartesia API error:', response.status, errorText);
        throw new Error(`Cartesia API request failed: ${response.status} - ${errorText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      console.log('✅ Cartesia TTS success:', { audioSize: audioBuffer.byteLength });

      return {
        audio: audioBuffer,
        contentType: response.headers.get('content-type') || 'audio/wav'
      };
    } catch (error) {
      console.error('❌ Cartesia TTS error:', error);
      throw new Error(`Cartesia TTS error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Streaming TTS for faster perceived performance
  async synthesizeSpeechStreaming(
    text: string,
    voiceId: string = 'bf0a246a-8642-498a-9950-80c35e9276b5',
    onChunk: (audioChunk: ArrayBuffer) => void,
    options: Partial<CartesiaTTSRequest> = {}
  ): Promise<void> {
    try {
      console.log('🔊 Starting streaming Cartesia TTS for:', text.substring(0, 50) + '...');
      
      if (!this.apiKey) {
        throw new Error('Cartesia API key not configured. Please set CARTESIA_API_KEY environment variable.');
      }

      if (!this.isServer) {
        throw new Error('Cartesia TTS service is only available on the server side');
      }

      const requestBody = {
        model_id: options.modelId || 'sonic-2',
        transcript: text,
        voice: {
          mode: 'id',
          id: voiceId
        },
        output_format: {
          container: 'wav',
          encoding: 'pcm_s16le',
          sample_rate: 22050,
          ...options.outputFormat
        },
        language: options.language || 'en',
        streaming: true // Enable streaming if supported
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Cartesia-Version': '2025-08-20',
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cartesia API request failed: ${response.status} - ${errorText}`);
      }

      // For now, fall back to regular synthesis but with optimizations
      const audioBuffer = await response.arrayBuffer();
      onChunk(audioBuffer);
      
    } catch (error) {
      console.error('❌ Streaming Cartesia TTS error:', error);
      throw error;
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      if (!this.apiKey) {
        return false;
      }

      if (!this.isServer) {
        return false;
      }

      // Test the API key with a minimal request
      await this.synthesizeSpeech('test', undefined, {
        outputFormat: { container: 'wav', encoding: 'pcm_f32le', sample_rate: 22050 }
      });

      return true;
    } catch (error) {
      console.error('Cartesia API key validation failed:', error);
      return false;
    }
  }

  // Get available voice options (you can expand this with more voices)
  getAvailableVoices() {
    return [
      {
        id: 'bf0a246a-8642-498a-9950-80c35e9276b5',
        name: 'Sophie',
        description: 'Sophie voice - Selected therapeutic voice for Jamie AI'
      }
    ];
  }

  // Client-side safe method to check if service is available
  isAvailable(): boolean {
    return this.isServer && this.apiKey !== '';
  }
}

// Export a singleton instance
export const cartesiaTTSService = new CartesiaTTSService();