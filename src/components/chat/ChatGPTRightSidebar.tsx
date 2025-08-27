import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, Brain, Activity, Shield, 
  Eye, Settings, Lightbulb, AlertTriangle, TrendingUp
} from 'lucide-react';
import { NarratorOrbComponent } from '../visuals/NarratorOrb';

interface ChatGPTRightSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  
  // Orb data
  isLoading: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  currentAudioLevel: number;
  analyserNode?: AnalyserNode | null;
  onEnterOrbMode: () => void;
  onFullscreenMode: () => void;
  
  // Emotional state
  currentEmotionalAssessment: {
    primaryEmotion: string;
    intensity: number;
    secondaryEmotions: string[];
    triggers: string[];
  };
  
  // Crisis monitoring
  currentCrisisLevel: {
    level: 'none' | 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    triggers: string[];
    recommendations: string[];
  };
  
  // Session progress
  sessionProgress?: {
    engagement: number;
    trustLevel: number;
    therapeuticAlliance: number;
    insights: string[];
    breakthroughs: string[];
  };
  
  showDashboard?: boolean;
}

interface SidebarSection {
  id: string;
  icon: React.ReactNode;
  label: string;
  content: React.ReactNode;
  priority: number; // For staggered animations
}

export const ChatGPTRightSidebar: React.FC<ChatGPTRightSidebarProps> = ({
  isCollapsed,
  onToggle,
  isLoading,
  isSpeaking,
  isListening,
  currentAudioLevel,
  analyserNode,
  onEnterOrbMode,
  onFullscreenMode,
  currentEmotionalAssessment,
  currentCrisisLevel,
  sessionProgress,
  showDashboard = false
}) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

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

  // Define sidebar sections for collapsed state
  const sidebarSections: SidebarSection[] = [
    {
      id: 'orb',
      icon: <Brain className="w-5 h-5" />,
      label: "Jamie's Presence",
      priority: 1,
      content: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Jamie's Presence</h3>
          <div className="flex justify-center mb-4">
            <motion.div 
              className="relative w-[280px] h-[280px] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 rounded-full mx-auto overflow-hidden border-2 border-purple-200 dark:border-purple-800 shadow-xl cursor-pointer"
              onClick={onEnterOrbMode}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: isLoading || isSpeaking 
                  ? ['0 10px 25px rgba(139, 92, 246, 0.2)', '0 20px 40px rgba(139, 92, 246, 0.4)', '0 10px 25px rgba(139, 92, 246, 0.2)']
                  : '0 10px 25px rgba(139, 92, 246, 0.1)'
              }}
              transition={{ 
                duration: 2, 
                repeat: (isLoading || isSpeaking) ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {isLoading ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full animate-pulse flex items-center justify-center">
                  <div className="text-blue-600 dark:text-blue-400 text-sm text-center">
                    <div>Processing...</div>
                    <div className="text-xs opacity-75">Jamie is thinking</div>
                  </div>
                </div>
              ) : (
                <>
                  <NarratorOrbComponent
                    isVisible={true}
                    intensity={isLoading ? 0.8 : (isSpeaking ? 0.9 : currentEmotionalAssessment.intensity / 10)}
                    audioLevel={isSpeaking ? currentAudioLevel : (isListening ? 0.4 : 0.1)}
                    analyserNode={analyserNode}
                    className="w-full h-full"
                  />
                  
                  {/* Fallback content when orb doesn't load */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-gray-600 dark:text-gray-300 text-center opacity-30">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">🧠</span>
                      </div>
                      <div className="text-xs font-medium">Jamie</div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
          <div className="text-center">
            <motion.p 
              className={`text-sm font-medium ${getEmotionalColor(currentEmotionalAssessment.primaryEmotion)}`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
              key={currentEmotionalAssessment.primaryEmotion}
            >
              {currentEmotionalAssessment.primaryEmotion}
            </motion.p>
            <p className="text-xs text-gray-500">
              Intensity: {currentEmotionalAssessment.intensity}/10
            </p>
          </div>
          
          <div className="mt-4 space-y-2">
            <motion.button
              onClick={onEnterOrbMode}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.02, y: -1, boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              Enter Orb Mode
            </motion.button>
            <motion.button
              onClick={onFullscreenMode}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.02, y: -1, boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              Fullscreen Mode
            </motion.button>
          </div>
        </motion.div>
      )
    },
    {
      id: 'emotional',
      icon: <Activity className="w-5 h-5" />,
      label: "Emotional Analysis", 
      priority: 2,
      content: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 border-l-4"
          style={{ 
            borderLeftColor: currentEmotionalAssessment.intensity >= 8 ? '#ef4444' : 
                             currentEmotionalAssessment.intensity >= 6 ? '#f59e0b' : 
                             currentEmotionalAssessment.intensity >= 4 ? '#eab308' : '#10b981'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Emotional Analysis</h3>
            <motion.div
              animate={{ 
                scale: currentEmotionalAssessment.intensity >= 7 ? [1, 1.1, 1] : 1,
                rotate: currentEmotionalAssessment.intensity >= 8 ? [0, 5, -5, 0] : 0
              }}
              transition={{ duration: 0.5 }}
              className={`w-3 h-3 rounded-full ${
                currentEmotionalAssessment.intensity >= 8 ? 'bg-red-500' :
                currentEmotionalAssessment.intensity >= 6 ? 'bg-orange-500' :
                currentEmotionalAssessment.intensity >= 4 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Primary Emotion</span>
              <motion.span 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.3 }}
                key={currentEmotionalAssessment.primaryEmotion}
                className={`text-sm font-medium capitalize px-2 py-1 rounded-full ${getEmotionalColor(currentEmotionalAssessment.primaryEmotion)} bg-opacity-10`}
              >
                {currentEmotionalAssessment.primaryEmotion}
              </motion.span>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Intensity Level</span>
                <motion.span 
                  className="text-sm font-medium text-gray-900 dark:text-white"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                  key={currentEmotionalAssessment.intensity}
                >
                  {currentEmotionalAssessment.intensity}/10
                </motion.span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
                <motion.div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    currentEmotionalAssessment.intensity >= 8 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                    currentEmotionalAssessment.intensity >= 6 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                    currentEmotionalAssessment.intensity >= 4 ? 'bg-gradient-to-r from-yellow-500 to-green-500' :
                    'bg-gradient-to-r from-green-500 to-blue-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentEmotionalAssessment.intensity / 10) * 100}%` }}
                />
                {currentEmotionalAssessment.intensity >= 7 && (
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-full"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
            </div>

            {currentEmotionalAssessment.triggers && currentEmotionalAssessment.triggers.length > 0 && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Identified Triggers</span>
                <div className="flex flex-wrap gap-1">
                  {currentEmotionalAssessment.triggers.map((trigger, index) => (
                    <motion.span 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full"
                    >
                      {trigger}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {currentEmotionalAssessment.secondaryEmotions && currentEmotionalAssessment.secondaryEmotions.length > 0 && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Secondary Emotions</span>
                <div className="flex flex-wrap gap-1">
                  {currentEmotionalAssessment.secondaryEmotions.map((emotion, index) => (
                    <motion.span 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full"
                    >
                      {emotion}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )
    },
    {
      id: 'crisis',
      icon: <Shield className="w-5 h-5" />,
      label: "Crisis Monitoring",
      priority: 3,
      content: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Crisis Monitoring</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Current Level</span>
              <motion.span 
                className={`text-sm font-medium ${getCrisisColor(currentCrisisLevel.level)}`}
                animate={currentCrisisLevel.level !== 'none' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: currentCrisisLevel.level !== 'none' ? Infinity : 0, repeatDelay: 2 }}
              >
                {currentCrisisLevel.level}
              </motion.span>
            </div>
            
            {currentCrisisLevel.level !== 'none' && (
              <motion.div 
                className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </motion.div>
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Crisis Detected</span>
                </div>
                <p className="text-xs text-red-600 dark:text-red-400">
                  Providing appropriate crisis support and resources.
                </p>
                {currentCrisisLevel.recommendations.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">Recommendations:</p>
                    <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                      {currentCrisisLevel.recommendations.map((rec, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          • {rec}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )
    }
  ];

  if (showDashboard && sessionProgress) {
    sidebarSections.push({
      id: 'session',
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Session Progress",
      priority: 4,
      content: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Session Progress</h3>
          <div className="space-y-4">
            {[
              { label: 'Engagement', value: sessionProgress.engagement, color: 'bg-green-500' },
              { label: 'Trust Level', value: sessionProgress.trustLevel, color: 'bg-blue-500' },
              { label: 'Therapeutic Alliance', value: sessionProgress.therapeuticAlliance, color: 'bg-purple-500' }
            ].map((item, index) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                  <motion.span 
                    className="text-sm font-medium"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.value}/10
                  </motion.span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div 
                    className={`${item.color} h-2 rounded-full transition-all duration-300`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / 10) * 100}%` }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                  />
                </div>
              </div>
            ))}

            {sessionProgress.insights.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Session Insights</h4>
                <div className="space-y-1">
                  {sessionProgress.insights.map((insight, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start space-x-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Lightbulb className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{insight}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )
    });
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

              {/* Luna AI-style Right Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? 60 : 320,
          x: 0
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 
                   flex flex-col h-full z-50 shadow-sm overflow-hidden"
        style={{ minWidth: isCollapsed ? 60 : 320 }}
      >
        {isCollapsed ? (
          /* Collapsed State - Vertical Icon Strip */
          <div className="flex flex-col h-full">
            <div className="p-3 flex justify-center">
              <motion.div
                className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-white text-sm font-bold">J</span>
              </motion.div>
            </div>
            
            <div className="flex-1 px-2 space-y-3">
              {sidebarSections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={onToggle}
                  className="w-full h-12 flex items-center justify-center rounded-lg text-gray-700 dark:text-gray-300
                           hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredSection(section.id)}
                  onHoverEnd={() => setHoveredSection(null)}
                >
                  <div className="flex-shrink-0">
                    {section.icon}
                  </div>
                  
                  {/* Luna AI-style Tooltip sliding in from right */}
                  <AnimatePresence>
                    {hoveredSection === section.id && (
                      <motion.div
                        initial={{ opacity: 0, x: -8, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-full mr-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 
                                 text-white text-sm rounded-lg whitespace-nowrap z-50
                                 shadow-lg border border-gray-700"
                      >
                        {section.label}
                        {/* Arrow pointing right */}
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 
                                      border-l-4 border-l-gray-900 dark:border-l-gray-700 
                                      border-y-4 border-y-transparent" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>

            {/* Profile/Settings at bottom */}
            <div className="p-3">
              <motion.button
                className="w-full h-12 flex items-center justify-center rounded-lg text-gray-700 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5" />
                
                {/* Tooltip */}
                <div className="absolute right-full mr-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 
                             text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 
                             transition-opacity pointer-events-none whitespace-nowrap z-50
                             transform translate-x-2 group-hover:translate-x-0">
                  Settings
                </div>
              </motion.button>
            </div>
          </div>
        ) : (
          /* Expanded State - Full Content */
          <div className="flex flex-col h-full">
            {/* Header with close button */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">J</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Jamie's Insights</span>
                </motion.div>
                
                <motion.button
                  onClick={onToggle}
                  className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 
                           hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Scrollable Content with staggered animations */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {sidebarSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: section.priority * 0.1 }}
                >
                  {section.content}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};