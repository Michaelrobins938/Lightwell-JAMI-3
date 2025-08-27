import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface EmotionalState {
  state: string;
  intensity: number; // 0-10
  confidence?: number;
  secondaryEmotions?: string[];
}

interface EnhancedAITherapistOrbProps {
  emotionalState: EmotionalState;
  isSpeaking?: boolean;
  isListening?: boolean;
  isThinking?: boolean;
  isResponding?: boolean;
  audioData?: number[];
  className?: string;
}

// Enhanced emotional state mapping
const emotionalStateConfig = {
  calm: {
    color: '#4F46E5',
    size: 0.8,
    speed: 0.5,
    pulse: false,
    particles: 1000,
    opacity: 0.6
  },
  anxious: {
    color: '#F59E0B',
    size: 1.2,
    speed: 2.0,
    pulse: true,
    particles: 1500,
    opacity: 0.8
  },
  sad: {
    color: '#6B7280',
    size: 0.6,
    speed: 0.3,
    pulse: false,
    particles: 800,
    opacity: 0.4
  },
  angry: {
    color: '#DC2626',
    size: 1.5,
    speed: 3.0,
    pulse: true,
    particles: 2000,
    opacity: 0.9
  },
  happy: {
    color: '#10B981',
    size: 1.0,
    speed: 1.0,
    pulse: false,
    particles: 1200,
    opacity: 0.7
  },
  excited: {
    color: '#F97316',
    size: 1.3,
    speed: 2.5,
    pulse: true,
    particles: 1800,
    opacity: 0.8
  },
  confused: {
    color: '#8B5CF6',
    size: 0.9,
    speed: 1.5,
    pulse: true,
    particles: 1100,
    opacity: 0.6
  },
  fearful: {
    color: '#7C3AED',
    size: 1.4,
    speed: 2.8,
    pulse: true,
    particles: 1600,
    opacity: 0.8
  },
  grateful: {
    color: '#059669',
    size: 0.9,
    speed: 0.8,
    pulse: false,
    particles: 1000,
    opacity: 0.7
  },
  hopeful: {
    color: '#0EA5E9',
    size: 0.8,
    speed: 0.6,
    pulse: false,
    particles: 900,
    opacity: 0.6
  },
  overwhelmed: {
    color: '#EC4899',
    size: 1.6,
    speed: 3.5,
    pulse: true,
    particles: 2200,
    opacity: 0.9
  },
  peaceful: {
    color: '#06B6D4',
    size: 0.7,
    speed: 0.4,
    pulse: false,
    particles: 700,
    opacity: 0.5
  },
  determined: {
    color: '#DC2626',
    size: 1.1,
    speed: 1.2,
    pulse: false,
    particles: 1300,
    opacity: 0.8
  },
  curious: {
    color: '#8B5CF6',
    size: 0.9,
    speed: 1.1,
    pulse: false,
    particles: 1000,
    opacity: 0.6
  },
  content: {
    color: '#10B981',
    size: 0.8,
    speed: 0.5,
    pulse: false,
    particles: 900,
    opacity: 0.6
  },
  distressed: {
    color: '#EF4444',
    size: 1.7,
    speed: 4.0,
    pulse: true,
    particles: 2500,
    opacity: 1.0
  }
};

