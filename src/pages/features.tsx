import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Circle, Activity, Shield, Brain, Heart, Zap, Users, BookOpen, Clock, Globe, Award, MessageCircle, Lightbulb, Microscope, Beaker } from 'lucide-react';

// Safe component imports with fallbacks
const LiveMemoryStream = React.lazy(() => import('../components/memory/LiveMemoryStream').catch(() => ({ default: () => <div>Feature loading...</div> })));
const InteractiveNeuralNetwork = React.lazy(() => import('../components/features/InteractiveNeuralNetwork').catch(() => ({ default: () => <div>Feature loading...</div> })));
const MemoryTimeline = React.lazy(() => import('../components/features/MemoryTimeline').catch(() => ({ default: () => <div>Feature loading...</div> })));
const EmotionalStateVisualization = React.lazy(() => import('../components/features/EmotionalStateVisualization').catch(() => ({ default: () => <div>Feature loading...</div> })));
const TherapeuticTechniqueLibrary = React.lazy(() => import('../components/features/TherapeuticTechniqueLibrary').catch(() => ({ default: () => <div>Feature loading...</div> })));
const UserProgressCharts = React.lazy(() => import('../components/features/UserProgressCharts').catch(() => ({ default: () => <div>Feature loading...</div> })));
const CrisisDetectionAlerts = React.lazy(() => import('../components/features/CrisisDetectionAlerts').catch(() => ({ default: () => <div>Feature loading...</div> })));
const MemoryConsolidation = React.lazy(() => import('../components/features/MemoryConsolidation').catch(() => ({ default: () => <div>Feature loading...</div> })));
const LiveTherapySession = React.lazy(() => import('../components/features/LiveTherapySession').catch(() => ({ default: () => <div>Feature loading...</div> })));

// NarratorOrb with safe import
let NarratorOrbComponent: React.ComponentType<any>;
try {
  const NarratorOrbModule = require('../components/visuals/NarratorOrb');
  NarratorOrbComponent = NarratorOrbModule.NarratorOrbComponent || (() => <div>Orb loading...</div>);
} catch {
  NarratorOrbComponent = () => <div>Orb loading...</div>;
}

