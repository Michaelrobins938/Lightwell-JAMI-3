import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Volume2, VolumeX, Settings, Zap, Heart, Brain, 
  Shield, TrendingUp, Eye, Coffee, Music, AlertTriangle, X,
  Play, Pause, RotateCcw, Save, Download, Share2, MessageCircle,
  Clock, User, Bot, CheckCircle, XCircle, Info, Plus, Edit2, Trash2,
  ChevronLeft, ChevronRight, MoreHorizontal
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'react-toastify';
import { useEnhancedVoiceAgent } from '../hooks/useEnhancedVoiceAgent';
import { useConversations } from '../hooks/useConversations';
import { EnhancedAITherapistOrb } from '../components/therapeutic/EnhancedAITherapistOrb';
import { Tooltip } from '../components/Tooltip';

interface VoiceSession {
  id: string;
  startTime: Date;
  duration: number;
  emotionalState: {
    primary: string;
    intensity: number;
    secondary: string[];
  };
  therapeuticTechniques: string[];
  crisisLevel: string;
}

export default function VoiceTherapyClient() {
  const { theme } = useTheme();
  
  // Generate persistent userId
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      let storedUserId = localStorage.getItem('luna-voice-user-id');
      if (!storedUserId) {
        storedUserId = 'voice-user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('luna-voice-user-id', storedUserId);
      }
      return storedUserId;
    }
    return 'voice-user-' + Date.now();
  });

  // Conversation management
  const {
    conversations,
    currentConversation,
    loading: conversationsLoading,
    createConversation,
    loadConversation,
    updateConversation,
    deleteConversation,
    startNewConversation
  } = useConversations(userId);
  
  // Enhanced Voice Agent
  const {
    isInitialized: voiceAgentInitialized,
    isListening: voiceAgentListening,
    isProcessing: voiceAgentProcessing,
    isSpeaking: voiceAgentSpeaking,
    conversationState: voiceAgentState,
    audioData: voiceAudioData,
    initializeSession: initializeVoiceSession,
    startListening: startVoiceListening,
    stopListening: stopVoiceListening,
    toggleListening: toggleVoiceListening,
    endSession: endVoiceSession
  } = useEnhancedVoiceAgent(userId);

  // Session state
  const [currentSession, setCurrentSession] = useState<VoiceSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<VoiceSession[]>([]);
  const [showSessionInfo, setShowSessionInfo] = useState(false);
  const [showFullscreenOrb, setShowFullscreenOrb] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    speed: 0.85,
    pitch: 1.0,
    volume: 1.0,
    style: 'nova'
  });

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Initialize voice session on component mount
  useEffect(() => {
    const initSession = async () => {
      try {
        await initializeVoiceSession();
        const session: VoiceSession = {
          id: `session-${Date.now()}`,
          startTime: new Date(),
          duration: 0,
          emotionalState: {
            primary: 'neutral',
            intensity: 0,
            secondary: []
          },
          therapeuticTechniques: [],
          crisisLevel: 'none'
        };
        setCurrentSession(session);
        toast.success('Voice therapy session initialized!');
        
        // Create a new conversation if none is selected
        if (!currentConversation) {
          await createConversation();
        }
      } catch (error) {
        console.error('Failed to initialize voice session:', error);
        toast.error('Failed to initialize voice session');
      }
    };

    initSession();
  }, [initializeVoiceSession, currentConversation, createConversation]);

  // Session duration timer
  useEffect(() => {
    if (!currentSession) return;

    const interval = setInterval(() => {
      setCurrentSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          duration: Math.floor((Date.now() - prev.startTime.getTime()) / 1000)
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmotionalColor = (emotion: string): string => {
    const colors = {
      happy: 'text-yellow-500',
      sad: 'text-blue-500',
      angry: 'text-red-500',
      anxious: 'text-orange-500',
      calm: 'text-green-500',
      neutral: 'text-gray-500',
    };
    return colors[emotion as keyof typeof colors] || 'text-gray-500';
  };

  const handleSaveSession = async () => {
    if (!currentSession || !currentConversation) return;

    try {
      // Save session to conversation notes
      await updateConversation(
        currentConversation.metadata.id,
        voiceAgentState.messages,
        undefined,
        currentSession.emotionalState
      );
      
      // Add to session history
      setSessionHistory(prev => [...prev, currentSession]);
      
      toast.success('Session saved successfully!');
    } catch (error) {
      console.error('Failed to save session:', error);
      toast.error('Failed to save session');
    }
  };

  const handleEndSession = async () => {
    if (!currentSession) return;

    try {
      await handleSaveSession();
      await endVoiceSession();
      setCurrentSession(null);
      toast.success('Session ended successfully!');
    } catch (error) {
      console.error('Failed to end session:', error);
      toast.error('Failed to end session');
    }
  };

  const handleStartNewSession = async () => {
    if (currentSession) {
      await handleEndSession();
    }
    
    const session: VoiceSession = {
      id: `session-${Date.now()}`,
      startTime: new Date(),
      duration: 0,
      emotionalState: {
        primary: 'neutral',
        intensity: 0,
        secondary: []
      },
      therapeuticTechniques: [],
      crisisLevel: 'none'
    };
    
    setCurrentSession(session);
    await createConversation();
    await initializeVoiceSession();
    toast.success('New voice therapy session started!');
  };

  if (!voiceAgentInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Initializing Voice Therapy
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Setting up your therapeutic voice experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col shadow-xl"
          >
            {/* Session Info Header */}
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Voice Therapy
                </h2>
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              {currentSession && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Session Duration</span>
                    <span className="font-mono text-purple-600 dark:text-purple-400">
                      {formatDuration(currentSession.duration)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Emotional State</span>
                    <span className={`font-medium capitalize ${getEmotionalColor(currentSession.emotionalState.primary)}`}>
                      {currentSession.emotionalState.primary}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleSaveSession}
                      className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Save className="w-4 h-4 inline mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleEndSession}
                      className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <X className="w-4 h-4 inline mr-1" />
                      End
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleStartNewSession}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">New Session</span>
              </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-3">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 px-2">
                Session History
              </h3>
              
              {conversationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No sessions yet. Start your first voice therapy session!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg cursor-pointer transition-all group hover:bg-purple-50 dark:hover:bg-purple-900/20 border ${
                        currentConversation?.metadata.id === conversation.id
                          ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700'
                          : 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-purple-200 dark:hover:border-purple-700'
                      }`}
                      onClick={() => loadConversation(conversation.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {conversation.title}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(conversation.updatedAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full">
                              {conversation.messageCount} exchanges
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Voice Therapy Session
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  AI-powered therapeutic voice interaction
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${voiceAgentListening ? 'bg-red-500 animate-pulse' : voiceAgentSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-gray-600 dark:text-gray-400">
                  {voiceAgentListening ? 'Listening...' : voiceAgentSpeaking ? 'Speaking...' : 'Ready'}
                </span>
              </div>

              <button
                onClick={() => setShowFullscreenOrb(true)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Voice Therapy Interface */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-2xl">
            {/* Enhanced AI Therapist Orb */}
            <div className="w-96 h-96 mx-auto mb-8 relative">
              <EnhancedAITherapistOrb
                isListening={voiceAgentListening}
                isSpeaking={voiceAgentSpeaking}
                isThinking={voiceAgentProcessing}
                audioData={voiceAudioData}
                emotionalState={{
                  state: currentSession?.emotionalState.primary || 'neutral',
                  intensity: currentSession?.emotionalState.intensity || 5,
                  secondaryEmotions: currentSession?.emotionalState.secondary || []
                }}
                className="w-full h-full"
              />
              
              {/* Status overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm">
                  {voiceAgentListening && 'Listening to you...'}
                  {voiceAgentProcessing && 'Processing your message...'}
                  {voiceAgentSpeaking && 'Speaking response...'}
                  {!voiceAgentListening && !voiceAgentProcessing && !voiceAgentSpeaking && 'Ready to listen'}
                </div>
              </div>
            </div>

            {/* Voice Controls */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <Tooltip content={voiceAgentListening ? "Stop listening" : "Start voice session"}>
                <button
                  onClick={toggleVoiceListening}
                  disabled={voiceAgentProcessing}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                    voiceAgentListening
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                      : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  } ${voiceAgentProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  {voiceAgentListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
              </Tooltip>

              <Tooltip content="Voice settings">
                <button
                  onClick={() => setShowSessionInfo(!showSessionInfo)}
                  className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </Tooltip>
            </div>

            {/* Session Info */}
            <AnimatePresence>
              {showSessionInfo && currentSession && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 mb-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Session Information
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <p className="font-mono text-purple-600 dark:text-purple-400">
                        {formatDuration(currentSession.duration)}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Emotional State:</span>
                      <p className={`font-medium capitalize ${getEmotionalColor(currentSession.emotionalState.primary)}`}>
                        {currentSession.emotionalState.primary}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Exchanges:</span>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {voiceAgentState.messages.length}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Crisis Level:</span>
                      <p className={`font-medium ${currentSession.crisisLevel === 'none' ? 'text-green-500' : 'text-red-500'}`}>
                        {currentSession.crisisLevel}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instructions */}
            <div className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
              <p className="mb-2">
                Click the microphone to start your voice therapy session. 
                Speak naturally about what's on your mind.
              </p>
              <p>
                Jamie will listen, understand, and provide thoughtful therapeutic responses
                using advanced AI voice technology.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Orb Modal */}
      <AnimatePresence>
        {showFullscreenOrb && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setShowFullscreenOrb(false)}
          >
            <div className="w-full h-full relative">
              <EnhancedAITherapistOrb
                isListening={voiceAgentListening}
                isSpeaking={voiceAgentSpeaking}
                isThinking={voiceAgentProcessing}
                audioData={voiceAudioData}
                emotionalState={{
                  state: currentSession?.emotionalState.primary || 'neutral',
                  intensity: currentSession?.emotionalState.intensity || 5,
                  secondaryEmotions: currentSession?.emotionalState.secondary || []
                }}
                className="w-full h-full"
              />
              
              <button
                onClick={() => setShowFullscreenOrb(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/50 backdrop-blur-md rounded-full px-6 py-3 text-white">
                  {voiceAgentListening && 'Listening to you...'}
                  {voiceAgentProcessing && 'Processing your message...'}
                  {voiceAgentSpeaking && 'Speaking response...'}
                  {!voiceAgentListening && !voiceAgentProcessing && !voiceAgentSpeaking && 'Ready to listen'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}