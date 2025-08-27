import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Eye, Brain, Shield, ChevronRight, ChevronLeft, Settings,
  AlertTriangle, Heart, Activity, BarChart3, Lightbulb,
  Target, TrendingUp
} from 'lucide-react';
import { NarratorOrbComponent } from '../visuals/NarratorOrb';

interface EmotionalAssessment {
  primaryEmotion: string;
  secondaryEmotions: string[];
  intensity: number;
  triggers: string[];
  somaticSymptoms: string[];
  cognitivePatterns: string[];
}

interface CrisisLevel {
  level: 'none' | 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  triggers: string[];
  recommendations: string[];
}

interface SessionProgress {
  stage: string;
  engagement: number;
  trustLevel: number;
  therapeuticAlliance: number;
  sessionGoals: string[];
  insights: string[];
  breakthroughs: string[];
  resistanceAreas: string[];
  nextSessionFocus: string[];
}

interface JamiePresenceSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  emotionalAssessment: EmotionalAssessment;
  crisisLevel: CrisisLevel;
  sessionProgress: SessionProgress;
  isLoading: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  currentAudioLevel: number;
  analyserNode: AnalyserNode | null;
  onEnterOrbMode: () => void;
  onEnterFullscreen: () => void;
  showDashboard: boolean;
  onToggleDashboard: () => void;
  isOrbModeActive?: boolean;
  orbRef?: React.RefObject<HTMLDivElement>;
}

