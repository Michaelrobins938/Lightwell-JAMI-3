'use client'

import React, { useState, useRef, useEffect } from 'react';
import { AudioReactiveOrb } from './AudioReactiveOrb';
import { JamieOrbVisualizer } from '../therapeutic/JamieOrbVisualizer';
import { useEnhancedJamieSpeech } from '../../hooks/useEnhancedJamieSpeech';

// Demo component showing how to integrate the new audio-reactive orb
export function AudioReactiveOrbDemo() {
  const [selectedDemo, setSelectedDemo] = useState<'standalone' | 'integrated'>('standalone');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState('');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Enhanced speech hook for demonstration
  const speech = useEnhancedJamieSpeech({
    useWebSpeech: true, // Enable Web Speech for demo
    ttsAudioElement: audioRef.current || undefined,
  });
  
  // Demo texts for testing
  const demoTexts = [
    "Hello! I'm Jamie, your AI therapeutic assistant. How are you feeling today?",
    "I understand that you're going through a difficult time. Let's explore these feelings together.",
    "Remember to take deep breaths. In through your nose, hold for four counts, and out through your mouth.",
    "You've shown incredible strength by reaching out. That takes courage, and I'm proud of you.",
    "Sometimes the smallest step in the right direction ends up being the biggest step of your life."
  ];
  
  // Emotional states for testing
  const emotionalStates = [
    { state: 'calm', intensity: 5 },
    { state: 'anxious', intensity: 7 },
    { state: 'hopeful', intensity: 6 },
    { state: 'compassionate', intensity: 8 },
    { state: 'encouraging', intensity: 7 }
  ];
  
  const [currentEmotion, setCurrentEmotion] = useState(emotionalStates[0]);
  
  // Handle file upload for testing with custom audio
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && audioRef.current) {
      const url = URL.createObjectURL(file);
      audioRef.current.src = url;
      audioRef.current.load();
    }
  };
  
  // Play demo text
  const playDemoText = (text: string, emotion: typeof emotionalStates[0]) => {
    setCurrentText(text);
    setCurrentEmotion(emotion);
    speech.speak(text);
  };
  
  // Test with uploaded audio
  const playUploadedAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  
  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Audio-Reactive Orb Demo
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Experience the battle-tested audio-reactive orb system with real-time spectral analysis, 
          envelope following, and burst effects synchronized to speech patterns.
        </p>
      </div>
      
      {/* Demo Mode Selector */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setSelectedDemo('standalone')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedDemo === 'standalone'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Standalone Orb
        </button>
        <button
          onClick={() => setSelectedDemo('integrated')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedDemo === 'integrated'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Integrated Jamie Orb
        </button>
      </div>
      
      {/* Controls */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Controls</h3>
        
        {/* Demo Text Buttons */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Try Demo Phrases:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {demoTexts.map((text, index) => (
              <button
                key={index}
                onClick={() => playDemoText(text, emotionalStates[index % emotionalStates.length])}
                className="p-3 text-left bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm"
                disabled={speech.isSpeaking}
              >
                <div className="font-medium text-gray-800 mb-1">
                  {emotionalStates[index % emotionalStates.length].state} (intensity: {emotionalStates[index % emotionalStates.length].intensity})
                </div>
                <div className="text-gray-600 line-clamp-2">
                  {text}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* File Upload */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Upload Audio File:</h4>
          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={playUploadedAudio}
              disabled={!audioRef.current?.src || isPlaying}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Play Uploaded Audio
            </button>
          </div>
        </div>
        
        {/* Stop Button */}
        <button
          onClick={speech.stop}
          disabled={!speech.isSpeaking && !isPlaying}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Stop
        </button>
        
        {/* Status */}
        <div className="text-sm text-gray-600">
          Status: {speech.isSpeaking || isPlaying ? 'Playing' : 'Ready'} |
          Analysis: {speech.isInitialized ? 'Active' : 'Inactive'} |
          {speech.error && <span className="text-red-600"> Error: {speech.error}</span>}
        </div>
      </div>
      
      {/* Orb Display */}
      <div className="bg-black rounded-lg p-8 min-h-[400px] flex items-center justify-center">
        {selectedDemo === 'standalone' ? (
          <div className="w-80 h-80">
            <AudioReactiveOrb
              analysisService={speech.analysisService}
              particleCount={8000}
            />
          </div>
        ) : (
          <div className="w-80 h-80">
            <JamieOrbVisualizer
              textToSpeak={currentText}
              emotionalState={currentEmotion}
              audioElement={audioRef.current || undefined}
              useEnhancedVisuals={true}
            />
          </div>
        )}
      </div>
      
      {/* Analysis Data Display */}
      {speech.isInitialized && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Real-time Analysis</h3>
          <AnalysisDisplay analysisService={speech.analysisService} />
        </div>
      )}
      
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        className="hidden"
        preload="metadata"
      />
      
      {/* Technical Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Technical Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">Audio Analysis</h4>
            <ul className="space-y-1">
              <li>• Envelope follower (30ms attack, 120ms release)</li>
              <li>• Spectral band analysis (low-mid, high)</li>
              <li>• Onset detection for syllables/words</li>
              <li>• Spectral centroid for pitch tracking</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Visual Effects</h4>
            <ul className="space-y-1">
              <li>• Instanced particle system (8k+ particles)</li>
              <li>• Curl noise flow field</li>
              <li>• Burst effects on speech onsets</li>
              <li>• Dynamic hue mapping from pitch</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component to display real-time analysis data
function AnalysisDisplay({ analysisService }: { analysisService: any }) {
  const [analysisData, setAnalysisData] = useState<any>(null);
  
  useEffect(() => {
    if (!analysisService) return;
    
    const interval = setInterval(() => {
      const data = analysisService.getLastAnalysis();
      setAnalysisData(data);
    }, 100);
    
    return () => clearInterval(interval);
  }, [analysisService]);
  
  if (!analysisData) {
    return <div className="text-gray-500">No analysis data</div>;
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div className="bg-white p-3 rounded border">
        <div className="font-medium text-gray-700">Envelope</div>
        <div className="text-2xl font-bold text-blue-600">
          {(analysisData.envelope * 100).toFixed(1)}%
        </div>
      </div>
      <div className="bg-white p-3 rounded border">
        <div className="font-medium text-gray-700">Low-Mid</div>
        <div className="text-2xl font-bold text-green-600">
          {(analysisData.lowMid * 100).toFixed(1)}%
        </div>
      </div>
      <div className="bg-white p-3 rounded border">
        <div className="font-medium text-gray-700">High Freq</div>
        <div className="text-2xl font-bold text-purple-600">
          {(analysisData.high * 100).toFixed(1)}%
        </div>
      </div>
      <div className="bg-white p-3 rounded border">
        <div className="font-medium text-gray-700">Centroid</div>
        <div className="text-2xl font-bold text-orange-600">
          {(analysisData.spectralCentroid * 100).toFixed(1)}%
        </div>
      </div>
      <div className="bg-white p-3 rounded border col-span-2">
        <div className="font-medium text-gray-700">Onsets</div>
        <div className="flex space-x-4">
          <span className={`px-2 py-1 rounded text-xs ${analysisData.syllableOnset ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'}`}>
            Syllable
          </span>
          <span className={`px-2 py-1 rounded text-xs ${analysisData.wordBoundary ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-600'}`}>
            Word
          </span>
        </div>
      </div>
      <div className="bg-white p-3 rounded border col-span-2">
        <div className="font-medium text-gray-700">Status</div>
        <div className="text-sm">
          {analysisData.isSilent ? 
            <span className="text-gray-500">Silent</span> : 
            <span className="text-green-600">Active</span>
          }
          <span className="ml-2 text-gray-400">
            (Raw: {(analysisData.rawLevel * 100).toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
}