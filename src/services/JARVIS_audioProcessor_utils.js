/**
 * 🎵 AUDIO PROCESSOR UTILITY
 * Handles audio analysis, processing, and visualization data
 */

export class AudioProcessor {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.bufferLength = 0;
        this.isInitialized = false;
        this.sampleRate = 44100;
        this.fftSize = 2048;
        
        // Audio processing settings
        this.smoothing = 0.8;
        this.minDecibels = -90;
        this.maxDecibels = -10;
        
        // Visualization data
        this.frequencyData = new Uint8Array();
        this.timeDomainData = new Uint8Array();
        this.audioLevel = 0;
        this.isAudioActive = false;
        
        // Callbacks
        this.onAudioData = null;
        this.onAudioLevelChange = null;
        this.onFrequencyChange = null;
    }

    /**
     * Initialize audio processor
     */
    async initialize() {
        try {
            console.log('🎵 Initializing AudioProcessor...');
            
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create analyser node
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.fftSize;
            this.analyser.smoothingTimeConstant = this.smoothing;
            this.analyser.minDecibels = this.minDecibels;
            this.analyser.maxDecibels = this.maxDecibels;
            
            // Set up data arrays
            this.bufferLength = this.analyser.frequencyBinCount;
            this.frequencyData = new Uint8Array(this.bufferLength);
            this.timeDomainData = new Uint8Array(this.bufferLength);
            
            this.isInitialized = true;
            console.log('✅ AudioProcessor initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize AudioProcessor:', error);
            throw error;
        }
    }

    /**
     * Connect audio source to processor
     */
    connectAudioSource(stream) {
        if (!this.isInitialized || !this.analyser) {
            throw new Error('AudioProcessor not initialized');
        }

        try {
            // Create source from stream
            const source = this.audioContext.createMediaStreamSource(stream);
            
            // Connect source to analyser
            source.connect(this.analyser);
            
            // Start audio processing
            this.startAudioProcessing();
            
            console.log('🎤 Audio source connected successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to connect audio source:', error);
            throw error;
        }
    }

    /**
     * Start audio processing loop
     */
    startAudioProcessing() {
        if (!this.isInitialized || !this.analyser) {
            return;
        }

        const processAudio = () => {
            // Get frequency data
            this.analyser.getByteFrequencyData(this.frequencyData);
            
            // Get time domain data
            this.analyser.getByteTimeDomainData(this.timeDomainData);
            
            // Calculate audio level
            this.calculateAudioLevel();
            
            // Check if audio is active
            this.checkAudioActivity();
            
            // Call callbacks
            if (this.onAudioData) {
                this.onAudioData({
                    frequency: this.frequencyData,
                    timeDomain: this.timeDomainData,
                    level: this.audioLevel,
                    isActive: this.isAudioActive
                });
            }
            
            // Continue processing
            requestAnimationFrame(processAudio);
        };

        processAudio();
    }

    /**
     * Calculate overall audio level
     */
    calculateAudioLevel() {
        if (!this.frequencyData || this.frequencyData.length === 0) {
            this.audioLevel = 0;
            return;
        }

        // Calculate RMS (Root Mean Square) of frequency data
        let sum = 0;
        for (let i = 0; i < this.frequencyData.length; i++) {
            sum += (this.frequencyData[i] / 255) ** 2;
        }
        
        const rms = Math.sqrt(sum / this.frequencyData.length);
        this.audioLevel = rms;
        
        // Call level change callback
        if (this.onAudioLevelChange) {
            this.onAudioLevelChange(this.audioLevel);
        }
    }

    /**
     * Check if audio is active (above threshold)
     */
    checkAudioActivity() {
        const threshold = 0.01; // Adjustable threshold
        const wasActive = this.isAudioActive;
        this.isAudioActive = this.audioLevel > threshold;
        
        // Call frequency change callback if activity changed
        if (wasActive !== this.isAudioActive && this.onFrequencyChange) {
            this.onFrequencyChange(this.isAudioActive);
        }
    }

    /**
     * Get frequency data for visualization
     */
    getFrequencyData() {
        if (!this.frequencyData) {
            return new Uint8Array();
        }
        
        // Return a copy to prevent external modification
        return new Uint8Array(this.frequencyData);
    }

    /**
     * Get time domain data for visualization
     */
    getTimeDomainData() {
        if (!this.timeDomainData) {
            return new Uint8Array();
        }
        
        // Return a copy to prevent external modification
        return new Uint8Array(this.timeDomainData);
    }

    /**
     * Get current audio level (0-1)
     */
    getAudioLevel() {
        return this.audioLevel;
    }

    /**
     * Check if audio is currently active
     */
    isAudioCurrentlyActive() {
        return this.isAudioActive;
    }

    /**
     * Get dominant frequency
     */
    getDominantFrequency() {
        if (!this.frequencyData || this.frequencyData.length === 0) {
            return 0;
        }

        let maxIndex = 0;
        let maxValue = 0;

        for (let i = 0; i < this.frequencyData.length; i++) {
            if (this.frequencyData[i] > maxValue) {
                maxValue = this.frequencyData[i];
                maxIndex = i;
            }
        }

        // Convert index to frequency
        const frequency = (maxIndex * this.audioContext.sampleRate) / this.fftSize;
        return frequency;
    }

    /**
     * Get frequency bands for visualization
     */
    getFrequencyBands(numBands = 8) {
        if (!this.frequencyData || this.frequencyData.length === 0) {
            return new Array(numBands).fill(0);
        }

        const bands = [];
        const samplesPerBand = Math.floor(this.frequencyData.length / numBands);

        for (let i = 0; i < numBands; i++) {
            const startIndex = i * samplesPerBand;
            const endIndex = startIndex + samplesPerBand;
            
            let sum = 0;
            for (let j = startIndex; j < endIndex; j++) {
                sum += this.frequencyData[j];
            }
            
            const average = sum / samplesPerBand;
            bands.push(average / 255); // Normalize to 0-1
        }

        return bands;
    }

    /**
     * Get audio statistics
     */
    getAudioStats() {
        if (!this.frequencyData || this.frequencyData.length === 0) {
            return {
                average: 0,
                peak: 0,
                variance: 0,
                dominantFreq: 0
            };
        }

        const values = Array.from(this.frequencyData).map(v => v / 255);
        const average = values.reduce((a, b) => a + b, 0) / values.length;
        const peak = Math.max(...values);
        
        const variance = values.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / values.length;
        const dominantFreq = this.getDominantFrequency();

        return {
            average,
            peak,
            variance,
            dominantFreq
        };
    }

    /**
     * Set audio processing settings
     */
    updateSettings(settings) {
        if (!this.analyser) return;

        if (settings.fftSize) {
            this.fftSize = settings.fftSize;
            this.analyser.fftSize = this.fftSize;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.frequencyData = new Uint8Array(this.bufferLength);
            this.timeDomainData = new Uint8Array(this.bufferLength);
        }

        if (settings.smoothing !== undefined) {
            this.smoothing = settings.smoothing;
            this.analyser.smoothingTimeConstant = this.smoothing;
        }

        if (settings.minDecibels !== undefined) {
            this.minDecibels = settings.minDecibels;
            this.analyser.minDecibels = this.minDecibels;
        }

        if (settings.maxDecibels !== undefined) {
            this.maxDecibels = settings.maxDecibels;
            this.analyser.maxDecibels = this.maxDecibels;
        }
    }

    /**
     * Set callbacks
     */
    setCallbacks(callbacks) {
        if (callbacks.onAudioData) {
            this.onAudioData = callbacks.onAudioData;
        }
        
        if (callbacks.onAudioLevelChange) {
            this.onAudioLevelChange = callbacks.onAudioLevelChange;
        }
        
        if (callbacks.onFrequencyChange) {
            this.onFrequencyChange = callbacks.onFrequencyChange;
        }
    }

    /**
     * Pause audio processing
     */
    pause() {
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
    }

    /**
     * Resume audio processing
     */
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    /**
     * Stop audio processing
     */
    stop() {
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.isInitialized = false;
        this.audioLevel = 0;
        this.isAudioActive = false;
    }

    /**
     * Cleanup resources
     */
    destroy() {
        console.log('🧹 Cleaning up AudioProcessor...');
        
        this.stop();
        
        // Clear callbacks
        this.onAudioData = null;
        this.onAudioLevelChange = null;
        this.onFrequencyChange = null;
        
        // Clear data arrays
        this.frequencyData = null;
        this.timeDomainData = null;
        
        console.log('✅ AudioProcessor cleaned up');
    }
}



