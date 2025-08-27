import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { 
  ArrowRight, 
  Play, 
  Pause, 
  Volume2, 
  Heart, 
  Brain, 
  Shield, 
  Zap, 
  Users, 
  BookOpen, 
  Clock, 
  Star, 
  MessageCircle, 
  Activity, 
  Award, 
  Globe,
  Lightbulb,
  Sparkles,
  Eye,
  Lock,
  UserCheck,
  TrendingUp,
  Mic,
  MicOff,
  Headphones,
  Layers,
  ChevronDown,
  ChevronRight,
  Quote,
  CheckCircle,
  Target,
  Compass,
  PauseCircle,
  PlayCircle
} from 'lucide-react';

import { NarratorOrbComponent } from '../components/visuals/NarratorOrb';
import LiveMemoryStream from '../components/memory/LiveMemoryStream';
import { ParallaxSection } from '../hooks/useParallax';
import { fadeUp, staggerParent, scaleInSpring, floatLoop, parallaxSlow, orbBreathing } from '../utils/animations';

const CapabilityCard = ({ 
  icon, 
  title, 
  description, 
  features,
  color,
  delay 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  color: string;
  delay: number;
}) => (
  <motion.div
    className="group"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02, y: -5 }}
  >
    <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-500 group-hover:shadow-2xl group-hover:bg-white/15 relative overflow-hidden h-full" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
      {/* Ambient glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50 opacity-60" />
      
      <div className={`w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-white/80 leading-relaxed mb-6 text-sm">
        {description}
      </p>
      
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span className="text-white/90 text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const StatCard = ({ 
  number, 
  label, 
  description,
  icon,
  color,
  delay 
}: {
  number: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
}) => (
  <motion.div
    className="text-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05 }}
    variants={floatLoop}
    animate="animate"
  >
    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/50 transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color}/20 flex items-center justify-center mx-auto mb-4`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{number}</div>
      <div className="text-sm text-slate-300 font-medium mb-1">{label}</div>
      <div className="text-xs text-slate-400">{description}</div>
    </div>
  </motion.div>
);

const InteractiveDemo = ({ 
  title, 
  description, 
  isActive,
  onToggle,
  children 
}: {
  title: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <motion.div
    className="group"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/60 via-slate-700/60 to-slate-800/60 backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/50 transition-all duration-500 relative overflow-hidden">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 via-blue-500/50 to-purple-500/50 opacity-60" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-300 text-sm">{description}</p>
          </div>
          <button
            onClick={onToggle}
            className={`p-3 rounded-xl transition-all duration-300 ${
              isActive 
                ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-400' 
                : 'bg-slate-700/50 border border-slate-600/30 text-slate-400 hover:bg-slate-600/50'
            }`}
          >
            {isActive ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
          </button>
        </div>
        
        <div className="min-h-[200px]">
          {children}
        </div>
      </div>
    </div>
  </motion.div>
);

const MeetJamie: React.FC = () => {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [emotionalState] = useState({
    state: 'calm',
    intensity: 5
  });

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const capabilities = [
    {
      icon: <Brain className="w-8 h-8 text-blue-400" />,
      title: 'Clinical Intelligence',
      description: 'Advanced therapeutic AI trained on evidence-based methodologies with continuous learning from clinical interactions.',
      features: [
        'DSM-5 diagnostic frameworks',
        'CBT, DBT, ACT protocols',
        'Trauma-informed approaches',
        'Real-time clinical assessment'
      ],
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-400" />,
      title: 'Emotional Intelligence',
      description: 'Sophisticated emotion recognition and empathetic response generation that adapts to your unique emotional patterns.',
      features: [
        'Real-time emotion analysis',
        'Contextual empathy modeling',
        'Adaptive response generation',
        'Emotional pattern learning'
      ],
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      title: 'Crisis Detection',
      description: 'Advanced safety monitoring with immediate intervention capabilities and seamless escalation to human professionals.',
      features: [
        '24/7 crisis monitoring',
        'Risk assessment algorithms',
        'Immediate escalation protocols',
        'Human therapist handoffs'
      ],
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: <Layers className="w-8 h-8 text-purple-400" />,
      title: 'Persistent Memory',
      description: 'Revolutionary memory architecture that builds deep understanding of your therapeutic journey over time.',
      features: [
        'Session continuity',
        'Progress tracking',
        'Pattern recognition',
        'Personalized interventions'
      ],
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: <Users className="w-8 h-8 text-cyan-400" />,
      title: 'Human Collaboration',
      description: 'Seamless integration with human therapists, maintaining continuity of care while enhancing therapeutic outcomes.',
      features: [
        'Therapist collaboration tools',
        'Care coordination',
        'Progress reporting',
        'Treatment plan integration'
      ],
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: <BookOpen className="w-8 h-8 text-amber-400" />,
      title: 'Evidence-Based',
      description: 'Every response grounded in peer-reviewed research, clinical best practices, and proven therapeutic methodologies.',
      features: [
        'Research-backed interventions',
        'Clinical validation',
        'Outcome measurement',
        'Continuous improvement'
      ],
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const stats = [
    { 
      number: '99.9%', 
      label: 'Uptime', 
      icon: <Clock className="w-6 h-6 text-blue-400" />, 
      description: 'Always available',
      color: 'from-blue-500 to-indigo-500'
    },
    { 
      number: '60+', 
      label: 'Countries', 
      icon: <Globe className="w-6 h-6 text-emerald-400" />, 
      description: 'Global access',
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      number: '24/7', 
      label: 'Availability', 
      icon: <Activity className="w-6 h-6 text-purple-400" />, 
      description: 'Round-the-clock',
      color: 'from-purple-500 to-violet-500'
    },
    { 
      number: 'HIPAA', 
      label: 'Compliant', 
      icon: <Shield className="w-6 h-6 text-amber-400" />, 
      description: 'Privacy secured',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black text-white overflow-x-hidden relative">
      
      {/* GPT-5 Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#ff6b9d] via-[#c44cff] via-[#7c3aed] via-[#3b82f6] to-[#06b6d4] animate-gradient-beam pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-tr from-[#fbbf24] via-[#f97316] via-[#dc2626] to-[#be185d] opacity-70 mix-blend-multiply pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-pink-500/8 via-purple-500/6 to-orange-500/8 mix-blend-screen pointer-events-none" />
      <div className="fixed inset-0 bg-black/6 backdrop-blur-sm pointer-events-none" />

      {/* Hero Section */}
      <section id="hero" className="h-screen snap-start relative bg-white/5 backdrop-blur-xl border-b border-white/10 overflow-hidden flex items-center justify-center z-10">
        
        <div className="max-w-6xl mx-auto px-8 py-20 relative z-10">
          <motion.div 
            className="text-center"
            variants={staggerParent}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 text-sm font-semibold mb-8"
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
              variants={scaleInSpring}
            >
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Clinical Grade</span>
              </div>
              <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
              <span>DSM-5 Trained</span>
              <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
              <span>Crisis Detection</span>
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              <span>HIPAA Compliant</span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-extralight mb-8 tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Meet{' '}
              <div className="relative inline-block">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                  JAMI-3
                </span>
              </div>
            </motion.h1>
            
            <motion.div 
              className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Your therapeutic AI companion powered by Lightwell's breakthrough research in{' '}
              <span className="relative inline-block text-purple-300 font-semibold">
                emotional intelligence
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent"></div>
              </span>{' '}
              and{' '}
              <span className="relative inline-block text-pink-300 font-semibold">
                persistent memory systems
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-400/60 to-transparent"></div>
              </span>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <button
                onClick={() => router.push('/chat')}
                className="bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/20 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-3 group"
                style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}
              >
                <MessageCircle className="w-5 h-5" />
                Start Therapy Session
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push('/showcase')}
                className="border border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-md flex items-center gap-3"
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
              >
                <Star className="w-5 h-5" />
                See How It Works
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* JAMI-3 Orb Demo Section */}
      <section id="consciousness" className="h-screen snap-start relative flex items-center justify-center overflow-hidden">
        {/* Parallax floating orbs */}
        <ParallaxSection speed={-0.2}>
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-blue-400/4 rounded-full blur-3xl" />
        </ParallaxSection>
        
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-amber-400/40 rounded-2xl text-amber-300 text-sm font-semibold mb-8 shadow-2xl shadow-amber-500/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 font-semibold">Interactive Demo</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-amber-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                JAMI-3's
              </span>
              {' '}
              <span className="text-white">Consciousness</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed font-light">
              Watch JAMI-3's neural activity in real-time as she processes emotions, 
              analyzes therapeutic needs, and generates personalized responses
            </p>
          </motion.div>

          {/* Main JAMI-3 Orb - Hero Element */}
          <motion.div 
            className="relative mb-16 flex justify-center items-center min-h-[600px]"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {/* Enhanced ambient glow - larger and more prominent */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-purple-500/20 blur-[200px] scale-[2] animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/15 via-blue-400/15 to-purple-400/15 blur-[120px] scale-[1.8]" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300/10 via-blue-300/10 to-purple-300/10 blur-[80px] scale-[1.5]" />
            
            {/* The Orb - Much larger and more prominent */}
            <motion.div 
              className="relative w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[700px] xl:h-[700px] transition-all duration-700 flex items-center justify-center"
              variants={orbBreathing}
              animate="animate"
            >
              {isClient ? (
                <div className="w-full h-full relative">
                  <NarratorOrbComponent 
                    isVisible={true}
                    audioLevel={isPlaying ? 0.6 : 0.3}
                    intensity={emotionalState.intensity / 10}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 via-blue-500 to-purple-500 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 bg-white/80 rounded-full animate-pulse" />
                </div>
              )}
            </motion.div>

            {/* Advanced capability indicators - positioned for larger orb */}
            <motion.div 
              className="absolute top-8 right-8 lg:top-12 lg:right-12 xl:top-16 xl:right-16 bg-blue-500/90 backdrop-blur-sm rounded-xl px-4 py-3 text-white text-sm font-medium shadow-xl"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-blue-100">THERAPEUTIC ANALYSIS</span>
              </div>
              <div className="text-xs text-white/90">Processing emotional patterns</div>
            </motion.div>

            <motion.div 
              className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12 xl:bottom-16 xl:left-16 bg-purple-500/90 backdrop-blur-sm rounded-xl px-4 py-3 text-white text-sm font-medium shadow-xl"
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-xs text-purple-100">CRISIS MONITORING</span>
              </div>
              <div className="text-xs text-white/90">Real-time safety assessment</div>
            </motion.div>

            <motion.div 
              className="absolute top-1/2 left-8 lg:left-12 xl:left-16 transform -translate-y-1/2 bg-emerald-500/90 backdrop-blur-sm rounded-xl px-4 py-3 text-white text-sm font-medium shadow-xl"
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 2.5, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-100">MEMORY FORMATION</span>
              </div>
              <div className="text-xs text-white/90">Building therapeutic context</div>
            </motion.div>

            <motion.div 
              className="absolute top-1/2 right-8 lg:right-12 xl:right-16 transform -translate-y-1/2 bg-amber-500/90 backdrop-blur-sm rounded-xl px-4 py-3 text-white text-sm font-medium shadow-xl"
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse" />
                <span className="text-xs text-amber-100">NEURAL PROCESSING</span>
              </div>
              <div className="text-xs text-white/90">Active learning pathways</div>
            </motion.div>
          </motion.div>

          {/* Technology explanation */}
          <motion.div
            className="text-center mb-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <p className="text-slate-200 text-xl mb-6 font-light">
              The world's first <span className="text-amber-400 font-semibold">therapeutic consciousness visualization</span>
            </p>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Each particle represents neural pathways processing your emotions, voice patterns, and therapeutic needs. 
              As you interact with JAMI-3, her consciousness visualizes in real-time—showing emotional analysis, 
              memory formation, and therapeutic response generation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section id="capabilities" className="h-screen snap-start relative flex items-center justify-center bg-gradient-to-r from-slate-900/60 via-slate-800/60 to-slate-900/60 backdrop-blur-xl border-y border-slate-700/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/30 rounded-full border border-slate-600/30 mb-6">
              <Brain className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300 font-medium">Therapeutic Capabilities</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                Clinical
              </span>
              {' '}Excellence
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              JAMI-3 combines cutting-edge AI research with proven therapeutic methodologies, 
              creating an unprecedented level of personalized mental healthcare
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <CapabilityCard
                key={index}
                icon={capability.icon}
                title={capability.title}
                description={capability.description}
                features={capability.features}
                color={capability.color}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Live Memory Demo */}
      <section id="memory" className="h-screen snap-start relative flex items-center justify-center overflow-hidden">
        {/* Subtle light beams */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,_var(--tw-gradient-stops))] from-amber-500/3 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,_var(--tw-gradient-stops))] from-blue-500/2 via-transparent to-transparent" />
        
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/30 rounded-full border border-slate-600/30 mb-6">
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-300 font-medium">Memory System</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-500 bg-clip-text text-transparent">
                Watch JAMI-3
              </span>
              {' '}Learn
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              See JAMI-3's revolutionary memory system in action as she creates, stores, and uses 
              therapeutic insights to provide increasingly personalized care
            </p>
          </motion.div>

          <InteractiveDemo
            title="Live Memory Formation"
            description="Watch JAMI-3 create and access memories in real-time during therapeutic interactions"
            isActive={activeDemo === 'memory'}
            onToggle={() => setActiveDemo(activeDemo === 'memory' ? null : 'memory')}
          >
            {activeDemo === 'memory' && (
              <LiveMemoryStream 
                userId="demo-user-123" 
                isActive={true}
                onMemoryEvent={(event) => {
                  console.log('Memory event:', event);
                }}
              />
            )}
            {activeDemo !== 'memory' && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">Click play to see JAMI-3's memory system in action</p>
                </div>
              </div>
            )}
          </InteractiveDemo>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              <strong>This is real science, not marketing.</strong> JAMI-3's memory system creates persistent, 
              searchable knowledge about your emotional patterns, therapeutic progress, and personal growth. 
              Every interaction builds a comprehensive understanding that makes each response more personalized and effective.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section id="standards" className="h-screen snap-start relative flex items-center justify-center bg-gradient-to-r from-slate-900/40 via-slate-800/40 to-slate-900/40 backdrop-blur-xl border-y border-slate-700/30 overflow-hidden">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/30 rounded-full border border-slate-600/30 mb-6">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-300 font-medium">Trust & Security</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Clinical
              </span>
              {' '}Standards
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              JAMI-3 meets the highest standards for therapeutic AI, ensuring your privacy, 
              safety, and clinical effectiveness
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                number={stat.number}
                label={stat.label}
                description={stat.description}
                icon={stat.icon}
                color={stat.color}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta" className="h-screen snap-start relative flex items-center justify-center overflow-hidden">
        {/* Warm concluding light */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/3 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/4 via-blue-500/2 to-transparent" />
        
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-800/60 via-slate-700/60 to-slate-800/60 backdrop-blur-2xl rounded-3xl p-12 border border-slate-700/40 shadow-2xl shadow-slate-900/50 relative overflow-hidden"
          >
            {/* Ambient effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-blue-500/5 to-purple-500/5" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 via-blue-500/50 to-purple-500/50" />
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-2xl border border-amber-400/30">
                  <Sparkles className="w-8 h-8 text-amber-400" />
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Meet JAMI-3?
              </h2>
              
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Experience the future of mental healthcare. JAMI-3 is ready to begin your therapeutic 
                journey with personalized, evidence-based support available 24/7.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => router.push('/chat')}
                  className="bg-gradient-to-r from-amber-500 to-blue-500 text-white px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-3 group"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Your Session
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push('/about')}
                  className="border border-slate-600/50 text-slate-200 hover:bg-slate-800/50 px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm"
                >
                  Learn More
                </button>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Available 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span>Crisis Support</span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <span className="text-sm text-slate-400 italic">
                  "Your journey to healing begins with a single conversation"
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MeetJamie;