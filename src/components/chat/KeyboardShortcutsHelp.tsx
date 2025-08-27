import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Command } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  key: string;
  description: string;
  category: string;
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  const shortcuts: ShortcutItem[] = [
    // Navigation
    { key: '⌘ + K', description: 'Open command palette', category: 'Navigation' },
    { key: '/', description: 'Focus input field', category: 'Navigation' },
    { key: 'Escape', description: 'Close modals / command palette', category: 'Navigation' },
    
    // Messaging
    { key: 'Enter', description: 'Send message', category: 'Messaging' },
    { key: 'Shift + Enter', description: 'New line in input', category: 'Messaging' },
    
    // Command Palette Navigation
    { key: '↑ ↓', description: 'Navigate commands', category: 'Command Palette' },
    { key: 'Enter', description: 'Select command', category: 'Command Palette' },
    { key: 'Escape', description: 'Close command palette', category: 'Command Palette' },
  ];

  const categories = shortcuts.map(s => s.category).filter((v, i, a) => a.indexOf(v) === i);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Command className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-100">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-lg font-medium text-gray-200 mb-3">{category}</h3>
                  <div className="space-y-2">
                    {shortcuts
                      .filter(shortcut => shortcut.category === category)
                      .map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 px-3 bg-gray-700 rounded-lg"
                        >
                          <span className="text-gray-300">{shortcut.description}</span>
                          <kbd className="px-2 py-1 bg-gray-600 text-gray-200 rounded text-sm font-mono">
                            {shortcut.key}
                          </kbd>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="mt-8 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">💡 Tips</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Use ⌘ + K to quickly access all commands</li>
                <li>• Press / to instantly focus the input field</li>
                <li>• Shift + Enter allows multi-line messages</li>
                <li>• Escape closes any open modal or dialog</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Press Escape to close</span>
              <span>Luna AI Keyboard Shortcuts</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


