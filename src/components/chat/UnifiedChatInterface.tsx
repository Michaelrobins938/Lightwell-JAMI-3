import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import dynamic from 'next/dynamic';

// Import unified sidebars
import { CollapsibleSidebar } from './CollapsibleSidebar';
import { ConsolidatedRightSidebar } from './ConsolidatedRightSidebar';

// Import core chat components
import ChatMessage from './ChatMessage';
import { ChatGPTInput } from './ChatGPTInput';
import { EnhancedChatInput } from './EnhancedChatInput';
import { MultiModalInput } from './MultiModalInput';
import { ModelSelector } from './ModelSelector';
import { MetricsBar } from './MetricsBar';
import { ThreadBranchVisualizer } from './ThreadBranchVisualizer';
import { ThreadTimelineVisualizer } from './ThreadTimelineVisualizer';

// Import feature components
import VoiceRecorder from './VoiceRecorder';
import { StreamingMessage } from './StreamingMessage';
import TypingIndicator from '../TypingIndicator';
import { CrisisIntervention } from './CrisisIntervention';
import { NarratorOrbComponent } from '../visuals/NarratorOrb';
import ScrollToBottom from './ScrollToBottom';
import { FileUploadZone } from './FileUploadZone';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

// Import hooks
import { useConversations } from '../../hooks/useConversations';
import { useStreamingChat } from '../../hooks/useStreamingChat';
import { useThreadBranching } from '../../hooks/useThreadBranching';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { useGeminiVision } from '../../hooks/useGeminiVision';
import { useVoiceMode } from '../../hooks/useVoiceMode';
import { useExport } from '../../hooks/useExport';
import { useChatTitles } from '../../hooks/useChatTitles';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useChatMemory } from '../../hooks/useChatMemory';
import { usePersonality } from '../../hooks/usePersonality';

// Import services
import memoryService from '../../services/memoryService';
import { trackEvent } from '../../services/analyticsService';

// Dynamic imports to avoid SSR issues
const VoiceMode = dynamic(() => import('../VoiceMode'), { ssr: false });
const CommandPaletteComponent = dynamic(() => import('./CommandPalette').then(mod => ({ default: mod.CommandPalette })), { ssr: false });

// Types
import { Message, Conversation } from '../../types/chat.types';

interface UnifiedChatInterfaceProps {
  className?: string;
  onVoiceModeToggle?: (isActive: boolean) => void;
  userId?: string;
  chatId?: string;
}

interface EmotionalAssessment {
  primaryEmotion: string;
  intensity: number;
  secondaryEmotions: string[];
  triggers: string[];
  confidence: number;
}

interface CrisisLevel {
  level: 'none' | 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  triggers: string[];
  recommendations: string[];
}

interface SessionProgress {
  engagement: number;
  trustLevel: number;
  therapeuticAlliance: number;
  insights: string[];
  breakthroughs: string[];
  duration: number;
  messageCount: number;
}

