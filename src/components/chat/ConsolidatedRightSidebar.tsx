import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

// React Icons - comprehensive set for all features
import { 
  BsChatDots, BsSearch, BsBook, BsPlus, BsPencil, BsTrash, BsPerson,
  BsGear, BsBoxArrowLeft, BsQuestionCircle, BsShare, BsDownload,
  BsEye, BsFlag, BsArchive, BsClipboardCheck, BsBarChart,
  BsMicFill, BsMic, BsSoundwave, BsHeadphones, BsPalette, BsCode,
  BsUpload, BsImage, BsFileText, BsCamera, BsRecordCircle,
  BsStar, BsHeart, BsBookmark, BsChat, BsGlobe, BsSun, BsMoon,
  BsShield, BsActivity, BsGraphUp, BsZoomIn,
  BsLightbulb, BsBrush, BsLayers, BsGrid, BsListUl, BsKanban, BsKeyboard
} from 'react-icons/bs';

import { 
  MdPsychology, MdDashboard, MdUpgrade, MdKeyboard, MdSupport, MdTrendingUp,
  MdHealthAndSafety, MdInsights, MdAnalytics, MdMemory,
  MdTune, MdAutoMode, MdColorLens, MdVolumeUp, MdVoiceChat,
  MdSmartToy, MdOutlinePlaylistAddCheck, MdTimer, MdHistory,
  MdFavorite, MdShare, MdFileDownload, MdFileUpload, MdSettings, MdHelp,
  MdFullscreen, MdFullscreenExit, MdMic, MdMicOff, MdVolumeOff,
  MdTranscribe, MdSentimentSatisfied, MdSentimentDissatisfied
} from 'react-icons/md';

import { 
  FaDownload, FaFileContract, FaBrain, FaRobot, FaMicrophone,
  FaVideo, FaImage, FaCode, FaPalette, FaEye, FaShieldAlt, FaHeart,
  FaChartLine, FaBolt, FaWaveSquare, FaHeadphones, FaMagic,
  FaExpand, FaCompress, FaPlay, FaPause, FaStop, FaForward,
  FaBackward, FaVolumeUp, FaVolumeDown, FaVolumeMute, FaUserMd
} from 'react-icons/fa';

import { 
  HiOutlineMenu, HiOutlineX, HiOutlineSparkles, HiOutlineChat,
  HiOutlineColorSwatch, HiOutlineMicrophone, HiOutlineCamera,
  HiOutlineDocument, HiOutlineCode, HiOutlineEye
} from 'react-icons/hi';

import { 
  AiOutlineExport, AiOutlineImport, AiOutlineRobot, AiOutlineEye,
  AiOutlineBranches, AiOutlineNodeIndex, AiOutlineExperiment
} from 'react-icons/ai';

import {
  RiMentalHealthLine, RiHeartPulseLine, RiHistoryLine,
  RiVoiceprintLine, RiSoundModuleLine, RiPulseLine
} from 'react-icons/ri';

import {
  IoSettingsOutline, IoAnalyticsOutline, IoEyeOutline,
  IoMicOutline, IoVolumeHighOutline, IoColorPaletteOutline
} from 'react-icons/io5';