function OrbParticles({ 
  emotionalState, 
  isSpeaking, 
  isListening, 
  isThinking, 
  isResponding,
  audioData 
}: {
  emotionalState: EmotionalState;
  isSpeaking?: boolean;
  isListening?: boolean;
  isThinking?: boolean;
  isResponding?: boolean;
  audioData?: number[];
}) {
  const pointsRef = useRef<any>(null);
  const meshRef = useRef<any>(null);
  const { camera } = useThree();
  
  const config = emotionalStateConfig[emotionalState.state as keyof typeof emotionalStateConfig] || emotionalStateConfig.calm;
  
  // Generate particles based on emotional state
  const particles = useMemo(() => {
    const particleCount = Math.min(config.particles, 2000); // Limit for performance
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const radius = config.size * (0.8 + Math.random() * 0.4);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Add slight random velocities for organic movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    
    return { positions, velocities, count: particleCount };
  }, [config]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const baseSpeed = config.speed;
    
    // Apply different behaviors based on state
    let speed = baseSpeed;
    let rotationSpeed = 0.5;
    let breathingIntensity = 0.03; // Base breathing
    
    if (isSpeaking) {
      speed *= 1.5;
      rotationSpeed *= 1.2;
      breathingIntensity = 0.08; // More dramatic breathing when speaking
    }
    
    if (isListening) {
      speed *= 0.8;
      rotationSpeed *= 0.7;
      breathingIntensity = 0.05; // Gentle breathing when listening
    }
    
    if (isThinking) {
      speed *= 0.6;
      rotationSpeed *= 0.5;
      breathingIntensity = 0.04;
    }
    
    if (isResponding) {
      speed *= 1.3;
      rotationSpeed *= 1.1;
      breathingIntensity = 0.06;
    }
    
    // Rotate the entire particle system
    pointsRef.current.rotation.x = Math.sin(time * rotationSpeed * 0.5) * 0.1;
    pointsRef.current.rotation.y = time * rotationSpeed;
    pointsRef.current.rotation.z = Math.sin(time * rotationSpeed * 0.3) * 0.05;
    
    // Base breathing animation (like a living organism)
    let baseScale = 1 + Math.sin(time * 2) * breathingIntensity;
    
    // Apply audio-reactive effects if audio data is available
    if (audioData && audioData.length > 0 && isSpeaking) {
      const audioIntensity = audioData.reduce((sum, val) => sum + Math.abs(val), 0) / audioData.length;
      // Make audio reactivity more pronounced
      const audioScale = 1 + audioIntensity * 0.5;
      baseScale *= audioScale;
    }
    
    // Apply pulsing effect for certain emotional states
    if (config.pulse) {
      baseScale *= 1 + Math.sin(time * 3) * 0.1;
    }
    
    // Intensity-based scaling
    const intensityScale = 0.8 + (emotionalState.intensity / 10) * 0.4;
    const finalScale = baseScale * intensityScale;
    pointsRef.current.scale.setScalar(finalScale);
  });

  return (
    <Points ref={pointsRef} positions={particles.positions}>
      <PointMaterial
        transparent
        size={2.5}
        sizeAttenuation={true}
        depthWrite={false}
        color={config.color}
        opacity={config.opacity}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function OrbCore({ emotionalState, isSpeaking, isListening }: {
  emotionalState: EmotionalState;
  isSpeaking?: boolean;
  isListening?: boolean;
}) {
  const coreRef = useRef<any>(null);
  const config = emotionalStateConfig[emotionalState.state as keyof typeof emotionalStateConfig] || emotionalStateConfig.calm;
  
  useFrame((state) => {
    if (!coreRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Base breathing effect (gentle, like a heartbeat)
    let breathingIntensity = 0.08;
    if (isSpeaking) breathingIntensity = 0.15; // More pronounced when speaking
    if (isListening) breathingIntensity = 0.05; // Gentler when listening
    
    const breathingScale = 1 + Math.sin(time * 2.5) * breathingIntensity;
    coreRef.current.scale.setScalar(breathingScale);
    
    // Speaking effect - rapid micro-pulsations
    if (isSpeaking) {
      const speakScale = 1 + Math.sin(time * 12) * 0.03;
      coreRef.current.scale.multiplyScalar(speakScale);
    }
    
    // Listening effect - slow, attentive pulse
    if (isListening) {
      const listenScale = 1 + Math.sin(time * 3) * 0.02;
      coreRef.current.scale.multiplyScalar(listenScale);
    }
    
    // Subtle rotation for life-like movement
    coreRef.current.rotation.y = time * 0.1;
  });

  return (
    <Sphere ref={coreRef} args={[0.35, 24, 24]}>
      <meshStandardMaterial
        color={new THREE.Color(config.color)}
        transparent
        opacity={0.4}
        emissive={new THREE.Color(config.color)}
        emissiveIntensity={isSpeaking ? 0.4 : 0.15}
        roughness={0.1}
        metalness={0.2}
      />
    </Sphere>
  );
}

function OrbRings({ emotionalState, isThinking }: {
  emotionalState: EmotionalState;
  isThinking?: boolean;
}) {
  const orbGroupRef = useRef<any>(null);
  const ringsRef = useRef<any>(null);
  const config = emotionalStateConfig[emotionalState.state as keyof typeof emotionalStateConfig] || emotionalStateConfig.calm;
  
  useFrame((state) => {
    if (!ringsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Rotate rings
    ringsRef.current.rotation.x = time * 0.3;
    ringsRef.current.rotation.y = time * 0.5;
    ringsRef.current.rotation.z = time * 0.2;
    
    // Thinking effect - faster rotation
    if (isThinking) {
      ringsRef.current.rotation.x *= 2;
      ringsRef.current.rotation.y *= 2;
      ringsRef.current.rotation.z *= 2;
    }
  });

  return (
    <group ref={ringsRef}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0, 0]}>
          <ringGeometry args={[0.8 + i * 0.3, 0.9 + i * 0.3, 32]} />
          <meshStandardMaterial
            color={new THREE.Color(config.color)}
            transparent
            opacity={0.1 - i * 0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export function EnhancedAITherapistOrb({
  emotionalState,
  isSpeaking = false,
  isListening = false,
  isThinking = false,
  isResponding = false,
  audioData,
  className = ''
}: EnhancedAITherapistOrbProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const config = emotionalStateConfig[emotionalState.state as keyof typeof emotionalStateConfig] || emotionalStateConfig.calm;

  // Add error boundary effect
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('EnhancedAITherapistOrb error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Error boundary for the 3D component
  if (hasError) {
    return (
      <motion.div
        className={`relative ${className}`}
        style={{ width: '200px', height: '200px' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <div className="text-blue-600 text-sm text-center">
            <div>Orb Unavailable</div>
            <div className="text-xs opacity-75">3D rendering error</div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {(() => {
        try {
          return (
            <Canvas
              camera={{ position: [0, 0, 5], fov: 75 }}
              style={{ width: '200px', height: '200px' }}
              gl={{ 
                antialias: true, 
                alpha: true, 
                powerPreference: "high-performance"
              }}
              dpr={[1, 2]}
              frameloop="always"
              onError={() => setHasError(true)}
            >
              <ambientLight intensity={0.4} />
              <pointLight position={[5, 5, 5]} intensity={1.2} />
              <pointLight position={[-5, -5, -5]} intensity={0.6} />
              <pointLight position={[0, 0, 10]} intensity={0.8} />
              
              <OrbCore 
                emotionalState={emotionalState}
                isSpeaking={isSpeaking}
                isListening={isListening}
              />
              
              <OrbRings 
                emotionalState={emotionalState}
                isThinking={isThinking}
              />
              
              <OrbParticles
                emotionalState={emotionalState}
                isSpeaking={isSpeaking}
                isListening={isListening}
                isThinking={isThinking}
                isResponding={isResponding}
                audioData={audioData}
              />
            </Canvas>
          );
        } catch (error) {
          console.error('Canvas rendering error:', error);
          setHasError(true);
          return (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <div className="text-blue-600 text-sm text-center">
                <div>Orb Unavailable</div>
                <div className="text-xs opacity-75">3D rendering error</div>
              </div>
            </div>
          );
        }
      })()}
      
      {/* Status indicators */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {isSpeaking && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-blue-500 rounded-full"
          />
        )}
        {isListening && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
        )}
        {isThinking && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-yellow-500 rounded-full"
          />
        )}
        {isResponding && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-purple-500 rounded-full"
          />
        )}
      </div>
      
      {/* Emotional state label */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap"
        >
          {emotionalState.state.charAt(0).toUpperCase() + emotionalState.state.slice(1)}
          <br />
          <span className="text-xs opacity-75">
            Intensity: {emotionalState.intensity}/10
          </span>
        </motion.div>
      )}
    </motion.div>
  );
} 