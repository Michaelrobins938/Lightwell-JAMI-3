// Memory editor component for creating and editing memories

import React, { useState, useEffect } from 'react';
import { Memory, MemoryCategory } from '../types/memory.types';
import { useMemory } from '../hooks/useMemory';

interface MemoryEditorProps {
  userId: string;
  memory?: Memory | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (memory: Memory) => void;
}

export function MemoryEditor({ 
  userId, 
  memory, 
  isOpen, 
  onClose, 
  onSave 
}: MemoryEditorProps) {
  const { addMemory, updateMemory } = useMemory(userId);
  
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    category: 'preferences' as MemoryCategory,
    confidence: 0.8,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when memory changes
  useEffect(() => {
    if (memory) {
      setFormData({
        key: memory.key,
        value: memory.value,
        category: memory.category,
        confidence: memory.confidence,
      });
    } else {
      setFormData({
        key: '',
        value: '',
        category: 'preferences',
        confidence: 0.8,
      });
    }
    setError(null);
  }, [memory, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.key.trim() || !formData.value.trim()) {
      setError('Key and value are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (memory) {
        // Update existing memory
        const updatedMemory = await updateMemory({
          id: memory.id,
          ...formData,
        });
        onSave?.(updatedMemory);
      } else {
        // Create new memory
        const newMemory = await addMemory({
          userId,
          ...formData,
        });
        onSave?.(newMemory);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save memory');
    } finally {
      setIsLoading(false);
    }
  };

  const categories: { value: MemoryCategory; label: string; description: string }[] = [
    {
      value: 'preferences',
      label: 'Preferences',
      description: 'Communication style, therapy preferences, likes/dislikes'
    },
    {
      value: 'context',
      label: 'Context',
      description: 'Current life situation, work, relationships, projects'
    },
    {
      value: 'facts',
      label: 'Facts',
      description: 'Personal background, history, concrete information'
    },
    {
      value: 'personality',
      label: 'Personality',
      description: 'How they communicate, their therapeutic style'
    },
    {
      value: 'goals',
      label: 'Goals',
      description: 'What they want to achieve in therapy or life'
    },
    {
      value: 'triggers',
      label: 'Triggers',
      description: 'Sensitive topics, trauma indicators (handle carefully)'
    },
    {
      value: 'progress',
      label: 'Progress',
      description: 'Therapeutic milestones, improvements, insights'
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {memory ? 'Edit Memory' : 'Add Memory'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Key */}
            <div>
              <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-1">
                Key
              </label>
              <input
                type="text"
                id="key"
                value={formData.key}
                onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                placeholder="e.g., communication_style, current_job"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Short identifier for this memory
              </p>
            </div>

            {/* Value */}
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <textarea
                id="value"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="e.g., Prefers direct, concise feedback rather than lengthy explanations"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Detailed description of this memory
              </p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as MemoryCategory }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {categories.find(c => c.value === formData.category)?.description}
              </p>
            </div>

            {/* Confidence */}
            <div>
              <label htmlFor="confidence" className="block text-sm font-medium text-gray-700 mb-1">
                Confidence: {Math.round(formData.confidence * 100)}%
              </label>
              <input
                type="range"
                id="confidence"
                min="0"
                max="1"
                step="0.1"
                value={formData.confidence}
                onChange={(e) => setFormData(prev => ({ ...prev, confidence: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (memory ? 'Update' : 'Save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Quick memory addition component for inline use
export function QuickMemoryAdd({ 
  userId, 
  onMemoryAdded 
}: { 
  userId: string; 
  onMemoryAdded?: (memory: Memory) => void; 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Memory
      </button>
      
      <MemoryEditor
        userId={userId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={(memory) => {
          onMemoryAdded?.(memory);
          setIsOpen(false);
        }}
      />
    </>
  );
}