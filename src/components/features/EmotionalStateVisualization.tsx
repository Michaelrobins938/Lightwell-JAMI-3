import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmotionalState {
  id: string;
  emotion: string;
  intensity: number; // 1-10
  valence: number; // -5 to +5
  timestamp: Date;
  context: string;
  triggers: string[];
  copingStrategies: string[];
}

interface EmotionalPattern {
  emotion: string;
  frequency: number;
  averageIntensity: number;
  averageValence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

const emotions = [
  'Joy', 'Contentment', 'Excitement', 'Gratitude', 'Love',
  'Sadness', 'Anger', 'Fear', 'Anxiety', 'Shame',
  'Guilt', 'Confusion', 'Frustration', 'Hope', 'Pride'
];

const triggers = [
  'Work stress', 'Relationship conflict', 'Health concerns', 'Financial worries',
  'Social interaction', 'Personal achievement', 'Unexpected events', 'Routine changes'
];

const copingStrategies = [
  'Deep breathing', 'Mindfulness meditation', 'Physical exercise', 'Social support',
  'Creative expression', 'Problem-solving', 'Self-compassion', 'Professional help'
];

export default function EmotionalStateVisualization() {
  const [emotionalStates, setEmotionalStates] = useState<EmotionalState[]>([]);
  const [patterns, setPatterns] = useState<EmotionalPattern[]>([]);
  const [isTracking, setIsTracking] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  // Simulate real-time emotional tracking
  useEffect(() => {
    if (!isTracking) return;

    const generateEmotionalState = () => {
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      const intensity = Math.floor(Math.random() * 10) + 1;
      const valence = Math.floor(Math.random() * 11) - 5; // -5 to +5
      
      const newState: EmotionalState = {
        id: `emotion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        emotion,
        intensity,
        valence,
        timestamp: new Date(),
        context: `User experiencing ${emotion.toLowerCase()} in current situation`,
        triggers: triggers.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1),
        copingStrategies: copingStrategies.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1)
      };

      setEmotionalStates(prev => [newState, ...prev.slice(0, 19)]); // Keep last 20
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance of emotional state
        generateEmotionalState();
      }
    }, 2000 + Math.random() * 3000); // Random interval 2-5 seconds

    return () => clearInterval(interval);
  }, [isTracking]);

  // Analyze emotional patterns
  useEffect(() => {
    if (emotionalStates.length === 0) return;

    const emotionMap = new Map<string, { count: number; intensities: number[]; valences: number[] }>();
    
    emotionalStates.forEach(state => {
      if (!emotionMap.has(state.emotion)) {
        emotionMap.set(state.emotion, { count: 0, intensities: [], valences: [] });
      }
      const existing = emotionMap.get(state.emotion)!;
      existing.count++;
      existing.intensities.push(state.intensity);
      existing.valences.push(state.valence);
    });

    const newPatterns: EmotionalPattern[] = Array.from(emotionMap.entries()).map(([emotion, data]) => {
      const avgIntensity = data.intensities.reduce((a, b) => a + b, 0) / data.intensities.length;
      const avgValence = data.valences.reduce((a, b) => a + b, 0) / data.valences.length;
      
      // Simple trend calculation
      const recentStates = emotionalStates
        .filter(s => s.emotion === emotion)
        .slice(-3);
      const trend = recentStates.length >= 2 
        ? (recentStates[recentStates.length - 1].valence > recentStates[0].valence ? 'increasing' : 'decreasing')
        : 'stable';

      return {
        emotion,
        frequency: data.count,
        averageIntensity: avgIntensity,
        averageValence: avgValence,
        trend
      };
    });

    setPatterns(newPatterns.sort((a, b) => b.frequency - a.frequency));
  }, [emotionalStates]);

  const getValenceColor = (valence: number) => {
    if (valence >= 3) return 'text-green-600';
    if (valence >= 1) return 'text-blue-600';
    if (valence >= -1) return 'text-gray-600';
    if (valence >= -3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return 'text-red-600';
    if (intensity >= 6) return 'text-orange-600';
    if (intensity >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↗️';
      case 'decreasing': return '↘️';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          ❤️ Real-Time Emotional Intelligence
        </h3>
        <p className="text-gray-600">
          Continuous emotional state analysis with pattern recognition and therapeutic insights
        </p>
      </div>

      {/* Tracking Controls */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-gray-700">
              {isTracking ? 'Emotional Tracking Active' : 'Tracking Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsTracking(!isTracking)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isTracking 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isTracking ? 'Pause Tracking' : 'Resume Tracking'}
          </button>
        </div>
      </div>

      {/* Current Emotional State */}
      {emotionalStates.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <h4 className="text-lg font-semibold">🎭 Current Emotional State</h4>
            <p className="text-blue-100 text-sm">Real-time emotional monitoring and analysis</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Latest Emotional State */}
              <div>
                <h5 className="font-semibold text-gray-700 mb-3">Latest Detection</h5>
                {(() => {
                  const latest = emotionalStates[0];
                  return (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-gray-800">{latest.emotion}</span>
                        <span className={`text-lg font-semibold ${getValenceColor(latest.valence)}`}>
                          {latest.valence > 0 ? '+' : ''}{latest.valence}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Intensity:</span>
                          <span className={`font-medium ${getIntensityColor(latest.intensity)}`}>
                            {latest.intensity}/10
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Time:</span>
                          <span className="text-sm text-gray-800">
                            {latest.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mt-3">{latest.context}</p>
                    </div>
                  );
                })()}
              </div>

              {/* Emotional Trends */}
              <div>
                <h5 className="font-semibold text-gray-700 mb-3">Emotional Trends</h5>
                <div className="space-y-3">
                  {patterns.slice(0, 5).map(pattern => (
                    <div key={pattern.emotion} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{pattern.emotion}</span>
                        <span className={`text-sm ${getTrendColor(pattern.trend)}`}>
                          {getTrendIcon(pattern.trend)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-800">
                          {pattern.frequency} occurrences
                        </div>
                        <div className="text-xs text-gray-600">
                          Avg: {pattern.averageIntensity.toFixed(1)} intensity, {pattern.averageValence.toFixed(1)} valence
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emotional Pattern Analysis */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4">
          <h4 className="text-lg font-semibold">📊 Pattern Recognition Analysis</h4>
          <p className="text-green-100 text-sm">Identifying recurring emotional themes and triggers</p>
        </div>
        
        <div className="p-6">
          {patterns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📈</div>
              <p>Collecting emotional data for pattern analysis</p>
              <p className="text-sm">Patterns will appear as more data is collected</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patterns.map((pattern, index) => (
                <motion.div
                  key={pattern.emotion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedEmotion(pattern.emotion === selectedEmotion ? null : pattern.emotion)}
                >
                  <div className="text-center">
                    <h5 className="font-semibold text-gray-800 mb-2">{pattern.emotion}</h5>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Frequency:</span>
                        <span className="font-medium text-blue-600">{pattern.frequency}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Avg Intensity:</span>
                        <span className={`font-medium ${getIntensityColor(Math.round(pattern.averageIntensity))}`}>
                          {pattern.averageIntensity.toFixed(1)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Avg Valence:</span>
                        <span className={`font-medium ${getValenceColor(Math.round(pattern.averageValence))}`}>
                          {pattern.averageValence > 0 ? '+' : ''}{pattern.averageValence.toFixed(1)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Trend:</span>
                        <span className={`font-medium ${getTrendColor(pattern.trend)}`}>
                          {getTrendIcon(pattern.trend)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Emotional States */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 p-4 border-b">
          <h4 className="text-lg font-semibold text-gray-800">📝 Emotional State History</h4>
          <p className="text-gray-600 text-sm">Detailed tracking of emotional experiences and responses</p>
        </div>
        
        <div className="p-4">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {emotionalStates.map((state, index) => (
                <motion.div
                  key={state.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-semibold text-gray-800">{state.emotion}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getValenceColor(state.valence)}`}>
                          Valence: {state.valence > 0 ? '+' : ''}{state.valence}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(state.intensity)}`}>
                          Intensity: {state.intensity}/10
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{state.context}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="font-medium text-gray-600">Triggers:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {state.triggers.map(trigger => (
                              <span
                                key={trigger}
                                className="px-2 py-1 bg-red-100 text-red-800 rounded-full"
                              >
                                {trigger}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-600">Coping Strategies:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {state.copingStrategies.map(strategy => (
                              <span
                                key={strategy}
                                className="px-2 py-1 bg-green-100 text-green-800 rounded-full"
                              >
                                {strategy}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right text-xs text-gray-500 ml-4">
                      {state.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Therapeutic Insights */}
      {selectedEmotion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200"
        >
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            🎯 Therapeutic Insights for {selectedEmotion}
          </h4>
          
          {(() => {
            const pattern = patterns.find(p => p.emotion === selectedEmotion);
            if (!pattern) return null;
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-700 mb-3">Pattern Analysis</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Occurrence Rate:</span>
                      <span className="font-medium">{pattern.frequency} times</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Emotional Intensity:</span>
                      <span className="font-medium">{pattern.averageIntensity.toFixed(1)}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Emotional Valence:</span>
                      <span className="font-medium">{pattern.averageValence > 0 ? '+' : ''}{pattern.averageValence.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trend Direction:</span>
                      <span className="font-medium capitalize">{pattern.trend}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-700 mb-3">Therapeutic Recommendations</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">Monitor frequency and intensity patterns</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">Identify common triggers and contexts</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">Develop personalized coping strategies</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span className="text-gray-700">Track progress and intervention effectiveness</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}