"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Heart, 
  Globe, 
  Clock, 
  Users, 
  Zap, 
  Coffee, 
  Star,
  Award,
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle,
  Gift,
  Target,
  Rocket,
  Brain,
  Lock,
  Eye,
  MessageCircle,
  BookOpen,
  Activity,
  BarChart3,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import Head from 'next/head';
import LightwellFooter from '../components/layout/LightwellFooter';
import getStripe from '../lib/stripe';

// Floating particle component
const FloatingParticle = ({ delay, duration, x, y }: any) => (
  <motion.div
    className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
    animate={{
      x: [x, x + 100, x],
      y: [y, y - 100, y],
      opacity: [0.3, 0.8, 0.3],
      scale: [0.5, 1, 0.5],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
);

// Animated counter component
const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
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
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);
  
  return <span>{count.toLocaleString()}</span>;
};

// Impact card component
const ImpactCard = ({ icon: Icon, title, description, gradient, delay }: any) => (
  <motion.div
    className={`p-6 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 group`}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ 
      scale: 1.05, 
      y: -5,
      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)'
    }}
  >
    <motion.div
      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6 }}
    >
      <Icon className="w-6 h-6 text-white" />
    </motion.div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-zinc-400 leading-relaxed">{description}</p>
  </motion.div>
);

// Feature card component
const FeatureCard = ({ icon: Icon, title, description, gradient, delay }: any) => (
  <motion.div
    className={`p-6 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 group`}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ 
      scale: 1.05, 
      y: -5,
      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)'
    }}
  >
    <motion.div
      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6 }}
    >
      <Icon className="w-6 h-6 text-white" />
    </motion.div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-zinc-400 leading-relaxed">{description}</p>
  </motion.div>
);

// Testimonial card component
const TestimonialCard = ({ name, role, content, avatar, delay }: any) => (
  <motion.div
    className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ 
      scale: 1.02, 
      y: -5,
      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)'
    }}
  >
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-4">
        <span className="text-white font-semibold">{name.charAt(0)}</span>
      </div>
      <div>
        <h4 className="text-white font-semibold">{name}</h4>
        <p className="text-zinc-400 text-sm">{role}</p>
      </div>
    </div>
    <p className="text-zinc-300 leading-relaxed">"{content}"</p>
  </motion.div>
);

