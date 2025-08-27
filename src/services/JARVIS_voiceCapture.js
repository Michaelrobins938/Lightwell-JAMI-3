/**
 * Voice Capture Service for JARVIS
 * Implements ChatGPT Desktop Protocol voice mode with PCM16 streaming
 * Based on GPT-5 specifications and audio worklet processing
 */

const { EventEmitter } = require('events');

class VoiceCaptureService extends EventEmitter {
    constructor() {
        super();
        
        // Audio configuration matching ChatGPT specs
        this.config = {
            sampleRate: 16000,     // 16kHz target
            channels: 1,           // Mono
            format: 'PCM16',       // 16-bit PCM
            chunkSizeMs: 30,       // 30ms chunks (480 samples)
            maxLatency: 150,       // 150ms max latency
            jitterBuffer: 80       // 80ms jitter buffer
        };
        
        // Audio processing state
        this.audioContext = null;
        this.mediaStream = null;
        this.workletNode = null;
        this.isCapturing = false;
        this.sessionId = null;
        
        // RMS tracking for orb visualization
        this.currentRMS = 0;
        this.rmsHistory = [];
        this.maxRMSHistory = 60; // 2 seconds at 30ms chunks
        
        // Audio metrics
        this.metrics = {
            chunksProcessed: 0,
            totalBytes: 0,
            averageRMS: 0,
            peakRMS: 0,
            droppedChunks: 0
        };
    }

    /**
     * Initialize audio capture with microphone permissions
     */
    async initializeCapture() {
        try {
            console.log('🎤 Initializing voice capture for ChatGPT Desktop Protocol...');
            
            // Request microphone access with optimal settings
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: { ideal: 48000 }, // Let browser use native rate
                    latency: { ideal: 0.01 }      // Low latency
                }
            });

            // Create AudioContext with optimal settings
            this.audioContext = new AudioContext({
                latencyHint: 'interactive',
                sampleRate: this.mediaStream.getAudioTracks()[0].getSettings().sampleRate
            });

            console.log(`🎵 Audio context: ${this.audioContext.sampleRate}Hz → ${this.config.sampleRate}Hz`);
            
            // Load the downsampling worklet
            await this.audioContext.audioWorklet.addModule('/downsample-worklet.js');
            
            console.log('✅ Voice capture initialized successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize voice capture:', error);
            throw error;
        }
    }

    /**
     * Start capturing audio and streaming PCM16 chunks
     */
    async startCapture(sessionId) {
        if (this.isCapturing) {
            console.log('⚠️ Voice capture already active');
            return;
        }

        try {
            this.sessionId = sessionId;
            
            // Create audio worklet node for downsampling
            this.workletNode = new AudioWorkletNode(this.audioContext, 'downsample-16k');
            
            // Set up worklet message handling
            this.workletNode.port.onmessage = (event) => {
                this.handleAudioChunk(event.data);
            };
            
            // Connect audio pipeline
            const source = this.audioContext.createMediaStreamSource(this.mediaStream);
            source.connect(this.workletNode);
            
            this.isCapturing = true;
            
            console.log(`🎤 Started voice capture for session: ${sessionId}`);
            this.emit('captureStarted', { sessionId, config: this.config });
            
        } catch (error) {
            console.error('❌ Failed to start voice capture:', error);
            throw error;
        }
    }

    /**
     * Stop audio capture
     */
    async stopCapture() {
        if (!this.isCapturing) {
            return;
        }

        try {
            this.isCapturing = false;
            
            // Disconnect audio nodes
            if (this.workletNode) {
                this.workletNode.disconnect();
                this.workletNode = null;
            }
            
            // Stop media stream
            if (this.mediaStream) {
                this.mediaStream.getTracks().forEach(track => track.stop());
            }
            
            // Close audio context
            if (this.audioContext && this.audioContext.state !== 'closed') {
                await this.audioContext.close();
                this.audioContext = null;
            }
            
            console.log('🛑 Voice capture stopped');
            this.emit('captureStopped', { 
                sessionId: this.sessionId,
                metrics: this.metrics 
            });
            
            this.sessionId = null;
            
        } catch (error) {
            console.error('❌ Error stopping voice capture:', error);
        }
    }

    /**
     * Handle audio chunk from worklet
     */
    handleAudioChunk(chunkData) {
        if (!this.isCapturing) {
            return;
        }

        try {
            const { data, rmsAmplitude, timestamp } = chunkData;
            
            // Update RMS tracking
            this.updateRMSTracking(rmsAmplitude);
            
            // Update metrics
            this.metrics.chunksProcessed++;
            this.metrics.totalBytes += data.byteLength;
            
            // Create audio chunk for CDP protocol
            const audioChunk = {
                sessionId: this.sessionId,
                audioData: data,
                format: this.config.format,
                sampleRate: this.config.sampleRate,
                channels: this.config.channels,
                timestamp: timestamp,
                rmsAmplitude: rmsAmplitude,
                chunkIndex: this.metrics.chunksProcessed
            };
            
            // Emit for processing
            this.emit('audioChunk', audioChunk);
            
            // Emit RMS for orb visualization
            this.emit('rmsUpdate', {
                current: rmsAmplitude,
                average: this.metrics.averageRMS,
                peak: this.metrics.peakRMS
            });
            
        } catch (error) {
            console.error('❌ Error handling audio chunk:', error);
            this.metrics.droppedChunks++;
        }
    }

    /**
     * Update RMS tracking for orb visualization
     */
    updateRMSTracking(rms) {
        this.currentRMS = rms;
        this.rmsHistory.push(rms);
        
        // Keep history window
        if (this.rmsHistory.length > this.maxRMSHistory) {
            this.rmsHistory.shift();
        }
        
        // Update metrics
        this.metrics.peakRMS = Math.max(this.metrics.peakRMS, rms);
        this.metrics.averageRMS = this.rmsHistory.reduce((sum, val) => sum + val, 0) / this.rmsHistory.length;
    }

    /**
     * Get current audio metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            currentRMS: this.currentRMS,
            isCapturing: this.isCapturing,
            sessionId: this.sessionId,
            config: this.config
        };
    }

    /**
     * Get RMS amplitude for orb visualization
     */
    getCurrentRMS() {
        return this.currentRMS;
    }

    /**
     * Check if currently capturing
     */
    isActive() {
        return this.isCapturing;
    }

    /**
     * Utility: Convert PCM16 to Float32 (for testing)
     */
    static pcm16ToFloat32(buffer) {
        const int16Array = new Int16Array(buffer);
        const float32Array = new Float32Array(int16Array.length);
        
        for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768.0;
        }
        
        return float32Array;
    }

    /**
     * Utility: Calculate RMS from PCM16 buffer
     */
    static rmsFromPCM16(buffer) {
        const samples = new Int16Array(buffer);
        let sum = 0;
        
        for (let i = 0; i < samples.length; i++) {
            const normalized = samples[i] / 32768.0;
            sum += normalized * normalized;
        }
        
        const rms = Math.sqrt(sum / Math.max(1, samples.length));
        return Math.min(1.0, rms / 0.25); // Normalize to 0-1
    }

    /**
     * Cleanup resources
     */
    async destroy() {
        await this.stopCapture();
        this.removeAllListeners();
        
        console.log('🗑️ Voice capture service destroyed');
    }
}

module.exports = VoiceCaptureService;