// Import feature components
import { NarratorOrbComponent } from '../visuals/NarratorOrb';
import { AITherapistOrb } from '../therapeutic/AITherapistOrb';
import { ExportDialog } from './ExportDialog';
import { ShareDialog } from './ShareDialog';
import { ConversationSettingsModal } from './ConversationSettingsModal';
import { SearchModal } from './SearchModal';
import { CommandPalette } from './CommandPalette';
import VoiceRecorder from './VoiceRecorder';
import { CrisisIntervention } from './CrisisIntervention';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  
  // Chat-related props
  conversations: Array<{
    id: string;
    title: string;
    timestamp: Date;
    preview: string;
    messageCount?: number;
    lastActivity?: Date;
    tags?: string[];
    starred?: boolean;
    archived?: boolean;
  }>;
  
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  
  // AI/Orb features
  isLoading?: boolean;
  isSpeaking?: boolean;
  isListening?: boolean;
  currentAudioLevel?: number;
  analyserNode?: AnalyserNode | null;
  onEnterOrbMode?: () => void;
  onFullscreenMode?: () => void;
  
  // Emotional/Crisis monitoring
  currentEmotionalAssessment?: {
    primaryEmotion: string;
    intensity: number;
    secondaryEmotions: string[];
    triggers: string[];
    confidence: number;
  };
  
  currentCrisisLevel?: {
    level: 'none' | 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    triggers: string[];
    recommendations: string[];
  };
  
  // Session/Analytics
  sessionProgress?: {
    engagement: number;
    trustLevel: number;
    therapeuticAlliance: number;
    insights: string[];
    breakthroughs: string[];
    duration: number;
    messageCount: number;
  };
  
  // Feature toggles
  features?: {
    voiceMode?: boolean;
    multimodal?: boolean;
    threadBranching?: boolean;
    export?: boolean;
    share?: boolean;
    analytics?: boolean;
    crisis?: boolean;
    memory?: boolean;
  };
}

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  badge?: number | string;
  category: string;
  priority?: number;
  active?: boolean;
}

interface FeatureCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: SidebarItem[];
  expanded: boolean;
}

