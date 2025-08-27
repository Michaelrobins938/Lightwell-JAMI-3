'use client'

import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Scene, Camera, WebGLRenderer, InstancedMesh, SphereGeometry, ShaderMaterial, Points, BufferGeometry, Group } from 'three'
import { AudioAnalysisService, AudioAnalysisData } from '../../services/audioAnalysisService'
import { 
  detectDeviceCapabilities, 
  getOptimalConfig, 
  AdaptiveQualityController,
  OrbPerformanceConfig 
} from '../../utils/orbPerformance'

// Instanced particle system with curl noise flow field
class AudioReactiveOrbSystem {
  private scene: any;
    private camera: any;
    private renderer: any;
  private analysisService: AudioAnalysisService | null
  
  private particleSystem: any | null;
    private sphereGeometry: any;
    private particleMaterial: any;
    private burstSystem: any | null;
    private burstGeometry: any;
    private burstMaterial: any;
    private rippleSystem: any;
  private ringMaterials: any[] = []
  
  // Uniforms for shaders
  private uniforms = {
    time: { value: 0 },
    envelope: { value: 0 },
    lowMid: { value: 0 },
    high: { value: 0 },
    spectralCentroid: { value: 0 },
    velocityMult: { value: 0.8 },
    sparkleCount: { value: 0 },
    hue: { value: 220 },
    noiseFrequency: { value: 1.0 },
    burstSeed: { value: 0 },
    glowBoost: { value: 0 }
  }
  
  // Base configuration
  private baseR = 1.2
  private baseSparkles = 100
  private lastBurstTime = 0
  private burstCooldown = 100 // ms
  private particleCount: number
  private particleGeometry: any
  private particles: any
  private maxBurstParticles: number = 1000
  private burstCount: number = 0
  private burstParticles: any
  private rippleRings: any
  
  constructor(
    scene: any,
    camera: any,
    renderer: any,
    analysisService: AudioAnalysisService | null,
    particleCount = 8000
  ) {
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.analysisService = analysisService
    this.particleCount = Math.min(particleCount, 30000) // Performance cap
    
    this.createParticleSystem()
    this.createBurstSystem()
    this.createRippleSystem()
  }
  
  private createParticleSystem() {
    // Use small sphere geometry for instanced particles
    this.particleGeometry = new THREE.SphereGeometry(0.015, 8, 6)
    
    this.particleMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.getParticleVertexShader(),
      fragmentShader: this.getParticleFragmentShader(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    
    this.particles = new THREE.InstancedMesh(
      this.particleGeometry,
      this.particleMaterial,
      this.particleCount
    )
    
    // Initialize particle positions with curl noise flow
    this.initializeParticlePositions()
    
    this.scene.add(this.particles)
  }
  
  private initializeParticlePositions() {
    const matrix = new THREE.Matrix4()
    const position = new THREE.Vector3()
    const scale = new THREE.Vector3()
    
    for (let i = 0; i < this.particleCount; i++) {
      // Spherical distribution with noise modulation
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      
      // Base radius with noise variation
      const noiseValue = this.curlNoise(theta * 0.3, phi * 0.3, 0)
      const radius = this.baseR * (0.3 + Math.abs(noiseValue) * 0.7)
      
      position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      )
      
      // Add curl flow
      const flow = this.curlNoise(position.x * 0.5, position.y * 0.5, position.z * 0.5)
      position.add(new THREE.Vector3(flow, flow * 0.7, flow * 0.5).multiplyScalar(0.3))
      
      // Random scale variation
      const particleScale = 0.8 + Math.random() * 0.4
      scale.setScalar(particleScale)
      
      matrix.compose(position, new THREE.Quaternion(), scale)
      this.particles.setMatrixAt(i, matrix)
    }
    
    this.particles.instanceMatrix.needsUpdate = true
  }
  
