import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  BookOpen, 
  Code, 
  Users, 
  Heart, 
  Target, 
  MessageCircle, 
  Shield,
  ArrowRight,
  Clock,
  Star,
  ExternalLink,
  Video,
  FileText,
  Zap,
  Globe,
  Lock,
  Settings,
  Database,
  Cpu,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';

const TutorialCard = ({ 
  icon, 
  title, 
  description, 
  duration, 
  difficulty, 
  category,
  href,
  delay 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  category: string;
  href: string;
  delay: number;
}) => (
  <motion.div
    className="p-6 rounded-2xl bg-luna-800/40 backdrop-blur-xl border border-luna-700/50 hover:border-luna-500/30 transition-all duration-300 group"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ 
      scale: 1.02, 
      y: -5,
      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)'
    }}
  >
    <Link href={href} className="block">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-luna-500 to-luna-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
            difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {difficulty}
          </span>
        </div>
      </div>
      <div className="mb-4">
        <span className="inline-block px-2 py-1 bg-luna-700/50 text-luna-300 text-xs rounded-full mb-2">
          {category}
        </span>
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-luna-300 transition-colors">
          {title}
        </h3>
        <p className="text-luna-300 leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex items-center justify-between text-sm text-luna-400">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </Link>
  </motion.div>
);

const FeaturedTutorial = ({ 
  title, 
  description, 
  duration, 
  difficulty, 
  href,
  delay 
}: {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  href: string;
  delay: number;
}) => (
  <motion.div
    className="p-8 rounded-2xl bg-gradient-to-br from-luna-600/20 to-luna-500/20 backdrop-blur-xl border border-luna-600/50 hover:border-luna-500/30 transition-all duration-300 group"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ 
      scale: 1.02, 
      y: -5,
      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)'
    }}
  >
    <Link href={href} className="block">
      <div className="flex items-start justify-between mb-6">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-luna-500 to-luna-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Play className="w-8 h-8 text-white" />
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
            {difficulty}
          </span>
        </div>
      </div>
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-luna-700/50 text-luna-300 text-sm rounded-full mb-3">
          Featured Tutorial
        </span>
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-luna-300 transition-colors">
          {title}
        </h3>
        <p className="text-luna-200 leading-relaxed text-lg mb-4">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-luna-300">
            <Clock className="w-5 h-5" />
            <span className="text-lg">{duration}</span>
          </div>
          <ArrowRight className="w-6 h-6 text-luna-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </Link>
  </motion.div>
);