export const UnifiedChatInterface: React.FC<UnifiedChatInterfaceProps> = ({
  className = '',
  onVoiceModeToggle,
  userId = 'user-1',
  chatId
}) => {
  // State management
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isFullscreenOrb, setIsFullscreenOrb] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [showThreadBranching, setShowThreadBranching] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'multimodal'>('text');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [metrics, setMetrics] = useState<{
    latencyMs: number | null;
    promptTokens: number | null;
    completionTokens: number | null;
    totalTokens: number | null;
  }>({
    latencyMs: null,
    promptTokens: null,
    completionTokens: null,
    totalTokens: null
  });
  
  // AI/Emotional state
  const [emotionalAssessment, setEmotionalAssessment] = useState<EmotionalAssessment>({
    primaryEmotion: 'neutral',
    intensity: 5,
    secondaryEmotions: [],
    triggers: [],
    confidence: 0.8
  });
  
  const [crisisLevel, setCrisisLevel] = useState<CrisisLevel>({
    level: 'none',
    confidence: 0,
    triggers: [],
    recommendations: []
  });
  
  const [sessionProgress, setSessionProgress] = useState<SessionProgress>({
    engagement: 7,
    trustLevel: 8,
    therapeuticAlliance: 6,
    insights: ['Building rapport', 'Identifying coping mechanisms'],
    breakthroughs: [],
    duration: 0,
    messageCount: 0
  });

  // Audio/Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentAudioLevel, setCurrentAudioLevel] = useState(0);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Hooks
  const router = useRouter();
  const { user } = useAuth();
  
  const {
    conversations,
    currentConversation,
    isLoading: conversationsLoading,
    createConversation,
    selectConversation,
    deleteConversation,
    renameConversation
  } = useConversations(userId);

  const {
    messages,
    isStreaming,
    isThinking,
    currentStreamingMessage,
    error: chatError,
    sendMessage,
    clearError,
    clearMessages
  } = useStreamingChat(userId, currentConversation?.id);

  const {
    tree: threadTree,
    currentPath: threadPath,
    isNavigatingHistory,
    initializeThread,
    addMessage: addThreadMessage,
    createBranch,
    navigateToNode
  } = useThreadBranching();

  const { scrollToBottom } = useAutoScroll({ enabled: true });
  const { isCapturing: visionProcessing } = useGeminiVision();
  
  const {
    listening: isVoiceActive,
    startListening: startVoiceMode,
    stopListening: stopVoiceMode,
    transcript
  } = useVoiceMode();

  // Additional hooks for enhanced functionality
  const { exportChat } = useExport();
  const { generateTitle, updateTitle } = useChatTitles();
  const { shortcuts } = useKeyboardShortcuts();
  const { addMemory } = useChatMemory(userId);
  const { activePersonality: currentPersonality, setActive: setPersonality } = usePersonality();

  // Effects
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingMessage, scrollToBottom]);

  useEffect(() => {
    // Initialize session timer
    const startTime = Date.now();
    const timer = setInterval(() => {
      setSessionProgress(prev => ({
        ...prev,
        duration: Math.floor((Date.now() - startTime) / 1000)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Update message count
    setSessionProgress(prev => ({
      ...prev,
      messageCount: messages.length
    }));
  }, [messages.length]);

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey)) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setShowCommandPalette(true);
            break;
          case 'n':
            e.preventDefault();
            handleNewConversation();
            break;
          case 'b':
            e.preventDefault();
            setLeftSidebarCollapsed(!leftSidebarCollapsed);
            break;
          case '.':
            e.preventDefault();
            setRightSidebarCollapsed(!rightSidebarCollapsed);
            break;
          case '/':
            e.preventDefault();
            setShowKeyboardShortcuts(true);
            break;
          case 'm':
            e.preventDefault();
            setShowMetrics(!showMetrics);
            break;
          case 't':
            e.preventDefault();
            setShowThreadBranching(!showThreadBranching);
            break;
          case 'e':
            e.preventDefault();
            if (currentConversation) {
              exportChat(currentConversation.messages, {
format: 'markdown',
includeMetadata: false,
includeTimestamps: false,
includeBranches: false,
includeSystemMessages: false,
compressionLevel: 'standard'
});
            }
            break;
          case 'Enter':
            if (e.shiftKey) return;
            e.preventDefault();
            handleSendMessage(currentInput);
            break;
        }
      }

      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowKeyboardShortcuts(false);
        if (isVoiceMode) {
          handleVoiceModeClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentInput, leftSidebarCollapsed, rightSidebarCollapsed, isVoiceMode, showMetrics, showThreadBranching, currentConversation]);

  // Handlers
  const handleNewConversation = useCallback(async () => {
    try {
      const conversation = await createConversation();
      if (conversation && typeof conversation === 'object' && 'id' in conversation) {
        await selectConversation(conversation.id);
        clearMessages();
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  }, [createConversation, selectConversation, clearMessages]);

  const handleSendMessage = useCallback(async (content: string, attachments?: any[]) => {
    if (!content.trim() || isStreaming) return;

    const startTime = Date.now();

    try {
      // Analyze emotional content
      const emotion = analyzeMessageEmotion(content);
      setEmotionalAssessment(emotion);
      
      // Check for crisis indicators
      const crisis = analyzeCrisisLevel(content);
      setCrisisLevel(crisis);

      // Store memory if enabled
      if (addMemory) {
        await addMemory({
          userId,
          type: 'emotional',
          content,
          metadata: {
            timestamp: new Date(),
            relevance: 0.5,
            tags: [],
            source: 'chat_message'
          }
        });
      }

      // Track analytics with enhanced metrics
      await trackEvent('message_sent', {
        userId,
        conversationId: currentConversation?.id,
        messageLength: content.length,
        hasAttachments: !!attachments?.length,
        inputMode,
        model: selectedModel,
        personality: currentPersonality?.name
      });

      // Send message via streaming with metrics tracking
      const response = await sendMessage(content, attachments);
      
      // Calculate and store metrics
      const latency = Date.now() - startTime;
      setMetrics(prev => ({
        ...prev,
        latencyMs: latency,
        promptTokens: content.split(' ').length, // Rough estimation
        completionTokens: response?.split(' ').length || 0,
        totalTokens: (content.split(' ').length + (response?.split(' ').length || 0))
      }));
      
      // Update session progress
      setSessionProgress(prev => ({
        ...prev,
        engagement: Math.min(10, prev.engagement + 0.1),
        trustLevel: Math.min(10, prev.trustLevel + 0.05)
      }));

      // Auto-generate title if this is the first message
      if (currentConversation && messages.length === 0 && generateTitle) {
        const title = await generateTitle(content);
        if (title && updateTitle) {
          await updateTitle(currentConversation.id, title);
        }
      }

      setCurrentInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [isStreaming, userId, currentConversation?.id, inputMode, sendMessage, selectedModel, currentPersonality, addMemory, generateTitle, updateTitle, messages.length]);

  const handleVoiceModeOpen = useCallback(() => {
    setIsVoiceMode(true);
    onVoiceModeToggle?.(true);
    startVoiceMode();
  }, [onVoiceModeToggle, startVoiceMode]);

  const handleVoiceModeClose = useCallback(() => {
    setIsVoiceMode(false);
    onVoiceModeToggle?.(false);
    stopVoiceMode();
  }, [onVoiceModeToggle, stopVoiceMode]);

  const handleOrbMode = useCallback(() => {
    router.push('/fullscreen-orb');
  }, [router]);

  const handleFullscreenMode = useCallback(() => {
    setIsFullscreenOrb(true);
  }, []);

  // Analysis functions
  const analyzeMessageEmotion = (content: string): EmotionalAssessment => {
    // Simple emotion analysis - in production, use proper NLP
    const emotionKeywords = {
      happy: ['happy', 'joy', 'great', 'wonderful', 'amazing', 'love'],
      sad: ['sad', 'depressed', 'down', 'crying', 'upset', 'hurt'],
      angry: ['angry', 'mad', 'frustrated', 'hate', 'furious', 'annoyed'],
      anxious: ['anxious', 'worried', 'nervous', 'scared', 'panic', 'stress'],
      calm: ['calm', 'peaceful', 'relaxed', 'content', 'serene']
    };

    const lowerContent = content.toLowerCase();
    let detectedEmotion = 'neutral';
    let maxMatches = 0;

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const matches = keywords.filter(keyword => lowerContent.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedEmotion = emotion;
      }
    }

    const intensity = Math.min(10, maxMatches * 2 + Math.random() * 3 + 3);

    return {
      primaryEmotion: detectedEmotion,
      intensity: Math.round(intensity),
      secondaryEmotions: [],
      triggers: maxMatches > 0 ? ['message_content'] : [],
      confidence: maxMatches > 0 ? 0.7 + (maxMatches * 0.1) : 0.5
    };
  };

  const analyzeCrisisLevel = (content: string): CrisisLevel => {
    const crisisKeywords = {
      critical: ['suicide', 'kill myself', 'end it all', 'not worth living'],
      high: ['hopeless', "can't go on", 'want to die', 'hurt myself'],
      medium: ['depressed', "can't cope", 'overwhelmed', 'breaking down'],
      low: ['stressed', 'anxious', 'worried', 'upset']
    };

    const lowerContent = content.toLowerCase();
    
    for (const [level, keywords] of Object.entries(crisisKeywords)) {
      for (const keyword of keywords) {
        if (lowerContent.includes(keyword)) {
          return {
            level: level as any,
            confidence: 0.8,
            triggers: [keyword],
            recommendations: level === 'critical' || level === 'high' 
              ? ['Contact emergency services', 'Provide crisis hotline numbers', 'Recommend immediate professional help']
              : ['Suggest coping strategies', 'Provide emotional support resources']
          };
        }
      }
    }

    return {
      level: 'none',
      confidence: 0,
      triggers: [],
      recommendations: []
    };
  };

  // Render methods
  const renderMessages = () => {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4" ref={chatContainerRef}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <ChatMessage
                message={message}
                isStreaming={false}
                onRegenerate={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
                onCopy={() => navigator.clipboard.writeText(message.content)}
                showActions={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming message */}
        {isStreaming && currentStreamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <StreamingMessage content={currentStreamingMessage} isStreaming={false} />
          </motion.div>
        )}

        {/* Thinking indicator */}
        {isThinking && !currentStreamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TypingIndicator />
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>
    );
  };

  const renderInputArea = () => {
    switch (inputMode) {
      case 'voice':
        return (
          <VoiceRecorder
            onTranscript={setCurrentInput}
            isListening={isListening}
            onStartListening={() => setIsListening(true)}
            onStopListening={() => setIsListening(false)}
          />
        );
      
      case 'multimodal':
        return (
          <MultiModalInput
            onSendMessage={handleSendMessage}
            value={currentInput}
            onChange={setCurrentInput}
            disabled={isStreaming}
            placeholder="Type a message, upload files, or record voice..."
          />
        );
      
      default:
        return (
          <EnhancedChatInput
            input={currentInput}
            setInput={setCurrentInput}
            onSendMessage={handleSendMessage}
            isLoading={isStreaming}
            isListening={isListening}
            onStartListening={handleVoiceModeOpen}
            onStopListening={handleVoiceModeClose}
            hasMessages={messages.length > 0}
          />
        );
    }
  };

function setShowCrisisIntervention(arg0: boolean): void {
throw new Error('Function not implemented.');
}

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 ${className}`}>
      {/* Left Sidebar */}
      <CollapsibleSidebar
        isCollapsed={leftSidebarCollapsed}
        onToggle={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
        conversations={conversations}
        currentConversationId={currentConversation?.id}
        onSelectConversation={selectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={deleteConversation}
        onRenameConversation={renameConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Chat Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Model Selector */}
              <ModelSelector />
              
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {(currentConversation as Conversation)?.title || 'New Conversation'}
              </h1>
              
              {/* Session Info */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {messages.length} messages • {Math.floor(sessionProgress.duration / 60)}m
              </div>
              
              {emotionalAssessment.primaryEmotion !== 'neutral' && (
                <motion.div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    emotionalAssessment.intensity >= 7 ? 'bg-red-100 text-red-700' :
                    emotionalAssessment.intensity >= 4 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  {emotionalAssessment.primaryEmotion} ({emotionalAssessment.intensity}/10)
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Feature Toggle Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowMetrics(!showMetrics)}
                  className={`p-2 rounded-lg transition-colors ${
                    showMetrics ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title="Toggle Metrics"
                >
                  📊
                </button>
                
                <button
                  onClick={() => setShowThreadBranching(!showThreadBranching)}
                  className={`p-2 rounded-lg transition-colors ${
                    showThreadBranching ? 'bg-purple-100 text-purple-600' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title="Thread Branching"
                >
                  🌳
                </button>
                
                <button
                  onClick={() => setShowKeyboardShortcuts(true)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  title="Keyboard Shortcuts (Ctrl+/)"
                >
                  ⌨️
                </button>
              </div>
              
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

              {/* Input Mode Toggles */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {(['text', 'voice', 'multimodal'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setInputMode(mode)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      inputMode === mode
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              {/* Crisis Alert */}
              {crisisLevel.level !== 'none' && (
                <motion.button
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    crisisLevel.level === 'critical' ? 'bg-red-600 text-white' :
                    crisisLevel.level === 'high' ? 'bg-red-500 text-white' :
                    crisisLevel.level === 'medium' ? 'bg-orange-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}
                  animate={{ pulse: crisisLevel.level === 'critical' ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: crisisLevel.level === 'critical' ? Infinity : 0 }}
                  onClick={() => setShowCrisisIntervention(true)}
                >
                  Crisis: {crisisLevel.level}
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        {renderMessages()}

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          {renderInputArea()}
        </div>
      </div>

      {/* Right Sidebar */}
      <ConsolidatedRightSidebar
        isCollapsed={rightSidebarCollapsed}
        onToggle={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
        conversations={conversations}
        currentConversationId={currentConversation?.id}
        onSelectConversation={selectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={deleteConversation}
        onRenameConversation={renameConversation}
        isLoading={isStreaming || conversationsLoading}
        isSpeaking={isSpeaking}
        isListening={isListening}
        currentAudioLevel={currentAudioLevel}
        analyserNode={analyserNode}
        onEnterOrbMode={handleOrbMode}
        onFullscreenMode={handleFullscreenMode}
        currentEmotionalAssessment={emotionalAssessment}
        currentCrisisLevel={crisisLevel}
        sessionProgress={sessionProgress}
        features={{
          voiceMode: true,
          multimodal: true,
          threadBranching: true,
          export: true,
          share: true,
          analytics: true,
          crisis: true,
          memory: true
        }}
      />

      {/* Modals and Overlays */}
      <AnimatePresence>
        {isVoiceMode && (
          <VoiceMode
            isOpen={isVoiceMode}
            onClose={handleVoiceModeClose}
          />
        )}

        {showCommandPalette && (
          <CommandPaletteComponent
            isOpen={showCommandPalette}
            onClose={() => setShowCommandPalette(false)}
          />
        )}

        {showKeyboardShortcuts && (
          <KeyboardShortcutsHelp
            isOpen={showKeyboardShortcuts}
            onClose={() => setShowKeyboardShortcuts(false)}
            shortcuts={shortcuts}
          />
        )}

        {isFullscreenOrb && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setIsFullscreenOrb(false)}
          >
            <NarratorOrbComponent
              isVisible={true}
              intensity={emotionalAssessment.intensity / 10}
              audioLevel={currentAudioLevel}
              analyserNode={analyserNode}
              className="w-96 h-96"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics Bar */}
      {showMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-40"
        >
          <MetricsBar
            latencyMs={metrics.latencyMs}
            promptTokens={metrics.promptTokens}
            completionTokens={metrics.completionTokens}
            totalTokens={metrics.totalTokens}
          />
        </motion.div>
      )}

      {/* Thread Branching Visualizer */}
      {showThreadBranching && threadTree && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl z-40 overflow-y-auto"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thread Branches</h3>
              <button
                onClick={() => setShowThreadBranching(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                ❌
              </button>
            </div>
          </div>
          
          <ThreadBranchVisualizer
            tree={threadTree}
            onSelectBranch={(branchId) => navigateToNode && navigateToNode(branchId)}
            onDeleteBranch={(branchId) => {
              // Handle branch deletion
              console.log('Delete branch:', branchId);
            }}
            selectedBranchId={threadPath.length > 0 ? threadPath[threadPath.length - 1] : undefined}
          />
        </motion.div>
      )}

      {/* Scroll to Bottom Button */}
      <ScrollToBottom onScrollToBottom={scrollToBottom} />

      {/* File Upload Zone (when dragging files) */}
      {inputMode === 'multimodal' && (
        <FileUploadZone
          onFileUpload={(files) => {
            console.log('Files uploaded:', files);
            // Handle file upload
          }}
        />
      )}
    </div>
  );
};

export default UnifiedChatInterface;