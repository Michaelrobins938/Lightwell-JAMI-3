import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Memory {
  id: string;
  type: string;
  category: string;
  content: string;
  importance: number;
  emotionalValence: number;
  tags: string;
  referenceCount: number;
  lastReferenced: string;
  createdAt: string;
}

interface MemoryStats {
  totalMemories: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  averageImportance: number;
  mostReferenced: Memory[];
}

export default function MemoryDashboard() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const loadMemories = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would call your API
      // For now, we'll simulate the data structure
      const mockMemories: Memory[] = [
        {
          id: '1',
          type: 'emotional_state',
          category: 'emotional',
          content: 'User experiences anxiety',
          importance: 7,
          emotionalValence: -2,
          tags: '["anxiety", "current-session"]',
          referenceCount: 3,
          lastReferenced: new Date().toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '2',
          type: 'recurring_theme',
          category: 'life',
          content: 'User discusses work stress',
          importance: 6,
          emotionalValence: 0,
          tags: '["work stress", "recurring"]',
          referenceCount: 5,
          lastReferenced: new Date().toISOString(),
          createdAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: '3',
          type: 'progress_milestone',
          category: 'therapeutic',
          content: 'User reports feeling better and making progress',
          importance: 8,
          emotionalValence: 2,
          tags: '["progress", "milestone"]',
          referenceCount: 2,
          lastReferenced: new Date().toISOString(),
          createdAt: new Date(Date.now() - 259200000).toISOString()
        }
      ];

      setMemories(mockMemories);
      calculateStats(mockMemories);
    } catch (error) {
      console.error('Failed to load memories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  const calculateStats = (memoryList: Memory[]) => {
    const byType: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    let totalImportance = 0;

    memoryList.forEach(memory => {
      byType[memory.type] = (byType[memory.type] || 0) + 1;
      byCategory[memory.category] = (byCategory[memory.category] || 0) + 1;
      totalImportance += memory.importance;
    });

    const mostReferenced = [...memoryList]
      .sort((a, b) => b.referenceCount - a.referenceCount)
      .slice(0, 5);

    setStats({
      totalMemories: memoryList.length,
      byType,
      byCategory,
      averageImportance: totalImportance / memoryList.length,
      mostReferenced
    });
  };

  const filteredMemories = memories.filter(memory => {
    if (selectedType !== 'all' && memory.type !== selectedType) return false;
    if (selectedCategory !== 'all' && memory.category !== selectedCategory) return false;
    return true;
  });

  const getEmotionalColor = (valence: number) => {
    if (valence >= 3) return 'text-green-500';
    if (valence >= 1) return 'text-blue-500';
    if (valence >= -1) return 'text-gray-500';
    if (valence >= -3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return 'text-red-600 font-bold';
    if (importance >= 6) return 'text-orange-600';
    if (importance >= 4) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🧠 Jamie's Memory Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            View and manage Jamie's persistent memory system
          </p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Memories</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalMemories}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg Importance</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.averageImportance.toFixed(1)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Memory Types</h3>
              <p className="text-3xl font-bold text-green-600">{Object.keys(stats.byType).length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Categories</h3>
              <p className="text-3xl font-bold text-purple-600">{Object.keys(stats.byCategory).length}</p>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="emotional_state">Emotional State</option>
                <option value="recurring_theme">Recurring Theme</option>
                <option value="progress_milestone">Progress Milestone</option>
                <option value="coping_strategy">Coping Strategy</option>
                <option value="life_event">Life Event</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="emotional">Emotional</option>
                <option value="life">Life</option>
                <option value="therapeutic">Therapeutic</option>
                <option value="work">Work</option>
                <option value="health">Health</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Memories List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Memories ({filteredMemories.length})
          </h3>
          
          {filteredMemories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No memories found with current filters.</p>
          ) : (
            <div className="space-y-4">
              {filteredMemories.map((memory, index) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          memory.type === 'emotional_state' ? 'bg-red-100 text-red-800' :
                          memory.type === 'progress_milestone' ? 'bg-green-100 text-green-800' :
                          memory.type === 'coping_strategy' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {memory.type.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {memory.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-800 mb-2">{memory.content}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className={`${getImportanceColor(memory.importance)}`}>
                          Importance: {memory.importance}/10
                        </span>
                        <span className={`${getEmotionalColor(memory.emotionalValence)}`}>
                          Valence: {memory.emotionalValence > 0 ? '+' : ''}{memory.emotionalValence}
                        </span>
                        <span>References: {memory.referenceCount}</span>
                        <span>Created: {new Date(memory.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