const SupportUs: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [isMonthly, setIsMonthly] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -100]);

  const donationAmounts = [5, 10, 25, 50, 100, 250];

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(0);
  };

  const calculateImpact = (amount: number) => {
    return Math.floor(amount / 5);
  };

  const handleDonation = async () => {
    const amount = selectedAmount || Number(customAmount);
    if (amount <= 0) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          isMonthly,
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await getStripe();
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe error:', error);
          alert('An error occurred. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Mental Health Advocate",
      content: "Luna's impact on global mental health access is revolutionary. Their AI-powered support has helped millions find hope and healing."
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Clinical Psychologist",
      content: "As a mental health professional, I've seen how Luna bridges the gap in mental health care. Their technology is both innovative and compassionate."
    },
    {
      name: "Emma Thompson",
      role: "Community Leader",
      content: "Supporting Luna means supporting a future where mental health care is accessible to everyone, regardless of their circumstances."
    }
  ];

  const impactStats = [
    { icon: Users, title: "500,000+", description: "People Helped", gradient: "from-blue-500 to-cyan-500" },
    { icon: Globe, title: "100+", description: "Countries Reached", gradient: "from-green-500 to-emerald-500" },
    { icon: Zap, title: "1,000,000+", description: "AI-Powered Sessions", gradient: "from-yellow-500 to-orange-500" },
    { icon: Heart, title: "24/7", description: "Support Available", gradient: "from-pink-500 to-rose-500" }
  ];

  const features = [
    { icon: Shield, title: "Privacy & Security", description: "Your data is protected with enterprise-grade security", gradient: "from-indigo-500 to-purple-500" },
    { icon: Brain, title: "AI-Powered Support", description: "Advanced AI that understands and responds with empathy", gradient: "from-blue-500 to-cyan-500" },
    { icon: Clock, title: "24/7 Availability", description: "Round-the-clock support when you need it most", gradient: "from-green-500 to-emerald-500" },
    { icon: Globe, title: "Global Access", description: "Breaking down barriers to mental health care worldwide", gradient: "from-yellow-500 to-orange-500" },
    { icon: Users, title: "Community Support", description: "Connect with others on similar mental health journeys", gradient: "from-pink-500 to-rose-500" },
    { icon: BookOpen, title: "Educational Resources", description: "Comprehensive mental health education and tools", gradient: "from-purple-500 to-indigo-500" }
  ];

  return (
    <>
      <Head>
        <title>Support Luna - Help Us Make Mental Health Accessible to Everyone</title>
        <meta name="description" content="Support Luna's mission to provide free, accessible mental health support worldwide. Your donation helps us reach more people in need." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen">
        
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.08),transparent_50%)]" />
          
          {/* Floating Particles */}
          <FloatingParticle delay={0} duration={8} x={100} y={200} />
          <FloatingParticle delay={2} duration={10} x={300} y={150} />
          <FloatingParticle delay={4} duration={12} x={500} y={300} />
          <FloatingParticle delay={6} duration={9} x={700} y={250} />
          
          <div className="relative z-10 container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
              >
                <Heart className="w-4 h-4 mr-2" />
                Support Our Mission
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-7xl font-bold text-white mb-6"
              >
                Help Us Make
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Mental Health
                </span>
                Accessible to Everyone
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                Luna is committed to providing free, compassionate mental health support globally. 
                Your support helps us continue and expand our mission to reach millions more people in need.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold text-lg flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  onClick={() => document.getElementById('donation-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Heart className="w-5 h-5" />
                  Support Our Mission
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                  onClick={() => document.getElementById('impact-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn About Our Impact
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Impact Stats Section */}
        <section id="impact-section" className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Global Impact
              </h2>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                Together, we've created a movement that's changing lives around the world
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactStats.map((stat, index) => (
                <ImpactCard
                  key={index}
                  icon={stat.icon}
                  title={stat.title}
                  description={stat.description}
                  gradient={stat.gradient}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                What Your Support Enables
              </h2>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                Your contribution directly supports these critical mental health initiatives
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  gradient={feature.gradient}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Donation Section */}
        <section id="donation-section" className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative flex w-full max-w-[1000px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 p-10 py-14 bg-zinc-900/40 backdrop-blur-xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Choose Your Impact
                  </h2>
                  <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                    Every contribution, no matter the size, makes a real difference in someone's life
                  </p>
                </motion.div>

                {/* Donation Type Toggle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex justify-center mb-8"
                >
                  <div className="bg-zinc-800/50 rounded-full p-1 border border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                        !isMonthly 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                          : 'text-zinc-400 hover:text-white'
                      }`}
                      onClick={() => setIsMonthly(false)}
                    >
                      One-time
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                        isMonthly 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                          : 'text-zinc-400 hover:text-white'
                      }`}
                      onClick={() => setIsMonthly(true)}
                    >
                      Monthly
                    </motion.button>
                  </div>
                </motion.div>

                {/* Amount Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 w-full max-w-md"
                >
                  {donationAmounts.map((amount) => (
                    <motion.button
                      key={amount}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        selectedAmount === amount 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                          : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 border border-white/10'
                      }`}
                      onClick={() => handleAmountClick(amount)}
                    >
                      ${amount}
                    </motion.button>
                  ))}
                </motion.div>

                {/* Custom Amount */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="w-full max-w-md mx-auto mb-8"
                >
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="w-full px-6 py-4 bg-zinc-800/50 border border-white/10 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg"
                  />
                </motion.div>

                {/* Impact Display */}
                <AnimatePresence>
                  {(selectedAmount > 0 || customAmount !== '') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-center mb-8"
                    >
                      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                        <p className="text-xl text-white mb-2">
                          Your {isMonthly ? 'monthly ' : ''}donation of{' '}
                          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            ${selectedAmount || customAmount}
                          </span>
                        </p>
                        <p className="text-zinc-300">
                          can help approximately{' '}
                          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                            {calculateImpact(selectedAmount || Number(customAmount))} people
                          </span>{' '}
                          receive mental health support.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Donate Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDonation}
                  disabled={isLoading || (selectedAmount === 0 && customAmount === '')}
                  className="w-full max-w-md py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5" />
                      Donate Now
                    </>
                  )}
                </motion.button>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-sm text-zinc-500 mt-4 text-center"
                >
                  Your donation is secure and tax-deductible. We're committed to transparency in how we use your support.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                What Our Supporters Say
              </h2>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                Hear from mental health professionals and advocates about Luna's impact
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  {...testimonial}
                  delay={index * 0.2}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Other Ways to Support */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Other Ways to Support
              </h2>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                There are many ways to contribute to our mission beyond financial support
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Spread the Word</h3>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  Share Luna with your friends, family, and social networks. The more people know about us, the more we can help.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2"
                >
                  Learn More <ExternalLink className="w-4 h-4" />
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Volunteer</h3>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  Join our team of volunteers and contribute your skills, time, and expertise to our mission.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2"
                >
                  Get Involved <ExternalLink className="w-4 h-4" />
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Share Resources</h3>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  Contribute educational content, mental health resources, or share your expertise with our community.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2"
                >
                  Contribute <ExternalLink className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Questions About Supporting Luna?
              </h2>
              <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
                We're here to answer any questions you might have about supporting our mission
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
                  <p className="text-zinc-400 text-sm">support@luna.com</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
                  <p className="text-zinc-400 text-sm">+1 (555) 123-4567</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Visit Us</h3>
                  <p className="text-zinc-400 text-sm">123 Mental Health Ave, Suite 100</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      
      <LightwellFooter />
    </>
  );
};

export default SupportUs;