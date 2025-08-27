import Head from 'next/head';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle,
  MessageSquare,
  Globe,
  Building,
  User,
  Heart,
  Shield,
  Users,
  Star,
  ArrowRight,
  Zap,
  Headphones,
  Shield as ShieldIcon,
  Users as UsersIcon,
  Star as StarIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  MessageSquare as MessageSquareIcon,
  Globe as GlobeIcon,
  Building as BuildingIcon,
  User as UserIcon,
  Heart as HeartIcon,
  Zap as ZapIcon,
  Headphones as HeadphonesIcon
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';

// Floating Particle Component
const FloatingParticle = ({ className = "" }: { className?: string }) => (
  <motion.div
    className={`absolute w-2 h-2 bg-blue-400/30 rounded-full ${className}`}
    animate={{
      y: [0, -20, 0],
      opacity: [0.3, 0.8, 0.3],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, className = "" }: { end: number; duration?: number; className?: string }) => {
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span className={className}>{count.toLocaleString()}+</span>;
};

// Contact Method Component
const ContactMethod = ({ 
  icon: Icon, 
  title, 
  description, 
  value, 
  link, 
  color = "blue" 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  value: string; 
  link: string; 
  color?: string;
}) => {
  const colorClasses = {
    blue: "text-blue-400 bg-blue-500/20 group-hover:bg-blue-500/30",
    purple: "text-purple-400 bg-purple-500/20 group-hover:bg-purple-500/30",
    green: "text-green-400 bg-green-500/20 group-hover:bg-green-500/30",
    red: "text-red-400 bg-red-500/20 group-hover:bg-red-500/30",
    orange: "text-orange-400 bg-orange-500/20 group-hover:bg-orange-500/30"
  };

  return (
    <motion.a
      href={link}
      className="block p-6 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 group"
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)'
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start space-x-4">
        <motion.div
          className={`w-12 h-12 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center transition-all duration-300`}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </h4>
          <p className="text-zinc-400 text-sm mb-1">{description}</p>
          <p className="text-white font-medium">{value}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors duration-300" />
      </div>
    </motion.a>
  );
};

