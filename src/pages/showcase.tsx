import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Activity, 
  BarChart3, 
  Cpu, 
  Eye, 
  Layers, 
  Network, 
  Play, 
  Pause,
  Code,
  Zap,
  Target,
  Gauge,
  TrendingUp,
  Sparkles,
  Monitor,
  Server,
  Database,
  GitBranch,
  Settings,
  MessageSquare,
  Shield,
  Lock,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users
} from 'lucide-react';
import TokenRenderingDot, { TypingIndicator, PulsingDot } from '../components/ui/TokenRenderingDot';

// Live AI Processing Demo Component
const LiveProcessingDemo = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const processingSteps = [
    { label: 'Input Analysis', status: 'analyzing', detail: 'Parsing emotional context and intent' },
    { label: 'Memory Retrieval', status: 'processing', detail: 'Accessing relevant therapeutic history' },
    { label: 'Clinical Assessment', status: 'processing', detail: 'Evaluating psychological patterns' },
    { label: 'Response Generation', status: 'generating', detail: 'Crafting personalized therapeutic response' },
    { label: 'Safety Validation', status: 'validating', detail: 'Crisis detection and ethical review' }
  ];

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % processingSteps.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Live AI Processing Pipeline</h3>
        <button
          onClick={() => setIsProcessing(!isProcessing)}
          className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all backdrop-blur-md ${
            isProcessing 
              ? 'bg-red-500/20 border border-red-400/30 text-red-400' 
              : 'bg-white/15 border border-white/25 text-white hover:bg-white/20'
          }`}
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
        >
          {isProcessing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isProcessing ? 'Stop Demo' : 'Start Demo'}
        </button>
      </div>

      <div className="space-y-4">
        {processingSteps.map((step, index) => (
          <motion.div
            key={index}
            className={`p-4 rounded-2xl border transition-all duration-500 backdrop-blur-md ${
              isProcessing && currentStep === index
                ? 'bg-purple-500/20 border-purple-400/50 shadow-lg shadow-purple-400/20'
                : 'bg-white/10 border-white/20'
            }`}
            style={{ boxShadow: isProcessing && currentStep === index ? '0 8px 24px rgba(168,85,247,0.3)' : '0 4px 12px rgba(0,0,0,0.2)' }}
            animate={{
              scale: isProcessing && currentStep === index ? 1.02 : 1,
              opacity: isProcessing && currentStep === index ? 1 : 0.7
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {isProcessing && currentStep === index ? (
                  <PulsingDot color="purple" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                )}
                <span className="font-medium text-white">{step.label}</span>
              </div>
              <div className="text-sm text-white/70">{step.detail}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {isProcessing && (
        <motion.div 
          className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 text-purple-300">
            <TypingIndicator />
            <span className="text-sm">Jamie is generating a therapeutic response...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Neural Network Visualization
const NeuralNetworkViz = () => {
  const [activeNodes, setActiveNodes] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNodes(Array.from({length: Math.floor(Math.random() * 5) + 2}, () => 
        Math.floor(Math.random() * 12)
      ));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-4 gap-8">
          {Array.from({length: 12}).map((_, i) => (
            <motion.div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-500 ${
                activeNodes.includes(i) 
                  ? 'bg-purple-400 shadow-lg shadow-purple-400/50' 
                  : 'bg-white/30'
              }`}
              animate={{
                scale: activeNodes.includes(i) ? 1.5 : 1,
                opacity: activeNodes.includes(i) ? 1 : 0.3
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="absolute top-4 left-4 text-sm text-white/70">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Neural Activity Monitor
        </div>
      </div>
    </div>
  );
};

export default function Showcase() {
  const [activeSection, setActiveSection] = useState('processing');

  const showcaseSections = [
    {
      id: 'processing',
      title: 'AI Processing Pipeline',
      description: 'See how Jamie analyzes and responds to therapeutic input in real-time',
      icon: <Cpu className="w-6 h-6" />,
      component: <LiveProcessingDemo />
    },
    {
      id: 'neural',
      title: 'Neural Network Activity',
      description: 'Visualize the neural pathways activating during therapeutic conversations',
      icon: <Network className="w-6 h-6" />,
      component: <NeuralNetworkViz />
    },
    {
      id: 'memory',
      title: 'Memory Formation',
      description: 'Watch how Jamie creates and accesses therapeutic memories',
      icon: <Database className="w-6 h-6" />,
      component: (
        <div className="space-y-4">
          <div className="text-center text-white/70 py-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
            <Database className="w-16 h-16 mx-auto mb-4 text-purple-300" />
            <p>Memory visualization component coming soon</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* GPT-5 Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#ff6b9d] via-[#c44cff] via-[#7c3aed] via-[#3b82f6] to-[#06b6d4] animate-gradient-beam pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-tr from-[#fbbf24] via-[#f97316] via-[#dc2626] to-[#be185d] opacity-70 mix-blend-multiply pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-pink-500/8 via-purple-500/6 to-orange-500/8 mix-blend-screen pointer-events-none" />
      <div className="fixed inset-0 bg-black/6 backdrop-blur-sm pointer-events-none" />
      {/* Hero Section */}
      <section className="relative py-20 px-8 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
              <Monitor className="w-4 h-4 text-purple-300" />
              <span className="text-sm text-white/80">Under the Hood</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extralight mb-8 tracking-wide">
              How Jamie{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                Actually Works
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Go beyond the interface. See the real AI systems, neural networks, and 
              processing pipelines that power therapeutic conversations.
            </p>
          </motion.div>

          {/* Section Navigation */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {showcaseSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-3 rounded-full border transition-all duration-300 flex items-center gap-3 backdrop-blur-md ${
                  activeSection === section.id
                    ? 'bg-purple-500/20 border-purple-400/50 text-purple-300 shadow-lg shadow-purple-400/20'
                    : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15'
                }`}
                style={{ 
                  boxShadow: activeSection === section.id 
                    ? '0 6px 20px rgba(168,85,247,0.3)' 
                    : '0 4px 12px rgba(0,0,0,0.2)' 
                }}
              >
                {section.icon}
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
          </motion.div>

          {/* Active Section Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8"
            style={{ boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}
          >
            {showcaseSections.find(s => s.id === activeSection)?.component}
          </motion.div>

          {/* Technical Specs */}
          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { label: 'Processing Speed', value: '<100ms', icon: <Zap className="w-5 h-5 text-yellow-400" /> },
              { label: 'Memory Capacity', value: 'Unlimited', icon: <Database className="w-5 h-5 text-blue-400" /> },
              { label: 'Safety Checks', value: '24/7', icon: <Shield className="w-5 h-5 text-green-400" /> },
              { label: 'Model Parameters', value: '175B+', icon: <Settings className="w-5 h-5 text-purple-400" /> }
            ].map((spec, index) => (
              <div key={index} className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}>
                <div className="flex items-center gap-3 mb-2">
                  {spec.icon}
                  <span className="text-sm text-white/70">{spec.label}</span>
                </div>
                <div className="text-2xl font-bold text-white">{spec.value}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
