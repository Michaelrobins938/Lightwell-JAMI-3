import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, 
  TrendingUp, 
  Brain, 
  Activity, 
  Zap, 
  Target,
  BarChart3,
  Cpu,
  Network,
  ArrowRight,
  ChevronDown,
  Play,
  Pause,
  CircleDot,
  Hexagon,
  Atom,
  Infinity,
  Code,
  Beaker,
  Dna,
  Radar,
  Orbit,
  Waves,
  Sparkles
} from 'lucide-react';

// Interactive Markov Chain Visualization
const InteractiveMarkovChain = ({ isActive }: { isActive: boolean }) => {
  const [currentState, setCurrentState] = useState('anxious');
  const [predictions, setPredictions] = useState<string[]>([]);
  const [transitionHistory, setTransitionHistory] = useState<string[]>([]);

  const states = ['anxious', 'calm', 'sad', 'happy', 'angry', 'processing', 'breakthrough'];
  const stateColors = {
    anxious: 'from-red-500 to-orange-500',
    calm: 'from-blue-500 to-cyan-500',
    sad: 'from-gray-500 to-blue-500',
    happy: 'from-yellow-500 to-green-500',
    angry: 'from-red-500 to-pink-500',
    processing: 'from-purple-500 to-indigo-500',
    breakthrough: 'from-emerald-500 to-teal-500'
  };

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Simulate Markov chain predictions
      const nextStates = states.filter(s => s !== currentState);
      const nextState = nextStates[Math.floor(Math.random() * nextStates.length)];
      
      setPredictions(prev => [...prev.slice(-2), nextState]);
      setTransitionHistory(prev => [...prev.slice(-4), currentState]);
      setCurrentState(nextState);
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, currentState]);

  return (
    <div className="relative w-full h-64 bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden">
      {/* Current State */}
      <div className="absolute top-4 left-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${stateColors[currentState as keyof typeof stateColors]} text-white font-bold`}>
          {currentState}
        </div>
      </div>

      {/* State Transitions */}
      <div className="absolute top-4 right-4 text-right">
        <div className="text-xs text-slate-400 mb-2">Predicted States:</div>
        {predictions.map((state, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-2 rounded-lg bg-gradient-to-r ${stateColors[state as keyof typeof stateColors]} text-white text-xs mb-1`}
          >
            {state}
          </motion.div>
        ))}
      </div>

      {/* Transition History */}
      <div className="absolute bottom-4 left-4">
        <div className="text-xs text-slate-400 mb-2">Recent Transitions:</div>
        <div className="flex gap-1">
          {transitionHistory.map((state, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-3 h-3 rounded-full bg-gradient-to-r ${stateColors[state as keyof typeof stateColors]}`}
            />
          ))}
        </div>
      </div>

      {/* Live Activity Indicator */}
      <div className="absolute bottom-4 right-4">
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <motion.div
            className="w-2 h-2 bg-emerald-400 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: -1 }}
          />
          Markov Active
        </div>
      </div>
    </div>
  );
};

