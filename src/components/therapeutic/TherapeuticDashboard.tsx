import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Clock,
  Target,
  Lightbulb,
  BookOpen,
  Users,
  Phone,
  MessageCircle,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  Star,
  Eye,
  Ear,
  MessageSquare,
  Crown,
  Lock,
  Unlock,
  Gift
} from 'lucide-react';
import { 
  UserTierStatus, 
  ConversionOpportunity
} from '../../services/freemiumTierService';
import { 
  EmotionalState, 
  CrisisLevel, 
  TherapeuticIntervention, 
  SessionProgress,
  EmpathyResponse,
  EmotionalRegulationTechnique
} from '../../types/ai';

interface TherapeuticDashboardProps {
  emotionalAssessment: EmotionalState;
  crisisLevel: CrisisLevel;
  therapeuticIntervention: TherapeuticIntervention;
  sessionProgress: SessionProgress;
  empathyResponse: EmpathyResponse;
  emotionalRegulationTechnique: EmotionalRegulationTechnique;
  sessionDuration: number;
  messageCount: number;
  isVisible: boolean;
  onClose: () => void;
  userTier?: UserTierStatus;
  conversionOpportunity?: ConversionOpportunity;
}

interface EmotionalTrend {
  timestamp: Date;
  emotion: string;
  intensity: number;
  valence: 'positive' | 'negative' | 'neutral';
}

function getValenceFromEmotion(emotion: string): 'positive' | 'negative' | 'neutral' {
  const positive = ['joy', 'gratitude', 'love', 'hope', 'relief', 'pride', 'interest', 'amusement', 'awe', 'contentment'];
  const negative = ['sadness', 'anger', 'fear', 'disgust', 'shame', 'guilt', 'envy', 'jealousy', 'anxiety', 'frustration', 'loneliness', 'grief'];
  if (positive.includes(emotion.toLowerCase())) return 'positive';
  if (negative.includes(emotion.toLowerCase())) return 'negative';
  return 'neutral';
}

