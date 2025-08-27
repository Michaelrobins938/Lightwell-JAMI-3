// Performance optimization utilities for the audio-reactive orb system

export interface DeviceCapabilities {
  tier: 'low' | 'medium' | 'high';
  maxParticles: number;
  useReducedMotion: boolean;
  hardwareConcurrency: number;
  devicePixelRatio: number;
  webglSupported: boolean;
  isMobile: boolean;
}

export interface OrbPerformanceConfig {
  particleCount: number;
  burstParticles: number;
  fftSize: number;
  useInstancing: boolean;
  enableBursts: boolean;
  enableRipples: boolean;
  updateFrequency: number; // Hz
  maxFPS: number;
}

/**
 * Detect device capabilities for performance optimization
 */
export function detectDeviceCapabilities(): DeviceCapabilities {
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const isMobile = window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Test WebGL support
  let webglSupported = false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    webglSupported = !!gl;
  } catch (e) {
    webglSupported = false;
  }
  
  // Determine performance tier
  let tier: 'low' | 'medium' | 'high' = 'medium';
  
  if (!webglSupported || hardwareConcurrency < 4 || isMobile) {
    tier = 'low';
  } else if (hardwareConcurrency >= 8 && devicePixelRatio <= 2 && !isMobile) {
    tier = 'high';
  }
  
  // Adjust for specific device conditions
  if (isMobile && hardwareConcurrency >= 6) {
    tier = 'medium'; // High-end mobile
  }
  
  const maxParticles = tier === 'low' ? 3000 : tier === 'medium' ? 8000 : 15000;
  
  return {
    tier,
    maxParticles,
    useReducedMotion: prefersReducedMotion,
    hardwareConcurrency,
    devicePixelRatio,
    webglSupported,
    isMobile
  };
}

/**
 * Generate optimal performance config based on device capabilities
 */
export function getOptimalConfig(capabilities?: DeviceCapabilities): OrbPerformanceConfig {
  const caps = capabilities || detectDeviceCapabilities();
  
  const configs = {
    low: {
      particleCount: 2000,
      burstParticles: 200,
      fftSize: 512,
      useInstancing: true,
      enableBursts: false,
      enableRipples: false,
      updateFrequency: 30,
      maxFPS: 30
    },
    medium: {
      particleCount: 6000,
      burstParticles: 500,
      fftSize: 1024,
      useInstancing: true,
      enableBursts: true,
      enableRipples: true,
      updateFrequency: 60,
      maxFPS: 60
    },
    high: {
      particleCount: 12000,
      burstParticles: 1000,
      fftSize: 2048,
      useInstancing: true,
      enableBursts: true,
      enableRipples: true,
      updateFrequency: 60,
      maxFPS: 60
    }
  };
  
  let config = { ...configs[caps.tier] };
  
  // Apply reduced motion adjustments
  if (caps.useReducedMotion) {
    config.enableBursts = false;
    config.enableRipples = false;
    config.particleCount = Math.floor(config.particleCount * 0.5);
    config.updateFrequency = 30;
  }
  
  // Mobile-specific adjustments
  if (caps.isMobile) {
    config.particleCount = Math.floor(config.particleCount * 0.7);
    config.burstParticles = Math.floor(config.burstParticles * 0.6);
    config.maxFPS = 30;
  }
  
  return config;
}

/**
 * Performance monitor for adaptive quality adjustment
 */
export class OrbPerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private currentFPS = 60;
  private targetFPS = 60;
  private fpsHistory: number[] = [];
  private maxHistoryLength = 120; // 2 seconds at 60fps
  
  private callbacks: Array<(fps: number, shouldReduce: boolean) => void> = [];
  
  constructor(targetFPS = 60) {
    this.targetFPS = targetFPS;
    this.lastTime = performance.now();
  }
  
  /**
   * Call this every frame to update FPS tracking
   */
  update(): void {
    this.frameCount++;
    const now = performance.now();
    const delta = now - this.lastTime;
    
    if (delta >= 1000) { // Update every second
      this.currentFPS = (this.frameCount * 1000) / delta;
      this.frameCount = 0;
      this.lastTime = now;
      
      // Add to history
      this.fpsHistory.push(this.currentFPS);
      if (this.fpsHistory.length > this.maxHistoryLength) {
        this.fpsHistory.shift();
      }
      
      // Check if performance adjustment is needed
      this.checkPerformance();
    }
  }
  
  private checkPerformance(): void {
    if (this.fpsHistory.length < 30) return; // Need at least 30 samples
    
    const recentFPS = this.fpsHistory.slice(-30);
    const averageFPS = recentFPS.reduce((sum, fps) => sum + fps, 0) / recentFPS.length;
    const minFPS = Math.min(...recentFPS);
    
    // Determine if quality should be reduced
    const shouldReduce = averageFPS < this.targetFPS * 0.8 || minFPS < this.targetFPS * 0.6;
    
    // Notify callbacks
    this.callbacks.forEach(callback => {
      try {
        callback(averageFPS, shouldReduce);
      } catch (error) {
        console.warn('Performance monitor callback error:', error);
      }
    });
  }
  
  /**
   * Subscribe to performance updates
   */
  onPerformanceChange(callback: (fps: number, shouldReduce: boolean) => void): void {
    this.callbacks.push(callback);
  }
  
  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    return this.currentFPS;
  }
  
  /**
   * Get average FPS over recent history
   */
  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return this.currentFPS;
    const recentSamples = this.fpsHistory.slice(-60); // Last 60 samples
    return recentSamples.reduce((sum, fps) => sum + fps, 0) / recentSamples.length;
  }
  
  /**
   * Reset performance tracking
   */
  reset(): void {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
  }
}

