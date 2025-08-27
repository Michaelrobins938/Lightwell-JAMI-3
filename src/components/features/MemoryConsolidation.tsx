import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Memory {
  id: string;
  type: string;
  content: string;
  importance: number;
  emotionalValence: number;
  tags: string[];
  connections: string[];
  createdAt: Date;
  lastReferenced: Date;
  referenceCount: number;
}

interface MemoryConnection {
  id: string;
  sourceId: string;
  targetId: string;
  strength: number;
  type: 'emotional' | 'thematic' | 'temporal' | 'contextual';
}

export default function MemoryConsolidation() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [connections, setConnections] = useState<MemoryConnection[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);
  const [isConsolidating, setIsConsolidating] = useState(true);

  // Simulate memory creation and consolidation
  useEffect(() => {
    if (!isConsolidating) return;

    const memoryTypes = ['emotional_state', 'recurring_theme', 'progress_milestone', 'coping_strategy', 'life_event'];
    const memoryContents = [
      'User experiences anxiety about work presentations',
      'User reports improved sleep quality after meditation',
      'User discusses relationship stress with partner',
      'User practices breathing exercises successfully',
      'User shows increased confidence in social situations',
      'User mentions recurring financial worries',
      'User demonstrates progress in emotional regulation',
      'User uses mindfulness techniques effectively',
      'User reports feeling overwhelmed by daily tasks',
      'User celebrates small victories and achievements'
    ];

    const generateMemory = () => {
      const newMemory: Memory = {
        id: `memory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: memoryTypes[Math.floor(Math.random() * memoryTypes.length)],
        content: memoryContents[Math.floor(Math.random() * memoryContents.length)],
        importance: Math.floor(Math.random() * 10) + 1,
        emotionalValence: Math.floor(Math.random() * 11) - 5, // -5 to +5
        tags: ['therapy', 'progress', 'challenge', 'achievement'].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1),
        connections: [],
        createdAt: new Date(),
        lastReferenced: new Date(),
        referenceCount: Math.floor(Math.random() * 5) + 1
      };

      setMemories(prev => [newMemory, ...prev.slice(0, 19)]); // Keep last 20
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of memory
        generateMemory();
      }
    }, 4000 + Math.random() * 3000); // Random interval 4-7 seconds

    return () => clearInterval(interval);
  }, [isConsolidating]);

  // Generate connections between memories
  useEffect(() => {
    if (memories.length < 2) return;

    const newConnections: MemoryConnection[] = [];
    const connectionTypes: MemoryConnection['type'][] = ['emotional', 'thematic', 'temporal', 'contextual'];

    memories.forEach((memory, index) => {
      if (index === 0) return;
      
      // Connect to previous memories based on similarity
      const previousMemories = memories.slice(0, index);
      previousMemories.forEach(prevMemory => {
        const similarity = calculateSimilarity(memory, prevMemory);
        if (similarity > 0.3) { // Only connect if similarity > 30%
          newConnections.push({
            id: `conn-${memory.id}-${prevMemory.id}`,
            sourceId: memory.id,
            targetId: prevMemory.id,
            strength: similarity,
            type: connectionTypes[Math.floor(Math.random() * connectionTypes.length)]
          });
        }
      });
    });

    setConnections(newConnections);
  }, [memories]);

  const calculateSimilarity = (mem1: Memory, mem2: Memory): number => {
    let similarity = 0;
    
    // Type similarity
    if (mem1.type === mem2.type) similarity += 0.3;
    
    // Emotional valence similarity
    const valenceDiff = Math.abs(mem1.emotionalValence - mem2.emotionalValence);
    if (valenceDiff <= 1) similarity += 0.2;
    else if (valenceDiff <= 2) similarity += 0.1;
    
    // Tag similarity
    const commonTags = mem1.tags.filter(tag => mem2.tags.includes(tag));
    similarity += (commonTags.length / Math.max(mem1.tags.length, mem2.tags.length)) * 0.3;
    
    // Temporal proximity
    const timeDiff = Math.abs(mem1.createdAt.getTime() - mem2.createdAt.getTime());
    if (timeDiff < 24 * 60 * 60 * 1000) similarity += 0.2; // Same day
    
    return Math.min(similarity, 1);
  };

  const getMemoryTypeColor = (type: string) => {
    switch (type) {
      case 'emotional_state': return 'bg-red-100 text-red-800';
      case 'progress_milestone': return 'bg-green-100 text-green-800';
      case 'coping_strategy': return 'bg-blue-100 text-blue-800';
      case 'recurring_theme': return 'bg-yellow-100 text-yellow-800';
      case 'life_event': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getValenceColor = (valence: number) => {
    if (valence >= 3) return 'text-green-600';
    if (valence >= 1) return 'text-blue-600';
    if (valence >= -1) return 'text-gray-600';
    if (valence >= -3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return 'text-red-600 font-bold';
    if (importance >= 6) return 'text-orange-600';
    if (importance >= 4) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getConnectionColor = (type: string) => {
    switch (type) {
      case 'emotional': return 'stroke-red-400';
      case 'thematic': return 'stroke-blue-400';
      case 'temporal': return 'stroke-green-400';
      case 'contextual': return 'stroke-purple-400';
      default: return 'stroke-gray-400';
    }
  };

  const getConnectionWidth = (strength: number) => {
    if (strength >= 0.8) return 'stroke-3';
    if (strength >= 0.6) return 'stroke-2';
    return 'stroke-1';
  };

  const selectedMemoryData = memories.find(m => m.id === selectedMemory);
  const selectedMemoryConnections = connections.filter(c => 
    c.sourceId === selectedMemory || c.targetId === selectedMemory
  );

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          🧠 Memory Consolidation & Organization
        </h3>
        <p className="text-gray-600">
          Watch how Jamie's memories are organized, connected, and consolidated for optimal retrieval
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConsolidating ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-gray-700">
              {isConsolidating ? 'Consolidation Active' : 'Consolidation Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsConsolidating(!isConsolidating)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isConsolidating 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isConsolidating ? 'Pause Consolidation' : 'Resume Consolidation'}
          </button>
        </div>
      </div>

      {/* Memory Network Visualization */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <h4 className="text-lg font-semibold">🕸️ Memory Network</h4>
          <p className="text-blue-100 text-sm">Visual representation of memory connections and relationships</p>
        </div>
        
        <div className="p-6">
          <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full">
              {connections.map(connection => {
                const source = memories.find(m => m.id === connection.sourceId);
                const target = memories.find(m => m.id === connection.targetId);
                if (!source || !target) return null;

                // Calculate positions (simplified grid layout)
                const sourceIndex = memories.findIndex(m => m.id === connection.sourceId);
                const targetIndex = memories.findIndex(m => m.id === connection.targetId);
                const sourceX = (sourceIndex % 5) * 20 + 10;
                const sourceY = Math.floor(sourceIndex / 5) * 20 + 10;
                const targetX = (targetIndex % 5) * 20 + 10;
                const targetY = Math.floor(targetIndex / 5) * 20 + 10;

                return (
                  <line
                    key={`${connection.sourceId}-${connection.targetId}`}
                    x1={`${sourceX}%`}
                    y1={`${sourceY}%`}
                    x2={`${targetX}%`}
                    y2={`${targetY}%`}
                    className={`${getConnectionColor(connection.type)} ${getConnectionWidth(connection.strength)} transition-all duration-300`}
                    opacity={connection.strength}
                  />
                );
              })}
            </svg>

            {/* Memory Nodes */}
            {memories.map((memory, index) => {
              const x = (index % 5) * 20 + 10;
              const y = Math.floor(index / 5) * 20 + 10;
              const isSelected = selectedMemory === memory.id;
              const hasConnections = connections.some(c => 
                c.sourceId === memory.id || c.targetId === memory.id
              );

              return (
                <motion.div
                  key={memory.id}
                  className={`absolute w-8 h-8 rounded-full cursor-pointer shadow-lg transition-all duration-300 ${
                    isSelected ? 'ring-4 ring-blue-400 scale-125' : 'hover:scale-110'
                  } ${getMemoryTypeColor(memory.type).split(' ')[0]}`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => setSelectedMemory(memory.id === selectedMemory ? null : memory.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-white text-xs font-bold">
                      {memory.type.split('_').map(word => word[0]).join('')}
                    </div>
                  </div>
                  
                  {/* Connection indicator */}
                  {hasConnections && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded-full border border-red-300"></div>
              <span className="text-xs text-gray-600">Emotional State</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded-full border border-green-300"></div>
              <span className="text-xs text-gray-600">Progress Milestone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 rounded-full border border-blue-300"></div>
              <span className="text-xs text-gray-600">Coping Strategy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 rounded-full border border-yellow-300"></div>
              <span className="text-xs text-gray-600">Recurring Theme</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-100 rounded-full border border-purple-300"></div>
              <span className="text-xs text-gray-600">Life Event</span>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Details */}
      {selectedMemoryData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4">
            <h4 className="text-lg font-semibold">📋 Memory Details</h4>
            <p className="text-green-100 text-sm">Detailed information about selected memory</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-gray-700 mb-3">Memory Information</h5>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Type:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getMemoryTypeColor(selectedMemoryData.type)}`}>
                      {selectedMemoryData.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Content:</span>
                    <p className="text-sm text-gray-800 mt-1">{selectedMemoryData.content}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Importance:</span>
                    <span className={`ml-2 font-semibold ${getImportanceColor(selectedMemoryData.importance)}`}>
                      {selectedMemoryData.importance}/10
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Emotional Valence:</span>
                    <span className={`ml-2 font-semibold ${getValenceColor(selectedMemoryData.emotionalValence)}`}>
                      {selectedMemoryData.emotionalValence > 0 ? '+' : ''}{selectedMemoryData.emotionalValence}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="font-semibold text-gray-700 mb-3">Memory Metadata</h5>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Created:</span>
                    <p className="text-sm text-gray-800 mt-1">
                      {selectedMemoryData.createdAt.toLocaleDateString()} at {selectedMemoryData.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Last Referenced:</span>
                    <p className="text-sm text-gray-800 mt-1">
                      {selectedMemoryData.lastReferenced.toLocaleDateString()} at {selectedMemoryData.lastReferenced.toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Reference Count:</span>
                    <span className="ml-2 font-semibold text-blue-600">{selectedMemoryData.referenceCount}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedMemoryData.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connections */}
            {selectedMemoryConnections.length > 0 && (
              <div className="mt-6">
                <h5 className="font-semibold text-gray-700 mb-3">Memory Connections</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedMemoryConnections.map(connection => {
                    const connectedMemory = memories.find(m => 
                      m.id === (connection.sourceId === selectedMemory ? connection.targetId : connection.sourceId)
                    );
                    if (!connectedMemory) return null;

                    return (
                      <div
                        key={connection.id}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMemoryTypeColor(connectedMemory.type)}`}>
                            {connectedMemory.type.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConnectionColor(connection.type).replace('stroke-', 'bg-').replace('-400', '-100')} ${getConnectionColor(connection.type).replace('stroke-', 'text-').replace('-400', '-800')}`}>
                            {connection.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{connectedMemory.content}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Strength: {(connection.strength * 100).toFixed(0)}%</span>
                          <span>{(connection.strength * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Memory Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">{memories.length}</div>
          <div className="text-sm text-gray-600">Total Memories</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{connections.length}</div>
          <div className="text-sm text-gray-600">Connections</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {memories.length > 0 ? (connections.length / memories.length).toFixed(1) : '0'}
          </div>
          <div className="text-sm text-gray-600">Avg Connections</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {memories.length > 0 ? (memories.reduce((sum, m) => sum + m.importance, 0) / memories.length).toFixed(1) : '0'}
          </div>
          <div className="text-sm text-gray-600">Avg Importance</div>
        </div>
      </div>

      {/* Recent Memories */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 p-4 border-b">
          <h4 className="text-lg font-semibold text-gray-800">🆕 Recent Memories</h4>
          <p className="text-gray-600 text-sm">Latest memories being consolidated</p>
        </div>
        
        <div className="p-4">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {memories.slice(0, 10).map((memory, index) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer ${
                    selectedMemory === memory.id ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedMemory(memory.id === selectedMemory ? null : memory.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMemoryTypeColor(memory.type)}`}>
                          {memory.type.replace('_', ' ')}
                        </span>
                        <span className={`text-xs font-medium ${getValenceColor(memory.emotionalValence)}`}>
                          Valence: {memory.emotionalValence > 0 ? '+' : ''}{memory.emotionalValence}
                        </span>
                        <span className={`text-xs font-medium ${getImportanceColor(memory.importance)}`}>
                          Importance: {memory.importance}/10
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-800 mb-2">{memory.content}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>Created: {memory.createdAt.toLocaleTimeString()}</span>
                        <span>References: {memory.referenceCount}</span>
                        <span>Connections: {connections.filter(c => c.sourceId === memory.id || c.targetId === memory.id).length}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
