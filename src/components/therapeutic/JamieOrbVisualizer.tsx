import React, { useEffect, useRef, useState } from 'react';
import { useJamieSpeech } from './useJamieSpeech';
import { JamieOrbOverlay } from './JamieOrbOverlay';

import { NarratorOrbComponent } from '../visuals/NarratorOrb';
import { AudioReactiveOrb } from '../visuals/AudioReactiveOrb';
import { AudioAnalysisService, createAudioAnalysisFromElement } from '../../services/audioAnalysisService';

interface JamieOrbVisualizerProps {
  textToSpeak: string;
  emotionalState: {
    state: string;
    intensity: number;
  };
  audioElement?: HTMLAudioElement; // For connecting to TTS audio
  useEnhancedVisuals?: boolean;   // Toggle between old and new orb
}

export const JamieOrbVisualizer: React.FC<JamieOrbVisualizerProps> = ({ 
  textToSpeak, 
  emotionalState,
  audioElement,
  useEnhancedVisuals = true
}) => {
  const { speak, analyser, isSpeaking } = useJamieSpeech();
  const [audioAnalysisService, setAudioAnalysisService] = useState<AudioAnalysisService | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  // Speak when textToSpeak changes (currently disabled in hook)
  useEffect(() => {
    if (textToSpeak) {
      speak(textToSpeak);
    }
  }, [textToSpeak, speak]);

  // Initialize audio analysis service when audioElement is provided
  useEffect(() => {
    if (!audioElement || !useEnhancedVisuals) return;

    try {
      const analysisService = createAudioAnalysisFromElement(audioElement, {
        // Tune for TTS characteristics
        attackTime: 0.02,     // Faster attack for speech
        releaseTime: 0.08,    // Faster release for speech
        onsetThreshold: 0.08, // Lower threshold for TTS
        fftSize: 1024         // Good balance for performance
      });
      
      setAudioAnalysisService(analysisService);
      
      return () => {
        analysisService.dispose();
      };
    } catch (error) {
      console.warn('Failed to create audio analysis service:', error);
    }
  }, [audioElement, useEnhancedVisuals]);

  // Fallback audio level calculation for legacy orb
  useEffect(() => {
    if (!analyser || useEnhancedVisuals) return;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const updateAudioLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setAudioLevel(average / 256);
    };
    
    const interval = setInterval(updateAudioLevel, 100);
    return () => clearInterval(interval);
  }, [analyser, useEnhancedVisuals]);

  // Map emotional state to intensity
  const getEmotionalIntensity = () => {
    return emotionalState.intensity || 0.5;
  };

  // Determine particle count based on device performance
  const getParticleCount = () => {
    const isMobile = window.innerWidth <= 768;
    const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    
    if (isMobile || isLowPower) {
      return useEnhancedVisuals ? 6000 : 4000;
    }
    return useEnhancedVisuals ? 12000 : 8000;
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
        {useEnhancedVisuals && audioAnalysisService ? (
          // New battle-tested audio-reactive orb
          <AudioReactiveOrb
            analysisService={audioAnalysisService}
            particleCount={getParticleCount()}
          />
        ) : (
          // Use NarratorOrb for consistent 3D rendering
          <NarratorOrbComponent
            isVisible={true}
            intensity={getEmotionalIntensity()}
            audioLevel={audioLevel}
            className="w-full h-full"
          />
        )}
      </div>
      <JamieOrbOverlay 
        emotionalState={emotionalState} 
        showMoodLabel 
      />
    </div>
  );
}; 