/**
 * Adaptive quality controller that automatically adjusts settings
 */
export class AdaptiveQualityController {
  private monitor: OrbPerformanceMonitor;
  private currentConfig: OrbPerformanceConfig;
  private baseConfig: OrbPerformanceConfig;
  private reductionLevel = 0; // 0 = no reduction, 1 = maximum reduction
  private maxReductionLevel = 3;
  
  private callbacks: Array<(config: OrbPerformanceConfig) => void> = [];
  
  constructor(baseConfig: OrbPerformanceConfig, targetFPS = 60) {
    this.baseConfig = { ...baseConfig };
    this.currentConfig = { ...baseConfig };
    this.monitor = new OrbPerformanceMonitor(targetFPS);
    
    this.monitor.onPerformanceChange((fps, shouldReduce) => {
      this.adjustQuality(fps, shouldReduce);
    });
  }
  
  private adjustQuality(fps: number, shouldReduce: boolean): void {
    const oldLevel = this.reductionLevel;
    
    if (shouldReduce && this.reductionLevel < this.maxReductionLevel) {
      this.reductionLevel++;
      console.log(`Reducing orb quality: level ${this.reductionLevel} (FPS: ${fps.toFixed(1)})`);
    } else if (!shouldReduce && fps > this.baseConfig.maxFPS * 0.9 && this.reductionLevel > 0) {
      this.reductionLevel = Math.max(0, this.reductionLevel - 1);
      console.log(`Improving orb quality: level ${this.reductionLevel} (FPS: ${fps.toFixed(1)})`);
    }
    
    if (oldLevel !== this.reductionLevel) {
      this.updateConfig();
    }
  }
  
  private updateConfig(): void {
    const reduction = this.reductionLevel / this.maxReductionLevel; // 0-1
    
    this.currentConfig = {
      particleCount: Math.floor(this.baseConfig.particleCount * (1 - reduction * 0.7)),
      burstParticles: Math.floor(this.baseConfig.burstParticles * (1 - reduction * 0.5)),
      fftSize: this.reductionLevel > 1 ? 512 : this.baseConfig.fftSize,
      useInstancing: this.baseConfig.useInstancing,
      enableBursts: this.reductionLevel < 2 && this.baseConfig.enableBursts,
      enableRipples: this.reductionLevel < 1 && this.baseConfig.enableRipples,
      updateFrequency: Math.max(15, this.baseConfig.updateFrequency - (reduction * 30)),
      maxFPS: this.baseConfig.maxFPS
    };
    
    // Notify subscribers
    this.callbacks.forEach(callback => {
      try {
        callback(this.currentConfig);
      } catch (error) {
        console.warn('Adaptive quality callback error:', error);
      }
    });
  }
  
  /**
   * Update performance monitoring (call every frame)
   */
  update(): void {
    this.monitor.update();
  }
  
  /**
   * Subscribe to config changes
   */
  onConfigChange(callback: (config: OrbPerformanceConfig) => void): void {
    this.callbacks.push(callback);
  }
  
  /**
   * Get current configuration
   */
  getCurrentConfig(): OrbPerformanceConfig {
    return { ...this.currentConfig };
  }
  
  /**
   * Get performance stats
   */
  getPerformanceStats() {
    return {
      currentFPS: this.monitor.getCurrentFPS(),
      averageFPS: this.monitor.getAverageFPS(),
      reductionLevel: this.reductionLevel,
      maxReductionLevel: this.maxReductionLevel
    };
  }
  
  /**
   * Force a specific reduction level
   */
  setReductionLevel(level: number): void {
    this.reductionLevel = Math.max(0, Math.min(level, this.maxReductionLevel));
    this.updateConfig();
  }
  
  /**
   * Reset to base configuration
   */
  reset(): void {
    this.reductionLevel = 0;
    this.monitor.reset();
    this.updateConfig();
  }
}

/**
 * Utility to measure rendering performance
 */
export function measureRenderTime<T>(fn: () => T): { result: T; time: number } {
  const start = performance.now();
  const result = fn();
  const time = performance.now() - start;
  return { result, time };
}

/**
 * GPU memory estimation (rough approximation)
 */
export function estimateGPUMemoryUsage(config: OrbPerformanceConfig): number {
  const particleBytes = config.particleCount * 16 * 4; // 16 floats per particle (matrix)
  const burstBytes = config.burstParticles * 8 * 4; // 8 floats per burst particle
  const textureBytes = 1024 * 1024 * 4; // Approximate texture usage
  const bufferBytes = config.fftSize * 2 * 4; // FFT buffers
  
  return particleBytes + burstBytes + textureBytes + bufferBytes; // bytes
}

/**
 * Get recommended settings text for users
 */
export function getPerformanceRecommendation(capabilities: DeviceCapabilities): string {
  switch (capabilities.tier) {
    case 'low':
      return 'Your device has limited graphics capabilities. The orb will use simplified visuals for optimal performance.';
    case 'medium':
      return 'Your device supports good quality visuals with moderate particle counts and effects.';
    case 'high':
      return 'Your device can handle high-quality visuals with maximum particle counts and all effects enabled.';
    default:
      return 'Visual quality will be automatically adjusted based on your device performance.';
  }
}