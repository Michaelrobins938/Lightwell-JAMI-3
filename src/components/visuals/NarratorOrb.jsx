import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Shader code from the original NarratorOrb.js
const nebulaVertexShader = `
    varying vec3 vColor;
    varying vec3 vPosition;
    varying vec3 vOriginalPosition;
    varying float vDistance;
    varying float vNoise;
    varying float vDensity;
    varying float vFlow;

    uniform float time;
    uniform float audioLevel;
    uniform float breathingPhase;

    // Enhanced 3D noise for more organic flow
    vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
        return mod289(((x*34.0)+1.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
    }

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
        vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        
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
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    // Fractal Brownian Motion for more complex structures
    float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for(int i = 0; i < 4; i++) {
            value += amplitude * snoise(p * frequency);
            frequency *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }

    void main() {
        vOriginalPosition = position;
        vColor = color;
        
        // Create flowing, organic motion with subtle audio enhancement
        float timeScale = time * 0.2;
        vec3 flowField = vec3(
            fbm(position * 0.5 + vec3(timeScale, 0.0, 0.0)),
            fbm(position * 0.5 + vec3(0.0, timeScale, 0.0)),
            fbm(position * 0.5 + vec3(0.0, 0.0, timeScale))
        );
        
        // Nebula density based on distance from center and noise
        float centerDistance = length(position);
        vDensity = smoothstep(3.0, 0.5, centerDistance);
        vDensity *= (0.5 + 0.5 * fbm(position * 1.2 + vec3(time * 0.1)));
        
        // Flowing tendrils effect with subtle audio reactivity
        vec3 curlNoise = vec3(
            snoise(position * 0.8 + vec3(time * 0.15, 0.0, 0.0)),
            snoise(position * 0.8 + vec3(0.0, time * 0.15, 0.0)),
            snoise(position * 0.8 + vec3(0.0, 0.0, time * 0.15))
        );
        
        // Combine flow effects with gentle audio response
        vec3 flow = flowField * 0.3 + curlNoise * 0.2;
        flow *= (1.0 + audioLevel * 0.4); // Subtle flow enhancement
        vFlow = length(flow);
        
        // More responsive but still gentle audio-reactive expansion
        float audioReactivity = audioLevel * (1.0 + sin(time * 5.0 + centerDistance * 3.0)) * 0.6;
        
        // Apply all transformations
        vec3 displaced = position + flow;
        displaced += normalize(position) * audioReactivity * 0.5;
        
        // Breathing animation with subtle audio enhancement
        float breathingScale = 1.0 + sin(breathingPhase) * 0.1 + audioLevel * 0.3;
        displaced *= breathingScale;
        
        vPosition = displaced;
        vDistance = length(displaced);
        vNoise = fbm(displaced * 1.5 + vec3(time * 0.1));
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        
        // Slightly more responsive point sizes
        float pointSize = (2.0 + vDensity * 6.0) * (1.0 + audioLevel * 4.0);
        gl_PointSize = clamp(pointSize, 1.0, 14.0);
    }
`;