export const TherapeuticDashboard: React.FC<TherapeuticDashboardProps> = ({
  emotionalAssessment,
  crisisLevel,
  therapeuticIntervention,
  sessionProgress,
  empathyResponse,
  emotionalRegulationTechnique,
  sessionDuration,
  messageCount,
  isVisible,
  onClose,
  userTier,
  conversionOpportunity
}) => {
  const [emotionalTrends, setEmotionalTrends] = useState<EmotionalTrend[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'emotional' | 'crisis' | 'therapeutic' | 'progress' | 'tier'>('overview');
  const [showInterventionDetails, setShowInterventionDetails] = useState(false);

  // Update emotional trends
  useEffect(() => {
    setEmotionalTrends(prev => [...prev, {
      timestamp: new Date(),
      emotion: emotionalAssessment.primaryEmotion,
      intensity: emotionalAssessment.intensity,
      valence: getValenceFromEmotion(emotionalAssessment.primaryEmotion)
    }]);
  }, [emotionalAssessment]);

  // Format session duration
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get emotional trend direction
  const getEmotionalTrend = () => {
    if (emotionalTrends.length < 2) return 'stable';
    const recent = emotionalTrends.slice(-3);
    const earlier = emotionalTrends.slice(-6, -3);
    
    const recentAvg = recent.reduce((sum, t) => sum + t.intensity, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, t) => sum + t.intensity, 0) / earlier.length;
    
    if (recentAvg > earlierAvg + 1) return 'improving';
    if (recentAvg < earlierAvg - 1) return 'declining';
    return 'stable';
  };

  const emotionalTrend = getEmotionalTrend();

  // Get tier display information
  const getTierDisplay = () => {
    if (!userTier) return null;
    
    const tierInfo = {
      free: { name: 'Free', icon: Unlock, color: 'text-green-600', bgColor: 'bg-green-50' },
      premium: { name: 'Premium', icon: Crown, color: 'text-purple-600', bgColor: 'bg-purple-50' },
      professional: { name: 'Professional', icon: Star, color: 'text-blue-600', bgColor: 'bg-blue-50' },
      enterprise: { name: 'Enterprise', icon: Zap, color: 'text-orange-600', bgColor: 'bg-orange-50' }
    };
    
    return tierInfo[userTier.currentTier as keyof typeof tierInfo];
  };

  const tierDisplay = getTierDisplay();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Therapeutic Dashboard
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Session Progress & Analytics
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {tierDisplay && (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${tierDisplay.bgColor} dark:bg-gray-800`}>
                    <tierDisplay.icon className={`w-4 h-4 ${tierDisplay.color}`} />
                    <span className={`text-sm font-medium ${tierDisplay.color}`}>
                      {tierDisplay.name}
                    </span>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'emotional', label: 'Emotional', icon: Heart },
                { id: 'crisis', label: 'Crisis', icon: Shield },
                { id: 'therapeutic', label: 'Interventions', icon: Brain },
                { id: 'progress', label: 'Progress', icon: TrendingUp },
                ...(userTier ? [{ id: 'tier', label: 'Tier', icon: Crown }] : [])
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Session Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Session Duration</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {formatDuration(sessionDuration)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Messages</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {messageCount}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Alliance Score</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {sessionProgress.therapeuticAlliance}/10
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Engagement</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {Math.round(sessionProgress.engagement * 10)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Current State */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Emotional State */}
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Heart className="w-5 h-5 text-red-500" />
                          Current Emotional State
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Primary Emotion:</span>
                            <span className="font-medium capitalize">{emotionalAssessment.primaryEmotion}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Intensity:</span>
                            <span className="font-medium">{emotionalAssessment.intensity}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Trend:</span>
                            <div className="flex items-center gap-1">
                              {emotionalTrend === 'improving' && <TrendingUp className="w-4 h-4 text-green-500" />}
                              {emotionalTrend === 'declining' && <TrendingDown className="w-4 h-4 text-red-500" />}
                              {emotionalTrend === 'stable' && <Activity className="w-4 h-4 text-blue-500" />}
                              <span className="capitalize">{emotionalTrend}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Crisis Level */}
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-orange-500" />
                          Crisis Assessment
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Risk Level:</span>
                            <span className={`font-medium capitalize ${
                              crisisLevel.level === 'critical' || crisisLevel.level === 'high' 
                                ? 'text-red-600' 
                                : 'text-green-600'
                            }`}>
                              {crisisLevel.level}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Escalation:</span>
                            <span className={`font-medium ${crisisLevel.professionalHelp ? 'text-red-600' : 'text-green-600'}`}>
                              {crisisLevel.professionalHelp ? 'Required' : 'Not Needed'}
                            </span>
                          </div>
                          {crisisLevel.riskFactors.length > 0 && (
                            <div>
                              <span className="text-gray-600 dark:text-gray-400 text-sm">Risk Factors:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {crisisLevel.riskFactors.map((factor, index) => (
                                  <span key={index} className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded">
                                    {factor}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Current Intervention */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        Current Therapeutic Intervention
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Technique</label>
                            <p className="font-medium">{therapeuticIntervention.technique}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Type</label>
                            <p className="font-medium">{therapeuticIntervention.type}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Effectiveness</label>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${therapeuticIntervention.effectiveness * 10}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{Math.round(therapeuticIntervention.effectiveness * 10)}%</span>
                            </div>
                          </div>
                          {therapeuticIntervention.personalization && (
                            <div>
                              <label className="text-sm text-gray-600 dark:text-gray-400">Personalization</label>
                              <p className="text-sm mt-1">{therapeuticIntervention.personalization}</p>
                            </div>
                          )}
                          {therapeuticIntervention.nextSteps && (
                            <div>
                              <label className="text-sm text-gray-600 dark:text-gray-400">Next Steps</label>
                              <ol className="list-decimal list-inside space-y-1 mt-1">
                                {therapeuticIntervention.nextSteps.map((step, idx) => (
                                  <li key={idx} className="text-sm">{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">Rationale</label>
                          <p className="text-sm mt-1">{therapeuticIntervention.rationale}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'emotional' && (
                  <motion.div
                    key="emotional"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Emotional Assessment Details */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4">Emotional Assessment</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Primary Emotion</label>
                            <p className="font-medium capitalize">{emotionalAssessment.primaryEmotion}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Intensity</label>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${(emotionalAssessment.intensity / 10) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{emotionalAssessment.intensity}/10</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Valence</label>
                            <p className="font-medium capitalize">{getValenceFromEmotion(emotionalAssessment.primaryEmotion)}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Intensity</label>
                            <p className="font-medium capitalize">{emotionalAssessment.intensity}/10</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Secondary Emotions</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {emotionalAssessment.secondaryEmotions.map((emotion, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded">
                                  {emotion}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Triggers</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {emotionalAssessment.triggers.map((trigger, index) => (
                                <span key={index} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs rounded">
                                  {trigger}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Somatic Symptoms</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {emotionalAssessment.somaticSymptoms.map((symptom, index) => (
                                <span key={index} className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded">
                                  {symptom}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Empathy Response */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4">Empathy Response</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">Type</label>
                          <p className="text-sm capitalize">{empathyResponse.type}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">Content</label>
                          <p className="text-sm">{empathyResponse.content}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">Tone</label>
                          <p className="text-sm capitalize">{empathyResponse.tone}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">Validation Level</label>
                          <p className="text-sm">{empathyResponse.validationLevel}/10</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'crisis' && (
                  <motion.div
                    key="crisis"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Crisis Assessment */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Crisis Assessment
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Risk Level</label>
                            <div className={`mt-1 px-3 py-2 rounded-lg font-medium ${
                              crisisLevel.level === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                              crisisLevel.level === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                              crisisLevel.level === 'moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            }`}>
                              {crisisLevel.level.toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Escalation Required</label>
                            <div className="mt-1 flex items-center gap-2">
                              {crisisLevel.professionalHelp ? (
                                <CheckCircle className="w-5 h-5 text-red-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-green-500" />
                              )}
                              <span className="font-medium">
                                {crisisLevel.professionalHelp ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Professional Help</label>
                            <div className="mt-1 flex items-center gap-2">
                              {crisisLevel.professionalHelp ? (
                                <CheckCircle className="w-5 h-5 text-red-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-green-500" />
                              )}
                              <span className="font-medium">
                                {crisisLevel.professionalHelp ? 'Required' : 'Not Needed'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Risk Factors</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {crisisLevel.riskFactors.map((factor, index) => (
                                <span key={index} className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs rounded">
                                  {factor}
                                </span>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Immediate Actions */}
                    {crisisLevel.immediateActions.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4">Immediate Actions</h3>
                        <div className="space-y-2">
                          {crisisLevel.immediateActions.map((action, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                              <Zap className="w-4 h-4 text-orange-500" />
                              <span className="text-sm">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}


                  </motion.div>
                )}

                {activeTab === 'therapeutic' && (
                  <motion.div
                    key="therapeutic"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Current Intervention */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        Current Therapeutic Intervention
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Technique</label>
                            <p className="font-medium">{therapeuticIntervention.technique}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Type</label>
                            <p className="font-medium">{therapeuticIntervention.type}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Effectiveness</label>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${therapeuticIntervention.effectiveness * 10}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{Math.round(therapeuticIntervention.effectiveness * 10)}%</span>
                            </div>
                          </div>
                          {therapeuticIntervention.personalization && (
                            <div>
                              <label className="text-sm text-gray-600 dark:text-gray-400">Personalization</label>
                              <p className="text-sm mt-1">{therapeuticIntervention.personalization}</p>
                            </div>
                          )}
                          {therapeuticIntervention.nextSteps && (
                            <div>
                              <label className="text-sm text-gray-600 dark:text-gray-400">Next Steps</label>
                              <ol className="list-decimal list-inside space-y-1 mt-1">
                                {therapeuticIntervention.nextSteps.map((step, idx) => (
                                  <li key={idx} className="text-sm">{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">Rationale</label>
                          <p className="text-sm mt-1">{therapeuticIntervention.rationale}</p>
                        </div>
                      </div>
                    </div>

                    {/* Emotional Regulation Technique */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4">Emotional Regulation Technique</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Name</label>
                            <p className="font-medium">{emotionalRegulationTechnique.name}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Duration</label>
                            <p className="font-medium">{emotionalRegulationTechnique.duration} minutes</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Effectiveness</label>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-blue-200 dark:bg-blue-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${emotionalRegulationTechnique.effectiveness * 10}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{Math.round(emotionalRegulationTechnique.effectiveness * 10)}%</span>
                            </div>
                          </div>
                          {emotionalRegulationTechnique.personalization && (
                            <div>
                              <label className="text-sm text-gray-600 dark:text-gray-400">Personalization</label>
                              <p className="text-sm mt-1">{emotionalRegulationTechnique.personalization}</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">Description</label>
                          <p className="text-sm mt-1">{emotionalRegulationTechnique.description}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">Steps</label>
                          <ol className="list-decimal list-inside space-y-1 mt-1">
                            {emotionalRegulationTechnique.steps.map((step, index) => (
                              <li key={index} className="text-sm">{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'progress' && (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Session Progress */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4">Session Progress</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Therapeutic Alliance</label>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${(sessionProgress.therapeuticAlliance / 10) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{sessionProgress.therapeuticAlliance}/10</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Therapeutic Alliance</label>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${sessionProgress.therapeuticAlliance * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{Math.round(sessionProgress.therapeuticAlliance * 100)}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Session Goals</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {sessionProgress.sessionGoals?.map((goal: string, index: number) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded">
                                  {goal}
                                </span>
                              )) || <span className="text-gray-500 text-xs">No goals set</span>}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Next Session Focus</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {sessionProgress.nextSessionFocus?.map((focus: string, index: number) => (
                                <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs rounded">
                                  {focus}
                                </span>
                              )) || <span className="text-gray-500 text-xs">No focus areas identified</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Insights and Breakthroughs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-yellow-500" />
                          Insights
                        </h3>
                        <div className="space-y-2">
                          {sessionProgress.insights?.map((insight: string, index: number) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                              <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{insight}</span>
                            </div>
                          )) || <span className="text-gray-500 text-xs">No insights yet</span>}
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-green-500" />
                          Breakthroughs
                        </h3>
                        <div className="space-y-2">
                          {sessionProgress.breakthroughs?.map((breakthrough: string, index: number) => (
                            <div key={index} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{breakthrough}</span>
                            </div>
                          )) || <span className="text-gray-500 text-xs">No breakthroughs yet</span>}
                        </div>
                      </div>
                    </div>

                    {/* Resistance Areas */}
                    {sessionProgress.resistanceAreas && sessionProgress.resistanceAreas.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-4">Areas of Resistance</h3>
                        <div className="flex flex-wrap gap-2">
                          {sessionProgress.resistanceAreas.map((area: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-sm rounded">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'tier' && userTier && (
                  <motion.div
                    key="tier"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Tier Information */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Crown className="w-5 h-5 text-purple-500" />
                        Current Tier: {tierDisplay?.name}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Daily Sessions</label>
                            <p className="font-medium">
                              {userTier.usage.dailySessions} / {userTier.limits.dailySessions === 999 ? 'Unlimited' : userTier.limits.dailySessions}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Session Length</label>
                            <p className="font-medium">
                              {userTier.usage.sessionLength} / {userTier.limits.sessionLength === 999 ? 'Unlimited' : userTier.limits.sessionLength} minutes
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Active Goals</label>
                            <p className="font-medium">
                              {userTier.limits.activeGoals === 999 ? 'Unlimited' : userTier.limits.activeGoals}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">CBT Worksheets</label>
                            <p className="font-medium">
                              {userTier.limits.cbtWorksheets === 999 ? 'Unlimited' : userTier.limits.cbtWorksheets} per month
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">AI Personality</label>
                            <p className="font-medium capitalize">
                              {userTier.limits.aiPersonality.replace('_', ' ')}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Progress Reports</label>
                            <p className="font-medium capitalize">
                              {userTier.limits.progressReports.replace('_', ' ')}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Community Access</label>
                            <p className="font-medium capitalize">
                              {userTier.limits.communityAccess.replace('_', ' ')}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 dark:text-gray-400">Crisis Support</label>
                            <p className="font-medium capitalize">
                              {userTier.limits.crisisSupport.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conversion Opportunity */}
                    {conversionOpportunity && (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Gift className="w-5 h-5 text-purple-500" />
                          Special Offer
                        </h3>
                        
                        <div className="space-y-4">
                          <p className="text-gray-700 dark:text-gray-300">
                            {conversionOpportunity.message}
                          </p>
                          
                          {conversionOpportunity.offer && (
                            <div className="flex items-center gap-2">
                              {conversionOpportunity.offer.trial && (
                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-sm rounded-full">
                                  {conversionOpportunity.offer.trial}
                                </span>
                              )}
                              {conversionOpportunity.offer.discount && (
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm rounded-full">
                                  {conversionOpportunity.offer.discount} off
                                </span>
                              )}
                            </div>
                          )}
                          
                          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                            Upgrade Now
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Tier Comparison */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4">Tier Comparison</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { name: 'Free', features: ['1 session/day', '20 min sessions', 'Basic CBT', 'Weekly reports'] },
                          { name: 'Premium', features: ['Unlimited sessions', 'Unlimited length', 'Advanced analytics', 'Real-time reports'] },
                          { name: 'Professional', features: ['Human consultation', 'Specialized modules', 'Family dashboard', 'Priority support'] }
                        ].map((tier) => (
                          <div key={tier.name} className={`p-4 rounded-lg border ${
                            tier.name === tierDisplay?.name 
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                              : 'border-gray-200 dark:border-gray-700'
                          }`}>
                            <h4 className="font-semibold mb-2">{tier.name}</h4>
                            <ul className="space-y-1 text-sm">
                              {tier.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 