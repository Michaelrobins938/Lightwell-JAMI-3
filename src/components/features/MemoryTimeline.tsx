import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MemoryEvent {
  id: string;
  type: 'created' | 'accessed' | 'strengthened' | 'connected' | 'consolidated';
  memoryId: string;
  memoryType: string;
  memoryContent: string;
  timestamp: Date;
  importance: number;
  emotionalValence: number;
  metadata: {
    context: string;
    trigger: string;
    confidence: number;
    processingTime: number;
  };
}

export default function MemoryTimeline() {
  const [memoryEvents, setMemoryEvents] = useState<MemoryEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  // Simulate memory timeline events
  useEffect(() => {
    if (!isRecording) return;

    const eventTypes: MemoryEvent['type'][] = ['created', 'accessed', 'strengthened', 'connected', 'consolidated'];
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
    const contexts = [
      'During therapy session',
      'In response to user input',
      'Pattern recognition triggered',
      'Emotional state analysis',
      'Therapeutic technique selection',
      'Crisis detection response',
      'Progress milestone reached',
      'Memory consolidation process'
    ];
    const triggers = [
      'User mention of anxiety',
      'Sleep quality improvement',
      'Relationship discussion',
      'Breathing exercise success',
      'Confidence increase',
      'Financial stress mention',
      'Emotional regulation progress',
      'Mindfulness practice'
    ];

    const generateMemoryEvent = () => {
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const memoryType = memoryTypes[Math.floor(Math.random() * memoryTypes.length)];
      const memoryContent = memoryContents[Math.floor(Math.random() * memoryContents.length)];
      
      const newEvent: MemoryEvent = {
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        memoryId: `memory-${Math.random().toString(36).substr(2, 9)}`,
        memoryType,
        memoryContent,
        timestamp: new Date(),
        importance: Math.floor(Math.random() * 10) + 1,
        emotionalValence: Math.floor(Math.random() * 11) - 5, // -5 to +5
        metadata: {
          context: contexts[Math.floor(Math.random() * contexts.length)],
          trigger: triggers[Math.floor(Math.random() * triggers.length)],
          confidence: Math.random() * 0.3 + 0.7, // 70-100%
          processingTime: Math.random() * 500 + 100 // 100-600ms
        }
      };

      setMemoryEvents(prev => [newEvent, ...prev.slice(0, 49)]); // Keep last 50 events
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.5) { // 50% chance of event
        generateMemoryEvent();
      }
    }, 2000 + Math.random() * 3000); // Random interval 2-5 seconds

    return () => clearInterval(interval);
  }, [isRecording]);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'created': return 'bg-green-500';
      case 'accessed': return 'bg-blue-500';
      case 'strengthened': return 'bg-purple-500';
      case 'connected': return 'bg-orange-500';
      case 'consolidated': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'created': return '➕';
      case 'accessed': return '👁️';
      case 'strengthened': return '💪';
      case 'connected': return '🔗';
      case 'consolidated': return '🧠';
      default: return '❓';
    }
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

  const filteredEvents = memoryEvents.filter(event => 
    filterType === 'all' || event.type === filterType
  );

  const eventTypes = memoryEvents.map(e => e.type).filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          📅 Memory Timeline & Lifecycle
        </h3>
        <p className="text-gray-600">
          Visual timeline showing how memories are created, accessed, and evolved over time
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-gray-700">
              {isRecording ? 'Timeline Recording Active' : 'Recording Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isRecording 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isRecording ? 'Pause Recording' : 'Resume Recording'}
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Events
          </button>
          {eventTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                filterType === type
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <h4 className="text-lg font-semibold">⏰ Memory Timeline</h4>
          <p className="text-blue-100 text-sm">Chronological view of memory lifecycle events</p>
        </div>
        
        <div className="p-6">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📅</div>
              <p>No memory events recorded yet</p>
              <p className="text-sm">Events will appear as memories are processed</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              
              {/* Timeline Events */}
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative flex items-start"
                    >
                      {/* Timeline Dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className={`w-4 h-4 rounded-full ${getEventTypeColor(event.type)} shadow-lg`}></div>
                        <div className="absolute inset-0 w-4 h-4 rounded-full bg-white animate-ping opacity-75"></div>
                      </div>
                      
                      {/* Event Content */}
                      <div className="ml-6 flex-1">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                             onClick={() => setSelectedEvent(event.id === selectedEvent ? null : event.id)}>
                          
                          {/* Event Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
                              <div>
                                <h5 className="font-semibold text-gray-800 capitalize">{event.type}</h5>
                                <p className="text-sm text-gray-600">{event.timestamp.toLocaleTimeString()}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMemoryTypeColor(event.type)}`}>
                              {event.memoryType.replace('_', ' ')}
                            </span>
                          </div>
                          
                          {/* Memory Content */}
                          <p className="text-gray-700 mb-3">{event.memoryContent}</p>
                          
                          {/* Event Metadata */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">Importance:</span>
                              <span className={`ml-1 font-medium ${getImportanceColor(event.importance)}`}>
                                {event.importance}/10
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Valence:</span>
                              <span className={`ml-1 font-medium ${getValenceColor(event.emotionalValence)}`}>
                                {event.emotionalValence > 0 ? '+' : ''}{event.emotionalValence}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Confidence:</span>
                              <span className="ml-1 font-medium text-blue-600">
                                {(event.metadata.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Processing:</span>
                              <span className="ml-1 font-medium text-purple-600">
                                {event.metadata.processingTime.toFixed(0)}ms
                              </span>
                            </div>
                          </div>
                          
                          {/* Context and Trigger */}
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-gray-600">Context:</span>
                                <p className="text-gray-800">{event.metadata.context}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Trigger:</span>
                                <p className="text-gray-800">{event.metadata.trigger}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {eventTypes.map(type => {
          const count = memoryEvents.filter(e => e.type === type).length;
          return (
            <div key={type} className="bg-white rounded-lg p-4 shadow-md text-center">
              <div className={`text-2xl mb-2 ${getEventTypeColor(type)}`}>
                {getEventTypeIcon(type)}
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{type}</div>
            </div>
          );
        })}
      </div>

      {/* Memory Type Distribution */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gray-50 p-4 border-b">
          <h4 className="text-lg font-semibold text-gray-800">📊 Memory Type Distribution</h4>
          <p className="text-gray-600 text-sm">Breakdown of memory types over time</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['emotional_state', 'progress_milestone', 'coping_strategy', 'recurring_theme', 'life_event'].map(type => {
              const count = memoryEvents.filter(e => e.memoryType === type).length;
              const percentage = memoryEvents.length > 0 ? (count / memoryEvents.length) * 100 : 0;
              
              return (
                <div key={type} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMemoryTypeColor(type)}`}>
                      {type.replace('_', ' ')}
                    </span>
                    <span className="text-lg font-bold text-gray-800">{count}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${getMemoryTypeColor(type).split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500')}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <div className="text-right text-sm text-gray-600">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline Summary */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 p-4 border-b">
          <h4 className="text-lg font-semibold text-gray-800">📈 Timeline Summary</h4>
          <p className="text-gray-600 text-sm">Overview of memory processing activity</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-semibold text-gray-700 mb-3">Activity Overview</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Events:</span>
                  <span className="font-medium">{memoryEvents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unique Memories:</span>
                  <span className="font-medium">{new Set(memoryEvents.map(e => e.memoryId)).size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory Types:</span>
                  <span className="font-medium">{new Set(memoryEvents.map(e => e.memoryType)).size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Processing Time:</span>
                  <span className="font-medium">
                    {memoryEvents.length > 0 
                      ? (memoryEvents.reduce((sum, e) => sum + e.metadata.processingTime, 0) / memoryEvents.length).toFixed(0)
                      : '0'
                    }ms
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-700 mb-3">Recent Activity</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Hour:</span>
                  <span className="font-medium">
                    {memoryEvents.filter(e => 
                      Date.now() - e.timestamp.getTime() < 60 * 60 * 1000
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last 24 Hours:</span>
                  <span className="font-medium">
                    {memoryEvents.filter(e => 
                      Date.now() - e.timestamp.getTime() < 24 * 60 * 60 * 1000
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Week:</span>
                  <span className="font-medium">
                    {memoryEvents.filter(e => 
                      Date.now() - e.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
                    ).length}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-700 mb-3">Performance Metrics</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Confidence:</span>
                  <span className="font-medium">
                    {memoryEvents.length > 0 
                      ? (memoryEvents.reduce((sum, e) => sum + e.metadata.confidence, 0) / memoryEvents.length * 100).toFixed(1)
                      : '0'
                    }%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">High Importance:</span>
                  <span className="font-medium">
                    {memoryEvents.filter(e => e.importance >= 8).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Positive Valence:</span>
                  <span className="font-medium">
                    {memoryEvents.filter(e => e.emotionalValence > 0).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