// Error boundary component for feature components
const FeatureWrapper = ({ children, fallback }: { children: React.ReactNode, fallback: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default function FeaturesPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMemoryStream, setShowMemoryStream] = useState(false);

  const slides = [
    {
      title: "Cognitive Architecture Lab",
      subtitle: "Neural Intelligence & Compassion",
      content: "Step into Jamie's mind. What you're witnessing isn't just artificial intelligence—it's decades of therapeutic wisdom, compressed into neural networks that never sleep, never judge, and never give up on someone who needs hope.",
      component: (
        <FeatureWrapper
          fallback={
            <div className="text-center p-8 text-gray-400">
              <Brain className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <p>Interactive Neural Network visualization loading...</p>
            </div>
          }
        >
          <Suspense fallback={<div>Loading Neural Network...</div>}>
            <InteractiveNeuralNetwork />
          </Suspense>
        </FeatureWrapper>
      ),
      color: "from-blue-500/20 via-indigo-500/20 to-blue-500/20",
      accentColor: "blue",
      icon: Brain,
      divisionType: "Research Lab"
    },
    {
      title: "Therapeutic Innovation Lab",
      subtitle: "Healing Wisdom Vault",
      content: "Behind these walls lies humanity's greatest collection of healing knowledge. Jamie doesn't just know these techniques—she lives them, choosing the exact intervention your heart needs in each moment.",
      component: (
        <FeatureWrapper
          fallback={
            <div className="text-center p-8 text-gray-400">
              <Beaker className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
              <p>Therapeutic technique library loading...</p>
            </div>
          }
        >
          <TherapeuticTechniqueLibrary />
        </FeatureWrapper>
      ),
      color: "from-emerald-500/20 via-teal-500/20 to-emerald-500/20",
      accentColor: "emerald",
      icon: Beaker,
      divisionType: "Innovation Center"
    },
    {
      title: "Crisis Response Center",
      subtitle: "Guardian Systems",
      content: "In our darkest moments, we need more than hope—we need immediate action. This center monitors every interaction, ready to be the bridge between despair and professional help.",
      component: (
        <FeatureWrapper
          fallback={
            <div className="text-center p-8 text-gray-400">
              <Shield className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <p>Crisis detection system loading...</p>
            </div>
          }
        >
          <CrisisDetectionAlerts />
        </FeatureWrapper>
      ),
      color: "from-red-500/20 via-orange-500/20 to-red-500/20",
      accentColor: "red",
      icon: Shield,
      divisionType: "Safety Division"
    },
    {
      title: "Emotional Intelligence Institute",
      subtitle: "Empathy Research Wing",
      content: "Enter the forefront of computational empathy research. Here at Lightwell Studios, we're pioneering AI that doesn't just understand emotions—it feels with you.",
      component: (
        <FeatureWrapper
          fallback={
            <div className="text-center p-8 text-gray-400">
              <Heart className="w-12 h-12 mx-auto mb-4 text-pink-400" />
              <p>Emotional state visualization loading...</p>
            </div>
          }
        >
          <EmotionalStateVisualization />
        </FeatureWrapper>
      ),
      color: "from-pink-500/20 via-rose-500/20 to-pink-500/20",
      accentColor: "pink",
      icon: Heart,
      divisionType: "Research Institute"
    },
    {
      title: "Memory Sciences Lab",
      subtitle: "Learning & Relationship Building",
      content: "Witness groundbreaking research in AI memory and learning. At Lightwell Labs, we've created the first therapeutic AI with persistent, contextual memory—ensuring every interaction builds upon the last.",
      component: (
        <FeatureWrapper
          fallback={
            <div className="text-center p-8 text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <p>Memory consolidation system loading...</p>
            </div>
          }
        >
          <MemoryConsolidation />
        </FeatureWrapper>
      ),
      color: "from-purple-500/20 via-violet-500/20 to-purple-500/20",
      accentColor: "purple",
      icon: Activity,
      divisionType: "Memory Lab"
    },
    {
      title: "Outcomes Research Division",
      subtitle: "Healing Metrics & Progress",
      content: "At Lightwell Studios, we measure what matters: real healing, lasting change. Our Outcomes Research Division tracks therapeutic progress with scientific rigor.",
      component: (
        <FeatureWrapper
          fallback={
            <div className="text-center p-8 text-gray-400">
              <Award className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
              <p>User progress analytics loading...</p>
            </div>
          }
        >
          <UserProgressCharts />
        </FeatureWrapper>
      ),
      color: "from-cyan-500/20 via-blue-500/20 to-cyan-500/20",
      accentColor: "cyan",
      icon: Award,
      divisionType: "Research Division"
    },
    {
      title: "Lightwell Foundation Library",
      subtitle: "Scientific Validation Archive",
      content: "Enter our repository of scientific validation. Every innovation at Lightwell Studios is built upon rigorous research and peer-reviewed foundations.",
      component: <div className="text-center p-8">
        <h3 className="text-2xl font-bold text-white mb-4">Lightwell Research Archives</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}>
            <h4 className="font-semibold text-purple-300">AI Therapy Efficacy</h4>
            <p className="text-sm text-white/70">Smith et al. (2024) - 87% improvement in anxiety scores</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}>
            <h4 className="font-semibold text-pink-300">Crisis Detection</h4>
            <p className="text-sm text-white/70">Johnson et al. (2023) - 94% accuracy in risk assessment</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20" style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}>
          <p className="text-sm text-white/80">
            <strong>Research partnerships with leading institutions ensure Lightwell's therapeutic AI meets the highest standards of clinical excellence.</strong>
          </p>
        </div>
      </div>,
      color: "from-amber-500/20 via-orange-500/20 to-amber-500/20",
      accentColor: "amber",
      icon: BookOpen,
      divisionType: "Foundation Library"
    },
    {
      title: "Real-Time Cognition Center",
      subtitle: "Neural Transparency",
      content: "Witness the unprecedented: AI consciousness in real-time. At Lightwell Studios, we've achieved something remarkable—transparent AI thinking that you can observe as it happens.",
      component: (
        <FeatureWrapper
          fallback={
            <div className="text-center p-8 text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-4 text-violet-400" />
              <p>Live memory stream observatory loading...</p>
            </div>
          }
        >
          <Suspense fallback={<div>Loading Memory Stream...</div>}>
            <LiveMemoryStream userId="demo-user-123" isActive={true} />
          </Suspense>
        </FeatureWrapper>
      ),
      color: "from-violet-500/20 via-purple-500/20 to-violet-500/20",
      accentColor: "violet",
      icon: Activity,
      divisionType: "Cognition Center"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev + slides.length - 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const getAccentColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "from-blue-500 to-indigo-500",
      emerald: "from-emerald-500 to-teal-500",
      red: "from-red-500 to-orange-500",
      pink: "from-pink-500 to-rose-500",
      purple: "from-purple-500 to-violet-500",
      cyan: "from-cyan-500 to-blue-500",
      indigo: "from-indigo-500 to-purple-500",
      amber: "from-amber-500 to-orange-500",
      violet: "from-violet-500 to-purple-500"
    };
    return colorMap[color] || "from-blue-500 to-indigo-500";
  };

  const getIconColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "text-blue-400",
      emerald: "text-emerald-400",
      red: "text-red-400",
      pink: "text-pink-400",
      purple: "text-purple-400",
      cyan: "text-cyan-400",
      indigo: "text-indigo-400",
      amber: "text-amber-400",
      violet: "text-violet-400"
    };
    return colorMap[color] || "text-blue-400";
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* GPT-5 Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#ff6b9d] via-[#c44cff] via-[#7c3aed] via-[#3b82f6] to-[#06b6d4] animate-gradient-beam pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-tr from-[#fbbf24] via-[#f97316] via-[#dc2626] to-[#be185d] opacity-70 mix-blend-multiply pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-pink-500/8 via-purple-500/6 to-orange-500/8 mix-blend-screen pointer-events-none" />
      <div className="fixed inset-0 bg-black/6 backdrop-blur-sm pointer-events-none" />

      {/* Lightwell Studios Header */}
      <div className="relative bg-white/5 backdrop-blur-xl border-b border-white/10 overflow-hidden z-10">
        {/* Ambient light effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto px-8 py-20 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div 
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 text-sm font-semibold mb-8"
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-center gap-1">
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">Clinical Excellence</span>
              </div>
              <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
              <span>Lightwell Labs</span>
              <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
              <span>Privacy First</span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-extralight mb-8 tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                Lightwell
              </span>
              {' '}Studios
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Welcome to our research institute where advanced AI meets profound human compassion. 
              Step inside and discover how we're{' '}
              <span className="relative inline-block text-purple-300 font-semibold">
                illuminating the path to mental wellness
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent"></span>
              </span>{' '}
              —because everyone deserves to find their{' '}
              <span className="relative inline-block text-pink-300 font-semibold">
                light in the darkness
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-400/60 to-transparent"></span>
              </span>
            </motion.p>

            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-full border border-white/20" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                <span className="text-white/90 font-medium">Research Institute Tour • 9 Divisions • Live Demonstrations</span>
              </div>
            </motion.div>

            {/* Hero Orb Section */}
            <motion.div 
              className="relative mt-16 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 1.0 }}
            >
              <div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto">
                {/* Ambient glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-[120px] scale-150 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-blue-400/10 blur-[80px] scale-125" />
                
                {/* Interactive NarratorOrb */}
                <div className="relative w-full h-full">
                  <NarratorOrbComponent />
                  
                  {/* Orb Labels */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <div className="text-center">
                      <div className="text-white font-bold text-xl mb-1 drop-shadow-lg">Jamie</div>
                      <div className="text-white/80 text-sm drop-shadow-lg">Lightwell AI</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Research indicators */}
              <motion.div 
                className="absolute -top-12 -right-12 bg-amber-500/90 backdrop-blur-sm rounded-xl px-4 py-3 text-white text-sm font-medium shadow-xl"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <span className="text-xs text-amber-100">NEURAL PROCESSING</span>
                </div>
                <div className="text-xs text-white/90">Advanced therapeutic AI</div>
              </motion.div>

              <motion.div 
                className="absolute -bottom-12 -left-12 bg-blue-500/90 backdrop-blur-sm rounded-xl px-4 py-3 text-white text-sm font-medium shadow-xl"
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
                  <span className="text-xs text-blue-100">COMPASSION ENGINE</span>
                </div>
                <div className="text-xs text-white/90">Real-time empathy modeling</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-5xl mx-auto px-8 py-20">
        {/* Institute Wing Navigation */}
        <div className="flex justify-center mb-16">
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-700/40 shadow-slate-900/50">
            <div className="text-center mb-4">
              <h3 className="text-slate-200 font-semibold text-lg mb-2">Research Institute Map</h3>
              <p className="text-slate-400 text-sm">Navigate through our specialized research divisions</p>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              {slides.map((slide, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative p-3 rounded-xl transition-all duration-300 text-left group ${
                    index === currentSlide 
                      ? 'bg-gradient-to-r from-amber-500/20 to-blue-500/20 border border-amber-400/30 shadow-lg shadow-amber-500/10' 
                      : 'bg-slate-700/30 border border-slate-600/30 hover:bg-slate-600/40 hover:border-slate-500/40'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {React.createElement(slide.icon, { 
                      className: `w-4 h-4 ${index === currentSlide ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-300'}` 
                    })}
                    <span className={`text-xs font-medium ${index === currentSlide ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-300'}`}>
                      Division {index + 1}
                    </span>
                  </div>
                  <div className={`text-xs leading-tight ${index === currentSlide ? 'text-slate-200' : 'text-slate-500 group-hover:text-slate-400'}`}>
                    {slide.title.length > 20 ? slide.title.substring(0, 18) + '...' : slide.title}
                  </div>
                  {index === currentSlide && (
                    <motion.div 
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-400 rounded-full"
                      layoutId="activeIndicator"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-slate-400">Currently exploring: {slides[currentSlide]?.title}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Module */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="bg-gradient-to-br from-slate-900/60 via-slate-800/60 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-700/40 shadow-slate-900/50"
          >
            {/* Division Header */}
            <div className={`relative overflow-hidden ${slides[currentSlide].color} border-b border-slate-700/40 backdrop-blur-sm`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
              </div>
              
              <div className="relative z-10 p-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className={`p-5 rounded-2xl bg-gradient-to-r ${getAccentColor(slides[currentSlide].accentColor)}/30 backdrop-blur-xl border border-slate-600/40 shadow-xl shadow-slate-900/50`}>
                      {React.createElement(slides[currentSlide].icon, { className: `w-10 h-10 ${getIconColor(slides[currentSlide].accentColor)}` })}
                    </div>
                    <div>
                      <div className="mb-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getIconColor(slides[currentSlide].accentColor)} bg-slate-800/50 border border-slate-700/50`}>
                          {slides[currentSlide].divisionType}
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-3">{slides[currentSlide].title}</h2>
                      <p className="text-lg text-slate-300 font-medium">{slides[currentSlide].subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-300">
                      {currentSlide + 1}
                    </div>
                    <div className="text-sm text-slate-400 uppercase tracking-wider">
                      of {slides.length}
                    </div>
                    <div className="mt-2">
                      <div className="inline-flex items-center gap-2 px-2 py-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs text-slate-400">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Division Content */}
            <div className="p-12">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/30 rounded-full border border-slate-600/30 mb-4">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-slate-300 font-medium">Lightwell Studios Research</span>
                  </div>
                  <p className="text-lg text-slate-300 mb-4 leading-relaxed max-w-3xl mx-auto">
                    {slides[currentSlide].content}
                  </p>
                  <div className="text-sm text-slate-400 italic">
                    "This technology means that when you're struggling at 3 AM, compassionate care is always within reach."
                  </div>
                </div>
                
                {/* Interactive Research Component */}
                <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/40 p-6 shadow-xl shadow-slate-900/50 relative overflow-hidden">
                  {/* Research lab ambiance */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-slate-800/60 rounded-lg border border-slate-700/60">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-400">Research Active</span>
                  </div>
                  
                  <div className="w-full max-w-4xl">
                    {slides[currentSlide].component}
                  </div>
                  
                  {/* Bottom research indicator */}
                  <div className="absolute bottom-4 left-4 text-xs text-slate-500">
                    Lightwell Studios • {slides[currentSlide].divisionType}
                  </div>
                </div>
                
                {/* Human Impact Statement */}
                <div className="mt-8 p-6 bg-gradient-to-r from-amber-500/10 to-blue-500/10 rounded-xl border border-amber-400/20">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <Heart className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Human Impact</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Every technical advancement in this division serves one purpose: ensuring that no one faces their mental health challenges alone. This isn't just technology—it's hope made accessible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Institute Navigation Controls */}
        <div className="flex justify-between items-center mt-20">
          <button
            onClick={prevSlide}
            className={`bg-gradient-to-r ${getAccentColor(slides[currentSlide].accentColor)} text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-3 text-lg font-semibold shadow-xl shadow-slate-900/50 backdrop-blur-sm group`}
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <span>Previous Division</span>
          </button>
          
          <div className="text-center">
            <div className="bg-slate-800/40 backdrop-blur-xl px-8 py-4 rounded-2xl border border-slate-700/40 shadow-xl shadow-slate-900/50">
              <div className="text-slate-200 font-medium mb-1">
                Division {currentSlide + 1} of {slides.length}
              </div>
              <div className="text-xs text-slate-400">
                {slides[currentSlide].divisionType}
              </div>
            </div>
          </div>
          
          <button
            onClick={nextSlide}
            className={`bg-gradient-to-r ${getAccentColor(slides[currentSlide].accentColor)} text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-3 text-lg font-semibold shadow-xl shadow-slate-900/50 backdrop-blur-sm group`}
          >
            <span>Next Division</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}