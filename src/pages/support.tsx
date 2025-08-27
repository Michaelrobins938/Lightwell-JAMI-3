import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Search,
  BookOpen,
  FileText,
  Video,
  Users,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Star,
  ExternalLink,
  Zap,
  Shield,
  Heart,
  Target,
  Globe,
  Lightbulb,
  HeadphonesIcon,
  Sparkles,
  Activity,
  Brain,
  Award,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Play,
  Eye,
  UserCheck,
  RefreshCw,
  Layers,
  Headphones
} from 'lucide-react';
import Link from 'next/link';

const SupportHubCard = ({ 
  icon, 
  title, 
  description, 
  href, 
  delay,
  accentColor,
  stats
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  delay: number;
  accentColor: string;
  stats?: string;
}) => (
  <motion.div
    className="group relative overflow-hidden"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ 
      scale: 1.02, 
      y: -5,
    }}
  >
    <Link href={href} className="block">
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-800/40 backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-slate-900/30 relative overflow-hidden">
        {/* Ambient glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${accentColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 via-blue-500/50 to-purple-500/50 opacity-60" />
        
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${accentColor}/20 backdrop-blur-xl border border-slate-600/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
          {icon}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-slate-300 leading-relaxed mb-6 text-sm">
          {description}
        </p>
        
        {stats && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300 border border-slate-600/30">
              {stats}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-400 group-hover:text-amber-300 transition-colors">
            <span className="text-sm font-medium">Explore Hub</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="w-2 h-2 bg-amber-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  </motion.div>
);

const ContactChannel = ({ 
  icon, 
  title, 
  description, 
  action, 
  href, 
  delay,
  availability,
  responseTime,
  accentColor
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  href: string;
  delay: number;
  availability: string;
  responseTime: string;
  accentColor: string;
}) => (
  <motion.div
    className="group relative"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ 
      scale: 1.02, 
      y: -3,
    }}
  >
    <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/60 via-slate-700/60 to-slate-800/60 backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-slate-900/30 relative overflow-hidden h-full">
      {/* Ambient glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${accentColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accentColor}/20 backdrop-blur-xl border border-slate-600/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-slate-300 leading-relaxed mb-6 text-sm">
        {description}
      </p>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Availability:</span>
          <span className="text-slate-200 font-medium">{availability}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Response Time:</span>
          <span className="text-slate-200 font-medium">{responseTime}</span>
        </div>
      </div>
      
      <Link href={href}>
        <button className={`w-full bg-gradient-to-r ${accentColor} text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold flex items-center justify-center gap-2 group/btn`}>
          {action}
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </Link>
    </div>
  </motion.div>
);

const FAQItem = ({ 
  question, 
  answer, 
  delay,
  category 
}: {
  question: string;
  answer: string;
  delay: number;
  category: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-800/40 backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/50 transition-all duration-300">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block px-2 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-medium">
                  {category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
                {question}
              </h3>
            </div>
            <div className="flex-shrink-0">
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>
          </div>
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-slate-600/30 mt-4">
                <p className="text-slate-300 leading-relaxed text-sm">
                  {answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');

  const supportHubs = [
    {
      icon: <Brain className="w-8 h-8 text-blue-400" />,
      title: "AI Integration Hub",
      description: "Complete guides for implementing Jamie's therapeutic AI capabilities into your applications and workflows.",
      href: "/docs/integration",
      accentColor: "from-blue-500 to-indigo-500",
      stats: "15+ Integration Guides"
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      title: "Security & Privacy Center",
      description: "HIPAA compliance, encryption standards, and data protection protocols for therapeutic AI deployment.",
      href: "/docs/security",
      accentColor: "from-emerald-500 to-teal-500",
      stats: "100% HIPAA Compliant"
    },
    {
      icon: <Activity className="w-8 h-8 text-purple-400" />,
      title: "Crisis Response Training",
      description: "Advanced protocols for crisis detection, intervention systems, and emergency escalation procedures.",
      href: "/docs/crisis",
      accentColor: "from-purple-500 to-violet-500",
      stats: "24/7 Crisis Support"
    },
    {
      icon: <Users className="w-8 h-8 text-amber-400" />,
      title: "Community Research Hub",
      description: "Connect with mental health professionals, researchers, and developers building the future of therapy.",
      href: "/community",
      accentColor: "from-amber-500 to-orange-500",
      stats: "2,000+ Members"
    },
    {
      icon: <Video className="w-8 h-8 text-pink-400" />,
      title: "Video Learning Library",
      description: "Interactive demonstrations, case studies, and implementation tutorials from Lightwell experts.",
      href: "/learn",
      accentColor: "from-pink-500 to-rose-500",
      stats: "50+ Video Guides"
    },
    {
      icon: <Award className="w-8 h-8 text-cyan-400" />,
      title: "Certification Program",
      description: "Professional training and certification for therapeutic AI implementation and best practices.",
      href: "/certification",
      accentColor: "from-cyan-500 to-blue-500",
      stats: "Professional Certification"
    }
  ];

  const contactChannels = [
    {
      icon: <MessageCircle className="w-6 h-6 text-white" />,
      title: "Live Research Support",
      description: "Connect instantly with our AI research team for technical guidance and implementation support.",
      action: "Start Research Chat",
      href: "#live-chat",
      availability: "24/7",
      responseTime: "< 2 minutes",
      accentColor: "from-blue-500 to-indigo-500"
    },
    {
      icon: <Headphones className="w-6 h-6 text-white" />,
      title: "Clinical Advisory Line",
      description: "Speak with licensed mental health professionals about therapeutic AI best practices and ethics.",
      action: "Schedule Consultation",
      href: "/consultation",
      availability: "Mon-Fri, 8AM-8PM EST",
      responseTime: "Same day",
      accentColor: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Mail className="w-6 h-6 text-white" />,
      title: "Research Collaboration",
      description: "Partner with Lightwell on research initiatives, case studies, and therapeutic AI advancement.",
      action: "Submit Research Proposal",
      href: "/research-partnership",
      availability: "Business Hours",
      responseTime: "2-3 business days",
      accentColor: "from-purple-500 to-violet-500"
    }
  ];

  const faqs = [
    {
      question: "How does Jamie's memory system ensure therapeutic continuity?",
      answer: "Jamie utilizes advanced contextual memory networks that maintain therapeutic relationships across sessions. Each interaction builds upon previous conversations, ensuring personalized care that evolves with the user's progress.",
      category: "AI Memory"
    },
    {
      question: "What clinical frameworks does Jamie's therapeutic AI follow?",
      answer: "Jamie is trained on evidence-based therapeutic modalities including CBT, DBT, ACT, and trauma-informed care. Our AI follows established clinical protocols while adapting to individual user needs.",
      category: "Clinical Standards"
    },
    {
      question: "How does Lightwell handle crisis intervention and safety?",
      answer: "Our crisis detection algorithms monitor conversations for risk indicators and immediately escalate to human crisis counselors when needed. We maintain partnerships with crisis hotlines and emergency services.",
      category: "Crisis Support"
    },
    {
      question: "Can Jamie integrate with existing electronic health record systems?",
      answer: "Yes, Jamie supports HL7 FHIR standards and can integrate with major EHR platforms while maintaining strict HIPAA compliance and data sovereignty.",
      category: "Integration"
    },
    {
      question: "What makes Lightwell's approach to AI therapy unique?",
      answer: "Unlike chatbots, Jamie employs persistent memory, emotional intelligence, and adaptive therapeutic techniques. Our AI doesn't just respond—it builds genuine therapeutic relationships.",
      category: "Technology"
    },
    {
      question: "How do I measure the effectiveness of Jamie's therapeutic interventions?",
      answer: "Lightwell provides comprehensive analytics including mood tracking, engagement metrics, therapeutic goal progress, and standardized assessment integrations like PHQ-9 and GAD-7.",
      category: "Analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-x-hidden relative">
      {/* Enhanced background with multiple layers - "Light in the Darkness" theme */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-amber-500/10 via-blue-500/8 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-600/8 via-blue-600/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-600/5 via-amber-500/3 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/5 via-transparent to-transparent" />
        {/* Subtle warm light rays */}
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(251,191,36,0.03)_60deg,transparent_120deg,rgba(59,130,246,0.02)_180deg,transparent_240deg,rgba(251,191,36,0.03)_300deg,transparent_360deg)]" />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-noise-pattern mix-blend-overlay" />
      </div>

      {/* Lightwell Support Center Header */}
      <div className="relative bg-gradient-to-r from-slate-900/40 via-slate-800/40 to-slate-900/40 backdrop-blur-xl shadow-2xl border-b border-slate-700/30 overflow-hidden">
        {/* Ambient light effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-blue-500/5 to-purple-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto px-8 py-20 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div 
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-amber-400/40 rounded-2xl text-amber-300 text-sm font-semibold mb-8 shadow-2xl shadow-amber-500/20"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-center gap-1">
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">Clinical Excellence</span>
              </div>
              <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
              <span>Support Center</span>
              <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
              <span>24/7 Available</span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="bg-gradient-to-r from-amber-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Lightwell
              </span>
              {' '}Support
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Welcome to our comprehensive support ecosystem where therapeutic AI expertise meets human compassion. 
              Whether you're implementing Jamie for the first time or scaling enterprise mental health solutions, our{' '}
              <span className="relative inline-block text-amber-400 font-semibold">
                research-backed guidance
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
              </span>{' '}
              ensures your success in{' '}
              <span className="relative inline-block text-blue-400 font-semibold">
                transforming mental healthcare
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"></div>
              </span>
            </motion.p>

            {/* Enhanced Search */}
            <motion.div 
              className="max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search therapeutic AI documentation, guides, and research..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="px-3 py-1 bg-slate-700/50 rounded-lg text-xs text-slate-400 border border-slate-600/30">
                    ⌘K
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="bg-gradient-to-r from-slate-800/30 to-slate-700/30 backdrop-blur-xl px-8 py-4 rounded-2xl border border-slate-600/40 shadow-2xl shadow-slate-900/50">
                <span className="text-slate-200 font-medium">Expert Support • Research Collaboration • Clinical Guidance</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Support Hubs */}
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
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-slate-300 font-medium">Lightwell Research Centers</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Knowledge
              </span>
              {' '}Hubs
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Specialized research centers designed to accelerate your therapeutic AI implementation 
              and ensure clinical excellence at every step
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportHubs.map((hub, index) => (
              <SupportHubCard
                key={hub.title}
                icon={hub.icon}
                title={hub.title}
                description={hub.description}
                href={hub.href}
                delay={index * 0.1}
                accentColor={hub.accentColor}
                stats={hub.stats}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Channels */}
      <section className="relative py-24 bg-gradient-to-r from-slate-900/60 via-slate-800/60 to-slate-900/60 backdrop-blur-xl border-y border-slate-700/30">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/30 rounded-full border border-slate-600/30 mb-6">
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-slate-300 font-medium">Expert Human Support</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Direct
              </span>
              {' '}Connection
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Connect with our clinical experts, AI researchers, and implementation specialists 
              for personalized guidance on your therapeutic AI journey
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactChannels.map((channel, index) => (
              <ContactChannel
                key={channel.title}
                icon={channel.icon}
                title={channel.title}
                description={channel.description}
                action={channel.action}
                href={channel.href}
                delay={index * 0.1}
                availability={channel.availability}
                responseTime={channel.responseTime}
                accentColor={channel.accentColor}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Support Metrics */}
      <section className="relative py-20">
        {/* Subtle light beams */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,_var(--tw-gradient-stops))] from-amber-500/3 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,_var(--tw-gradient-stops))] from-blue-500/2 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Clock className="w-6 h-6 text-blue-400" />,
                value: "< 2 min",
                label: "Average Response Time",
                color: "from-blue-500 to-indigo-500"
              },
              {
                icon: <UserCheck className="w-6 h-6 text-emerald-400" />,
                value: "98.7%",
                label: "Resolution Rate",
                color: "from-emerald-500 to-teal-500"
              },
              {
                icon: <Globe className="w-6 h-6 text-purple-400" />,
                value: "24/7",
                label: "Crisis Support",
                color: "from-purple-500 to-violet-500"
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
                value: "4.9/5",
                label: "Support Satisfaction",
                color: "from-amber-500 to-orange-500"
              }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/40"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.color}/20 flex items-center justify-center mx-auto mb-4`}>
                  {metric.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm text-slate-400">{metric.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 bg-gradient-to-r from-slate-900/40 via-slate-800/40 to-slate-900/40 backdrop-blur-xl border-y border-slate-700/30">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/30 rounded-full border border-slate-600/30 mb-6">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300 font-medium">Expert Knowledge Base</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Research
              </span>
              {' '}Insights
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Advanced therapeutic AI implementation guidance from our clinical research team 
              and mental health professionals
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                delay={index * 0.1}
                category={faq.category}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24">
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
                Ready to Transform Mental Healthcare?
              </h2>
              
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join the mental health revolution with Lightwell's therapeutic AI. 
                Our expert team is here to guide your implementation every step of the way.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/get-started">
                  <button className="bg-gradient-to-r from-amber-500 to-blue-500 text-white px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-3 group">
                    Start Implementation
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/research">
                  <button className="border border-slate-600/50 text-slate-200 hover:bg-slate-800/50 px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm">
                    Explore Research
                  </button>
                </Link>
              </div>
              
              <div className="mt-8 text-center">
                <span className="text-sm text-slate-400 italic">
                  "Because every person deserves access to compassionate, intelligent mental health support"
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}