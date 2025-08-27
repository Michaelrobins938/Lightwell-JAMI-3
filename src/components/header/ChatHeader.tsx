import React from 'react';

interface ChatHeaderProps {
  onMenuToggle: () => void;
  modelSelector: string;
  onModelChange: (model: string) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onMenuToggle, 
  modelSelector, 
  onModelChange 
}) => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <button 
        onClick={onMenuToggle} 
        className="p-2 hover:bg-gray-700 rounded transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <div className="flex items-center space-x-2">
        <span>Model:</span>
        <select 
          value={modelSelector} 
          onChange={(e) => onModelChange(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="claude-3">Claude 3</option>
        </select>
      </div>
    </header>
  );
};

export default ChatHeader;
