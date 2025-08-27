import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Crown, Zap } from 'lucide-react';
import { useChatStore } from '../../store/slices/chatSlice';

interface ModelInfo {
  id: string;
  name: string;
  description: string;
  isPremium?: boolean;
  isNew?: boolean;
  isFast?: boolean;
}

const MODELS: ModelInfo[] = [
  {
    id: 'luna-ai-4',
    name: 'Luna AI 4',
    description: 'Most capable model for complex tasks',
    isPremium: true
  },
  {
    id: 'luna-ai-4-turbo',
    name: 'Luna AI 4 Turbo',
    description: 'Fast and efficient for most tasks',
    isFast: true
  },
  {
    id: 'luna-ai-3.5',
    name: 'Luna AI 3.5',
    description: 'Good balance of speed and capability'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI\'s latest model',
    isPremium: true
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    description: 'Fast and efficient GPT model'
  }
];

export const ModelSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentModel, setModel } = useChatStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentModelInfo = MODELS.find(m => m.id === currentModel) || MODELS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleModelSelect = (modelId: string) => {
    setModel(modelId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
      >
        {/* Model Icon */}
        <div className="w-5 h-5 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">L</span>
        </div>
        
        {/* Model Name */}
        <span className="font-medium text-white group-hover:text-white/90 transition-colors">
          {currentModelInfo.name}
        </span>
        
        {/* Premium/Fast Badge */}
        {currentModelInfo.isPremium && (
          <Crown className="w-4 h-4 text-yellow-400" />
        )}
        {currentModelInfo.isFast && (
          <Zap className="w-4 h-4 text-blue-400" />
        )}
        
        {/* Dropdown Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white/70 transition-colors" />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ 
              duration: 0.15, 
              ease: [0.4, 0, 0.2, 1],
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-700/50 overflow-hidden z-[9999]"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-700/50">
              <h3 className="text-sm font-medium text-white">Choose a model</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Models have different capabilities and response times
              </p>
            </div>

            {/* Model Options */}
            <div className="py-2">
              {MODELS.map((model, index) => (
                <motion.button
                  key={model.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                  onClick={() => handleModelSelect(model.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors group ${
                    model.id === currentModel ? 'bg-zinc-800/30' : ''
                  }`}
                >
                  {/* Model Icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">L</span>
                  </div>

                  {/* Model Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">
                        {model.name}
                      </span>
                      {model.isPremium && (
                        <Crown className="w-4 h-4 text-yellow-400" />
                      )}
                      {model.isFast && (
                        <Zap className="w-4 h-4 text-blue-400" />
                      )}
                      {model.isNew && (
                        <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {model.description}
                    </p>
                  </div>

                  {/* Checkmark for selected model */}
                  {model.id === currentModel && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2, type: "spring" }}
                    >
                      <Check className="w-5 h-5 text-green-400" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-zinc-700/50 bg-zinc-800/30">
              <p className="text-xs text-zinc-400 text-center">
                Models may have different response times and capabilities
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



















