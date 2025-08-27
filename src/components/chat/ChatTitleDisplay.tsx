// Chat title display and editing component

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TitleSuggestion } from '../../types/chatTitle.types';

interface ChatTitleDisplayProps {
  conversationId: string;
  title?: string;
  isGenerating?: boolean;
  suggestions?: TitleSuggestion[];
  onTitleChange?: (title: string) => void;
  onRegenerateTitle?: () => void;
  onRequestSuggestions?: () => void;
  isEditable?: boolean;
  showGenerateButton?: boolean;
  className?: string;
}

export function ChatTitleDisplay({
  conversationId,
  title,
  isGenerating = false,
  suggestions = [],
  onTitleChange,
  onRegenerateTitle,
  onRequestSuggestions,
  isEditable = true,
  showGenerateButton = true,
  className = '',
}: ChatTitleDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Update edit value when title changes
  useEffect(() => {
    if (title) {
      setEditValue(title);
    }
  }, [title]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuggestions]);

  const handleStartEditing = () => {
    if (isEditable && !isGenerating) {
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== title) {
      onTitleChange?.(trimmedValue);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditValue(title || '');
    setIsEditing(false);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleSuggestionClick = (suggestion: TitleSuggestion) => {
    setEditValue(suggestion.title);
    onTitleChange?.(suggestion.title);
    setIsEditing(false);
    setShowSuggestions(false);
  };

  const handleShowSuggestions = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(!showSuggestions);
    } else {
      onRequestSuggestions?.();
      setTimeout(() => setShowSuggestions(true), 500);
    }
  };

  const displayTitle = title || 'Untitled Conversation';
  const hasTitle = Boolean(title);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-2">
        {/* Title Display/Editor */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveEdit}
                className="w-full px-2 py-1 text-lg font-semibold bg-transparent border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                placeholder="Enter conversation title..."
                maxLength={100}
              />
              
              {/* Suggestions Button */}
              {(suggestions.length > 0 || onRequestSuggestions) && (
                <button
                  onClick={handleShowSuggestions}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  title="View suggestions"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2 min-w-0">
              {/* Title Text */}
              <h1 
                onClick={handleStartEditing}
                className={`text-lg font-semibold truncate cursor-pointer transition-colors ${
                  hasTitle 
                    ? 'text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                title={isEditable ? 'Click to edit title' : displayTitle}
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4"
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </motion.div>
                    <span className="text-gray-500 dark:text-gray-400">Generating title...</span>
                  </div>
                ) : (
                  displayTitle
                )}
              </h1>

              {/* Edit Icon */}
              {isEditable && !isGenerating && (
                <button
                  onClick={handleStartEditing}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all"
                  title="Edit title"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isEditing && (
          <div className="flex items-center space-x-1">
            {/* Generate/Regenerate Button */}
            {showGenerateButton && (
              <button
                onClick={onRegenerateTitle}
                disabled={isGenerating}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={hasTitle ? 'Regenerate title' : 'Generate title'}
              >
                <motion.div
                  animate={isGenerating ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isGenerating ? Infinity : 0, ease: 'linear' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </motion.div>
              </button>
            )}

            {/* Suggestions Button */}
            {suggestions.length > 0 && (
              <button
                onClick={handleShowSuggestions}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="View title suggestions"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Title Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
          >
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                Suggested Titles
              </div>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-2 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{suggestion.title}</span>
                      <div className="flex items-center space-x-1 ml-2">
                        <div className={`w-2 h-2 rounded-full ${
                          suggestion.confidence > 0.8 
                            ? 'bg-green-400' 
                            : suggestion.confidence > 0.6 
                            ? 'bg-yellow-400' 
                            : 'bg-red-400'
                        }`} />
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {suggestion.style}
                        </span>
                      </div>
                    </div>
                    {suggestion.reasoning && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {suggestion.reasoning}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confidence Indicator */}
      {hasTitle && !isEditing && !isGenerating && (
        <div className="mt-1 flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              AI generated
            </span>
          </div>
        </div>
      )}
    </div>
  );
}