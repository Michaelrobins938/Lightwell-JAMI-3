// Battle-tested audio analysis service for orb visuals
// Implements envelope follower, spectral analysis, and onset detection

export interface AudioAnalysisData {
  // Main signals
  envelope: number;          // 0-1, smoothed RMS/peak amplitude
  lowMid: number;           // 0-1, 150-500Hz energy (body/warmth)
  high: number;             // 0-1, 3-8kHz energy (sibilants/clarity)
  spectralCentroid: number; // 0-1, normalized frequency center of mass
  
  // Onset detection
  syllableOnset: boolean;   // Short burst for syllables
  wordBoundary: boolean;    // Stronger burst for word boundaries
  spectralFlux: number;     // Raw flux value for debugging
  
  // State
  isSilent: boolean;        // True if envelope < threshold for >300ms
  rawLevel: number;         // Raw RMS before envelope follower
}

export interface AudioAnalysisConfig {
  fftSize: number;          // 1024-4096, higher = better freq resolution
  smoothing: number;        // 0-1, analyser smoothing
  attackTime: number;       // seconds, envelope attack
  releaseTime: number;      // seconds, envelope release
  silenceThreshold: number; // 0-1, below this = silence
  silenceTimeout: number;   // ms, silence detection timeout
  onsetThreshold: number;   // 0-1, spectral flux threshold for syllables
  onsetCooldown: number;    // ms, minimum time between onsets
}

const DEFAULT_CONFIG: AudioAnalysisConfig = {
  fftSize: 2048,
  smoothing: 0.6,
  attackTime: 0.03,     // 30ms attack
  releaseTime: 0.12,    // 120ms release
  silenceThreshold: 0.02,
  silenceTimeout: 300,   // 300ms
  onsetThreshold: 0.12,  // Tune per voice
  onsetCooldown: 100     // 100ms cooldown
};

export class AudioAnalysisService {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private config: AudioAnalysisConfig;
  
  // Buffers
  private timeDomainData: Float32Array;
  private frequencyData: Uint8Array;
  private prevFrequencyData: Float32Array;
  
  // Envelope follower
  private envelope = 0;
  private attackCoeff: number;
  private releaseCoeff: number;
  
  // Onset detection
  private lastOnsetTime = 0;
  private silenceStartTime = 0;
  private isSilent = false;
  
  // Cached analysis result
  private lastAnalysis: AudioAnalysisData;
  
  constructor(audioContext: AudioContext, config: Partial<AudioAnalysisConfig> = {}) {
    this.audioContext = audioContext;
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Create analyser
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = this.config.fftSize;
    this.analyser.smoothingTimeConstant = this.config.smoothing;
    
    // Initialize buffers
    this.timeDomainData = new Float32Array(this.analyser.fftSize);
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.prevFrequencyData = new Float32Array(this.analyser.frequencyBinCount);
    
    // Calculate envelope follower coefficients
    const sampleRate = audioContext.sampleRate;
    this.attackCoeff = Math.exp(-1 / (this.config.attackTime * sampleRate));
    this.releaseCoeff = Math.exp(-1 / (this.config.releaseTime * sampleRate));
    
    // Initialize analysis
    this.lastAnalysis = {
      envelope: 0,
      lowMid: 0,
      high: 0,
      spectralCentroid: 0,
      syllableOnset: false,
      wordBoundary: false,
      spectralFlux: 0,
      isSilent: true,
      rawLevel: 0
    };
  }
  
  /**
   * Connect an audio source to the analyser
   */
  connectSource(source: AudioNode): void {
    source.connect(this.analyser);
  }
  
  /**
   * Get the analyser node for manual connection
   */
  getAnalyser(): AnalyserNode {
    return this.analyser;
  }
  
  /**
   * Calculate RMS (Root Mean Square) of time domain data
   */
  private calculateRMS(buffer: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    return Math.sqrt(sum / buffer.length);
  }
  
  /**
   * Calculate energy in a frequency band
   */
  private calculateBandEnergy(frequencyData: Uint8Array, minHz: number, maxHz: number): number {
    const nyquist = this.audioContext.sampleRate / 2;
    const binCount = frequencyData.length;
    
    const minBin = Math.floor((minHz / nyquist) * binCount);
    const maxBin = Math.min(binCount - 1, Math.ceil((maxHz / nyquist) * binCount));
    
    let sum = 0;
    for (let i = minBin; i <= maxBin; i++) {
      sum += frequencyData[i];
    }
    
    return sum / ((maxBin - minBin + 1) * 255); // Normalize to 0-1
  }
  
  /**
   * Calculate spectral centroid (frequency center of mass)
   */
  private calculateSpectralCentroid(frequencyData: Uint8Array): number {
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < frequencyData.length; i++) {
      const magnitude = frequencyData[i];
      numerator += magnitude * i;
      denominator += magnitude;
    }
    
