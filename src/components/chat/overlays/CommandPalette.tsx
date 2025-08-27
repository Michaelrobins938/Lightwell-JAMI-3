import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand?: (command: string) => void;
}

const commands = [
  { id: 'new-chat', label: 'New Chat', description: 'Start a new conversation' },
  { id: 'clear-memory', label: 'Clear Memory', description: 'Reset conversation memory' },
  { id: 'export-chat', label: 'Export Chat', description: 'Download conversation as file' },
  { id: 'voice-mode', label: 'Voice Mode', description: 'Enable voice conversation' },
  { id: 'orb-mode', label: 'Orb Mode', description: 'Open immersive orb interface' },
  { id: 'memory-stream', label: 'Memory Stream', description: 'Show memory formation' },
];

export default function CommandPalette({ isOpen, onClose, onExecuteCommand }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            onExecuteCommand?.(filteredCommands[selectedIndex].id);
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onExecuteCommand, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="fixed top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-lg bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-700">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                autoFocus
              />
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </div>

            {/* Commands */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No commands found
                </div>
              ) : (
                filteredCommands.map((command, index) => (
                  <motion.div
                    key={command.id}
                    className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      onExecuteCommand?.(command.id);
                      onClose();
                    }}
                    whileHover={{ x: 2 }}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{command.label}</div>
                      <div className={`text-xs ${
                        index === selectedIndex ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {command.description}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}