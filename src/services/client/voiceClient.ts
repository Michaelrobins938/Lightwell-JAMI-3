// Voice Client for Luna AI - OpenAI Realtime Integration
// Handles WebSocket communication with OpenAI Realtime API

import { EventEmitter } from 'events';

export interface VoiceClientConfig {
  serverUrl: string;
  sampleRate: number;
  voice: string;
  model: string;
}

export interface VoiceClientState {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  sessionId: string | null;
  transcript: string;
  responseText: string;
  audioLevel: number;
}

export class VoiceClient extends EventEmitter {
  private socket: WebSocket | null = null;
  private config: VoiceClientConfig;
  private state: VoiceClientState;
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 1000;

  constructor(config: VoiceClientConfig) {
    super();
    this.config = config;
    this.state = {
      isConnected: false,
      isListening: false,
      isSpeaking: false,
      isProcessing: false,
      sessionId: null,
      transcript: '',
      responseText: '',
      audioLevel: 0,
    };
  }

  // Connect to voice service
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.config.serverUrl);

        this.socket.onopen = () => {
          console.log('🔌 Connected to voice service');
          this.state.isConnected = true;
          this.reconnectAttempts = 0;
          this.initializeSession();
          this.emit('connected');
          resolve();
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.socket.onclose = (event) => {
          console.log('❌ Disconnected from voice service:', event.code, event.reason);
          this.state.isConnected = false;
          this.emit('disconnected');
          
          // Attempt reconnection
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
              console.log(`🔄 Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
              this.connect().catch(console.error);
            }, this.reconnectDelay * this.reconnectAttempts);
          }
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.emit('error', error);
          reject(error);
        };

        // Connection timeout
        setTimeout(() => {
          if (!this.state.isConnected) {
            reject(new Error('Voice connection timeout'));
          }
        }, 10000);

      } catch (error) {
        reject(error);
      }
    });
  }

  // Initialize voice session
  private initializeSession(): void {
    if (!this.socket) return;

    const sessionInit = {
      type: 'session_init',
      user_id: 'luna-user',
      model: this.config.model,
      voice: this.config.voice,
      sample_rate: this.config.sampleRate,
    };

    this.socket.send(JSON.stringify(sessionInit));
  }

  // Handle incoming messages
  private handleMessage(event: MessageEvent): void {
    try {
      if (event.data instanceof Blob) {
        // Binary audio data
        this.handleAudioData(event.data);
      } else {
        // JSON message
        const message = JSON.parse(event.data);
        this.handleJsonMessage(message);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  // Handle JSON messages
  private handleJsonMessage(message: any): void {
    console.log('📨 Received message:', message.type);

    switch (message.type) {
      case 'session_ack':
        this.state.sessionId = message.sessionId;
        this.emit('session_ready', message);
        break;

      case 'transcription_delta':
        this.state.transcript += message.delta;
        this.emit('transcription_delta', { delta: message.delta, streaming: true });
        break;

      case 'transcription_completed':
        this.state.transcript = message.text;
        this.state.isProcessing = false;
        this.emit('transcription_completed', { text: message.text, final: true });
        break;

      case 'response_text':
        this.state.responseText += message.text;
        this.emit('response_text', { text: message.text, streaming: true });
        break;

      case 'response_complete':
        this.state.isSpeaking = false;
        this.state.isProcessing = false;
        this.emit('response_complete', message.data);
        break;

      case 'error':
        console.error('Voice service error:', message);
        this.emit('error', message);
        break;

      case 'session_end':
        console.log('Session ended:', message.reason);
        this.emit('session_end', message);
        break;

      default:
        console.log('Unknown message type:', message.type);
        break;
    }
  }

  // Handle binary audio data
  private async handleAudioData(blob: Blob): Promise<void> {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      this.playAudioBuffer(arrayBuffer);
      this.emit('audio_output', arrayBuffer);
    } catch (error) {
      console.error('Error handling audio data:', error);
    }
  }

  // Start recording audio
  async startRecording(): Promise<void> {
    if (!this.state.isConnected) {
      throw new Error('Not connected to voice service');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.config.sampleRate,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      this.audioContext = new AudioContext({
        sampleRate: this.config.sampleRate,
      });

      const source = this.audioContext.createMediaStreamSource(stream);
      const processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (event) => {
        const inputBuffer = event.inputBuffer;
        const inputData = inputBuffer.getChannelData(0);
        
        // Convert to PCM16 and send to server
        const pcm16 = this.floatToPCM16(inputData);
        const base64Audio = this.arrayBufferToBase64(pcm16);
        
        this.sendAudio(base64Audio);
      };

      source.connect(processor);
      processor.connect(this.audioContext.destination);

      this.state.isListening = true;
      this.emit('recording_started');

    } catch (error) {
      console.error('Failed to start recording:', error);
      this.emit('error', { message: 'Failed to start recording', error });
      throw error;
    }
  }

  // Stop recording audio
  stopRecording(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.state.isListening = false;
    this.emit('recording_stopped');

    // Commit the audio buffer
    this.commitAudio();
  }

  // Send audio chunk to server
  private sendAudio(base64Audio: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    const audioInput = {
      type: 'audio_input',
      audio: base64Audio,
    };

    this.socket.send(JSON.stringify(audioInput));
  }

  // Commit audio buffer
  private commitAudio(): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    const audioCommit = {
      type: 'audio_commit',
    };

    this.socket.send(JSON.stringify(audioCommit));
    this.state.isProcessing = true;
  }

  // Create response with instructions
  createResponse(instructions: string, modalities: ('text' | 'audio')[] = ['text', 'audio']): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('Not connected to voice service');
    }

    const responseCreate = {
      type: 'response_create',
      instructions,
      modalities,
    };

    this.socket.send(JSON.stringify(responseCreate));
    this.state.isSpeaking = true;
  }

  // Play audio buffer
  private async playAudioBuffer(arrayBuffer: ArrayBuffer): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  // Convert float32 audio to PCM16
  private floatToPCM16(float32Array: Float32Array): ArrayBuffer {
    const pcm16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const sample = Math.max(-1, Math.min(1, float32Array[i]));
      pcm16Array[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }
    return pcm16Array.buffer;
  }

  // Convert ArrayBuffer to base64
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Disconnect from voice service
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.state = {
      isConnected: false,
      isListening: false,
      isSpeaking: false,
      isProcessing: false,
      sessionId: null,
      transcript: '',
      responseText: '',
      audioLevel: 0,
    };

    this.emit('disconnected');
  }

  // Get current state
  getState(): VoiceClientState {
    return { ...this.state };
  }

  // Check if connected
  get connected(): boolean {
    return this.state.isConnected;
  }

  // Get session ID
  get sessionId(): string | null {
    return this.state.sessionId;
  }
}