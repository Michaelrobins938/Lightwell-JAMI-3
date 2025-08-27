import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Image, FileText, Code2, Zap, Database, 
  FolderOpen, Brain, Video, Music, File, ChevronRight, Shield, Headphones
} from 'lucide-react';

interface InputBarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: () => void;
  onAgentMode: () => void;
  onDeepResearch: () => void;
  onConnectors: () => void;
  onCrisisSupport: () => void;
  onMeditation: () => void;
}

interface ModalOption {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  action: () => void;
  isNew?: boolean;
  isPremium?: boolean;
}

export const InputBarModal: React.FC<InputBarModalProps> = ({
  isOpen,
  onClose,
  onFileUpload,
  onAgentMode,
  onDeepResearch,
  onConnectors,
  onCrisisSupport,
  onMeditation
}) => {
  const options: ModalOption[] = [
    {
      id: 'upload',
      icon: <Upload className="w-5 h-5" />,
      label: 'Upload files',
      description: 'Upload documents, images, and more',
      action: onFileUpload
    },
    {
      id: 'crisis-support',
      icon: <Shield className="w-5 h-5" />,
      label: 'Crisis Support',
      description: '24/7 crisis intervention & resources',
      action: onCrisisSupport
    },
    {
      id: 'meditation',
      icon: <Headphones className="w-5 h-5" />,
      label: 'Meditation & Mindfulness',
      description: 'Guided sessions for inner peace',
      action: onMeditation
    },
    {
      id: 'agent-mode',
      icon: <Brain className="w-5 h-5" />,
      label: 'Agent mode',
      description: 'AI agent for complex tasks',
      action: onAgentMode,
      isNew: true
    },
    {
      id: 'deep-research',
      icon: <Zap className="w-5 h-5" />,
      label: 'Deep research',
      description: 'Comprehensive research and analysis',
      action: onDeepResearch
    },
    {
      id: 'connectors',
      icon: <Database className="w-5 h-5" />,
      label: 'Use connectors',
      description: 'Connect to external data sources',
      action: onConnectors
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9998]"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.95, 
              y: 10,
              x: '-50%'
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: '-50%'
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              y: 10,
              x: '-50%'
            }}
            transition={{ 
              duration: 0.2, 
              ease: [0.4, 0, 0.2, 1],
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="fixed bottom-20 left-1/2 z-[9999] w-80 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-700/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-700/50">
              <h3 className="text-sm font-medium text-white">Add files and more</h3>
            </div>
            
            {/* Options */}
            <div className="py-2">
              {options.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                  onClick={() => {
                    option.action();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors group"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                    {option.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">
                        {option.label}
                      </span>
                      {option.isNew && (
                        <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                          New
                        </span>
                      )}
                      {option.isPremium && (
                        <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">
                          Pro
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {option.description}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                </motion.button>
              ))}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 border-t border-zinc-700/50 bg-zinc-800/30">
              <p className="text-xs text-zinc-400 text-center">
                Click any option to get started
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};






