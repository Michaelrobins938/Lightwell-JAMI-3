import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type EmotionalState = 
  | 'calm' 
  | 'anxious' 
  | 'depressed' 
  | 'angry' 
  | 'joyful' 
  | 'overwhelmed' 
  | 'focused' 
  | 'creative' 
  | 'vulnerable' 
  | 'empowered';

export interface EmotionalContextType {
  currentState: EmotionalState;
  intensity: number; // 0-10 scale
  setEmotionalState: (state: EmotionalState, intensity?: number) => void;
  emotionalHistory: Array<{ state: EmotionalState; intensity: number; timestamp: Date }>;
  isInCrisis: boolean;
  triggerCrisisMode: () => void;
  exitCrisisMode: () => void;
  getColorMode: () => string;
  getAnimationSpeed: () => string;
  getVoiceModulation: () => string;
}

const EmotionalContext = createContext<EmotionalContextType | undefined>(undefined);

interface EmotionalStateProviderProps {
  children: ReactNode;
}

export const EmotionalStateProvider: React.FC<EmotionalStateProviderProps> = ({ children }) => {
  const [currentState, setCurrentState] = useState<EmotionalState>('calm');
  const [intensity, setIntensity] = useState(5);
  const [emotionalHistory, setEmotionalHistory] = useState<Array<{ state: EmotionalState; intensity: number; timestamp: Date }>>([]);
  const [isInCrisis, setIsInCrisis] = useState(false);

  const setEmotionalState = (state: EmotionalState, newIntensity?: number) => {
    const newIntensityValue = newIntensity ?? intensity;
    
    setCurrentState(state);
    setIntensity(newIntensityValue);
    
    setEmotionalHistory(prev => [
      ...prev,
      { state, intensity: newIntensityValue, timestamp: new Date() }
    ].slice(-50)); // Keep last 50 entries
  };

  const triggerCrisisMode = () => {
    setIsInCrisis(true);
    setEmotionalState('overwhelmed', 10);
  };

  const exitCrisisMode = () => {
    setIsInCrisis(false);
    setEmotionalState('calm', 3);
  };

  const getColorMode = (): string => {
    if (isInCrisis) return 'crisis';
    
    switch (currentState) {
      case 'calm':
        return 'calm';
      case 'anxious':
        return 'anxious';
      case 'depressed':
        return 'depressed';
      case 'angry':
        return 'angry';
      case 'joyful':
        return 'joyful';
      case 'overwhelmed':
        return 'overwhelmed';
      case 'focused':
        return 'focused';
      case 'creative':
        return 'creative';
      case 'vulnerable':
        return 'vulnerable';
      case 'empowered':
        return 'empowered';
      default:
        return 'neutral';
    }
  };

  const getAnimationSpeed = (): string => {
    if (isInCrisis) return 'slow';
    
    switch (currentState) {
      case 'anxious':
      case 'angry':
      case 'overwhelmed':
        return 'fast';
      case 'calm':
      case 'depressed':
        return 'slow';
      case 'joyful':
      case 'creative':
        return 'medium';
      default:
        return 'medium';
    }
  };

  const getVoiceModulation = (): string => {
    if (isInCrisis) return 'gentle';
    
    switch (currentState) {
      case 'vulnerable':
      case 'depressed':
        return 'gentle';
      case 'angry':
      case 'overwhelmed':
        return 'grounding';
      case 'anxious':
        return 'calming';
      case 'joyful':
        return 'celebratory';
      case 'creative':
        return 'inspirational';
      default:
        return 'neutral';
    }
  };

  const value: EmotionalContextType = {
    currentState,
    intensity,
    setEmotionalState,
    emotionalHistory,
    isInCrisis,
    triggerCrisisMode,
    exitCrisisMode,
    getColorMode,
    getAnimationSpeed,
    getVoiceModulation,
  };

  return (
    <EmotionalContext.Provider value={value}>
      {children}
    </EmotionalContext.Provider>
  );
};

export const useEmotionalState = (): EmotionalContextType => {
  const context = useContext(EmotionalContext);
  if (context === undefined) {
    throw new Error('useEmotionalState must be used within an EmotionalStateProvider');
  }
  return context;
}; 