const nebulaFragmentShader = `
    varying vec3 vColor;
    varying vec3 vPosition;
    varying vec3 vOriginalPosition;
    varying float vDistance;
    varying float vNoise;
    varying float vDensity;
    varying float vFlow;

    uniform float time;
    uniform float audioLevel;
    uniform float intensity;

    // Convert HSV to RGB
    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
        // Soft, organic point shape
        vec2 circCoord = 2.0 * gl_PointCoord - 1.0;
        float dist = length(circCoord);
        if (dist > 1.0) discard;
        
        // Nebula color mapping based on density and flow - BALANCED VERSION
        float colorZone = vDensity + vFlow * 0.3 + sin(time * 0.3 + vDistance) * 0.1;
        
        float hue;
        if (colorZone > 0.7) {
            // Dense core - bright cyan to blue (like reference)
            hue = 0.5 + colorZone * 0.08 + audioLevel * 0.04; // Slightly more audio response
        } else if (colorZone > 0.4) {
            // Mid density - purple to blue
            hue = 0.65 + colorZone * 0.15 + sin(time * 0.5) * 0.02;
        } else {
            // Outer wisps - magenta to pink (like reference)
            hue = 0.85 + colorZone * 0.12 + vNoise * 0.03; // Magenta range
        }
        
        // Balanced saturation and brightness
        float saturation = 0.85 + vDensity * 0.1 + audioLevel * 0.06;
        
        // MUCH more balanced brightness - less obnoxious
        float brightness = 1.2 + vDensity * 1.8 + vFlow * 0.8;
        brightness += audioLevel * 1.0; // Slightly more audio response
        brightness += sin(time * 1.5 + vDistance * 2.0) * 0.2;
        brightness *= intensity;
        brightness = clamp(brightness, 0.4, 2.5); // More controlled range
        
        vec3 nebulaColor = hsv2rgb(vec3(hue, saturation, brightness));
        
        // Much more subtle core glow - less white
        float coreGlow = smoothstep(0.3, 1.0, vDensity);
        nebulaColor += coreGlow * vec3(0.3, 0.6, 0.8) * (0.8 + audioLevel * 0.4); // Slightly more audio glow
        
        // Much more subtle star-like points - way less obnoxious
        float starPoint = smoothstep(0.85, 1.0, vDensity) * smoothstep(0.7, 1.0, vFlow);
        nebulaColor += starPoint * vec3(0.4, 0.6, 0.9) * 0.5; // Very subtle white points
        
        // Soft falloff for gaseous appearance
        float gasAlpha = 1.0 - smoothstep(0.0, 1.0, dist);
        gasAlpha = pow(gasAlpha, 1.2); // Softer edges
        
        // Balanced density-based transparency
        float densityAlpha = vDensity * 1.2 + 0.2;
        
        // Flow-based wispy effects
        float flowAlpha = smoothstep(0.0, 0.5, vFlow) * 0.6;
        
        // Combine alpha effects with balanced values
        float finalAlpha = gasAlpha * (densityAlpha + flowAlpha);
        finalAlpha *= (0.5 + audioLevel * 0.4); // Slightly more audio response
        
        // Subtle flickering like real gas with gentle audio enhancement
        float flicker = sin(time * 2.0 + vDistance * 4.0) * 0.08 + 0.92;
        flicker += sin(time * 6.0 + audioLevel * 10.0) * audioLevel * 0.05; // Gentle audio flicker
        finalAlpha *= flicker;
        
        // Ensure minimum visibility
        finalAlpha = clamp(finalAlpha, 0.08, 0.9);
        
        gl_FragColor = vec4(nebulaColor, finalAlpha);
    }
`;

const tendrilVertexShader = `
    varying vec3 vColor;
    varying vec3 vPosition;
    varying float vDistance;
    varying float vNoise;
    varying float vDensity;
    varying float vFlow;

    uniform float time;
    uniform float audioLevel;
    uniform float breathingPhase;

    // Enhanced 3D noise for tendril flow
    vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
        return mod289(((x*34.0)+1.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
    }

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
        vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        
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
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
        vColor = color;
        
        // Create flowing tendril motion
        float timeScale = time * 0.3;
        vec3 flowField = vec3(
            snoise(position * 0.8 + vec3(timeScale, 0.0, 0.0)),
            snoise(position * 0.8 + vec3(0.0, timeScale, 0.0)),
            snoise(position * 0.8 + vec3(0.0, 0.0, timeScale))
        );
        
        // Tendril density based on distance from center
        float centerDistance = length(position);
        vDensity = smoothstep(2.0, 0.2, centerDistance);
        vDensity *= (0.5 + 0.5 * snoise(position * 1.5 + vec3(time * 0.1)));
        
        // Flowing tendril effect
        vec3 flow = flowField * 0.4;
        flow *= (1.0 + audioLevel * 0.3);
        vFlow = length(flow);
        
        // Audio-reactive tendril expansion
        float audioReactivity = audioLevel * (1.0 + sin(time * 3.0 + centerDistance * 2.0)) * 0.4;
        
        // Apply transformations
        vec3 displaced = position + flow;
        displaced += normalize(position) * audioReactivity * 0.3;
        
        // Breathing animation
        float breathingScale = 1.0 + sin(breathingPhase) * 0.05 + audioLevel * 0.2;
        displaced *= breathingScale;
        
        vPosition = displaced;
        vDistance = length(displaced);
        vNoise = snoise(displaced * 2.0 + vec3(time * 0.15));
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        
        // Responsive point sizes for tendrils
        float pointSize = (1.5 + vDensity * 4.0) * (1.0 + audioLevel * 2.0);
        gl_PointSize = clamp(pointSize, 0.5, 8.0);
    }
`;

