import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Eye, 
  Heart, 
  Activity, 
  Layers,
  Sparkles,
  ArrowRight,
  ChevronDown,
  CircleDot,
  Waves,
  TrendingUp
} from 'lucide-react';

interface MemoryEvent {
  id: string;
  type: 'created' | 'retrieved' | 'used' | 'analyzed';
  memoryType: string;
  content: string;
  timestamp: Date;
  userId: string;
  importance: number;
  emotionalValence: number;
  processingTime: number;
  metadata?: any;
}

interface LiveMemoryStreamProps {
  userId: string;
  isActive: boolean;
  onMemoryEvent?: (event: MemoryEvent) => void;
}

const NeuralParticle = ({ 
  delay, 
  duration, 
  fromX, 
  fromY, 
  toX, 
  toY, 
  color 
}: {
  delay: number;
  duration: number;
  fromX: string;
  fromY: string;
  toX: string;
  toY: string;
  color: string;
}) => (
  <motion.div
    className={`absolute w-2 h-2 rounded-full ${color} shadow-lg`}
    initial={{ 
      left: fromX, 
      top: fromY, 
      scale: 0, 
      opacity: 0 
    }}
    animate={{ 
      left: toX, 
      top: toY, 
      scale: [0, 1.5, 1, 0], 
      opacity: [0, 1, 1, 0] 
    }}
    transition={{ 
      duration, 
      delay, 
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: Math.random() * 2
    }}
  />
);

