import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useEmotionalState } from './EmotionalStateProvider';
import { Heart, Brain, Star, Shield, Eye, Zap, Moon, Sun } from 'lucide-react';

interface TherapeuticCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export const TherapeuticCanvas: React.FC<TherapeuticCanvasProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentState, intensity, getColorMode, getAnimationSpeed } = useEmotionalState();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; type: string }>>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Generate emotional particles based on state
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const particleCount = Math.floor(intensity * 2);
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          type: getParticleType(currentState)
        });
      }
      
      setParticles(newParticles);
    };

    generateParticles();
  }, [currentState, intensity]);

  const getParticleType = (state: string): string => {
    switch (state) {
      case 'calm':
        return 'peaceful';
      case 'anxious':
        return 'nervous';
      case 'joyful':
        return 'sparkle';
      case 'creative':
        return 'inspiration';
      case 'vulnerable':
        return 'gentle';
      case 'empowered':
        return 'strong';
      default:
        return 'neutral';
    }
  };

  const getBackgroundGradient = (): string => {
    const colorMode = getColorMode();
    
    switch (colorMode) {
      case 'calm':
        return 'bg-gradient-to-br from-luna-100 via-blue-50 to-growth-100';
      case 'anxious':
        return 'bg-gradient-to-br from-yellow-100 via-orange-50 to-red-50';
      case 'depressed':
        return 'bg-gradient-to-br from-shadow-100 via-gray-50 to-shadow-200';
      case 'angry':
        return 'bg-gradient-to-br from-red-100 via-orange-50 to-yellow-50';
      case 'joyful':
        return 'bg-gradient-to-br from-compassion-100 via-pink-50 to-dream-100';
      case 'creative':
        return 'bg-gradient-to-br from-dream-100 via-purple-50 to-luna-100';
      case 'vulnerable':
        return 'bg-gradient-to-br from-compassion-50 via-pink-25 to-luna-50';
      case 'empowered':
        return 'bg-gradient-to-br from-growth-100 via-green-50 to-luna-100';
      case 'crisis':
        return 'bg-gradient-to-br from-red-50 via-pink-25 to-compassion-50';
      default:
        return 'bg-gradient-to-br from-luna-100 via-blue-50 to-growth-100';
    }
  };

  const getAnimationDuration = (): number => {
    const speed = getAnimationSpeed();
    switch (speed) {
      case 'fast':
        return 0.3;
      case 'slow':
        return 0.8;
      default:
        return 0.5;
    }
  };

  return (
    <motion.div
      ref={canvasRef}
      className={`relative min-h-screen w-full overflow-hidden ${getBackgroundGradient()} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: getAnimationDuration() }}
    >
      {/* Emotional Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute w-2 h-2 rounded-full ${
            particle.type === 'peaceful' ? 'bg-luna-300' :
            particle.type === 'nervous' ? 'bg-yellow-400' :
            particle.type === 'sparkle' ? 'bg-compassion-400' :
            particle.type === 'inspiration' ? 'bg-dream-400' :
            particle.type === 'gentle' ? 'bg-compassion-300' :
            particle.type === 'strong' ? 'bg-growth-400' :
            'bg-luna-400'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0, 1, 0],
            y: [-20, -100],
            x: [0, Math.random() * 100 - 50]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Emotional State Indicator */}
      <motion.div
        className="absolute top-4 right-4 glass rounded-full p-3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <motion.div
          className="flex items-center space-x-2"
          animate={{
            scale: intensity > 7 ? [1, 1.1, 1] : 1
          }}
          transition={{
            duration: 2,
            repeat: intensity > 7 ? Infinity : 0
          }}
        >
          {currentState === 'calm' && <Moon className="w-6 h-6 text-luna-500" />}
          {currentState === 'anxious' && <Zap className="w-6 h-6 text-yellow-500" />}
          {currentState === 'joyful' && <Star className="w-6 h-6 text-compassion-500" />}
          {currentState === 'creative' && <Brain className="w-6 h-6 text-dream-500" />}
          {currentState === 'vulnerable' && <Heart className="w-6 h-6 text-compassion-500" />}
          {currentState === 'empowered' && <Shield className="w-6 h-6 text-growth-500" />}
          {currentState === 'focused' && <Eye className="w-6 h-6 text-luna-500" />}
          {currentState === 'depressed' && <Moon className="w-6 h-6 text-shadow-500" />}
          {currentState === 'angry' && <Zap className="w-6 h-6 text-red-500" />}
          {currentState === 'overwhelmed' && <Zap className="w-6 h-6 text-orange-500" />}
        </motion.div>
      </motion.div>

      {/* Breathing UI */}
      <motion.div
        className="absolute bottom-4 left-4 glass rounded-full p-4"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-8 h-8 rounded-full bg-luna-300 opacity-60" />
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        className="relative z-10 h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: getAnimationDuration() }}
      >
        {children}
      </motion.div>

      {/* Emotional Wave Effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-luna-400 to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}; 