export const ConsolidatedRightSidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  conversations = [],
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  isLoading = false,
  isSpeaking = false,
  isListening = false,
  currentAudioLevel = 0,
  analyserNode = null,
  onEnterOrbMode = () => {},
  onFullscreenMode = () => {},
  currentEmotionalAssessment = {
    primaryEmotion: 'neutral',
    intensity: 5,
    secondaryEmotions: [],
    triggers: [],
    confidence: 0.8
  },
  currentCrisisLevel = {
    level: 'none',
    confidence: 0,
    triggers: [],
    recommendations: []
  },
  sessionProgress,
  features = {
    voiceMode: true,
    multimodal: true,
    threadBranching: true,
    export: true,
    share: true,
    analytics: true,
    crisis: true,
    memory: true
  }
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['ai-orb']));
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showCrisisIntervention, setShowCrisisIntervention] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  
  const router = useRouter();
  const { user, logout } = useAuth();

  // Helper functions
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

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

  // Feature categories with consolidated functionality
  const featureCategories: FeatureCategory[] = [
    {
      id: 'ai-orb',
      name: 'Jamie AI',
      icon: <FaBrain className="w-5 h-5" />,
      expanded: expandedCategories.has('ai-orb'),
      items: [
        {
          icon: <MdPsychology className="w-5 h-5" />,
          label: 'Enter Orb Mode',
          action: onEnterOrbMode,
          category: 'ai-orb'
        },
        {
          icon: <MdFullscreen className="w-5 h-5" />,
          label: 'Fullscreen Mode', 
          action: onFullscreenMode,
          category: 'ai-orb'
        },
        {
          icon: <MdPsychology className="w-5 h-5" />,
          label: 'Memory Insights',
          action: () => router.push('/memory-insights'),
          category: 'ai-orb'
        },
        {
          icon: <MdAnalytics className="w-5 h-5" />,
          label: 'Session Analytics',
          action: () => setActiveFeature('analytics'),
          category: 'ai-orb',
          badge: sessionProgress?.messageCount
        }
      ]
    },
    {
      id: 'therapy-features',
      name: 'AI Therapy',
      icon: <RiMentalHealthLine className="w-5 h-5" />,
      expanded: expandedCategories.has('therapy-features'),
      items: [
        {
          icon: <FaUserMd className="w-5 h-5" />,
          label: 'AI Therapist Mode',
          action: () => setActiveFeature('ai-therapist'),
          category: 'therapy-features'
        },
        {
          icon: <MdPsychology className="w-5 h-5" />,
          label: 'Therapeutic Orb',
          action: () => setActiveFeature('therapeutic-orb'),
          category: 'therapy-features'
        },
        {
          icon: <BsLightbulb className="w-5 h-5" />,
          label: 'CBT Techniques',
          action: () => router.push('/resources/cbt'),
          category: 'therapy-features'
        },
        {
          icon: <MdInsights className="w-5 h-5" />,
          label: 'Therapy Techniques',
          action: () => setActiveFeature('therapy-techniques'),
          category: 'therapy-features'
        },
        {
          icon: <BsClipboardCheck className="w-5 h-5" />,
          label: 'Session Progress',
          action: () => setActiveFeature('session-progress'),
          category: 'therapy-features'
        },
        {
          icon: <MdHealthAndSafety className="w-5 h-5" />,
          label: 'Crisis Assessment',
          action: () => setActiveFeature('crisis-assessment'),
          category: 'therapy-features'
        },
        {
          icon: <FaVideo className="w-5 h-5" />,
          label: 'Video Therapy',
          action: () => router.push('/video-therapy'),
          category: 'therapy-features'
        },
        {
          icon: <RiVoiceprintLine className="w-5 h-5" />,
          label: 'Voice Therapy',
          action: () => router.push('/voice-therapy'),
          category: 'therapy-features'
        },
        {
          icon: <BsBook className="w-5 h-5" />,
          label: 'Guided Journaling',
          action: () => router.push('/tools/guided-journaling'),
          category: 'therapy-features'
        }
      ]
    },
    {
      id: 'voice-features',
      name: 'Voice & Audio',
      icon: <FaMicrophone className="w-5 h-5" />,
      expanded: expandedCategories.has('voice-features'),
      items: [
        {
          icon: <MdVoiceChat className="w-5 h-5" />,
          label: 'Voice Mode',
          action: () => setVoiceEnabled(!voiceEnabled),
          category: 'voice-features',
          active: voiceEnabled
        },
        {
          icon: <BsRecordCircle className="w-5 h-5" />,
          label: 'Voice Recording',
          action: () => setActiveFeature('voice-recorder'),
          category: 'voice-features'
        },
        {
          icon: <MdTranscribe className="w-5 h-5" />,
          label: 'Speech-to-Text',
          action: () => setActiveFeature('transcribe'),
          category: 'voice-features'
        },
        {
          icon: <BsSoundwave className="w-5 h-5" />,
          label: 'Audio Analysis',
          action: () => setActiveFeature('audio-analysis'),
          category: 'voice-features'
        }
      ]
    },
    {
      id: 'multimodal',
      name: 'Multimodal',
      icon: <HiOutlineSparkles className="w-5 h-5" />,
      expanded: expandedCategories.has('multimodal'),
      items: [
        {
          icon: <BsImage className="w-5 h-5" />,
          label: 'Image Upload',
          action: () => setActiveFeature('image-upload'),
          category: 'multimodal'
        },
        {
          icon: <BsCamera className="w-5 h-5" />,
          label: 'Vision Analysis',
          action: () => setActiveFeature('vision'),
          category: 'multimodal'
        },
        {
          icon: <BsCode className="w-5 h-5" />,
          label: 'Code Execution',
          action: () => setActiveFeature('code'),
          category: 'multimodal'
        },
        {
          icon: <BsFileText className="w-5 h-5" />,
          label: 'File Upload',
          action: () => setActiveFeature('file-upload'),
          category: 'multimodal'
        }
      ]
    },
    {
      id: 'conversation',
      name: 'Conversation',
      icon: <BsChatDots className="w-5 h-5" />,
      expanded: expandedCategories.has('conversation'),
      items: [
        {
          icon: <BsSearch className="w-5 h-5" />,
          label: 'Search Chat',
          action: () => setShowSearchModal(true),
          category: 'conversation'
        },
        {
          icon: <AiOutlineBranches className="w-5 h-5" />,
          label: 'Thread Branching',
          action: () => setActiveFeature('threading'),
          category: 'conversation'
        },
        {
          icon: <BsShare className="w-5 h-5" />,
          label: 'Share Conversation',
          action: () => setShowShareDialog(true),
          category: 'conversation'
        },
        {
          icon: <AiOutlineExport className="w-5 h-5" />,
          label: 'Export Chat',
          action: () => setShowExportDialog(true),
          category: 'conversation'
        }
      ]
    },
    {
      id: 'monitoring',
      name: 'Health Monitoring',
      icon: <RiMentalHealthLine className="w-5 h-5" />,
      expanded: expandedCategories.has('monitoring'),
      items: [
        {
          icon: <BsActivity className="w-5 h-5" />,
          label: 'Emotional State',
          action: () => setActiveFeature('emotional'),
          category: 'monitoring',
          badge: currentEmotionalAssessment.intensity
        },
        {
          icon: <BsShield className="w-5 h-5" />,
          label: 'Crisis Support',
          action: () => setShowCrisisIntervention(true),
          category: 'monitoring'
        },
        {
          icon: <MdFavorite className="w-5 h-5" />,
          label: 'Mood Tracking',
          action: () => router.push('/mood-journal'),
          category: 'monitoring'
        },
        {
          icon: <BsGraphUp className="w-5 h-5" />,
          label: 'Progress Tracking',
          action: () => router.push('/progress'),
          category: 'monitoring'
        }
      ]
    },
    {
      id: 'personalization',
      name: 'Personalization',
      icon: <BsPalette className="w-5 h-5" />,
      expanded: expandedCategories.has('personalization'),
      items: [
        {
          icon: <MdColorLens className="w-5 h-5" />,
          label: 'Theme Settings',
          action: () => setThemeMode(themeMode === 'light' ? 'dark' : 'light'),
          category: 'personalization'
        },
        {
          icon: <MdTune className="w-5 h-5" />,
          label: 'Preferences',
          action: () => setShowSettingsModal(true),
          category: 'personalization'
        },
        {
          icon: <MdAutoMode className="w-5 h-5" />,
          label: 'AI Personality',
          action: () => router.push('/personality-management'),
          category: 'personalization'
        },
        {
          icon: <BsKeyboard className="w-5 h-5" />,
          label: 'Shortcuts',
          action: () => setActiveFeature('shortcuts'),
          category: 'personalization'
        }
      ]
    },
    {
      id: 'tools',
      name: 'Advanced Tools',
      icon: <HiOutlineSparkles className="w-5 h-5" />,
      expanded: expandedCategories.has('tools'),
      items: [
        {
          icon: <MdKeyboard className="w-5 h-5" />,
          label: 'Command Palette',
          action: () => setShowCommandPalette(true),
          category: 'tools'
        },
        {
          icon: <BsLayers className="w-5 h-5" />,
          label: 'Plugin Manager',
          action: () => router.push('/plugin-management'),
          category: 'tools'
        },
        {
          icon: <MdHistory className="w-5 h-5" />,
          label: 'Chat History',
          action: () => router.push('/chat-history'),
          category: 'tools'
        },
        {
          icon: <BsBarChart className="w-5 h-5" />,
          label: 'Usage Stats',
          action: () => setActiveFeature('stats'),
          category: 'tools'
        }
      ]
    }
  ];

  // Render category content based on selection
  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'ai-therapist':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">AI Therapist Mode</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Current Session</h4>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  Jamie is using evidence-based therapeutic techniques including CBT, DBT, and mindfulness approaches.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {sessionProgress?.therapeuticAlliance || 7}/10
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">Alliance</div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {sessionProgress?.engagement || 8}/10
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">Engagement</div>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white">Active Techniques:</h5>
                <div className="flex flex-wrap gap-2">
                  {['CBT', 'Mindfulness', 'Active Listening', 'Empathy'].map((technique) => (
                    <span key={technique} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
                      {technique}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'therapeutic-orb':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Therapeutic Orb</h3>
            <div className="flex justify-center mb-4">
              <AITherapistOrb
                isSpeaking={isSpeaking}
                isListening={isListening}
                isThinking={false}
                emotionalState={{
                  state: currentEmotionalAssessment.primaryEmotion,
                  intensity: currentEmotionalAssessment.intensity / 10
                }}
                className="w-32 h-32"
              />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The therapeutic orb visualizes emotional resonance and provides calming presence during sessions.
              </p>
              <div className="flex justify-center space-x-2">
                <button 
                  onClick={onEnterOrbMode}
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600"
                >
                  Enter Orb Mode
                </button>
                <button 
                  onClick={onFullscreenMode}
                  className="px-3 py-1 bg-purple-500 text-white text-xs rounded-full hover:bg-purple-600"
                >
                  Fullscreen
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'therapy-techniques':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Therapeutic Techniques</h3>
            <div className="space-y-3">
              {[
                { name: 'Cognitive Behavioral Therapy', desc: 'Identify and change negative thought patterns', color: 'blue' },
                { name: 'Dialectical Behavior Therapy', desc: 'Emotional regulation and distress tolerance', color: 'green' },
                { name: 'Mindfulness Based Therapy', desc: 'Present-moment awareness and acceptance', color: 'purple' },
                { name: 'Solution-Focused Therapy', desc: 'Goal-oriented problem-solving approach', color: 'orange' }
              ].map((technique, index) => (
                <motion.div
                  key={technique.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 bg-${technique.color}-50 dark:bg-${technique.color}-900/20 rounded-lg cursor-pointer hover:bg-${technique.color}-100 dark:hover:bg-${technique.color}-900/30`}
                >
                  <h4 className={`font-medium text-${technique.color}-900 dark:text-${technique.color}-300 text-sm`}>
                    {technique.name}
                  </h4>
                  <p className={`text-xs text-${technique.color}-700 dark:text-${technique.color}-400 mt-1`}>
                    {technique.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'crisis-assessment':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Crisis Assessment</h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                currentCrisisLevel.level === 'none' ? 'bg-green-50 dark:bg-green-900/20' :
                currentCrisisLevel.level === 'low' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                currentCrisisLevel.level === 'medium' ? 'bg-orange-50 dark:bg-orange-900/20' :
                'bg-red-50 dark:bg-red-900/20'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">Current Level</span>
                  <span className={`font-semibold capitalize ${getCrisisColor(currentCrisisLevel.level)}`}>
                    {currentCrisisLevel.level}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Confidence: {Math.round(currentCrisisLevel.confidence * 100)}%
                </p>
              </div>

              {currentCrisisLevel.triggers.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Detected Triggers</h4>
                  <div className="flex flex-wrap gap-1">
                    {currentCrisisLevel.triggers.map((trigger, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {currentCrisisLevel.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {currentCrisisLevel.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {currentCrisisLevel.level !== 'none' && (
                <button
                  onClick={() => setShowCrisisIntervention(true)}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                >
                  Access Crisis Resources
                </button>
              )}
            </div>
          </motion.div>
        );

      case 'analytics':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Session Analytics</h3>
            {sessionProgress && (
              <div className="space-y-4">
                {[
                  { label: 'Engagement', value: sessionProgress.engagement, color: 'bg-green-500' },
                  { label: 'Trust Level', value: sessionProgress.trustLevel, color: 'bg-blue-500' },
                  { label: 'Therapeutic Alliance', value: sessionProgress.therapeuticAlliance, color: 'bg-purple-500' }
                ].map((item, index) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                      <span className="text-sm font-medium">{item.value}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div 
                        className={`${item.color} h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / 10) * 100}%` }}
                        transition={{ delay: index * 0.2, duration: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        );

      case 'emotional':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Emotional Analysis</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Primary Emotion</span>
                <span className={`text-sm font-medium capitalize ${getEmotionalColor(currentEmotionalAssessment.primaryEmotion)}`}>
                  {currentEmotionalAssessment.primaryEmotion}
                </span>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Intensity</span>
                  <span className="text-sm font-medium">{currentEmotionalAssessment.intensity}/10</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div 
                    className="bg-gradient-to-r from-green-500 to-red-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentEmotionalAssessment.intensity / 10) * 100}%` }}
                  />
                </div>
              </div>

              {currentEmotionalAssessment.triggers.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Triggers</span>
                  <div className="flex flex-wrap gap-1">
                    {currentEmotionalAssessment.triggers.map((trigger, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

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

      {/* Main Sidebar */}
      <motion.div
        className="relative bg-gray-900 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700
                   flex flex-col h-full transition-all duration-300 ease-in-out"
        initial={false}
        animate={{
          width: isCollapsed ? 64 : 380,
        }}
      >
        {/* Header */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {!isCollapsed ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">J</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Jamie Features</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto"
                >
                  <span className="text-white text-xs font-bold">J</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {!isCollapsed && (
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {isCollapsed ? (
            /* Collapsed State */
            <div className="p-2 space-y-2">
              {featureCategories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={onToggle}
                  className="w-12 h-12 flex items-center justify-center rounded-lg text-gray-700 dark:text-gray-300
                           hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.icon}
                  
                  {/* Tooltip */}
                  <div className="absolute right-full mr-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 
                                text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 
                                transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {category.name}
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            /* Expanded State */
            <div className="p-4 space-y-4">
              {/* AI Orb Visualization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Jamie's Presence</h3>
                <div className="flex justify-center mb-4">
                  <motion.div 
                    className="relative w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={onEnterOrbMode}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <NarratorOrbComponent
                      isVisible={true}
                      intensity={currentEmotionalAssessment.intensity / 10}
                      audioLevel={isSpeaking ? currentAudioLevel : 0.1}
                      analyserNode={analyserNode}
                      className="w-full h-full"
                    />
                  </motion.div>
                </div>
                <div className="text-center text-sm">
                  <span className={`font-medium ${getEmotionalColor(currentEmotionalAssessment.primaryEmotion)}`}>
                    {currentEmotionalAssessment.primaryEmotion} ({currentEmotionalAssessment.intensity}/10)
                  </span>
                </div>
              </motion.div>

              {/* Feature Categories */}
              {featureCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-gray-700 dark:text-gray-300">
                        {category.icon}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedCategories.has(category.id) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BsGear className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedCategories.has(category.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-200 dark:border-gray-700"
                      >
                        <div className="p-2 space-y-1">
                          {category.items.map((item, itemIndex) => (
                            <motion.button
                              key={itemIndex}
                              onClick={item.action}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                item.active 
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex-shrink-0">
                                {item.icon}
                              </div>
                              <span className="text-sm font-medium">{item.label}</span>
                              {item.badge && (
                                <div className="ml-auto text-xs px-2 py-1 bg-blue-600 text-white rounded-full">
                                  {item.badge}
                                </div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Active Feature Content */}
              {activeFeature && (
                <div className="mt-4">
                  {renderFeatureContent()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Features Active</span>
              <span>{Object.values(features).filter(Boolean).length}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showExportDialog && (
          <ExportDialog
            isOpen={showExportDialog}
            onClose={() => setShowExportDialog(false)}
            messages={[]}
            threadTree={undefined}
          />
        )}
        
        {showShareDialog && (
          <ShareDialog
            isOpen={showShareDialog}
            onClose={() => setShowShareDialog(false)}
            conversationId={currentConversationId || ''}
            conversationTitle="Current Conversation"
            messageCount={0}
          />
        )}
        
        {showSettingsModal && (
          <ConversationSettingsModal
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            conversationId={currentConversationId}
            onSave={(settings) => {
              console.log('Settings saved:', settings);
              // Handle settings save
            }}
          />
        )}
        
        {showSearchModal && (
          <SearchModal
            isOpen={showSearchModal}
            onClose={() => setShowSearchModal(false)}
            conversations={conversations}
            onSelectConversation={onSelectConversation}
            onNewChat={onNewConversation}
          />
        )}
        
        {showCommandPalette && (
          <CommandPalette
            isOpen={showCommandPalette}
            onClose={() => setShowCommandPalette(false)}
            onNewConversation={onNewConversation}
            onOpenSettings={() => setShowSettingsModal(true)}
            onShareConversation={() => setShowShareDialog(true)}
            onExportConversation={() => setShowExportDialog(true)}
            onClearConversation={() => {}}
            onDeleteConversation={() => {}}
            onFocusInput={() => {}}
          />
        )}
        
        {showCrisisIntervention && (
          <CrisisIntervention
            isOpen={showCrisisIntervention}
            onClose={() => setShowCrisisIntervention(false)}
            crisisLevel={currentCrisisLevel.level}
            triggers={currentCrisisLevel.triggers}
            recommendations={currentCrisisLevel.recommendations}
          />
        )}
      </AnimatePresence>
    </>
  );
};