// Feature Card Component
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color = "blue" 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  color?: string;
}) => {
  const colorClasses = {
    blue: "text-blue-400 bg-blue-500/20",
    purple: "text-purple-400 bg-purple-500/20",
    green: "text-green-400 bg-green-500/20",
    red: "text-red-400 bg-red-500/20",
    orange: "text-orange-400 bg-orange-500/20"
  };

  return (
    <motion.div
      className="p-6 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300"
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)'
      }}
    >
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </motion.div>
  );
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    concern: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: MailIcon,
      title: 'Email Support',
      description: 'Get help with your account',
      value: 'support@luna.ai',
      link: 'mailto:support@luna.ai',
      color: 'blue'
    },
    {
      icon: PhoneIcon,
      title: 'Crisis Support',
      description: '24/7 crisis intervention',
      value: '1-800-LUNA-HELP',
      link: 'tel:1-800-LUNA-HELP',
      color: 'red'
    },
    {
      icon: MessageSquareIcon,
      title: 'Live Chat',
      description: 'Available 24/7 on our website',
      value: 'Chat Now',
      link: '/chat',
      color: 'green'
    },
    {
      icon: MapPinIcon,
      title: 'Global Access',
      description: 'Available worldwide',
      value: '150+ Countries',
      link: '#',
      color: 'purple'
    },
    {
      icon: ClockIcon,
      title: 'Always Available',
      description: '24/7 mental health support',
      value: 'Round the Clock',
      link: '#',
      color: 'orange'
    },
    {
      icon: BuildingIcon,
      title: 'Corporate Partnerships',
      description: 'Enterprise mental health solutions',
      value: 'partnerships@luna.ai',
      link: 'mailto:partnerships@luna.ai',
      color: 'blue'
    }
  ];

  const features = [
    {
      icon: HeartIcon,
      title: 'Compassionate Support',
      description: 'Our team is trained in mental health and crisis intervention',
      color: 'red'
    },
    {
      icon: ShieldIcon,
      title: 'Privacy First',
      description: 'Your conversations and data are protected with enterprise-grade security',
      color: 'green'
    },
    {
      icon: UsersIcon,
      title: 'Community Driven',
      description: 'Join thousands of users who have found support and understanding',
      color: 'blue'
    },
    {
      icon: StarIcon,
      title: 'Holistic Wellness',
      description: 'Comprehensive mental health support for all aspects of your life',
      color: 'purple'
    },
    {
      icon: ZapIcon,
      title: 'Instant Response',
      description: 'Get immediate support when you need it most',
      color: 'orange'
    },
    {
      icon: HeadphonesIcon,
      title: 'Multiple Channels',
      description: 'Contact us through email, phone, chat, or in-app messaging',
      color: 'green'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', concern: '', message: '' });
        
        // Reset form after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        console.error('Failed to send message:', data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <Layout>
      <Head>
        <title>Contact Luna - Get in Touch | Mental Health Support</title>
        <meta name="description" content="Contact Luna for support, inquiries, or crisis intervention. Our compassionate team is available 24/7 to help you on your mental health journey." />
        <meta name="keywords" content="contact, support, mental health, crisis intervention, AI companion, Luna" />
        <meta property="og:title" content="Contact Luna - Get in Touch" />
        <meta property="og:description" content="Contact Luna for support, inquiries, or crisis intervention. Our compassionate team is available 24/7." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://luna.ai/contact" />
      </Head>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)]" />
        
        {/* Floating Particles */}
        <FloatingParticle className="top-20 left-20" />
        <FloatingParticle className="top-40 right-32" />
        <FloatingParticle className="bottom-32 left-1/4" />
        <FloatingParticle className="bottom-20 right-1/3" />
        <FloatingParticle className="top-1/2 left-1/2" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Star className="w-4 h-4 mr-2" />
              We're Here to Help
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Get in Touch
              <span className="block bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                We're Here for You
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Whether you need support, have questions, or want to share your experience, 
              our compassionate team is available 24/7 to help you on your mental health journey.
            </motion.p>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                <AnimatedCounter end={24} className="text-blue-400" />/7
              </div>
              <p className="text-zinc-400">Support Available</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                <AnimatedCounter end={150} className="text-purple-400" />+
              </div>
              <p className="text-zinc-400">Countries Served</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                <AnimatedCounter end={50000} className="text-green-400" />+
              </div>
              <p className="text-zinc-400">Users Helped</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="relative py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="p-8 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10">
                <h3 className="text-2xl font-semibold text-white mb-6">Send Us a Message</h3>
                
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      className="text-center py-12"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-white mb-2">Message Sent!</h4>
                      <p className="text-zinc-400">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit} 
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                            placeholder="Enter your full name"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="concern" className="block text-sm font-medium text-zinc-300 mb-2">
                          Primary Concern
                        </label>
                        <select
                          id="concern"
                          name="concern"
                          value={formData.concern}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                        >
                          <option value="">Select your primary concern</option>
                          <option value="anxiety">Anxiety & Stress</option>
                          <option value="depression">Depression</option>
                          <option value="relationships">Relationships</option>
                          <option value="self-esteem">Self-esteem</option>
                          <option value="grief">Grief & Loss</option>
                          <option value="crisis">Crisis Support</option>
                          <option value="technical">Technical Support</option>
                          <option value="billing">Billing & Subscriptions</option>
                          <option value="partnership">Partnership Inquiry</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 resize-none"
                          placeholder="Tell us how we can help you on your mental health journey..."
                        />
                      </div>
                      
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Send Message</span>
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <ContactMethod
                    key={info.title}
                    icon={info.icon}
                    title={info.title}
                    description={info.description}
                    value={info.value}
                    link={info.link}
                    color={info.color}
                  />
                ))}
              </div>

              {/* Additional Info */}
              <motion.div
                className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h4 className="text-lg font-semibold text-white mb-4">Why Choose Luna?</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span className="text-zinc-300">Compassionate AI Support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-zinc-300">Safe & Private</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-zinc-300">Community Support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-purple-400" />
                    <span className="text-zinc-300">Holistic Wellness</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How We Support You
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Our comprehensive support system is designed to meet your mental health needs 
              through multiple channels and specialized services.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  color={feature.color}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Support Hours Section */}
      <section className="relative py-24 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Support Hours
            </h2>
            <p className="text-xl text-zinc-400">
              We're here when you need us most
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="text-center p-6 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Crisis Support</h3>
              <p className="text-zinc-400">24/7 Emergency Response</p>
              <p className="text-white font-medium mt-2">Immediate Help</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center p-6 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Live Chat</h3>
              <p className="text-zinc-400">Available 24/7</p>
              <p className="text-white font-medium mt-2">Instant Support</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center p-6 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email Support</h3>
              <p className="text-zinc-400">Response within 24 hours</p>
              <p className="text-white font-medium mt-2">Detailed Help</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </Layout>
  );
}