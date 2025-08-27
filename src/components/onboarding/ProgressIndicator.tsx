'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  progress: number;
  confidence: number;
  estimatedQuestionsRemaining: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  confidence,
  estimatedQuestionsRemaining
}) => {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-600';
    if (conf >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 0.8) return 'High';
    if (conf >= 0.6) return 'Moderate';
    return 'Low';
  };

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Progress Stats */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            Progress: {Math.round(progress)}%
          </span>
          <span className="text-gray-600">
            ~{estimatedQuestionsRemaining} questions remaining
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Confidence:</span>
          <span className={`font-semibold ${getConfidenceColor(confidence)}`}>
            {getConfidenceLabel(confidence)}
          </span>
          <div className="w-2 h-2 rounded-full bg-gray-300">
            <motion.div
              className={`w-2 h-2 rounded-full ${
                confidence >= 0.8 ? 'bg-green-500' : 
                confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: confidence }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Adaptive Message */}
      <div className="mt-3 text-xs text-gray-500">
        {confidence >= 0.8 ? (
          <span>✓ Assessment precision is excellent</span>
        ) : confidence >= 0.6 ? (
          <span>⏳ Gathering more information for better accuracy</span>
        ) : (
          <span>📊 Need more responses for reliable assessment</span>
        )}
      </div>
    </div>
  );
}; 