  private createBurstSystem() {
    // Points system for burst particles
    this.burstGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(this.maxBurstParticles * 3)
    const colors = new Float32Array(this.maxBurstParticles * 3)
    const scales = new Float32Array(this.maxBurstParticles)
    const lifetimes = new Float32Array(this.maxBurstParticles)
    
    this.burstGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.burstGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    this.burstGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1))
    this.burstGeometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1))
    
    this.burstMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.getBurstVertexShader(),
      fragmentShader: this.getBurstFragmentShader(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    
    this.burstParticles = new THREE.Points(this.burstGeometry, this.burstMaterial)
    this.scene.add(this.burstParticles)
  }
  
  private createRippleSystem() {
    this.rippleRings = new THREE.Group()
    
    // Create 3 concentric rings for ripple effects
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.RingGeometry(0.1, 0.15, 32)
      const material = new THREE.ShaderMaterial({
        uniforms: {
          ...this.uniforms,
          ringRadius: { value: 0 },
          ringOpacity: { value: 0 }
        },
        vertexShader: this.getRingVertexShader(),
        fragmentShader: this.getRingFragmentShader(),
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      })
      
      const ring = new THREE.Mesh(geometry, material)
      this.rippleRings.add(ring)
      this.ringMaterials.push(material)
    }
    
    this.scene.add(this.rippleRings)
  }
  
  // Simplified curl noise function
  private curlNoise(x: number, y: number, z: number): number {
    return Math.sin(x * 2.1 + y * 1.3 + z * 0.7) * 0.5 +
           Math.sin(x * 4.2 + y * 2.6 + z * 1.4) * 0.25 +
           Math.sin(x * 8.4 + y * 5.2 + z * 2.8) * 0.125
  }
  
  public spawnBurst(strength: number, type: 'syllable' | 'word' = 'syllable') {
    const now = performance.now()
    if (now - this.lastBurstTime < this.burstCooldown) return
    
    this.lastBurstTime = now
    
    const particleCount = type === 'syllable' ? 
      80 + Math.random() * 40 :  // 80-120 for syllables
      250 + Math.random() * 150  // 250-400 for words
    
    this.uniforms.burstSeed.value = Math.random()
    
    // Spawn burst particles
    this.addBurstParticles(particleCount, strength, type)
    
    // Spawn ripple ring
    this.addRippleRing(strength, type)
    
    // Word boundaries get glow boost
    if (type === 'word') {
      this.uniforms.glowBoost.value = 0.1
      setTimeout(() => {
        this.uniforms.glowBoost.value = 0
      }, 120)
    }
  }
  
  private addBurstParticles(count: number, strength: number, type: 'syllable' | 'word') {
    const positions = this.burstGeometry.attributes.position.array as Float32Array
    const colors = this.burstGeometry.attributes.color.array as Float32Array
    const scales = this.burstGeometry.attributes.scale.array as Float32Array
    const lifetimes = this.burstGeometry.attributes.lifetime.array as Float32Array
    
    const startIndex = Math.min(this.burstCount, this.maxBurstParticles - count)
    
    for (let i = 0; i < count && startIndex + i < this.maxBurstParticles; i++) {
      const idx = (startIndex + i) * 3
      const particleIdx = startIndex + i
      
      // Start near core, burst outward
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 0.2 + Math.random() * 0.3
      
      positions[idx] = radius * Math.sin(phi) * Math.cos(theta)
      positions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[idx + 2] = radius * Math.cos(phi)
      
      // Color based on type and current hue
      const hue = this.uniforms.hue.value
      const color = new THREE.Color().setHSL(
        (hue + (Math.random() - 0.5) * 60) / 360,
        0.8,
        type === 'word' ? 0.9 : 0.7
      )
      
      colors[idx] = color.r
      colors[idx + 1] = color.g
      colors[idx + 2] = color.b
      
      // Scale and lifetime
      scales[particleIdx] = type === 'word' ? 2.0 + Math.random() : 1.0 + Math.random() * 0.5
      lifetimes[particleIdx] = 1.0 // Will decay over time
    }
    
    this.burstCount = Math.min(this.burstCount + count, this.maxBurstParticles)
    
    // Update geometry
    this.burstGeometry.attributes.position.needsUpdate = true
    this.burstGeometry.attributes.color.needsUpdate = true
    this.burstGeometry.attributes.scale.needsUpdate = true
    this.burstGeometry.attributes.lifetime.needsUpdate = true
    this.burstGeometry.setDrawRange(0, this.burstCount)
  }
  
  private addRippleRing(strength: number, type: 'syllable' | 'word') {
    // Find an available ring
    const ringIndex = Math.floor(Math.random() * this.ringMaterials.length)
    const material = this.ringMaterials[ringIndex]
    
    // Animate ring expansion
    const startRadius = 0.1
    const endRadius = type === 'word' ? 3.0 : 2.0
    const duration = type === 'word' ? 220 : 150
    const opacity = type === 'word' ? 0.6 : 0.4
    
    material.uniforms.ringRadius.value = startRadius
    material.uniforms.ringOpacity.value = opacity
    
    // Animate expansion and fade
    const startTime = performance.now()
    const animate = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      if (progress < 1) {
        material.uniforms.ringRadius.value = THREE.MathUtils.lerp(startRadius, endRadius, progress)
        material.uniforms.ringOpacity.value = opacity * (1 - progress)
        requestAnimationFrame(animate)
      } else {
        material.uniforms.ringOpacity.value = 0
      }
    }
    animate()
  }
  
  public update(deltaTime: number) {
    if (!this.analysisService) {
      // Fallback breathing animation
      this.uniforms.time.value += deltaTime
      this.uniforms.envelope.value = 0.2 + Math.sin(this.uniforms.time.value * 2) * 0.1
      return
    }
    
    const analysis = this.analysisService.analyze()
    this.updateFromAnalysis(analysis, deltaTime)
  }
  
  private updateFromAnalysis(analysis: AudioAnalysisData, deltaTime: number) {
    this.uniforms.time.value += deltaTime
    
    // Core signals → visual parameters
    this.uniforms.envelope.value = analysis.envelope
    this.uniforms.lowMid.value = analysis.lowMid
    this.uniforms.high.value = analysis.high
    this.uniforms.spectralCentroid.value = analysis.spectralCentroid
    
    // Envelope → size, glow, speed
    const radiusScale = 1 + 0.06 * analysis.envelope + 0.02 * analysis.lowMid
    this.uniforms.velocityMult.value = 0.8 + 1.4 * analysis.envelope
    
    // High frequency → sparkles and saturation
    this.uniforms.sparkleCount.value = this.baseSparkles + 40 * analysis.high
    
    // Spectral centroid → hue tilt
    this.uniforms.hue.value = THREE.MathUtils.lerp(220, 300, analysis.spectralCentroid)
    
    // Pitch/centroid → noise frequency (shape tightening)
    this.uniforms.noiseFrequency.value = 0.8 + analysis.spectralCentroid * 0.4
    
    // Handle onsets
    if (analysis.syllableOnset) {
      this.spawnBurst(1, 'syllable')
    }
    
    if (analysis.wordBoundary) {
      this.spawnBurst(2, 'word')
    }
    
    // Silence → decay to baseline
    if (analysis.isSilent) {
      this.uniforms.velocityMult.value = THREE.MathUtils.lerp(
        this.uniforms.velocityMult.value, 
        1.0, 
        deltaTime * 2
      )
      this.uniforms.sparkleCount.value = THREE.MathUtils.lerp(
        this.uniforms.sparkleCount.value,
        this.baseSparkles,
        deltaTime * 2
      )
    }
    
    // Update instanced particle positions with flow field
    this.updateParticleFlow(deltaTime)
    
    // Update burst particles
    this.updateBurstParticles(deltaTime)
  }
  
  private updateParticleFlow(deltaTime: number) {
    // This would normally be done in a compute shader for performance
    // For now, we'll let the vertex shader handle the flow field
    // The shader updates based on the uniforms we set above
  }
  
  private updateBurstParticles(deltaTime: number) {
    if (this.burstCount === 0) return
    
    const positions = this.burstGeometry.attributes.position.array as Float32Array
    const lifetimes = this.burstGeometry.attributes.lifetime.array as Float32Array
    const velocities = new Float32Array(this.burstCount * 3) // Could store this as attribute
    
    let activeCount = 0
    
    for (let i = 0; i < this.burstCount; i++) {
      const idx = i * 3
      
      // Decay lifetime
      lifetimes[i] -= deltaTime * 2.0 // 2.0 = decay rate
      
      if (lifetimes[i] > 0) {
        // Move particles outward from center
        const currentPos = new THREE.Vector3(
          positions[idx],
          positions[idx + 1], 
          positions[idx + 2]
        )
        
        // Radial outward velocity
        const velocity = currentPos.normalize().multiplyScalar(3.0 * deltaTime)
        
        positions[idx] += velocity.x
        positions[idx + 1] += velocity.y
        positions[idx + 2] += velocity.z
        
        activeCount++
      } else {
        // Reset dead particles to end of array
        lifetimes[i] = 0
      }
    }
    
    // Compact array (remove dead particles)
    if (activeCount < this.burstCount) {
      this.burstCount = activeCount
      this.burstGeometry.setDrawRange(0, this.burstCount)
    }
    
    this.burstGeometry.attributes.position.needsUpdate = true
    this.burstGeometry.attributes.lifetime.needsUpdate = true
  }
  
  // Shader code
  private getParticleVertexShader(): string {
    return `
      uniform float time;
      uniform float envelope;
      uniform float lowMid;
      uniform float high;
      uniform float velocityMult;
      uniform float noiseFrequency;
      
      attribute vec3 originalPosition;
      
      varying vec3 vPosition;
      varying vec3 vColor;
      varying float vDensity;
      
      // Simplex noise functions (simplified)
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
      }
      
      vec3 curlNoise(vec3 p) {
        float freq = noiseFrequency;
        return vec3(
          snoise(p * freq + vec3(time * 0.1, 0.0, 0.0)),
          snoise(p * freq + vec3(0.0, time * 0.1, 0.0)),
          snoise(p * freq + vec3(0.0, 0.0, time * 0.1))
        );
      }
      
      void main() {
        vec3 pos = position;
        
        // Curl noise flow field
        vec3 flow = curlNoise(pos * 0.5) * 0.3 * velocityMult;
        
        // Radial spring to keep particles near center
        float dist = length(pos);
        float softRadius = 2.0;
        if (dist > softRadius) {
          vec3 spring = -0.2 * (dist - softRadius) * normalize(pos);
          flow += spring;
        }
        
        // Apply flow
        pos += flow;
        
        // Audio-reactive scaling
        float audioScale = 1.0 + envelope * 0.3 + lowMid * 0.02;
        pos *= audioScale;
        
        // Calculate density for shader effects
        vDensity = 1.0 / (1.0 + dist * dist * 0.5);
        vDensity *= (0.5 + 0.5 * snoise(pos * 1.2 + vec3(time * 0.1)));
        
        vPosition = pos;
        vColor = vec3(0.6, 0.8, 1.0); // Base color, modified in fragment
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `
  }
  
  private getParticleFragmentShader(): string {
    return `
      uniform float time;
      uniform float envelope;
      uniform float high;
      uniform float hue;
      uniform float sparkleCount;
      uniform float glowBoost;
      
      varying vec3 vPosition;
      varying vec3 vColor;
      varying float vDensity;
      
      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
      
      void main() {
        float dist = length(vPosition);
        
        // Convert hue to RGB
        float h = hue / 360.0;
        float saturation = 0.8 + high * 0.15;
        float brightness = 0.8 + vDensity * 0.4 + envelope * 0.3 + glowBoost;
        
        vec3 color = hsv2rgb(vec3(h, saturation, brightness));
        
        // Sparkle effect on high frequencies
        float sparkle = step(0.98, sin(time * 15.0 + dist * 20.0)) * high;
        color += sparkle * vec3(0.5, 0.7, 1.0);
        
        // Core glow
        float coreGlow = smoothstep(0.8, 0.2, dist);
        color += coreGlow * vec3(0.2, 0.4, 0.8) * envelope;
        
        float alpha = vDensity * (0.4 + envelope * 0.3);
        alpha *= (0.6 + high * 0.4);
        
        gl_FragColor = vec4(color, alpha);
      }
    `
  }
  
  private getBurstVertexShader(): string {
    return `
      attribute float scale;
      attribute float lifetime;
      
      uniform float time;
      uniform float burstSeed;
      
      varying float vLifetime;
      varying vec3 vColor;
      
      void main() {
        vLifetime = lifetime;
        vColor = color;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = scale * 3.0;
      }
    `
  }
  
  private getBurstFragmentShader(): string {
    return `
      varying float vLifetime;
      varying vec3 vColor;
      
      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        if (dist > 0.5) discard;
        
        float alpha = (1.0 - dist * 2.0) * vLifetime;
        gl_FragColor = vec4(vColor, alpha);
      }
    `
  }
  
  private getRingVertexShader(): string {
    return `
      uniform float ringRadius;
      
      void main() {
        vec3 pos = position * ringRadius;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `
  }
  
  private getRingFragmentShader(): string {
    return `
      uniform float ringOpacity;
      uniform float hue;
      
      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
      
      void main() {
        float h = hue / 360.0;
        vec3 color = hsv2rgb(vec3(h, 0.7, 1.0));
        gl_FragColor = vec4(color, ringOpacity);
      }
    `
  }
  
  public dispose() {
    this.scene.remove(this.particles)
    this.scene.remove(this.burstParticles)
    this.scene.remove(this.rippleRings)
    
    this.particleGeometry.dispose()
    this.particleMaterial.dispose()
    this.burstGeometry.dispose()
    this.burstMaterial.dispose()
    
    this.ringMaterials.forEach(material => material.dispose())
  }
}