const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <div 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 
                       px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs 
                       rounded-md whitespace-nowrap pointer-events-none"
          >
            {content}
            <div className="absolute right-full top-1/2 -translate-y-1/2 
                            border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const JamiePresenceSidebar: React.FC<JamiePresenceSidebarProps> = ({
  isCollapsed,
  onToggle,
  emotionalAssessment,
  crisisLevel,
  sessionProgress,
  isLoading,
  isSpeaking,
  isListening,
  currentAudioLevel,
  analyserNode,
  onEnterOrbMode,
  onEnterFullscreen,
  showDashboard,
  onToggleDashboard,
  isOrbModeActive = false,
  orbRef
}) => {
  const shouldReduceMotion = useReducedMotion();
  const internalOrbRef = useRef<HTMLDivElement>(null);
  const orbRefToUse = orbRef || internalOrbRef;
  const getEmotionalColor = (emotion: string): string => {
    const colors = {
      happy: 'text-yellow-500',
      sad: 'text-blue-500',
      angry: 'text-red-500',
      anxious: 'text-orange-500',
      calm: 'text-green-500',
      excited: 'text-purple-500',
      neutral: 'text-gray-500'
    };
    return colors[emotion as keyof typeof colors] || 'text-gray-500';
  };

  const getCrisisColor = (level: string): string => {
    const colors = {
      none: 'text-green-500',
      low: 'text-yellow-500',
      medium: 'text-orange-500',
      high: 'text-red-500',
      critical: 'text-red-700'
    };
    return colors[level as keyof typeof colors] || 'text-gray-500';
  };

  const getIntensityColor = (intensity: number): string => {
    if (intensity >= 8) return 'bg-red-500';
    if (intensity >= 6) return 'bg-orange-500';
    if (intensity >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Mobile Toggle Button */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.button
            onClick={onToggle}
            className="lg:hidden fixed top-4 right-4 z-50 
                       p-2.5 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 
                       text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
                       transition-all duration-200 hover:shadow-lg"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Brain className="w-5 h-5" />
            {(isSpeaking || isListening || isLoading) && (
              <motion.div
                className="absolute top-0 right-0 w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: isSpeaking ? '#10b981' : isListening ? '#3b82f6' : '#f59e0b'
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Collapsed State - Icon Strip */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex w-[60px] bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 
                       flex-col items-center py-4 space-y-3 fixed right-0 top-0 h-full z-40
                       lg:flex md:hidden"
          >
            {/* Jamie Orb Icon */}
            <Tooltip content="Jamie's Presence">
              <motion.button
                onClick={onToggle}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 
                           flex items-center justify-center text-white shadow-lg relative overflow-hidden
                           hover:scale-105 transition-transform duration-150"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ 
                    boxShadow: isSpeaking ? 
                      ['0 0 0 0 rgba(168, 85, 247, 0.4)', '0 0 0 8px rgba(168, 85, 247, 0)', '0 0 0 0 rgba(168, 85, 247, 0)'] :
                      isListening ?
                      ['0 0 0 0 rgba(59, 130, 246, 0.4)', '0 0 0 6px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0)'] :
                      'none'
                  }}
                  transition={{ duration: 1.5, repeat: isSpeaking || isListening ? Infinity : 0 }}
                  className="w-full h-full rounded-full flex items-center justify-center"
                >
                  <Brain className="w-5 h-5" />
                </motion.div>
                
                {/* Activity indicator */}
                {(isSpeaking || isListening || isLoading) && (
                  <motion.div
                    className="absolute top-0 right-0 w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: isSpeaking ? '#10b981' : isListening ? '#3b82f6' : '#f59e0b'
                    }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </motion.button>
            </Tooltip>

            {/* Emotional Analysis Icon */}
            <Tooltip content={`${emotionalAssessment.primaryEmotion} (${emotionalAssessment.intensity}/10)`}>
              <motion.div
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 
                           flex items-center justify-center cursor-pointer
                           hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                onClick={onToggle}
              >
                <Heart className={`w-4 h-4 ${getEmotionalColor(emotionalAssessment.primaryEmotion)}`} />
                <motion.div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getIntensityColor(emotionalAssessment.intensity)}`}
                  animate={{ scale: emotionalAssessment.intensity >= 7 ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: emotionalAssessment.intensity >= 7 ? Infinity : 0 }}
                />
              </motion.div>
            </Tooltip>

            {/* Crisis Monitoring Icon */}
            <Tooltip content={`Crisis Level: ${crisisLevel.level}`}>
              <motion.div
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 
                           flex items-center justify-center cursor-pointer
                           hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                onClick={onToggle}
                animate={{ 
                  rotate: crisisLevel.level !== 'none' ? [0, 5, -5, 0] : 0,
                  scale: crisisLevel.level === 'high' || crisisLevel.level === 'critical' ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  rotate: { duration: 0.5 },
                  scale: { duration: 0.3, repeat: crisisLevel.level === 'high' || crisisLevel.level === 'critical' ? Infinity : 0 }
                }}
              >
                <Shield className={`w-4 h-4 ${getCrisisColor(crisisLevel.level)}`} />
                {crisisLevel.level !== 'none' && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                )}
              </motion.div>
            </Tooltip>

            {/* Dashboard Toggle Icon */}
            <Tooltip content="Session Progress">
              <motion.div
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 
                           flex items-center justify-center cursor-pointer
                           hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                onClick={onToggleDashboard}
              >
                <BarChart3 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                {showDashboard && (
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
            </Tooltip>

            {/* Settings Icon at bottom */}
            <div className="flex-1" />
            <Tooltip content="Settings">
              <motion.div
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 
                           flex items-center justify-center cursor-pointer
                           hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <Settings className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </motion.div>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded State - Full Sidebar */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ 
              x: isOrbModeActive ? 20 : 0, 
              opacity: isOrbModeActive ? 0.15 : 1
            }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ 
              duration: shouldReduceMotion ? 0.1 : 0.25, 
              ease: "easeInOut",
              opacity: { duration: shouldReduceMotion ? 0.1 : 0.25 }
            }}
            style={{
              '--sidebar-fade-opacity': '0.15'
            } as React.CSSProperties}
            className="flex w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 
                       min-h-0 flex-col fixed inset-y-0 right-0 z-50
                       lg:relative lg:z-40 md:fixed md:z-50 sm:w-full sm:bg-gray-50/95 sm:dark:bg-gray-800/95 sm:backdrop-blur-sm"
          >
            <div className="relative h-full">
              <div className="p-6 space-y-6 h-full overflow-y-auto">
                {/* Header with collapse button */}
                <div className="flex items-center justify-between">
                  <motion.h2 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ 
                      opacity: isOrbModeActive ? 0.4 : 1, 
                      x: isOrbModeActive ? 10 : 0 
                    }}
                    transition={{ 
                      delay: shouldReduceMotion ? 0 : 0.1,
                      duration: shouldReduceMotion ? 0.1 : 0.2,
                      ease: "easeOut"
                    }}
                    className="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    Jamie's Presence
                  </motion.h2>
                  <motion.button
                    onClick={onToggle}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
                               rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-150"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* AI Orb Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex justify-center mb-4">
                    <motion.div 
                      ref={orbRefToUse}
                      className="relative w-[200px] h-[200px] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 
                                 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 rounded-full mx-auto overflow-hidden 
                                 border-2 border-purple-200 dark:border-purple-800 shadow-xl cursor-pointer"
                      onClick={onEnterOrbMode}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                      animate={{
                        opacity: isOrbModeActive ? 0.3 : 1,
                        boxShadow: isSpeaking ? 
                          ['0 0 0 0 rgba(168, 85, 247, 0.3)', '0 0 0 10px rgba(168, 85, 247, 0)', '0 0 0 0 rgba(168, 85, 247, 0)'] :
                          isListening ?
                          ['0 0 0 0 rgba(59, 130, 246, 0.3)', '0 0 0 8px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0)'] :
                          'none'
                      }}
                      transition={{ 
                        scale: { duration: 0.2 },
                        opacity: { duration: 0.25, ease: "easeOut" },
                        boxShadow: { duration: 1.5, repeat: (isSpeaking || isListening) ? Infinity : 0 }
                      }}
                    >
                      {isLoading ? (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full animate-pulse flex items-center justify-center">
                          <div className="text-blue-600 dark:text-blue-400 text-sm text-center">
                            <motion.div
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              Processing...
                            </motion.div>
                            <div className="text-xs opacity-75">Jamie is thinking</div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <NarratorOrbComponent
                            isVisible={true}
                            intensity={isLoading ? 0.8 : (isSpeaking ? 0.9 : emotionalAssessment.intensity / 10)}
                            audioLevel={isSpeaking ? currentAudioLevel : (isListening ? 0.4 : 0.1)}
                            analyserNode={analyserNode}
                            className="w-full h-full"
                          />
                          
                          {/* Fallback content */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-gray-600 dark:text-gray-300 text-center opacity-30">
                              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                                <Brain className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-xs font-medium">Jamie</div>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </div>

                  <motion.div 
                    className="text-center mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.p 
                      className={`text-sm font-medium ${getEmotionalColor(emotionalAssessment.primaryEmotion)}`}
                      key={emotionalAssessment.primaryEmotion}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.3 }}
                    >
                      {emotionalAssessment.primaryEmotion}
                    </motion.p>
                    <p className="text-xs text-gray-500">
                      Intensity: {emotionalAssessment.intensity}/10
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <motion.button
                      onClick={onEnterOrbMode}
                      className="w-full h-12 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg 
                                 shadow-lg relative overflow-hidden group font-medium text-sm
                                 flex items-center justify-center"
                      whileHover={{ 
                        y: -1,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                        background: "linear-gradient(135deg, rgb(147, 51, 234), rgb(59, 130, 246))"
                      }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                      />
                      <span className="relative z-10">Enter Orb Mode</span>
                    </motion.button>
                    <motion.button
                      onClick={onEnterFullscreen}
                      className="w-full h-12 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg 
                                 shadow-lg relative overflow-hidden group font-medium text-sm
                                 flex items-center justify-center"
                      whileHover={{ 
                        y: -1,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                        background: "linear-gradient(135deg, rgb(59, 130, 246), rgb(6, 182, 212))"
                      }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                      />
                      <span className="relative z-10">Fullscreen Mode</span>
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Emotional Analysis Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 border-l-4"
                  style={{ 
                    borderLeftColor: emotionalAssessment.intensity >= 8 ? '#ef4444' : 
                                     emotionalAssessment.intensity >= 6 ? '#f59e0b' : 
                                     emotionalAssessment.intensity >= 4 ? '#eab308' : '#10b981'
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Emotional Analysis</h3>
                    <motion.div
                      animate={{ 
                        scale: emotionalAssessment.intensity >= 7 ? [1, 1.1, 1] : 1,
                        rotate: emotionalAssessment.intensity >= 8 ? [0, 5, -5, 0] : 0
                      }}
                      transition={{ duration: 0.5, repeat: emotionalAssessment.intensity >= 7 ? Infinity : 0 }}
                      className={`w-3 h-3 rounded-full ${getIntensityColor(emotionalAssessment.intensity)}`}
                    />
                  </div>
                  
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Primary Emotion</span>
                      <motion.span 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.3 }}
                        key={emotionalAssessment.primaryEmotion}
                        className={`text-sm font-medium capitalize px-2 py-1 rounded-full ${getEmotionalColor(emotionalAssessment.primaryEmotion)} bg-opacity-10`}
                      >
                        {emotionalAssessment.primaryEmotion}
                      </motion.span>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Intensity Level</span>
                        <motion.span 
                          className="text-sm font-medium text-gray-900 dark:text-white"
                          key={emotionalAssessment.intensity}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 0.2 }}
                        >
                          {emotionalAssessment.intensity}/10
                        </motion.span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
                        <motion.div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            emotionalAssessment.intensity >= 8 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                            emotionalAssessment.intensity >= 6 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                            emotionalAssessment.intensity >= 4 ? 'bg-gradient-to-r from-yellow-500 to-green-500' :
                            'bg-gradient-to-r from-green-500 to-blue-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(emotionalAssessment.intensity / 10) * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                        {emotionalAssessment.intensity >= 7 && (
                          <motion.div
                            className="absolute inset-0 bg-white/20 rounded-full"
                            animate={{ opacity: [0, 0.3, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </div>
                    </div>

                    {emotionalAssessment.triggers && emotionalAssessment.triggers.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Identified Triggers</span>
                        <div className="flex flex-wrap gap-1">
                          {emotionalAssessment.triggers.map((trigger, index) => (
                            <motion.span 
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + (index * 0.1) }}
                              className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full"
                            >
                              {trigger}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {emotionalAssessment.secondaryEmotions && emotionalAssessment.secondaryEmotions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Secondary Emotions</span>
                        <div className="flex flex-wrap gap-1">
                          {emotionalAssessment.secondaryEmotions.map((emotion, index) => (
                            <motion.span 
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + (index * 0.1) }}
                              className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full"
                            >
                              {emotion}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Crisis Monitoring Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Crisis Monitoring</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Current Level</span>
                      <motion.span 
                        className={`text-sm font-medium ${getCrisisColor(crisisLevel.level)}`}
                        key={crisisLevel.level}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.3 }}
                      >
                        {crisisLevel.level}
                      </motion.span>
                    </div>
                    
                    {crisisLevel.level !== 'none' && (
                      <motion.div 
                        className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-red-700 dark:text-red-300">Crisis Detected</span>
                        </div>
                        <p className="text-xs text-red-600 dark:text-red-400">
                          Providing appropriate crisis support and resources.
                        </p>
                        {crisisLevel.recommendations.length > 0 && (
                          <motion.div 
                            className="mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                          >
                            <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">Recommendations:</p>
                            <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                              {crisisLevel.recommendations.map((rec, index) => (
                                <motion.li 
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.7 + (index * 0.1) }}
                                >
                                  • {rec}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Session Progress Section */}
                <AnimatePresence>
                  {showDashboard && (
                    <motion.div
                      initial={{ opacity: 0, x: 20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ delay: 0.45, duration: 0.3 }}
                      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Session Progress</h3>
                        <motion.button
                          onClick={onToggleDashboard}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Engagement */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Engagement</span>
                            <motion.span 
                              className="text-sm font-medium"
                              key={sessionProgress.engagement}
                              animate={{ scale: [1, 1.15, 1] }}
                              transition={{ duration: 0.2 }}
                            >
                              {sessionProgress.engagement}/10
                            </motion.span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div 
                              className="bg-green-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(sessionProgress.engagement / 10) * 100}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </motion.div>

                        {/* Trust Level */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Trust Level</span>
                            <motion.span 
                              className="text-sm font-medium"
                              key={sessionProgress.trustLevel}
                              animate={{ scale: [1, 1.15, 1] }}
                              transition={{ duration: 0.2 }}
                            >
                              {sessionProgress.trustLevel}/10
                            </motion.span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div 
                              className="bg-blue-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(sessionProgress.trustLevel / 10) * 100}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                            />
                          </div>
                        </motion.div>

                        {/* Therapeutic Alliance */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Therapeutic Alliance</span>
                            <motion.span 
                              className="text-sm font-medium"
                              key={sessionProgress.therapeuticAlliance}
                              animate={{ scale: [1, 1.15, 1] }}
                              transition={{ duration: 0.2 }}
                            >
                              {sessionProgress.therapeuticAlliance}/10
                            </motion.span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div 
                              className="bg-purple-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(sessionProgress.therapeuticAlliance / 10) * 100}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            />
                          </div>
                        </motion.div>

                        {sessionProgress.insights.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                          >
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Session Insights</h4>
                            <div className="space-y-1">
                              {sessionProgress.insights.map((insight, index) => (
                                <motion.div 
                                  key={index} 
                                  className="flex items-start space-x-2"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.9 + (index * 0.1) }}
                                >
                                  <Lightbulb className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                                  <span className="text-xs text-gray-600 dark:text-gray-400">{insight}</span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};