import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedAIResponse, EmotionalState, TherapeuticIntervention, CrisisLevel } from '../../types/ai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotionalAssessment?: EmotionalState;
  therapeuticIntervention?: TherapeuticIntervention;
  crisisLevel?: CrisisLevel;
}

interface JamieChatBoxProps {
  userId: string;
  onCrisisDetected?: (crisisLevel: CrisisLevel) => void;
  onEmotionalInsight?: (assessment: EmotionalState) => void;
  onTherapeuticProgress?: (intervention: TherapeuticIntervention) => void;
}

const JamieChatBox: React.FC<JamieChatBoxProps> = ({
  userId,
  onCrisisDetected,
  onEmotionalInsight,
  onTherapeuticProgress
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [emotionalInsights, setEmotionalInsights] = useState<EmotionalState | null>(null);
  const [therapeuticIntervention, setTherapeuticIntervention] = useState<TherapeuticIntervention | null>(null);
  const [crisisLevel, setCrisisLevel] = useState<CrisisLevel | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm Jamie, your AI therapeutic companion. I'm here to provide empathetic support and help you explore your thoughts and feelings. What would you like to talk about today?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.slice(-10).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          userId,
          sessionId,
          useEnhanced: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data: EnhancedAIResponse = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        emotionalAssessment: data.emotionalAssessment,
        therapeuticIntervention: data.therapeuticIntervention,
        crisisLevel: data.crisisLevel
      };

      setMessages(prev => [...prev, assistantMessage]);
      setSessionId(data.sessionId);
      
      // Update insights
      setEmotionalInsights(data.emotionalAssessment);
      setTherapeuticIntervention(data.therapeuticIntervention);
      setCrisisLevel(data.crisisLevel);

      // Trigger callbacks
      if (data.crisisLevel && data.crisisLevel.level !== 'none') {
        onCrisisDetected?.(data.crisisLevel);
      }
      
      onEmotionalInsight?.(data.emotionalAssessment);
      onTherapeuticProgress?.(data.therapeuticIntervention);

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm experiencing some technical difficulties right now, but I'm here to listen. Can you tell me more about what you're going through?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      'anxiety': 'bg-yellow-100 text-yellow-800',
      'depression': 'bg-blue-100 text-blue-800',
      'anger': 'bg-red-100 text-red-800',
      'joy': 'bg-green-100 text-green-800',
      'sadness': 'bg-gray-100 text-gray-800',
      'fear': 'bg-purple-100 text-purple-800',
      'excitement': 'bg-orange-100 text-orange-800',
      'contentment': 'bg-teal-100 text-teal-800'
    };
    return colors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getCrisisColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'none': 'bg-green-100 text-green-800',
      'low': 'bg-yellow-100 text-yellow-800',
      'moderate': 'bg-orange-100 text-orange-800',
      'high': 'bg-red-100 text-red-800',
      'critical': 'bg-red-200 text-red-900'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">J</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Jamie AI Therapist</h3>
            <p className="text-sm text-gray-500">Your therapeutic companion</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowInsights(!showInsights)}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
        >
          {showInsights ? 'Hide' : 'Show'} Insights
        </button>
      </div>

      {/* Insights Panel */}
      <AnimatePresence>
        {showInsights && (emotionalInsights || therapeuticIntervention || crisisLevel) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-200 bg-gray-50 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Emotional Assessment */}
              {emotionalInsights && (
                <div className="bg-white p-3 rounded-lg border">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Emotional State</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Primary:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getEmotionColor(emotionalInsights.primaryEmotion)}`}>
                        {emotionalInsights.primaryEmotion}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Intensity:</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(emotionalInsights.intensity / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{emotionalInsights.intensity}/10</span>
                      </div>
                    </div>
                    {emotionalInsights.progressIndicator && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Progress:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          emotionalInsights.progressIndicator === 'improving' ? 'bg-green-100 text-green-800' :
                          emotionalInsights.progressIndicator === 'regressing' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {emotionalInsights.progressIndicator}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Therapeutic Intervention */}
              {therapeuticIntervention && (
                <div className="bg-white p-3 rounded-lg border">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Therapeutic Approach</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Type:</span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {therapeuticIntervention.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Technique:</span>
                      <span className="text-xs text-gray-800 font-medium">
                        {therapeuticIntervention.technique}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Effectiveness:</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(therapeuticIntervention.effectiveness / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{therapeuticIntervention.effectiveness}/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Crisis Level */}
              {crisisLevel && crisisLevel.level !== 'none' && (
                <div className="bg-white p-3 rounded-lg border">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Crisis Assessment</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Level:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCrisisColor(crisisLevel.level)}`}>
                        {crisisLevel.level.toUpperCase()}
                      </span>
                    </div>
                    {crisisLevel.urgency && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Urgency:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getCrisisColor(crisisLevel.urgency)}`}>
                          {crisisLevel.urgency.toUpperCase()}
                        </span>
                      </div>
                    )}
                    {crisisLevel.professionalHelp && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Professional Help:</span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                          RECOMMENDED
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">Jamie is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts and feelings..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default JamieChatBox; 