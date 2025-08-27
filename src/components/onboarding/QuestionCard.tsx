'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IRTQuestion } from '@/types/assessment';


interface QuestionCardProps {
  question: IRTQuestion;
  onResponse: (questionId: string, value: number, responseTime: number, behavioralMetrics: any) => void;
  questionNumber: number;
  totalEstimated: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onResponse,
  questionNumber,
  totalEstimated
}) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const handleOptionSelect = (value: number) => {
    setSelectedValue(value);
    const responseTime = Date.now() - startTime;
    
    // Small delay for visual feedback
    setTimeout(() => {
      onResponse(question.id, value, responseTime, {
        hoveredOptions: hoveredOption ? [hoveredOption] : [],
        selectionConfidence: calculateSelectionConfidence(value, responseTime)
      });
    }, 300);
  };

  const calculateSelectionConfidence = (value: number, responseTime: number): number => {
    // Quick responses on extreme values suggest high confidence
    // Moderate response times on middle values suggest consideration
    const isExtremeValue = value <= 1 || value >= question.responseOptions.length - 1;
    const isFastResponse = responseTime < 3000;
    const isSlowResponse = responseTime > 15000;

    if (isExtremeValue && isFastResponse) return 0.9;
    if (isSlowResponse) return 0.4;
    return 0.7; // Default moderate confidence
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      mood: 'bg-blue-50 border-blue-200',
      anxiety: 'bg-purple-50 border-purple-200',
      cognition: 'bg-green-50 border-green-200',
      social: 'bg-orange-50 border-orange-200',
      behavioral: 'bg-teal-50 border-teal-200',
      trauma: 'bg-red-50 border-red-200',
      substance: 'bg-yellow-50 border-yellow-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-50 border-gray-200';
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      minimal: 'hover:bg-green-100 border-green-300',
      mild: 'hover:bg-yellow-100 border-yellow-300',
      moderate: 'hover:bg-orange-100 border-orange-300',
      severe: 'hover:bg-red-100 border-red-300'
    };
    return colors[severity as keyof typeof colors] || 'hover:bg-gray-100 border-gray-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-6 rounded-lg border-2 ${getCategoryColor(question.category)} shadow-sm`}
    >
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-500">
            Question {questionNumber} of ~{totalEstimated}
          </span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full capitalize">
            {question.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 leading-relaxed">
          {question.content}
        </h3>
        
        {question.estimatedTime && (
          <p className="text-sm text-gray-500 mt-2">
            Estimated time: {question.estimatedTime} seconds
          </p>
        )}
      </div>

      {/* Response Options */}
      <div className="space-y-3">
        {question.responseOptions.map((option, index) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOptionSelect(option.value)}
            onMouseEnter={() => setHoveredOption(option.id)}
            onMouseLeave={() => setHoveredOption(null)}
            disabled={selectedValue !== null}
            className={`
              w-full p-4 text-left rounded-lg border-2 transition-all duration-200
              ${selectedValue === option.value 
                ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-200' 
                : `bg-white ${option.severity ? getSeverityColor(option.severity) : 'hover:bg-gray-50 border-gray-300'}`
              }
              ${selectedValue !== null && selectedValue !== option.value ? 'opacity-50' : ''}
              disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-blue-300
            `}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">{option.text}</span>
              <div className="flex items-center space-x-2">
                {option.severity && (
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${option.severity === 'minimal' ? 'bg-green-100 text-green-800' : ''}
                    ${option.severity === 'mild' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${option.severity === 'moderate' ? 'bg-orange-100 text-orange-800' : ''}
                    ${option.severity === 'severe' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {option.severity}
                  </span>
                )}
                <span className="text-sm text-gray-500">{option.value}</span>
              </div>
            </div>
            
            {option.crisisFlag && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                ⚠️ This response may indicate need for immediate support
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Your responses help us personalize your experience</span>
          <span>All responses are confidential</span>
        </div>
      </div>
    </motion.div>
  );
}; 