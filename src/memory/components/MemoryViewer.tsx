// Memory timeline viewer component for Luna AI Therapist

import React, { useState, useMemo } from 'react';
import { Memory, MemoryCategory } from '../types/memory.types';
import { useMemory } from '../hooks/useMemory';

interface MemoryViewerProps {
  userId: string;
  onEditMemory?: (memory: Memory) => void;
  onDeleteMemory?: (id: string) => void;
  className?: string;
}

export function MemoryViewer({ 
  userId, 
  onEditMemory, 
  onDeleteMemory,
  className = '' 
}: MemoryViewerProps) {
  const { memories, isLoading, error } = useMemory(userId);
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMemories = useMemo(() => {
    let filtered = memories;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(memory => memory.category === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(memory => 
        memory.key.toLowerCase().includes(term) ||
        memory.value.toLowerCase().includes(term)
      );
    }

    return filtered.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [memories, selectedCategory, searchTerm]);

  const categoryColors: Record<MemoryCategory, string> = {
    preferences: 'bg-blue-100 text-blue-800 border-blue-200',
    context: 'bg-green-100 text-green-800 border-green-200',
    facts: 'bg-purple-100 text-purple-800 border-purple-200',
    personality: 'bg-pink-100 text-pink-800 border-pink-200',
    goals: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    triggers: 'bg-red-100 text-red-800 border-red-200',
    progress: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  };

  if (isLoading) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-200 h-20 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Failed to load memories: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Memory Timeline
        </h2>
        <span className="text-sm text-gray-500">
          {memories.length} memories stored
        </span>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Search memories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-sm border ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            All ({memories.length})
          </button>
          
          {Object.keys(categoryColors).map(category => {
            const count = memories.filter(m => m.category === category).length;
            if (count === 0) return null;
            
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as MemoryCategory)}
                className={`px-3 py-1 rounded-full text-sm border capitalize ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Memory List */}
      <div className="space-y-3">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || selectedCategory !== 'all' 
              ? 'No memories match your filters'
              : 'No memories stored yet'
            }
          </div>
        ) : (
          filteredMemories.map(memory => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              categoryColor={categoryColors[memory.category]}
              onEdit={onEditMemory}
              onDelete={onDeleteMemory}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface MemoryCardProps {
  memory: Memory;
  categoryColor: string;
  onEdit?: (memory: Memory) => void;
  onDelete?: (id: string) => void;
}

function MemoryCard({ memory, categoryColor, onEdit, onDelete }: MemoryCardProps) {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const confidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Category Badge */}
      <div className="flex items-start justify-between mb-2">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${categoryColor}`}>
          {memory.category}
        </span>
        
        {showActions && (onEdit || onDelete) && (
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(memory)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(memory.id)}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Memory Content */}
      <div className="mb-2">
        <h3 className="font-medium text-gray-900 mb-1">
          {memory.key}
        </h3>
        <p className="text-gray-700 text-sm">
          {memory.value}
        </p>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {formatDate(memory.updatedAt)}
        </span>
        <div className="flex items-center space-x-2">
          <span className={`font-medium ${confidenceColor(memory.confidence)}`}>
            {Math.round(memory.confidence * 100)}% confidence
          </span>
          {memory.chatId && (
            <span className="text-gray-400">
              • From conversation
            </span>
          )}
        </div>
      </div>
    </div>
  );
}