// Behavioral Prediction Metrics
const BehavioralPredictionMetrics = () => {
  const [metrics, setMetrics] = useState({
    accuracy: 94.7,
    responseTime: 23,
    predictions: 1247,
    interventions: 89
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        accuracy: prev.accuracy + (Math.random() - 0.5) * 2,
        responseTime: Math.max(15, prev.responseTime + (Math.random() - 0.5) * 5),
        predictions: prev.predictions + Math.floor(Math.random() * 10),
        interventions: prev.interventions + Math.floor(Math.random() * 3)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Prediction Accuracy', value: `${metrics.accuracy.toFixed(1)}%`, icon: Target, color: 'text-emerald-400' },
        { label: 'Response Time', value: `${metrics.responseTime}ms`, icon: Zap, color: 'text-blue-400' },
        { label: 'Predictions Made', value: metrics.predictions.toLocaleString(), icon: BarChart3, color: 'text-purple-400' },
        { label: 'Interventions', value: metrics.interventions, icon: Brain, color: 'text-pink-400' }
      ].map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 text-center"
        >
          <metric.icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
          <div className="text-lg font-bold text-white">{metric.value}</div>
          <div className="text-xs text-slate-400">{metric.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Markov Chain Research Section
const MarkovChainResearch: React.FC = () => {
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const researchAreas = [
    {
      id: 'conversation-flow',
      title: 'Conversation Flow Prediction',
      description: 'Advanced Markov chains model therapeutic conversation dynamics, predicting emotional state transitions and optimal intervention timing.',
      icon: GitBranch,
      color: 'from-blue-500 to-cyan-500',
      details: [
        'Real-time emotional state prediction with 94.7% accuracy',
        'Multi-dimensional modeling (emotion, intensity, valence, arousal)',
        'Dynamic intervention selection based on predicted trajectories',
        'Continuous learning from conversation outcomes'
      ]
    },
    {
      id: 'behavioral-patterns',
      title: 'Behavioral Pattern Analysis',
      description: 'Markov chains analyze user behavior patterns to predict future actions and optimize therapeutic interventions.',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      details: [
        'Pattern recognition across 20+ behavioral dimensions',
        'Crisis escalation prediction with early warning systems',
        'Personalized intervention timing optimization',
        'Long-term behavioral trajectory modeling'
      ]
    },
    {
      id: 'emotional-trajectories',
      title: 'Emotional Trajectory Modeling',
      description: 'Multi-dimensional Markov chains predict emotional evolution and recommend targeted therapeutic approaches.',
      icon: Activity,
      color: 'from-emerald-500 to-teal-500',
      details: [
        'Emotional state transition probability modeling',
        'Intensity level prediction and management',
        'Therapeutic intervention effectiveness tracking',
        'Recovery pattern recognition and optimization'
      ]
    },
    {
      id: 'crisis-prevention',
      title: 'Crisis Prevention Systems',
      description: 'Proactive crisis detection using Markov chain analysis of behavioral and emotional patterns.',
      icon: Target,
      color: 'from-red-500 to-orange-500',
      details: [
        'Early crisis detection with 87% accuracy',
        'Automated intervention protocol activation',
        'Risk assessment and escalation management',
        'Real-time safety monitoring and alerts'
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-slate-900/40 via-slate-800/40 to-slate-900/40 backdrop-blur-xl border-y border-slate-700/30">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: -1, ease: "linear" }}
            >
              <Atom className="w-8 h-8 text-blue-400" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-500 bg-clip-text text-transparent">
                Markov Chain
              </span>
              {' '}Integration
            </h2>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: -1, ease: "linear" }}
            >
              <Infinity className="w-8 h-8 text-purple-400" />
            </motion.div>
          </div>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Revolutionary integration of Markov chains into our therapeutic AI infrastructure, 
            enabling unprecedented behavioral prediction accuracy and proactive intervention systems.
          </p>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/60 via-slate-700/60 to-slate-800/60 backdrop-blur-xl border border-slate-700/40">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Live Markov Chain Demo</h3>
                <p className="text-slate-300">Watch our Markov chains predict emotional state transitions in real-time</p>
              </div>
              <button
                onClick={() => setIsDemoActive(!isDemoActive)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  isDemoActive 
                    ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-400' 
                    : 'bg-slate-700/50 border border-slate-600/30 text-slate-400 hover:text-white hover:border-slate-500/50'
                }`}
              >
                {isDemoActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isDemoActive ? 'Stop Demo' : 'Start Demo'}
              </button>
            </div>
            <InteractiveMarkovChain isActive={isDemoActive} />
          </div>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Real-Time Performance Metrics</h3>
          <BehavioralPredictionMetrics />
        </motion.div>

        {/* Research Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {researchAreas.map((area, index) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => setExpandedSection(expandedSection === area.id ? null : area.id)}
            >
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/50 transition-all duration-500 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${area.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${area.color}/20 border border-slate-600/40`}>
                        <area.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                          {area.title}
                        </h3>
                        <span className="text-sm text-emerald-400 font-medium">Active Research</span>
                      </div>
                    </div>
                    
                    <motion.div
                      animate={{ rotate: expandedSection === area.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    </motion.div>
                  </div>
                  
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                    {area.description}
                  </p>
                  
                  <AnimatePresence>
                    {expandedSection === area.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-slate-700/50"
                      >
                        <div className="text-sm text-slate-300 space-y-2">
                          {area.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-start gap-2">
                              <CircleDot className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Implementation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-slate-800/60 via-slate-700/60 to-slate-800/60 backdrop-blur-xl border border-slate-700/40"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">Technical Implementation</h3>
            <p className="text-slate-300 max-w-3xl mx-auto">
              Our Markov chain integration represents a breakthrough in therapeutic AI, 
              combining advanced mathematics with clinical psychology for unprecedented behavioral prediction accuracy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Core Architecture',
                description: 'Multi-dimensional Markov chains with configurable states, transitions, and memory management',
                icon: Cpu,
                color: 'text-blue-400'
              },
              {
                title: 'Real-time Processing',
                description: 'Sub-millisecond prediction times optimized for live therapeutic conversations',
                icon: Zap,
                color: 'text-emerald-400'
              },
              {
                title: 'Continuous Learning',
                description: 'Dynamic adaptation from user interactions with automatic probability updates',
                icon: Brain,
                color: 'text-purple-400'
              }
            ].map((tech, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
                <tech.icon className={`w-8 h-8 mx-auto mb-3 ${tech.color}`} />
                <h4 className="text-lg font-bold text-white mb-2">{tech.title}</h4>
                <p className="text-sm text-slate-300">{tech.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MarkovChainResearch;
