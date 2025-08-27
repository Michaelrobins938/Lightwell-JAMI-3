import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, AlertTriangle, TrendingUp, TrendingDown, 
  Activity, Brain, Zap, Shield, Eye, Clock,
  Plus, X, Save, AlertCircle, CheckCircle
} from 'lucide-react';

interface MoodData {
  mood: number; // 1-10 scale
  intensity: number; // 1-10 scale
  anxiety: number; // 1-10 scale
  depression: number; // 1-10 scale
  stress: number; // 1-10 scale
  suicidalThoughts: boolean;
  selfHarmThoughts: boolean;
  crisisLevel: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  context: string;
  tags: string[];
}

interface CrisisAlert {
  id: string;
  type: 'suicidal' | 'self-harm' | 'severe-depression' | 'severe-anxiety' | 'other';
  severity: 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  escalated: boolean;
}

interface MoodMonitorProps {
  isVisible: boolean;
  onToggle: () => void;
  onCrisisAlert: (alert: CrisisAlert) => void;
  userId?: string;
}

export default function MoodMonitor({ 
  isVisible, 
  onToggle, 
  onCrisisAlert, 
  userId 
}: MoodMonitorProps) {
  const [currentMood, setCurrentMood] = useState<MoodData | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodData[]>([]);
  const [showMoodInput, setShowMoodInput] = useState(false);
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);

  // Load mood history from API
  const loadMoodHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/mood-history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMoodHistory(data.moodHistory || []);
      }
    } catch (error) {
      console.error('Failed to load mood history:', error);
    }
  }, []);

  // Save mood data
  const saveMood = useCallback(async (moodData: Omit<MoodData, 'timestamp' | 'crisisLevel'>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Calculate crisis level
      const crisisLevel = calculateCrisisLevel(moodData);
      
      const fullMoodData: MoodData = {
        ...moodData,
        timestamp: new Date(),
        crisisLevel
      };

      // Save to API
      const response = await fetch('/api/save-mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(fullMoodData),
      });

      if (response.ok) {
        setCurrentMood(fullMoodData);
        setMoodHistory(prev => [fullMoodData, ...prev]);
        
        // Check for crisis alerts
        if (crisisLevel === 'high' || crisisLevel === 'critical') {
          const alert = createCrisisAlert(fullMoodData);
          setCrisisAlerts(prev => [alert, ...prev]);
          onCrisisAlert(alert);
        }
      }
    } catch (error) {
      console.error('Failed to save mood:', error);
    }
  }, [onCrisisAlert]);

  // Calculate crisis level based on mood data
  const calculateCrisisLevel = (moodData: Omit<MoodData, 'timestamp' | 'crisisLevel'>): MoodData['crisisLevel'] => {
    const { mood, intensity, anxiety, depression, stress, suicidalThoughts, selfHarmThoughts } = moodData;
    
    // Critical indicators
    if (suicidalThoughts || selfHarmThoughts) {
      return 'critical';
    }
    
    // High risk indicators
    if (mood <= 2 || anxiety >= 9 || depression >= 9 || stress >= 9) {
      return 'high';
    }
    
    // Medium risk indicators
    if (mood <= 4 || anxiety >= 7 || depression >= 7 || stress >= 7) {
      return 'medium';
    }
    
    return 'low';
  };

  // Create crisis alert
  const createCrisisAlert = (moodData: MoodData): CrisisAlert => {
    const { crisisLevel, suicidalThoughts, selfHarmThoughts, mood, anxiety, depression, stress } = moodData;
    
    let type: CrisisAlert['type'] = 'other';
    let severity: CrisisAlert['severity'] = 'medium';
    let message = '';

    if (suicidalThoughts) {
      type = 'suicidal';
      severity = 'critical';
      message = '⚠️ CRITICAL: Suicidal thoughts detected. Immediate intervention required.';
    } else if (selfHarmThoughts) {
      type = 'self-harm';
      severity = 'critical';
      message = '⚠️ CRITICAL: Self-harm thoughts detected. Immediate intervention required.';
    } else if (crisisLevel === 'high') {
      if (mood <= 2) {
        type = 'severe-depression';
        severity = 'high';
        message = '🚨 HIGH RISK: Severe depression detected. Professional help recommended.';
      } else if (anxiety >= 9) {
        type = 'severe-anxiety';
        severity = 'high';
        message = '🚨 HIGH RISK: Severe anxiety detected. Professional help recommended.';
      }
    } else if (crisisLevel === 'medium') {
      severity = 'medium';
      message = '⚠️ MEDIUM RISK: Elevated distress detected. Monitor closely.';
    }

    return {
      id: crypto.randomUUID(),
      type,
      severity,
      message,
      timestamp: new Date(),
      acknowledged: false,
      escalated: false
    };
  };

  // Analyze conversation for mood indicators
  const analyzeConversation = useCallback(async (conversation: string) => {
    if (isAnalyzing) return;
    
    try {
      setIsAnalyzing(true);
      
      // Use sentiment analysis API
      const response = await fetch('/api/analyzeSentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: conversation,
          userId: userId || 'anonymous'
        }),
      });

      if (response.ok) {
        const analysis = await response.json();
        
        // Extract mood indicators from analysis
        const moodIndicators = {
          mood: Math.max(1, Math.min(10, Math.round(analysis.sentiment * 5 + 5))),
          intensity: Math.max(1, Math.min(10, Math.round(analysis.intensity * 10))),
          anxiety: Math.max(1, Math.min(10, Math.round(analysis.anxiety * 10))),
          depression: Math.max(1, Math.min(10, Math.round(analysis.depression * 10))),
          stress: Math.max(1, Math.min(10, Math.round(analysis.stress * 10))),
          suicidalThoughts: analysis.suicidal_risk > 0.7,
          selfHarmThoughts: analysis.self_harm_risk > 0.7,
          context: `Auto-detected from conversation: ${conversation.substring(0, 100)}...`,
          tags: analysis.tags || []
        };

        // Auto-save if crisis indicators detected
        if (moodIndicators.suicidalThoughts || moodIndicators.selfHarmThoughts || 
            moodIndicators.mood <= 3 || moodIndicators.anxiety >= 8 || 
            moodIndicators.depression >= 8) {
          await saveMood(moodIndicators);
        }

        setLastAnalysis(new Date());
      }
    } catch (error) {
      console.error('Failed to analyze conversation:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, saveMood, userId]);

  // Acknowledge crisis alert
  const acknowledgeAlert = (alertId: string) => {
    setCrisisAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
  };

  // Escalate crisis alert
  const escalateAlert = (alertId: string) => {
    setCrisisAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, escalated: true }
          : alert
      )
    );
  };

  // Load mood history on mount
  useEffect(() => {
    loadMoodHistory();
  }, [loadMoodHistory]);

  // Get mood trend
  const getMoodTrend = () => {
    if (moodHistory.length < 2) return 'stable';
    
    const recent = moodHistory.slice(0, 3);
    const avgRecent = recent.reduce((sum, m) => sum + m.mood, 0) / recent.length;
    const avgOlder = moodHistory.slice(3, 6).reduce((sum, m) => sum + m.mood, 0) / Math.max(1, moodHistory.length - 3);
    
    if (avgRecent > avgOlder + 1) return 'improving';
    if (avgRecent < avgOlder - 1) return 'declining';
    return 'stable';
  };

  // Get crisis level color
  const getCrisisColor = (level: MoodData['crisisLevel']) => {
    switch (level) {
      case 'critical': return 'text-red-400 border-red-500/30 bg-red-900/20';
      case 'high': return 'text-orange-400 border-orange-500/30 bg-orange-900/20';
      case 'medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20';
      case 'low': return 'text-green-400 border-green-500/30 bg-green-900/20';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-900/20';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-700 shadow-2xl z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Mood Monitor
              </h2>
              <button
                onClick={onToggle}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto p-4 space-y-6">
            {/* Current Mood Status */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Current Status
              </h3>
              
              {currentMood ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Mood Level</span>
                    <span className="text-white font-semibold">{currentMood.mood}/10</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Crisis Level</span>
                    <span className={`px-2 py-1 rounded text-xs border ${getCrisisColor(currentMood.crisisLevel)}`}>
                      {currentMood.crisisLevel.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Last Updated</span>
                    <span className="text-gray-400 text-xs">
                      {currentMood.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No mood data recorded yet</p>
              )}
            </div>

            {/* Quick Mood Input */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4 text-green-400" />
                  Quick Mood Check
                </h3>
                <button
                  onClick={() => setShowMoodInput(!showMoodInput)}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  {showMoodInput ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showMoodInput && (
                <QuickMoodInput onSave={saveMood} />
              )}
            </div>

            {/* Crisis Alerts */}
            {crisisAlerts.length > 0 && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <h3 className="text-red-400 font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Crisis Alerts
                </h3>
                
                <div className="space-y-3">
                  {crisisAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="bg-red-900/30 border border-red-500/50 rounded p-3">
                      <p className="text-red-200 text-sm mb-2">{alert.message}</p>
                      <div className="flex gap-2">
                        {!alert.acknowledged && (
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                          >
                            Acknowledge
                          </button>
                        )}
                        {!alert.escalated && (
                          <button
                            onClick={() => escalateAlert(alert.id)}
                            className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors"
                          >
                            Escalate
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mood Trends */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Mood Trends
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Trend</span>
                  <span className="text-white font-semibold capitalize">{getMoodTrend()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Entries Today</span>
                  <span className="text-white font-semibold">
                    {moodHistory.filter(m => 
                      m.timestamp.toDateString() === new Date().toDateString()
                    ).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Total Entries</span>
                  <span className="text-white font-semibold">{moodHistory.length}</span>
                </div>
              </div>
            </div>

            {/* Analysis Status */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                AI Analysis
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Status</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    isAnalyzing 
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                      : 'bg-green-600/20 text-green-300 border border-green-500/30'
                  }`}>
                    {isAnalyzing ? 'Analyzing...' : 'Ready'}
                  </span>
                </div>
                
                {lastAnalysis && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Last Analysis</span>
                    <span className="text-gray-400 text-xs">
                      {lastAnalysis.toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Quick Mood Input Component
interface QuickMoodInputProps {
  onSave: (moodData: Omit<MoodData, 'timestamp' | 'crisisLevel'>) => void;
}

function QuickMoodInput({ onSave }: QuickMoodInputProps) {
  const [mood, setMood] = useState(5);
  const [intensity, setIntensity] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [depression, setDepression] = useState(5);
  const [stress, setStress] = useState(5);
  const [suicidalThoughts, setSuicidalThoughts] = useState(false);
  const [selfHarmThoughts, setSelfHarmThoughts] = useState(false);
  const [context, setContext] = useState('');

  const handleSave = () => {
    onSave({
      mood,
      intensity,
      anxiety,
      depression,
      stress,
      suicidalThoughts,
      selfHarmThoughts,
      context: context || 'Quick mood check',
      tags: []
    });
    
    // Reset form
    setMood(5);
    setIntensity(5);
    setAnxiety(5);
    setDepression(5);
    setStress(5);
    setSuicidalThoughts(false);
    setSelfHarmThoughts(false);
    setContext('');
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-gray-300 text-sm mb-1">Mood (1-10)</label>
        <input
          type="range"
          min="1"
          max="10"
          value={mood}
          onChange={(e) => setMood(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>😢 1</span>
          <span>😐 5</span>
          <span>😊 10</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-300 text-sm mb-1">Anxiety</label>
          <input
            type="range"
            min="1"
            max="10"
            value={anxiety}
            onChange={(e) => setAnxiety(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm mb-1">Stress</label>
          <input
            type="range"
            min="1"
            max="10"
            value={stress}
            onChange={(e) => setStress(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={suicidalThoughts}
            onChange={(e) => setSuicidalThoughts(e.target.checked)}
            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <span className="text-red-400 text-sm">Suicidal thoughts</span>
        </label>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selfHarmThoughts}
            onChange={(e) => setSelfHarmThoughts(e.target.checked)}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="text-orange-400 text-sm">Self-harm thoughts</span>
        </label>
      </div>

      <input
        type="text"
        placeholder="Context (optional)"
        value={context}
        onChange={(e) => setContext(e.target.value)}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        Save Mood
      </button>
    </div>
  );
}
