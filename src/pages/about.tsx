import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Shield, 
  Users, 
  Star, 
  Clock, 
  Globe, 
  Zap, 
  Award, 
  BookOpen, 
  Smile, 
  Target, 
  ArrowRight, 
  CheckCircle, 
  Eye, 
  Lock, 
  Lightbulb,
  Sparkles,
  Activity,
  TrendingUp,
  Microscope,
  Beaker,
  Layers,
  Compass,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Play,
  Building,
  Briefcase,
  GraduationCap,
  Coffee,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Quote
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ServiceWaiver } from '../components/legal/ServiceWaiver';

const StoryMilestone = ({ 
  year, 
  title, 
  description, 
  impact,
  delay 
}: {
  year: string;
  title: string;
  description: string;
  impact: string;
  delay: number;
}) => (
  <motion.div
    className="group relative"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
  >
    <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-500 group-hover:shadow-2xl group-hover:bg-white/15 relative overflow-hidden" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50 opacity-60" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/25">
            <Calendar className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{year}</div>
            <div className="text-purple-300 font-semibold">{title}</div>
          </div>
        </div>
        
        <p className="text-white/80 leading-relaxed mb-4 text-sm">
          {description}
        </p>
        
        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-medium text-pink-400">Impact</span>
          </div>
          <p className="text-white/90 text-sm font-medium">{impact}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const ResearchArea = ({ 
  icon, 
  title, 
  description, 
  achievements,
  color,
  delay 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  achievements: string[];
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
    <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-800/40 backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-slate-900/30 relative overflow-hidden h-full">
      {/* Ambient glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 via-blue-500/50 to-purple-500/50 opacity-60" />
      
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color}/20 backdrop-blur-xl border border-slate-600/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-slate-300 leading-relaxed mb-6 text-sm">
        {description}
      </p>
      
      <div className="space-y-2">
        {achievements.map((achievement, index) => (
          <div key={index} className="flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div className="text-slate-200 text-sm">{achievement}</div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const TeamMember = ({ 
  name, 
  role, 
  expertise,
  image,
  delay 
}: {
  name: string;
  role: string;
  expertise: string;
  image: string;
  delay: number;
}) => (
  <motion.div
    className="group text-center"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-800/40 backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-slate-900/30 relative overflow-hidden">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-blue-500 to-purple-500 p-1 mx-auto mb-4">
          <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
            <span className="text-white font-bold text-xl">{name.charAt(0)}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
        <p className="text-amber-400 font-medium text-sm mb-2">{role}</p>
        <p className="text-slate-300 text-xs">{expertise}</p>
      </div>
    </div>
  </motion.div>
);

const ValueCard = ({ 
  icon, 
  title, 
  description,
  color,
  delay 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}) => (
  <motion.div
    className="group"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05, y: -5 }}
  >
    <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-500 group-hover:shadow-2xl group-hover:bg-white/15 relative overflow-hidden text-center" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50 opacity-60" />
      
      <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 mx-auto shadow-lg">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-white/80 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  </motion.div>
);

export default function About() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showServiceWaiver, setShowServiceWaiver] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const researchAreas = [
    {
      icon: <Brain className="w-8 h-8 text-blue-400" />,
      title: "Cognitive Architecture",
      description: "Developing advanced neural networks that understand and respond to human emotions with unprecedented accuracy and empathy.",
      achievements: [
        "90%+ accuracy in emotion detection",
        "Real-time contextual understanding",
        "Adaptive learning algorithms"
      ],
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      title: "Crisis Intervention",
      description: "Pioneering AI systems for immediate crisis detection and response, ensuring no one faces their darkest moments alone.",
      achievements: [
        "24/7 crisis monitoring",
        "Instant escalation protocols",
        "99.7% uptime reliability"
      ],
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-400" />,
      title: "Therapeutic Innovation",
      description: "Creating AI that doesn't just understand mental health—it actively participates in the healing journey with proven therapeutic techniques.",
      achievements: [
        "Evidence-based interventions",
        "Personalized therapy plans",
        "Measurable outcome tracking"
      ],
      color: "from-pink-500 to-rose-500"
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Clinical Officer",
      expertise: "Clinical Psychology, AI Ethics",
      image: "/team/sarah.jpg"
    },
    {
      name: "Marcus Rodriguez",
      role: "Lead AI Researcher",
      expertise: "Machine Learning, NLP",
      image: "/team/marcus.jpg"
    },
    {
      name: "Dr. Amara Okafor",
      role: "Director of Research",
      expertise: "Cognitive Science, Therapy",
      image: "/team/amara.jpg"
    },
    {
      name: "James Liu",
      role: "Head of Engineering",
      expertise: "Distributed Systems, Security",
      image: "/team/james.jpg"
    }
  ];

  const faqs = [
    {
      question: "What makes Lightwell's approach to AI therapy unique?",
      answer: "Unlike traditional chatbots, Jamie employs persistent memory, emotional intelligence, and adaptive therapeutic techniques. Our AI doesn't just respond—it builds genuine therapeutic relationships that evolve with each interaction."
    },
    {
      question: "How does Lightwell ensure the safety and ethics of AI therapy?",
      answer: "We have a dedicated clinical ethics board, licensed mental health professionals overseeing our AI development, and strict protocols for crisis intervention. Every aspect of Jamie's responses is grounded in evidence-based therapeutic practices."
    },
    {
      question: "What research validates Lightwell's therapeutic AI effectiveness?",
      answer: "Our research partnerships with leading academic institutions have demonstrated significant improvements in user wellbeing metrics, with peer-reviewed studies showing comparable outcomes to traditional therapy for many conditions."
    },
    {
      question: "How does Lightwell protect user privacy and confidentiality?",
      answer: "We employ end-to-end encryption, zero-knowledge architecture, and strict HIPAA compliance. Your therapeutic conversations are protected with the same confidentiality standards as traditional therapy."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* GPT-5 Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#ff6b9d] via-[#c44cff] via-[#7c3aed] via-[#3b82f6] to-[#06b6d4] animate-gradient-beam pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-tr from-[#fbbf24] via-[#f97316] via-[#dc2626] to-[#be185d] opacity-70 mix-blend-multiply pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-pink-500/8 via-purple-500/6 to-orange-500/8 mix-blend-screen pointer-events-none" />
      <div className="fixed inset-0 bg-black/6 backdrop-blur-sm pointer-events-none" />

      {/* Hero Section */}
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
              <span>Our Story</span>
              <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
              <span>Research Driven</span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-extralight mb-8 tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              About{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                Lightwell
              </span>
            </motion.h1>
            
            <motion.div 
              className="text-lg md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              We are pioneering the future of mental healthcare through advanced therapeutic AI research. 
              At Lightwell Studios, our mission is to{' '}
              <div className="relative inline-block text-purple-300 font-semibold">
                illuminate the path to healing
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent"></div>
              </div>{' '}
              for every person who needs support, ensuring that{' '}
              <div className="relative inline-block text-pink-300 font-semibold">
                no one faces darkness alone
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-400/60 to-transparent"></div>
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link href="/meet-jamie">
                <button className="bg-gradient-to-r from-amber-500 to-blue-500 text-white px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-3 group">
                  Experience AI
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/research">
                <button className="border border-slate-600/50 text-slate-200 hover:bg-slate-800/50 px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm">
                  Our Research
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mission & Values */}
      <section className="relative py-24">
        {/* Floating light orbs */}
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-blue-400/4 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/30 rounded-full border border-slate-600/30 mb-6">
              <Compass className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-slate-300 font-medium">Our Foundation</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Guided by
              </span>
              {' '}Purpose
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Every breakthrough at Lightwell is driven by our unwavering commitment to 
              transforming mental healthcare through compassionate, intelligent technology
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-8 h-8 text-pink-400" />,
                title: "Compassionate Innovation",
                description: "We develop technology that doesn't just understand symptoms—it recognizes the human experience behind them, responding with genuine empathy and care.",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: <Shield className="w-8 h-8 text-emerald-400" />,
                title: "Ethical Excellence",
                description: "Every feature we build is guided by the highest ethical standards, ensuring AI therapy serves humanity with integrity, safety, and respect.",
                color: "from-emerald-500 to-teal-500"
              },
              {
                icon: <Globe className="w-8 h-8 text-blue-400" />,
                title: "Universal Access",
                description: "Mental health support shouldn't be a privilege. We're breaking down barriers to ensure therapeutic AI reaches everyone who needs it, everywhere.",
                color: "from-blue-500 to-indigo-500"
              }
            ].map((value, index) => (
              <ValueCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
                color={value.color}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="relative py-24 bg-gradient-to-r from-slate-900/60 via-slate-800/60 to-slate-900/60 backdrop-blur-xl border-y border-slate-700/30">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
              <Microscope className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white/90 font-medium">Research Excellence</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extralight mb-6 tracking-wide">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                Scientific
              </span>
              {' '}Frontiers
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Our research divisions are pushing the boundaries of what's possible in AI therapy, 
              creating breakthroughs that transform how we approach mental healthcare
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {researchAreas.map((area, index) => (
              <ResearchArea
                key={index}
                icon={area.icon}
                title={area.title}
                description={area.description}
                achievements={area.achievements}
                color={area.color}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="relative py-24">
        {/* Subtle light beams */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,_var(--tw-gradient-stops))] from-amber-500/3 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,_var(--tw-gradient-stops))] from-blue-500/2 via-transparent to-transparent" />
        
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/30 rounded-full border border-slate-600/30 mb-6">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-slate-300 font-medium">Our Journey</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                The Story
              </span>
              {' '}Behind Lightwell
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              From a shared vision to transform mental healthcare to breakthrough innovations 
              that are changing lives worldwide—discover how Lightwell is illuminating the path forward
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                year: "2023",
                title: "The Vision Emerges",
                description: "Founded by a team of clinical psychologists, AI researchers, and engineers who witnessed the mental health crisis firsthand and knew technology could bridge the gap between need and access.",
                impact: "Secured initial research funding and established clinical advisory board"
              },
              {
                year: "2024",
                title: "Breakthrough Research",
                description: "Achieved groundbreaking advances in AI empathy modeling and therapeutic response generation, publishing peer-reviewed research that redefined the possibilities of AI-assisted mental healthcare.",
                impact: "Published 5 peer-reviewed papers, established academic partnerships"
              },
              {
                year: "2024",
                title: "Jamie's Birth",
                description: "After thousands of hours of development and clinical testing, Jamie became the world's first therapeutic AI with persistent memory, emotional intelligence, and genuine therapeutic capabilities.",
                impact: "Successfully completed clinical trials with 95% user satisfaction"
              },
              {
                year: "2025",
                title: "Global Impact",
                description: "Lightwell Studios opened its doors to users worldwide, democratizing access to high-quality mental health support and establishing new standards for AI therapy ethics and effectiveness.",
                impact: "Serving 100,000+ users across 50+ countries with 24/7 support"
              }
            ].map((milestone, index) => (
              <StoryMilestone
                key={index}
                year={milestone.year}
                title={milestone.title}
                description={milestone.description}
                impact={milestone.impact}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="relative py-24 bg-gradient-to-r from-slate-900/40 via-slate-800/40 to-slate-900/40 backdrop-blur-xl border-y border-slate-700/30">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/90 font-medium">Leadership Team</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extralight mb-6 tracking-wide">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                Visionary
              </span>
              {' '}Leaders
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Meet the experts, clinicians, and innovators who are pioneering the future of AI therapy 
              and ensuring every breakthrough serves humanity's wellbeing
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                expertise={member.expertise}
                image={member.image}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24">
        {/* Warm concluding light */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/3 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/30 rounded-full border border-slate-600/30 mb-6">
              <Quote className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300 font-medium">Common Questions</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Understanding
              </span>
              {' '}Lightwell
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Learn more about our approach, research, and commitment to advancing 
              mental healthcare through responsible AI innovation
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-800/40 backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/50 transition-all duration-300">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        {expandedFaq === index ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-slate-600/30 mt-4">
                          <p className="text-slate-300 leading-relaxed text-sm">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-slate-900/60 via-slate-800/60 to-slate-900/60 backdrop-blur-xl border-t border-slate-700/30">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 relative overflow-hidden"
            style={{ boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}
          >
            {/* Ambient effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50" />
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/25">
                  <Sparkles className="w-8 h-8 text-purple-300" />
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-extralight text-white mb-6 tracking-wide">
                Experience the <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">Lightwell</span> Difference
              </h2>
              
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join the thousands who have found hope, healing, and support through our 
                groundbreaking therapeutic AI. Your journey to better mental health starts here.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button 
                  onClick={() => setShowServiceWaiver(true)}
                  className="bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/20 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-3 group"
                  style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}
                >
                  Try AI Therapy Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link href="/features">
                  <button className="border border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-md"
                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                    Explore Features
                  </button>
                </Link>
              </div>
              
              <div className="mt-8 text-center">
                <span className="text-sm text-white/60 italic">
                  "Every breakthrough begins with the belief that healing is possible"
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Waiver Modal */}
      <AnimatePresence>
        {showServiceWaiver && (
          <ServiceWaiver
            onWaiverSigned={async (waiverData) => {
              try {
                // Store waiver data in localStorage
                localStorage.setItem('serviceWaiver', JSON.stringify(waiverData));
                
                // Close the waiver modal
                setShowServiceWaiver(false);
                
                // Redirect to signup page
                window.location.href = '/signup';
              } catch (error) {
                console.error('Error processing waiver:', error);
                alert('There was an error processing your waiver. Please try again.');
              }
            }}
            onClose={() => setShowServiceWaiver(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}