    if (denominator === 0) return 0;
    return (numerator / denominator) / frequencyData.length; // Normalize to 0-1
  }
  
  /**
   * Calculate spectral flux for onset detection
   */
  private calculateSpectralFlux(currentFreq: Uint8Array): number {
    let flux = 0;
    
    for (let i = 0; i < currentFreq.length; i++) {
      const current = currentFreq[i] / 255;
      const previous = this.prevFrequencyData[i] / 255;
      const diff = current - previous;
      
      if (diff > 0) {
        flux += diff;
      }
    }
    
    // Store current as previous for next frame
    for (let i = 0; i < currentFreq.length; i++) {
      this.prevFrequencyData[i] = currentFreq[i] / 255;
    }
    
    return flux; // Returns roughly 0-1+
  }
  
  /**
   * Main analysis function - call this every frame
   */
  analyze(currentTime: number = performance.now()): AudioAnalysisData {
    // Get audio data
    this.analyser.getFloatTimeDomainData(this.timeDomainData);
    this.analyser.getByteFrequencyData(this.frequencyData);
    
    // Calculate raw level
    const rawLevel = this.calculateRMS(this.timeDomainData);
    const normalizedLevel = Math.min(rawLevel * 3.0, 1.0); // Gain normalize for TTS
    
    // Envelope follower with attack/decay
    const target = normalizedLevel;
    if (target > this.envelope) {
      // Attack
      this.envelope = this.attackCoeff * this.envelope + (1 - this.attackCoeff) * target;
    } else {
      // Release
      this.envelope = this.releaseCoeff * this.envelope + (1 - this.releaseCoeff) * target;
    }
    
    // Spectral bands
    const lowMid = this.calculateBandEnergy(this.frequencyData, 150, 500);
    const high = this.calculateBandEnergy(this.frequencyData, 3000, 8000);
    const spectralCentroid = this.calculateSpectralCentroid(this.frequencyData);
    
    // Onset detection
    const spectralFlux = this.calculateSpectralFlux(this.frequencyData);
    const timeSinceLastOnset = currentTime - this.lastOnsetTime;
    const syllableOnset = spectralFlux > this.config.onsetThreshold && 
                         timeSinceLastOnset > this.config.onsetCooldown;
    
    if (syllableOnset) {
      this.lastOnsetTime = currentTime;
    }
    
    // Word boundary detection (simplified - stronger flux threshold)
    // In practice, you'd use TTS word timing or more sophisticated detection
    const wordBoundary = spectralFlux > (this.config.onsetThreshold * 1.8) && 
                        timeSinceLastOnset > this.config.onsetCooldown * 2;
    
    // Silence detection
    const wasSilent = this.isSilent;
    if (this.envelope < this.config.silenceThreshold) {
      if (!wasSilent) {
        this.silenceStartTime = currentTime;
      }
      this.isSilent = (currentTime - this.silenceStartTime) > this.config.silenceTimeout;
    } else {
      this.isSilent = false;
    }
    
    // Update cached result
    this.lastAnalysis = {
      envelope: this.envelope,
      lowMid,
      high,
      spectralCentroid,
      syllableOnset,
      wordBoundary,
      spectralFlux,
      isSilent: this.isSilent,
      rawLevel
    };
    
    return this.lastAnalysis;
  }
  
  /**
   * Get the last analysis without recalculating
   */
  getLastAnalysis(): AudioAnalysisData {
    return this.lastAnalysis;
  }
  
  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AudioAnalysisConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Recalculate envelope coefficients if timing changed
    if (newConfig.attackTime !== undefined || newConfig.releaseTime !== undefined) {
      const sampleRate = this.audioContext.sampleRate;
      this.attackCoeff = Math.exp(-1 / (this.config.attackTime * sampleRate));
      this.releaseCoeff = Math.exp(-1 / (this.config.releaseTime * sampleRate));
    }
    
    // Update analyser if FFT size or smoothing changed
    if (newConfig.fftSize !== undefined) {
      this.analyser.fftSize = this.config.fftSize;
      this.timeDomainData = new Float32Array(this.analyser.fftSize);
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.prevFrequencyData = new Float32Array(this.analyser.frequencyBinCount);
    }
    
    if (newConfig.smoothing !== undefined) {
      this.analyser.smoothingTimeConstant = this.config.smoothing;
    }
  }
  
  /**
   * Clean up resources
   */
  dispose(): void {
    this.analyser.disconnect();
  }
}

/**
 * Helper function to create an audio analysis service from an audio element
 */
export function createAudioAnalysisFromElement(
  audioElement: HTMLAudioElement, 
  config?: Partial<AudioAnalysisConfig>
): AudioAnalysisService {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const source = audioContext.createMediaElementSource(audioElement);
  
  const analysisService = new AudioAnalysisService(audioContext, config);
  analysisService.connectSource(source);
  
  // Connect to destination so audio still plays
  source.connect(audioContext.destination);
  
  return analysisService;
}

/**
 * Helper function to create an audio analysis service from a media stream
 */
export function createAudioAnalysisFromStream(
  mediaStream: MediaStream,
  config?: Partial<AudioAnalysisConfig>
): AudioAnalysisService {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(mediaStream);
  
  const analysisService = new AudioAnalysisService(audioContext, config);
  analysisService.connectSource(source);
  
  return analysisService;
}