// React component wrapper
interface AudioReactiveOrbProps {
  analysisService?: AudioAnalysisService | null
  particleCount?: number
  className?: string
  isVisible?: boolean
  enableAdaptiveQuality?: boolean
  performanceConfig?: Partial<OrbPerformanceConfig>
  onPerformanceChange?: (stats: any) => void
}

export function AudioReactiveOrb({
  analysisService,
  particleCount,
  className = '',
  isVisible = true,
  enableAdaptiveQuality = true,
  performanceConfig,
  onPerformanceChange
}: AudioReactiveOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const orbSystemRef = useRef<AudioReactiveOrbSystem | null>(null)
  const sceneRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const animationRef = useRef<number>(0)
  const qualityControllerRef = useRef<AdaptiveQualityController | null>(null)
  const [hasError, setHasError] = useState(false)
  const [currentConfig, setCurrentConfig] = useState<OrbPerformanceConfig | null>(null)
  const [deviceCapabilities] = useState(() => detectDeviceCapabilities())
  
  useEffect(() => {
    if (!containerRef.current || !isVisible) return
    
    const container = containerRef.current
    
    try {
      // Generate optimal configuration
      const optimalConfig = getOptimalConfig(deviceCapabilities)
      const finalConfig = {
        ...optimalConfig,
        ...performanceConfig,
        ...(particleCount && { particleCount })
      }
      setCurrentConfig(finalConfig)
      
      // Create Three.js scene
      const scene = new THREE.Scene()
      sceneRef.current = scene
      
      const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      )
      camera.position.z = 4
      
      // Renderer with device-appropriate settings
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: deviceCapabilities.tier !== 'low',
        powerPreference: deviceCapabilities.tier === 'high' ? 'high-performance' : 'default'
      })
      
      const pixelRatio = Math.min(deviceCapabilities.devicePixelRatio, deviceCapabilities.tier === 'low' ? 1 : 2)
      renderer.setPixelRatio(pixelRatio)
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)
      rendererRef.current = renderer
      
      // Create orb system with optimized settings
      orbSystemRef.current = new AudioReactiveOrbSystem(
        scene,
        camera,
        renderer,
        analysisService || null,
        finalConfig.particleCount
      )
      
      // Setup adaptive quality controller
      if (enableAdaptiveQuality) {
        const qualityController = new AdaptiveQualityController(finalConfig, finalConfig.maxFPS)
        qualityControllerRef.current = qualityController
        
        // Subscribe to config changes
        qualityController.onConfigChange((newConfig) => {
          setCurrentConfig(newConfig)
          // TODO: Update orb system with new config
        })
      }
      
      // Animation loop with performance monitoring
      let lastTime = 0
      let frameCount = 0
      const animate = (currentTime: number) => {
        const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.016) // Cap at 60fps
        lastTime = currentTime
        frameCount++
        
        // Update performance monitoring
        if (qualityControllerRef.current) {
          qualityControllerRef.current.update()
          
          // Report performance stats periodically
          if (frameCount % 60 === 0 && onPerformanceChange) {
            const stats = qualityControllerRef.current.getPerformanceStats()
            onPerformanceChange(stats)
          }
        }
        
        // Skip frames if necessary for performance
        const shouldSkipFrame = currentConfig && 
          currentConfig.updateFrequency < 60 && 
          frameCount % Math.ceil(60 / currentConfig.updateFrequency) !== 0
        
        if (!shouldSkipFrame && orbSystemRef.current) {
          orbSystemRef.current.update(deltaTime)
        }
        
        renderer.render(scene, camera)
        animationRef.current = requestAnimationFrame(animate)
      }
      animate(0)
      
      // Handle resize
      const handleResize = () => {
        if (!container || !camera || !renderer) return
        
        const width = container.clientWidth
        const height = container.clientHeight
        
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
        renderer.setPixelRatio(pixelRatio)
        renderer.setSize(width, height)
      }
      
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('resize', handleResize)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        if (orbSystemRef.current) {
          orbSystemRef.current.dispose()
        }
        if (qualityControllerRef.current) {
          qualityControllerRef.current.reset()
        }
        if (renderer) {
          renderer.dispose()
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement)
          }
        }
      }
      
    } catch (error) {
      console.error('AudioReactiveOrb initialization error:', error)
      setHasError(true)
    }
    
  }, [isVisible, analysisService, particleCount, enableAdaptiveQuality, performanceConfig, currentConfig, deviceCapabilities, onPerformanceChange])
  
  if (!isVisible) return null
  
  if (hasError) {
    return (
      <div className={`audio-reactive-orb-fallback ${className} flex flex-col items-center justify-center space-y-4`}>
        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse" />
        <div className="text-sm text-gray-500 text-center">
          <div>WebGL unavailable</div>
          <div className="text-xs">Device tier: {deviceCapabilities.tier}</div>
        </div>
      </div>
    )
  }
  
  return (
    <div
      ref={containerRef}
      className={`audio-reactive-orb-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    />
  )
}