const tendrilFragmentShader = `
    varying vec3 vColor;
    varying vec3 vPosition;
    varying float vDistance;
    varying float vNoise;
    varying float vDensity;
    varying float vFlow;

    uniform float time;
    uniform float audioLevel;
    uniform float intensity;

    // Convert HSV to RGB
    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
        // Soft tendril point shape
        vec2 circCoord = 2.0 * gl_PointCoord - 1.0;
        float dist = length(circCoord);
        if (dist > 1.0) discard;
        
        // Tendril color mapping
        float colorZone = vDensity + vFlow * 0.2 + sin(time * 0.2 + vDistance) * 0.05;
        
        float hue = 0.7 + colorZone * 0.15 + vNoise * 0.02; // Purple to magenta
        float saturation = 0.8 + vDensity * 0.2 + audioLevel * 0.1;
        float brightness = 1.0 + vDensity * 1.5 + vFlow * 0.6;
        brightness += audioLevel * 0.8;
        brightness += sin(time * 1.2 + vDistance * 1.5) * 0.15;
        brightness *= intensity;
        brightness = clamp(brightness, 0.3, 2.0);
        
        vec3 tendrilColor = hsv2rgb(vec3(hue, saturation, brightness));
        
        // Subtle core glow
        float coreGlow = smoothstep(0.2, 0.8, vDensity);
        tendrilColor += coreGlow * vec3(0.2, 0.4, 0.6) * (0.6 + audioLevel * 0.3);
        
        // Soft falloff
        float gasAlpha = 1.0 - smoothstep(0.0, 1.0, dist);
        gasAlpha = pow(gasAlpha, 1.1);
        
        // Density-based transparency
        float densityAlpha = vDensity * 1.0 + 0.1;
        float flowAlpha = smoothstep(0.0, 0.4, vFlow) * 0.4;
        
        float finalAlpha = gasAlpha * (densityAlpha + flowAlpha);
        finalAlpha *= (0.4 + audioLevel * 0.3);
        
        // Subtle flickering
        float flicker = sin(time * 1.5 + vDistance * 3.0) * 0.06 + 0.94;
        flicker += sin(time * 4.0 + audioLevel * 8.0) * audioLevel * 0.03;
        finalAlpha *= flicker;
        
        finalAlpha = clamp(finalAlpha, 0.05, 0.7);
        
        gl_FragColor = vec4(tendrilColor, finalAlpha);
    }
`;

