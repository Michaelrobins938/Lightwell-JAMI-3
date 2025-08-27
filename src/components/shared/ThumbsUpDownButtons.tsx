import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ThumbsUpDownButtonsProps {
  onPositiveFeedback?: () => void;
  onNegativeFeedback?: () => void;
}

export const ThumbsUpDownButtons: React.FC<ThumbsUpDownButtonsProps> = ({ 
  onPositiveFeedback, 
  onNegativeFeedback 
}) => {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  const handlePositiveFeedback = () => {
    setFeedback('positive');
    onPositiveFeedback?.();
  };

  const handleNegativeFeedback = () => {
    setFeedback('negative');
    onNegativeFeedback?.();
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handlePositiveFeedback}
        className={`
          p-1 rounded-md transition-colors duration-200
          ${feedback === 'positive' 
            ? 'bg-green-500 text-white' 
            : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}
        `}
        aria-label="Thumbs up"
      >
        <ThumbsUp size={16} />
      </button>
      <button
        onClick={handleNegativeFeedback}
        className={`
          p-1 rounded-md transition-colors duration-200
          ${feedback === 'negative' 
            ? 'bg-red-500 text-white' 
            : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}
        `}
        aria-label="Thumbs down"
      >
        <ThumbsDown size={16} />
      </button>
    </div>
  );
};
