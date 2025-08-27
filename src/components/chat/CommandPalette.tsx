import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Command, MessageSquare, Settings, Share2, 
  Download, RotateCcw, Plus, Trash2, ArrowUp, ArrowDown
} from 'lucide-react';

interface CommandAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNewConversation: () => void;
  onOpenSettings: () => void;
  onShareConversation: () => void;
  onExportConversation: () => void;
  onClearConversation: () => void;
  onDeleteConversation: () => void;
  onFocusInput: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onNewConversation,
  onOpenSettings,
  onShareConversation,
  onExportConversation,
  onClearConversation,
  onDeleteConversation,
  onFocusInput
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: CommandAction[] = [
    {
      id: 'new-conversation',
      title: 'New Conversation',
      description: 'Start a fresh conversation',
      icon: <Plus className="w-4 h-4" />,
      action: () => {
        onNewConversation();
        onClose();
      },
      keywords: ['new', 'start', 'fresh', 'create']
    },
    {
      id: 'focus-input',
      title: 'Focus Input',
      description: 'Focus the message input field',
      icon: <MessageSquare className="w-4 h-4" />,
      action: () => {
        onFocusInput();
        onClose();
      },
      keywords: ['input', 'type', 'message', 'chat', 'focus']
    },
    {
      id: 'share',
      title: 'Share Conversation',
      description: 'Create a shareable link',
      icon: <Share2 className="w-4 h-4" />,
      action: () => {
        onShareConversation();
        onClose();
      },
      keywords: ['share', 'link', 'public', 'export']
    },
    {
      id: 'export',
      title: 'Export Conversation',
      description: 'Download conversation as file',
      icon: <Download className="w-4 h-4" />,
      action: () => {
        onExportConversation();
        onClose();
      },
      keywords: ['export', 'download', 'save', 'file']
    },
    {
      id: 'settings',
      title: 'Conversation Settings',
      description: 'Configure model and preferences',
      icon: <Settings className="w-4 h-4" />,
      action: () => {
        onOpenSettings();
        onClose();
      },
      keywords: ['settings', 'config', 'model', 'preferences']
    },
    {
      id: 'clear',
      title: 'Clear Messages',
      description: 'Clear all messages in conversation',
      icon: <RotateCcw className="w-4 h-4" />,
      action: () => {
        onClearConversation();
        onClose();
      },
      keywords: ['clear', 'reset', 'empty', 'delete messages']
    },
    {
      id: 'delete',
      title: 'Delete Conversation',
      description: 'Permanently delete this conversation',
      icon: <Trash2 className="w-4 h-4" />,
      action: () => {
        onDeleteConversation();
        onClose();
      },
      keywords: ['delete', 'remove', 'trash', 'permanent']
    }
  ];

  // Filter commands based on query
  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase()) ||
    command.keywords.some(keyword => 
      keyword.toLowerCase().includes(query.toLowerCase())
    )
  );

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-700">
            <div className="flex items-center gap-2 text-gray-400">
              <Command className="w-5 h-5" />
              <span className="text-sm font-medium">Command Palette</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>

          {/* Search Input */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search commands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No commands found</p>
                <p className="text-sm text-gray-500">Try a different search term</p>
              </div>
            ) : (
              <div ref={listRef} className="space-y-1 p-2">
                {filteredCommands.map((command, index) => (
                  <motion.button
                    key={command.id}
                    onClick={command.action}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      index === selectedIndex
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: index === selectedIndex ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`flex-shrink-0 ${
                      index === selectedIndex ? 'text-white' : 'text-gray-400'
                    }`}>
                      {command.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{command.title}</div>
                      <div className={`text-sm ${
                        index === selectedIndex ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {command.description}
                      </div>
                    </div>
                    {index === selectedIndex && (
                      <ArrowUp className="w-4 h-4 text-blue-200" />
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
            <div className="flex items-center justify-between">
              <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
              <span>{filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