// React component for the NarratorOrb
export default function NarratorOrb({ 
  audioLevel = 0, 
  intensity = 1.0, 
  breathingPhase = 0,
  particleCount = 8000,
  tendrilCount = 12,
  ...props 
}) {
  const meshRef = useRef();
  const tendrilRefs = useRef([]);
  const { scene } = useThree();

  // Create particle geometry and material
  const { geometry, material, tendrilGeometry, tendrilMaterial } = useMemo(() => {
    // Create particle positions in a sphere
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random position within sphere
      const radius = Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Color based on distance from center
      const distance = Math.sqrt(positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2);
      const normalizedDistance = distance / 3;
      
      // Luna color palette: purples, magentas, blues
      const hue = 0.7 + normalizedDistance * 0.2; // Purple to magenta
      const saturation = 0.8 + normalizedDistance * 0.2;
      const value = 0.6 + normalizedDistance * 0.4;
      
      // Convert HSV to RGB
      const h = hue * 6;
      const s = saturation;
      const v = value;
      const c = v * s;
      const x = c * (1 - Math.abs((h % 2) - 1));
      const m = v - c;
      
      let r, g, b;
      if (h < 1) {
        r = c; g = x; b = 0;
      } else if (h < 2) {
        r = x; g = c; b = 0;
      } else if (h < 3) {
        r = 0; g = c; b = x;
      } else if (h < 4) {
        r = 0; g = x; b = c;
      } else if (h < 5) {
        r = x; g = 0; b = c;
      } else {
        r = c; g = 0; b = x;
      }
      
      colors[i3] = r + m;
      colors[i3 + 1] = g + m;
      colors[i3 + 2] = b + m;
      
      sizes[i] = Math.random() * 2 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: nebulaVertexShader,
      fragmentShader: nebulaFragmentShader,
      uniforms: {
        time: { value: 0 },
        audioLevel: { value: audioLevel },
        breathingPhase: { value: breathingPhase },
        intensity: { value: intensity }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    // Create tendril geometry
    const tendrilGeometry = new THREE.BufferGeometry();
    const tendrilPositions = new Float32Array(tendrilCount * 100 * 3);
    const tendrilColors = new Float32Array(tendrilCount * 100 * 3);
    const tendrilSizes = new Float32Array(tendrilCount * 100);

    for (let t = 0; t < tendrilCount; t++) {
      for (let i = 0; i < 100; i++) {
        const index = t * 100 + i;
        const i3 = index * 3;
        
        // Create spiral tendril
        const angle = (t / tendrilCount) * Math.PI * 2 + (i / 100) * Math.PI * 4;
        const radius = 0.5 + (i / 100) * 2;
        const height = (i / 100) * 3;
        
        tendrilPositions[i3] = Math.cos(angle) * radius;
        tendrilPositions[i3 + 1] = height - 1.5;
        tendrilPositions[i3 + 2] = Math.sin(angle) * radius;
        
        // Color gradient along tendril
        const progress = i / 100;
        const hue = 0.7 + progress * 0.2; // Purple to magenta
        const saturation = 0.8 + progress * 0.2;
        const value = 0.6 + progress * 0.4;
        
        // Convert HSV to RGB
        const h = hue * 6;
        const s = saturation;
        const v = value;
        const c = v * s;
        const x = c * (1 - Math.abs((h % 2) - 1));
        const m = v - c;
        
        let r, g, b;
        if (h < 1) {
          r = c; g = x; b = 0;
        } else if (h < 2) {
          r = x; g = c; b = 0;
        } else if (h < 3) {
          r = 0; g = c; b = x;
        } else if (h < 4) {
          r = 0; g = x; b = c;
        } else if (h < 5) {
          r = x; g = 0; b = c;
        } else {
          r = c; g = 0; b = x;
        }
        
        tendrilColors[i3] = r + m;
        tendrilColors[i3 + 1] = g + m;
        tendrilColors[i3 + 2] = b + m;
        
        tendrilSizes[index] = Math.random() * 1.5 + 0.5;
      }
    }

    tendrilGeometry.setAttribute('position', new THREE.BufferAttribute(tendrilPositions, 3));
    tendrilGeometry.setAttribute('color', new THREE.BufferAttribute(tendrilColors, 3));
    tendrilGeometry.setAttribute('size', new THREE.BufferAttribute(tendrilSizes, 1));

    const tendrilMaterial = new THREE.ShaderMaterial({
      vertexShader: tendrilVertexShader,
      fragmentShader: tendrilFragmentShader,
      uniforms: {
        time: { value: 0 },
        audioLevel: { value: audioLevel },
        breathingPhase: { value: breathingPhase },
        intensity: { value: intensity }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    return { geometry, material, tendrilGeometry, tendrilMaterial };
  }, [particleCount, tendrilCount, audioLevel, breathingPhase, intensity]);

  // Animation loop
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Update uniforms
    material.uniforms.time.value = time;
    material.uniforms.audioLevel.value = audioLevel;
    material.uniforms.breathingPhase.value = breathingPhase;
    material.uniforms.intensity.value = intensity;
    
    tendrilMaterial.uniforms.time.value = time;
    tendrilMaterial.uniforms.audioLevel.value = audioLevel;
    tendrilMaterial.uniforms.breathingPhase.value = breathingPhase;
    tendrilMaterial.uniforms.intensity.value = intensity;
    
    // Rotate the orb slightly
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.1;
      meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.1;
    }
    
    // Animate tendrils
    tendrilRefs.current.forEach((tendril, index) => {
      if (tendril) {
        tendril.rotation.y = time * 0.05 + (index / tendrilCount) * Math.PI * 2;
        tendril.rotation.z = Math.sin(time * 0.1 + index) * 0.1;
      }
    });
  });

  return (
    <group {...props}>
      {/* Main nebula particles */}
      <points ref={meshRef} geometry={geometry} material={material} />
      
      {/* Tendrils */}
      {Array.from({ length: tendrilCount }, (_, index) => (
        <points
          key={index}
          ref={(el) => (tendrilRefs.current[index] = el)}
          geometry={tendrilGeometry}
          material={tendrilMaterial}
          position={[0, 0, 0]}
        />
      ))}
    </group>
  );
} 