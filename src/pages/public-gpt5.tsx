import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Paperclip, 
  Mic, 
  ArrowUp, 
  MessageCircle, 
  Sparkles,
  Menu,
  Plus,
  User,
  Settings
} from 'lucide-react';

// GPT-5 Theme Demo Chat Interface
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// AppShell Component (following the architectural diagram)
const AppShell: React.FC<{ children: React.ReactNode; sidebar: React.ReactNode }> = ({ children, sidebar }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="h-screen bg-gradient-to-br from-gpt5-slate-950 via-gpt5-slate-900 to-gpt5-black text-white overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-white/10 bg-gpt5-slate-900/50 backdrop-blur-sm flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gpt5-beam-gradient rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">J3</span>
            </div>
            <span className="text-sm font-semibold text-white">JAMI-3</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gpt5-amber-start rounded-full animate-pulse" />
          <span className="text-xs text-slate-400">Demo Mode</span>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-gpt5-slate-900/30 backdrop-blur-sm border-r border-white/10 overflow-hidden"
            >
              {sidebar}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
};

// Sidebar Component (following the architectural diagram)
const Sidebar: React.FC = () => {
  const chatHistory = [
    "How can JAMI-3 help with anxiety?",
    "Tell me about mindfulness techniques", 
    "I'm feeling overwhelmed today",
    "What are coping strategies for stress?",
    "How do I improve my sleep habits?"
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/10">
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-gpt5-beam-gradient rounded-xl text-white shadow-lg hover:shadow-xl transition-all">
          <Plus size={16} />
          <span className="font-medium">New Chat</span>
        </button>
      </div>
      
      {/* Chat History List */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
          Try these examples
        </h3>
        <div className="space-y-1">
          {chatHistory.map((title, index) => (
            <ChatHistoryItem key={index} title={title} />
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gpt5-beam-gradient rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-white font-medium">Demo User</p>
            <p className="text-xs text-slate-400">Try JAMI-3 for free</p>
          </div>
          <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Chat History Item Component  
const ChatHistoryItem: React.FC<{ title: string }> = ({ title }) => {
  return (
    <button className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
      <div className="flex items-center gap-2">
        <MessageCircle size={14} className="text-slate-500" />
        <span className="truncate">{title}</span>
      </div>
    </button>
  );
};

// Chat Window Component
const ChatWindow: React.FC<{ 
  messages: Message[];
  isTyping: boolean;
  onSubmitMessage: (message: string) => void;
}> = ({ messages, isTyping, onSubmitMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmitMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* Input Bar */}
      <InputBar 
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        disabled={isTyping}
      />
    </div>
  );
};

// Empty State Component
const EmptyState: React.FC = () => {
  const suggestions = [
    "How can JAMI-3 help with anxiety?",
    "Tell me about mindfulness techniques",
    "I'm feeling overwhelmed today",
    "What are some coping strategies for stress?"
  ];

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="w-20 h-20 bg-gpt5-beam-gradient rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
        <span className="text-white text-2xl font-bold">J3</span>
      </div>
      
      <h1 className="text-3xl font-light text-white mb-4">
        Hello, I'm <span className="bg-gpt5-beam-gradient bg-clip-text text-transparent font-semibold">JAMI-3</span>
      </h1>
      
      <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-lg mx-auto">
        Your AI therapeutic companion. I'm here to listen, support, and help you navigate your mental wellness journey.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-gpt5-slate-800/30 border border-white/10 rounded-xl text-left text-slate-300 hover:text-white hover:bg-gpt5-slate-800/50 transition-all hover:border-gpt5-amber-start/30"
          >
            <div className="flex items-start gap-3">
              <Sparkles size={16} className="text-gpt5-amber-start mt-0.5 flex-shrink-0" />
              <span className="text-sm">{suggestion}</span>
            </div>
          </motion.button>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-gpt5-amber-start rounded-full animate-pulse" />
          This is a demo. Sign up for the full JAMI-3 experience.
        </span>
      </p>
    </div>
  );
};

// Message Bubble Component
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          message.role === 'user'
            ? 'bg-gpt5-beam-gradient text-white shadow-lg'
            : 'bg-gpt5-slate-800/40 border border-white/10 text-white'
        }`}
      >
        {message.role === 'assistant' && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-gpt5-beam-gradient rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">J3</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">JAMI-3</span>
          </div>
        )}
        <p className="leading-relaxed">{message.content}</p>
      </div>
    </motion.div>
  );
};

// Typing Indicator Component
const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="bg-gpt5-slate-800/40 border border-white/10 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-gpt5-beam-gradient rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">J3</span>
          </div>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gpt5-beam-gradient rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Input Bar Component (following the architectural diagram)
const InputBar: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}> = ({ value, onChange, onSubmit, disabled }) => {
  return (
    <div className="border-t border-white/10 bg-gpt5-slate-900/50 backdrop-blur-sm p-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={onSubmit} className="relative">
          <div className="flex items-end gap-3">
            {/* Attachment Button */}
            <AttachmentButton />
            
            {/* Chat Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder="Message JAMI-3..."
                className="w-full resize-none rounded-xl bg-gpt5-slate-800/50 border border-white/20 px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gpt5-amber-start/50 focus:border-gpt5-amber-start/50 transition-all disabled:opacity-50"
              />
              
              {/* Send Button */}
              <button
                type="submit"
                disabled={disabled || !value.trim()}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                  value.trim() && !disabled
                    ? "bg-gpt5-beam-gradient text-white shadow-lg hover:shadow-xl"
                    : "bg-gpt5-slate-700/50 text-slate-500 cursor-not-allowed"
                }`}
              >
                <ArrowUp size={16} />
              </button>
            </div>

            {/* Voice Button */}
            <VoiceButton />
          </div>
        </form>
        
        <p className="text-xs text-slate-500 text-center mt-2">
          JAMI-3 can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

// Attachment Button Component
const AttachmentButton: React.FC = () => {
  return (
    <button
      type="button"
      className="flex-shrink-0 p-3 text-slate-400 hover:text-gpt5-amber-start transition-colors rounded-lg hover:bg-white/5"
      title="Attach files"
    >
      <Paperclip size={18} />
    </button>
  );
};

// Voice Button Component
const VoiceButton: React.FC = () => {
  return (
    <button
      type="button"
      className="flex-shrink-0 p-3 text-slate-400 hover:text-gpt5-pink transition-colors rounded-lg hover:bg-white/5"
      title="Voice message"
    >
      <Mic size={18} />
    </button>
  );
};

// Main Public GPT-5 Demo Page
export default function PublicGPT5Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Canned responses for the demo
  const getCannedResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    const responses: { [key: string]: string } = {
      "how can jami-3 help with anxiety?": "I can help you understand anxiety better, teach coping strategies like breathing exercises and grounding techniques, and provide a safe space to talk through your feelings. Would you like to explore any specific aspect?",
      "tell me about mindfulness techniques": "Mindfulness is about staying present in the moment. I can guide you through techniques like deep breathing, body scans, and the 5-4-3-2-1 grounding exercise. These help calm your mind when you're feeling stressed or anxious. Which would you like to try first?",
      "i'm feeling overwhelmed today": "I hear you, and I'm glad you reached out. Feeling overwhelmed is completely valid. Let's take this one step at a time. What's been weighing on you most today? Sometimes just talking through it can help lighten the load.",
      "what are some coping strategies for stress?": "There are many effective stress management techniques I can share with you. These include deep breathing exercises, progressive muscle relaxation, time management strategies, and mindfulness practices. I can also help you identify your stress triggers. What type of stress are you dealing with most?",
      "default": "I'm here to listen and support you. What would you like to talk about today?"
    };
    
    // Check for exact matches first
    if (responses[lowerMessage]) {
      return responses[lowerMessage];
    }
    
    // Check for keyword matches
    for (const [keyword, response] of Object.entries(responses)) {
      if (keyword !== 'default' && lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    return responses.default;
  };

  const handleSubmitMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date()
    };
    
    // Add user message
    setMessages([userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const cannedResponse = getCannedResponse(message);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: cannedResponse,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setIsTyping(false);
      setMessages([userMessage, aiMessage]);
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>JAMI-3 Demo - GPT-5 Style - Lightwell</title>
        <meta name="description" content="Try JAMI-3 AI therapeutic companion with GPT-5 style interface" />
      </Head>

      <AppShell sidebar={<Sidebar />}>
        <ChatWindow 
          messages={messages}
          isTyping={isTyping}
          onSubmitMessage={handleSubmitMessage}
        />
      </AppShell>
    </>
  );
}