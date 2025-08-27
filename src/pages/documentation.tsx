import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Code, 
  Zap, 
  Shield, 
  Users, 
  MessageCircle, 
  Heart, 
  Target,
  ArrowRight,
  ExternalLink,
  Search,
  FileText,
  Play,
  Download,
  Github,
  Globe,
  Lock,
  Settings,
  Database,
  Cpu
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';

const DocumentationCard = ({ 
  icon, 
  title, 
  description, 
  href, 
  category,
  delay 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  category: string;
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
        <ExternalLink className="w-5 h-5 text-luna-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="mb-3">
        <span className="inline-block px-2 py-1 bg-luna-700/50 text-luna-300 text-xs rounded-full mb-2">
          {category}
        </span>
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-luna-300 transition-colors">
          {title}
        </h3>
        <p className="text-luna-300 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  </motion.div>
);

const SearchSection = () => (
  <div className="relative max-w-2xl mx-auto mb-12">
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-luna-400" />
      <input
        type="text"
        placeholder="Search documentation..."
        className="w-full pl-12 pr-4 py-4 bg-luna-800/50 border border-luna-700/50 rounded-xl text-white placeholder-luna-400 focus:outline-none focus:border-luna-500/50 focus:ring-2 focus:ring-luna-500/20"
      />
    </div>
  </div>
);

export default function Documentation() {
  const documentationSections = [
    {
      title: "Getting Started",
      description: "Quick start guides and basic setup",
      items: [
        {
          icon: <Play className="w-6 h-6 text-white" />,
          title: "Quick Start Guide",
          description: "Get up and running with Luna AI in minutes",
          href: "#quick-start",
          category: "Beginner"
        },
        {
          icon: <Settings className="w-6 h-6 text-white" />,
          title: "Configuration",
          description: "Configure Luna AI for your specific needs",
          href: "#configuration",
          category: "Setup"
        },
        {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "User Management",
          description: "Manage users, roles, and permissions",
          href: "#user-management",
          category: "Admin"
        }
      ]
    },
    {
      title: "Core Features",
      description: "Detailed guides for Luna's main features",
      items: [
        {
          icon: <MessageCircle className="w-6 h-6 text-white" />,
          title: "AI Chat Integration",
          description: "Integrate Luna's AI chat capabilities into your application",
          href: "#ai-chat",
          category: "Integration"
        },
        {
          icon: <Heart className="w-6 h-6 text-white" />,
          title: "Mood Tracking",
          description: "Implement mood tracking and emotional analysis features",
          href: "#mood-tracking",
          category: "Analytics"
        },
        {
          icon: <Target className="w-6 h-6 text-white" />,
          title: "Goal Setting",
          description: "Set up goal tracking and progress monitoring",
          href: "#goal-setting",
          category: "Features"
        }
      ]
    },
    {
      title: "API Reference",
      description: "Complete API documentation and examples",
      items: [
        {
          icon: <Code className="w-6 h-6 text-white" />,
          title: "REST API",
          description: "Complete REST API reference with examples",
          href: "#rest-api",
          category: "API"
        },
        {
          icon: <Zap className="w-6 h-6 text-white" />,
          title: "WebSocket API",
          description: "Real-time communication with Luna AI",
          href: "#websocket-api",
          category: "API"
        },
        {
          icon: <Database className="w-6 h-6 text-white" />,
          title: "Data Models",
          description: "Complete data model documentation",
          href: "#data-models",
          category: "Reference"
        }
      ]
    },
    {
      title: "Security & Privacy",
      description: "Security best practices and privacy guidelines",
      items: [
        {
          icon: <Shield className="w-6 h-6 text-white" />,
          title: "Security Guide",
          description: "Implement security best practices for Luna AI",
          href: "#security",
          category: "Security"
        },
        {
          icon: <Lock className="w-6 h-6 text-white" />,
          title: "Privacy Compliance",
          description: "HIPAA and GDPR compliance guidelines",
          href: "#privacy",
          category: "Compliance"
        },
        {
          icon: <Cpu className="w-6 h-6 text-white" />,
          title: "Data Encryption",
          description: "End-to-end encryption implementation",
          href: "#encryption",
          category: "Security"
        }
      ]
    },
    {
      title: "Deployment",
      description: "Deployment guides and infrastructure setup",
      items: [
        {
          icon: <Globe className="w-6 h-6 text-white" />,
          title: "Production Deployment",
          description: "Deploy Luna AI to production environments",
          href: "#deployment",
          category: "DevOps"
        },
        {
          icon: <Github className="w-6 h-6 text-white" />,
          title: "Docker Setup",
          description: "Containerized deployment with Docker",
          href: "#docker",
          category: "DevOps"
        },
        {
          icon: <Download className="w-6 h-6 text-white" />,
          title: "SDK Downloads",
          description: "Download Luna AI SDKs for various platforms",
          href: "#sdk",
          category: "Development"
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
              Documentation
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
              Luna AI Documentation
            </h1>
            <p className="text-xl md:text-2xl text-luna-200 mb-8 max-w-3xl mx-auto">
              Everything you need to integrate and use Luna AI in your applications. 
              From quick start guides to advanced API references.
            </p>
            <SearchSection />
          </motion.div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {documentationSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
                  {section.title}
                </h2>
                <p className="text-xl text-luna-200 max-w-2xl mx-auto">
                  {section.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.items.map((item, itemIndex) => (
                  <DocumentationCard
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    href={item.href}
                    category={item.category}
                    delay={sectionIndex * 0.1 + itemIndex * 0.1}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-luna-800/30 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-8">
              Quick Links
            </h2>
            <p className="text-xl text-luna-200 max-w-2xl mx-auto">
              Popular documentation sections and resources
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { title: "API Reference", href: "#api", icon: <Code className="w-5 h-5" /> },
              { title: "SDK Downloads", href: "#sdk", icon: <Download className="w-5 h-5" /> },
              { title: "Security Guide", href: "#security", icon: <Shield className="w-5 h-5" /> },
              { title: "Examples", href: "#examples", icon: <FileText className="w-5 h-5" /> },
            ].map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link
                  href={link.href}
                  className="flex items-center space-x-3 p-4 rounded-xl bg-luna-800/40 border border-luna-700/50 hover:border-luna-500/30 transition-all duration-300 group"
                >
                  <div className="text-luna-400 group-hover:text-luna-300 transition-colors">
                    {link.icon}
                  </div>
                  <span className="text-luna-200 group-hover:text-white transition-colors font-medium">
                    {link.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-luna-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-auto" />
                </Link>
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
              Need Help?
            </h2>
            <p className="text-xl text-luna-100 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-white text-luna-600 hover:bg-luna-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center mx-auto">
                  Contact Support
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
              <Link href="/community">
                <button className="border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg transition-all duration-300">
                  Community Forum
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 