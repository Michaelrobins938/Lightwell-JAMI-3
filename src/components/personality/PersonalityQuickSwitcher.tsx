import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown, Star, Heart, Target, BookOpen, Users } from 'lucide-react';
import { PersonalityConfig } from '../../services/personalityService';

interface PersonalityQuickSwitcherProps {
  activePersonality: PersonalityConfig | null;
  personalities: PersonalityConfig[];
  systemPersonalities: PersonalityConfig[];
  onPersonalitySelect: (personality: PersonalityConfig) => void;
  className?: string;
}

export const PersonalityQuickSwitcher: React.FC<PersonalityQuickSwitcherProps> = ({
  activePersonality,
  personalities,
  systemPersonalities,
  onPersonalitySelect,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'therapeutic':
        return <Heart className="w-3 h-3" />;
      case 'coaching':
        return <Target className="w-3 h-3" />;
      case 'educational':
        return <BookOpen className="w-3 h-3" />;
      case 'supportive':
        return <Users className="w-3 h-3" />;
      default:
        return <Brain className="w-3 h-3" />;
    }
  };

  // Ensure both arrays are always arrays, even if undefined/null
  const safePersonalities = Array.isArray(personalities) ? personalities : [];
  const safeSystemPersonalities = Array.isArray(systemPersonalities) ? systemPersonalities : [];
  const allPersonalities = [...safePersonalities, ...safeSystemPersonalities];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
      >
        <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
          {activePersonality?.name || 'Select Personality'}
        </span>
        <ChevronDown className={`w-3 h-3 text-blue-600 dark:text-blue-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Switch Personality
              </h3>
            </div>

            <div className="p-2 space-y-1">
              {/* User Personalities */}
              {safePersonalities.length > 0 && (
                <>
                  <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Your Personalities
                  </div>
                  {safePersonalities.map((personality) => (
                    <button
                      key={personality.id}
                      onClick={() => {
                        onPersonalitySelect(personality);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                        activePersonality?.id === personality.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {getCategoryIcon(personality.category)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {personality.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {personality.description || 'No description'}
                        </div>
                      </div>
                      {activePersonality?.id === personality.id && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </>
              )}

              {/* System Personalities */}
              {safeSystemPersonalities.length > 0 && (
                <>
                  <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    System Personalities
                  </div>
                  {safeSystemPersonalities.map((personality) => (
                    <button
                      key={personality.id}
                      onClick={() => {
                        onPersonalitySelect(personality);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                        activePersonality?.id === personality.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(personality.category)}
                        <Star className="w-3 h-3 text-yellow-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {personality.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {personality.description || 'No description'}
                        </div>
                      </div>
                      {activePersonality?.id === personality.id && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </>
              )}

              {/* No Personalities */}
              {allPersonalities.length === 0 && (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No personalities available</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  // Navigate to personality management
                  window.location.href = '/personality-management';
                }}
                className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-center"
              >
                Manage Personalities
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};