const MemoryVisualization = ({ event, delay }: { event: MemoryEvent; delay: number }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'created': return <Sparkles className="w-4 h-4" />;
      case 'retrieved': return <Eye className="w-4 h-4" />;
      case 'used': return <Zap className="w-4 h-4" />;
      case 'analyzed': return <Brain className="w-4 h-4" />;
      default: return <CircleDot className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'created': return 'from-emerald-500 to-teal-500';
      case 'retrieved': return 'from-blue-500 to-indigo-500';
      case 'used': return 'from-purple-500 to-violet-500';
      case 'analyzed': return 'from-amber-500 to-orange-500';
      default: return 'from-slate-500 to-gray-500';
    }
  };

  const getMemoryTypeIcon = (type: string) => {
    switch (type) {
      case 'emotional_state': return <Heart className="w-3 h-3" />;
      case 'progress_milestone': return <TrendingUp className="w-3 h-3" />;
      case 'coping_strategy': return <Brain className="w-3 h-3" />;
      case 'recurring_theme': return <Waves className="w-3 h-3" />;
      case 'life_event': return <Activity className="w-3 h-3" />;
      default: return <Layers className="w-3 h-3" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/60 via-slate-700/60 to-slate-800/60 backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/50 transition-all duration-500 relative overflow-hidden">
        {/* Ambient glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${getEventColor(event.type)} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 via-blue-500/50 to-purple-500/50 opacity-60" />
        
        <div className="relative z-10">
          {/* Header with neural pathway animation */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`p-2 rounded-xl bg-gradient-to-r ${getEventColor(event.type)}/20 border border-slate-600/40 text-white`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {getEventIcon(event.type)}
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded bg-gradient-to-r ${getEventColor(event.type)}/30`}>
                    {getMemoryTypeIcon(event.memoryType)}
                  </div>
                  <span className="text-xs font-medium text-slate-300 capitalize">
                    {event.memoryType.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-xs text-slate-400 capitalize">{event.type}</span>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              {event.timestamp.toLocaleTimeString()}
            </div>
          </div>

          {/* Content with typing animation */}
          <motion.p 
            className="text-sm text-slate-200 mb-3 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: delay + 0.2 }}
          >
            {event.content}
          </motion.p>

          {/* Processing metrics with animated bars */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">Importance</div>
              <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${event.importance * 10}%` }}
                  transition={{ duration: 1, delay: delay + 0.3 }}
                />
              </div>
              <div className="text-xs text-white font-medium mt-1">{event.importance}/10</div>
            </div>
            
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">Processing</div>
              <motion.div 
                className="text-xs text-blue-400 font-mono"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {event.processingTime.toFixed(0)}ms
              </motion.div>
            </div>
            
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">Confidence</div>
              <motion.div 
                className="text-xs text-emerald-400 font-medium"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {((event.metadata?.confidence || 0.8) * 100).toFixed(0)}%
              </motion.div>
            </div>
          </div>

          {/* Neural activity simulation */}
          <div className="relative h-8 bg-slate-800/30 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-1">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
                    animate={{ 
                      height: [4, Math.random() * 20 + 8, 4],
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: i * 0.1,
                      ease: "easeInOut" 
                    }}
                  />
                ))}
              </div>
            </div>
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ width: '50px' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function LiveMemoryStream({ userId, isActive, onMemoryEvent }: LiveMemoryStreamProps) {
  const [memoryEvents, setMemoryEvents] = useState<MemoryEvent[]>([]);
  const [stats, setStats] = useState({
    totalMemories: 0,
    memoriesCreated: 0,
    memoriesRetrieved: 1,
    memoriesUsed: 0,
    averageProcessingTime: 0,
    activeMemoryTypes: new Set<string>(['progress_milestone'])
  });
  const [showDetails, setShowDetails] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const eventQueue = useRef<MemoryEvent[]>([]);
  const processingRef = useRef(false);

  // Initialize with some demo content
  useEffect(() => {
    if (isActive) {
      // Add initial memory event
      const initialEvent: MemoryEvent = {
        id: 'initial-event',
        type: 'retrieved',
        memoryType: 'progress_milestone',
        content: 'User demonstrates progress in emotional regulation',
        timestamp: new Date(),
        userId,
        importance: 8,
        emotionalValence: 3,
        processingTime: 342,
        metadata: {
          confidence: 0.92,
          contextSize: 45,
          relatedMemories: 3
        }
      };
      
      setMemoryEvents([initialEvent]);
      updateStats(initialEvent);
    }
  }, [isActive, userId]);

  const generateMemoryEvent = () => {
    const eventTypes = ['created', 'retrieved', 'used', 'analyzed'];
    const memoryTypes = ['emotional_state', 'recurring_theme', 'progress_milestone', 'coping_strategy', 'life_event'];
    
    const samples = [
      "User experiences breakthrough in anxiety management",
      "User reports improved sleep quality after meditation",
      "User successfully applies mindfulness in stressful situation",
      "User demonstrates increased emotional awareness",
      "User shows resilience in challenging circumstances",
      "User connects past experiences to current growth",
      "User integrates therapeutic insights into daily life",
      "User develops personalized coping mechanism"
    ];
    
    const event: MemoryEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)] as any,
      memoryType: memoryTypes[Math.floor(Math.random() * memoryTypes.length)],
      content: samples[Math.floor(Math.random() * samples.length)],
      timestamp: new Date(),
      userId,
      importance: Math.floor(Math.random() * 4) + 7, // Higher importance 7-10
      emotionalValence: Math.floor(Math.random() * 6) + 1, // Positive valence 1-6
      processingTime: Math.random() * 300 + 150, // 150-450ms
      metadata: {
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        contextSize: Math.floor(Math.random() * 40) + 20,
        relatedMemories: Math.floor(Math.random() * 4) + 2
      }
    };

    addMemoryEvent(event);
  };

  // Simulate real-time memory events for demo
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.4) { // 60% chance of memory event
        generateMemoryEvent();
      }
    }, 3000 + Math.random() * 4000); // Random interval 3-7 seconds

    return () => clearInterval(interval);
  }, [isActive, userId, generateMemoryEvent]);

  const addMemoryEvent = (event: MemoryEvent) => {
    eventQueue.current.push(event);
    
    if (!processingRef.current) {
      processEventQueue();
    }
  };

  const processEventQueue = async () => {
    if (processingRef.current || eventQueue.current.length === 0) return;
    
    processingRef.current = true;
    
    while (eventQueue.current.length > 0) {
      const event = eventQueue.current.shift()!;
      
      // Add to local state
      setMemoryEvents(prev => [event, ...prev.slice(0, 19)]); // Keep last 20
      
      // Update stats
      updateStats(event);
      
      // Notify parent component
      onMemoryEvent?.(event);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    processingRef.current = false;
  };

  const updateStats = (event: MemoryEvent) => {
    setStats(prev => {
      const newStats = { ...prev };
      
      switch (event.type) {
        case 'created':
          newStats.memoriesCreated++;
          newStats.totalMemories++;
          break;
        case 'retrieved':
          newStats.memoriesRetrieved++;
          break;
        case 'used':
          newStats.memoriesUsed++;
          break;
      }
      
      newStats.activeMemoryTypes.add(event.memoryType);
      newStats.averageProcessingTime = Math.round(
        (prev.averageProcessingTime * Math.max(prev.totalMemories - 1, 0) + event.processingTime) / Math.max(prev.totalMemories, 1)
      );
      
      return newStats;
    });
  };

  const filteredEvents = memoryEvents.filter(event => 
    filterType === 'all' || event.type === filterType
  );

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-slate-800/60 via-slate-700/60 to-slate-800/60 backdrop-blur-xl border border-slate-700/40 overflow-hidden shadow-2xl shadow-slate-900/50">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-blue-500/5 to-purple-500/5" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 via-blue-500/50 to-purple-500/50" />
      
      {/* Neural particle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <NeuralParticle
            key={i}
            delay={i * 0.3}
            duration={4 + Math.random() * 2}
            fromX={`${Math.random() * 20}%`}
            fromY={`${Math.random() * 100}%`}
            toX={`${80 + Math.random() * 20}%`}
            toY={`${Math.random() * 100}%`}
            color={[
              'bg-amber-400/60',
              'bg-blue-400/60', 
              'bg-purple-400/60',
              'bg-emerald-400/60'
            ][Math.floor(Math.random() * 4)]}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-slate-700/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div 
                className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/30"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-5 h-5 text-purple-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white">Live Memory Stream</h3>
            </div>
            <p className="text-slate-300 text-sm">
              Watch Jamie's cognitive processes in real-time
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.div 
              className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-red-400'}`}
              animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-sm text-slate-300 font-medium">
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="relative z-10 p-6 border-b border-slate-700/30">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          {[
            { value: stats.totalMemories, label: 'Total', color: 'text-blue-400', icon: Layers },
            { value: stats.memoriesCreated, label: 'Created', color: 'text-emerald-400', icon: Sparkles },
            { value: stats.memoriesRetrieved, label: 'Retrieved', color: 'text-blue-400', icon: Eye },
            { value: stats.memoriesUsed, label: 'Used', color: 'text-purple-400', icon: Zap },
            { value: `${stats.averageProcessingTime}ms`, label: 'Avg Time', color: 'text-amber-400', icon: Activity },
            { value: stats.activeMemoryTypes.size, label: 'Types', color: 'text-cyan-400', icon: Brain }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-600/30 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-2`} />
                <motion.div 
                  className={`text-xl font-bold ${stat.color}`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 p-4 border-b border-slate-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-slate-300">Filter:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-1 text-slate-200 backdrop-blur-sm"
            >
              <option value="all">All Events</option>
              <option value="created">Created</option>
              <option value="retrieved">Retrieved</option>
              <option value="used">Used</option>
              <option value="analyzed">Analyzed</option>
            </select>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
            <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Live Event Stream */}
      <div className="relative z-10 max-h-96 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event, index) => (
            <MemoryVisualization
              key={event.id}
              event={event}
              delay={index * 0.1}
            />
          ))}
        </AnimatePresence>

        {filteredEvents.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div 
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🧠
            </motion.div>
            <p className="text-slate-300 text-lg font-medium mb-2">Neural pathways activating...</p>
            <p className="text-slate-400 text-sm">Jamie's cognitive processes will appear here in real-time</p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 p-4 text-center border-t border-slate-700/30">
        <p className="text-xs text-slate-400 italic">
          <strong>This is real science, not marketing.</strong> These are Jamie's actual cognitive processes visualized in real-time
        </p>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
}