export default function Tutorials() {
  const featuredTutorial = {
    title: "Building Your First Luna AI Integration",
    description: "Learn how to integrate Luna AI into your application with this comprehensive step-by-step guide. From initial setup to advanced features, this tutorial covers everything you need to know.",
    duration: "45 minutes",
    difficulty: "Beginner",
    href: "#first-integration"
  };

  const tutorialCategories = [
    {
      title: "Getting Started",
      description: "Essential tutorials for beginners",
      items: [
        {
          icon: <Play className="w-6 h-6 text-white" />,
          title: "Quick Start with Luna AI",
          description: "Get up and running with Luna AI in under 10 minutes",
          duration: "10 minutes",
          difficulty: "Beginner",
          category: "Setup",
          href: "#quick-start"
        },
        {
          icon: <Settings className="w-6 h-6 text-white" />,
          title: "Basic Configuration",
          description: "Configure Luna AI for your specific use case",
          duration: "15 minutes",
          difficulty: "Beginner",
          category: "Configuration",
          href: "#basic-config"
        },
        {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "User Authentication",
          description: "Implement secure user authentication with Luna AI",
          duration: "20 minutes",
          difficulty: "Beginner",
          category: "Security",
          href: "#auth"
        }
      ]
    },
    {
      title: "Core Features",
      description: "Master Luna's main capabilities",
      items: [
        {
          icon: <MessageCircle className="w-6 h-6 text-white" />,
          title: "AI Chat Implementation",
          description: "Build a complete AI chat interface with Luna",
          duration: "30 minutes",
          difficulty: "Intermediate",
          category: "Integration",
          href: "#ai-chat"
        },
        {
          icon: <Heart className="w-6 h-6 text-white" />,
          title: "Mood Tracking System",
          description: "Create a comprehensive mood tracking application",
          duration: "25 minutes",
          difficulty: "Intermediate",
          category: "Analytics",
          href: "#mood-tracking"
        },
        {
          icon: <Target className="w-6 h-6 text-white" />,
          title: "Goal Setting & Progress",
          description: "Implement goal tracking and progress monitoring",
          duration: "35 minutes",
          difficulty: "Intermediate",
          category: "Features",
          href: "#goals"
        }
      ]
    },
    {
      title: "Advanced Topics",
      description: "Expert-level tutorials and techniques",
      items: [
        {
          icon: <Code className="w-6 h-6 text-white" />,
          title: "Custom AI Models",
          description: "Train and deploy custom AI models with Luna",
          duration: "60 minutes",
          difficulty: "Advanced",
          category: "AI/ML",
          href: "#custom-models"
        },
        {
          icon: <Shield className="w-6 h-6 text-white" />,
          title: "Security Best Practices",
          description: "Implement enterprise-grade security for Luna AI",
          duration: "45 minutes",
          difficulty: "Advanced",
          category: "Security",
          href: "#security"
        },
        {
          icon: <Database className="w-6 h-6 text-white" />,
          title: "Data Analytics Dashboard",
          description: "Build comprehensive analytics dashboards",
          duration: "50 minutes",
          difficulty: "Advanced",
          category: "Analytics",
          href: "#analytics"
        }
      ]
    },
    {
      title: "Integration Guides",
      description: "Platform-specific integration tutorials",
      items: [
        {
          icon: <Globe className="w-6 h-6 text-white" />,
          title: "Web Application Integration",
          description: "Integrate Luna AI into React, Vue, or Angular apps",
          duration: "40 minutes",
          difficulty: "Intermediate",
          category: "Web",
          href: "#web-integration"
        },
        {
          icon: <Zap className="w-6 h-6 text-white" />,
          title: "Mobile App Integration",
          description: "Add Luna AI to iOS and Android applications",
          duration: "35 minutes",
          difficulty: "Intermediate",
          category: "Mobile",
          href: "#mobile-integration"
        },
        {
          icon: <Cpu className="w-6 h-6 text-white" />,
          title: "Backend Integration",
          description: "Integrate Luna AI with Node.js, Python, or Java backends",
          duration: "30 minutes",
          difficulty: "Intermediate",
          category: "Backend",
          href: "#backend-integration"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-luna-900 via-luna-800 to-luna-700">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-luna-600/10 to-luna-500/10"></div>
        <div className="relative container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="inline-block px-3 py-1 mb-6 bg-luna-800/50 border border-luna-600/50 text-luna-300 rounded-full text-xs font-medium">
              Tutorials
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
              Learn Luna AI
            </h1>
            <p className="text-xl md:text-2xl text-luna-200 mb-8 max-w-3xl mx-auto">
              Step-by-step tutorials to help you master Luna AI. From beginner guides 
              to advanced techniques, learn everything you need to build amazing AI-powered applications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Tutorial */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Featured Tutorial
            </h2>
            <p className="text-xl text-luna-200 max-w-2xl mx-auto">
              Start your journey with our most popular tutorial
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <FeaturedTutorial
              title={featuredTutorial.title}
              description={featuredTutorial.description}
              duration={featuredTutorial.duration}
              difficulty={featuredTutorial.difficulty}
              href={featuredTutorial.href}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Tutorial Categories */}
      <section className="py-20 bg-luna-800/30 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          {tutorialCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              className="mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
                  {category.title}
                </h2>
                <p className="text-xl text-luna-200 max-w-2xl mx-auto">
                  {category.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((item, itemIndex) => (
                  <TutorialCard
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    duration={item.duration}
                    difficulty={item.difficulty}
                    category={item.category}
                    href={item.href}
                    delay={categoryIndex * 0.1 + itemIndex * 0.1}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-8">
              Learning Paths
            </h2>
            <p className="text-xl text-luna-200 max-w-3xl mx-auto">
              Follow structured learning paths designed to take you from beginner to expert
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Beginner Path",
                description: "Start your Luna AI journey with fundamentals",
                steps: ["Quick Start", "Basic Configuration", "First Integration"],
                duration: "2 hours",
                icon: <Play className="w-8 h-8 text-white" />
              },
              {
                title: "Developer Path",
                description: "Build production-ready applications",
                steps: ["API Integration", "Custom Features", "Deployment"],
                duration: "4 hours",
                icon: <Code className="w-8 h-8 text-white" />
              },
              {
                title: "Expert Path",
                description: "Master advanced AI and ML techniques",
                steps: ["Custom Models", "Advanced Analytics", "Enterprise Features"],
                duration: "6 hours",
                icon: <TrendingUp className="w-8 h-8 text-white" />
              }
            ].map((path, index) => (
              <motion.div
                key={path.title}
                className="p-6 rounded-2xl bg-luna-800/40 backdrop-blur-xl border border-luna-700/50 hover:border-luna-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-luna-500 to-luna-600 flex items-center justify-center mb-4">
                  {path.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{path.title}</h3>
                <p className="text-luna-300 mb-4">{path.description}</p>
                <div className="space-y-2 mb-4">
                  {path.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-luna-300 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-luna-400">
                  <span>{path.duration}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-luna-600 to-luna-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-luna-100 mb-8 max-w-2xl mx-auto">
              Choose your learning path and start building amazing AI-powered applications with Luna AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#beginner-path">
                <button className="bg-white text-luna-600 hover:bg-luna-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center mx-auto">
                  Start Learning
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
              <Link href="/documentation">
                <button className="border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg transition-all duration-300">
                  View Documentation
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 