'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  Heart, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Star,
  Lock,
  Zap,
  CheckCircle
} from 'lucide-react';

interface OnboardingRailroadProps {
  onComplete: () => void;
  onSkip: () => void;
}

const railroadSteps = [
  {
    id: 'ai-intelligence',
    title: 'AI-Powered Intelligence',
    subtitle: 'Meet JAMI-3',
    description: 'Advanced therapeutic AI trained on clinical best practices, capable of providing personalized mental health support 24/7.',
    features: [
      'Clinical-grade therapeutic responses',
      'Personalized conversation patterns',
      'Evidence-based interventions',
      'Real-time emotional intelligence'
    ],
    icon: Brain,
    gradient: 'from-gpt5-amber-start via-gpt5-orange to-gpt5-pink',
    bgGradient: 'from-gpt5-amber-start/10 via-gpt5-orange/8 to-gpt5-pink/6'
  },
  {
    id: 'security',
    title: 'Clinical-Grade Security',
    subtitle: 'Your Privacy Matters',
    description: 'Enterprise-level security with HIPAA compliance, end-to-end encryption, and zero-knowledge architecture.',
    features: [
      'HIPAA compliant infrastructure',
      'End-to-end encryption',
      'Zero-knowledge data handling',
      'SOC 2 Type II certified'
    ],
    icon: Shield,
    gradient: 'from-gpt5-orange via-gpt5-pink to-gpt5-purple',
    bgGradient: 'from-gpt5-orange/8 via-gpt5-pink/10 to-gpt5-purple/6'
  },
  {
    id: 'personalization',
    title: 'Personalized Growth',
    subtitle: 'Tailored for You',
    description: 'Adaptive learning algorithms create a unique therapeutic experience based on your needs and progress.',
    features: [
      'Personalized therapy approaches',
      'Adaptive conversation styles',
      'Progress tracking & insights',
      'Goal-oriented support'
    ],
    icon: Heart,
    gradient: 'from-gpt5-pink via-gpt5-purple to-gpt5-purple-end',
    bgGradient: 'from-gpt5-pink/10 via-gpt5-purple/8 to-gpt5-purple-end/6'
  },
  {
    id: 'community',
    title: 'Community & Trust',
    subtitle: 'You\'re Not Alone',
    description: 'Join thousands who trust JAMI-3 for their mental wellness journey, backed by clinical research.',
    features: [
      'Trusted by 50,000+ users',
      'Clinical research backing',
      '24/7 crisis support',
      'Professional oversight'
    ],
    icon: Users,
    gradient: 'from-gpt5-purple via-gpt5-purple-end to-gpt5-amber-start',
    bgGradient: 'from-gpt5-purple/8 via-gpt5-purple-end/10 to-gpt5-amber-start/6'
  }
];

export default function OnboardingRailroad({ onComplete, onSkip }: OnboardingRailroadProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Accessibility: Announce step changes to screen readers
  useEffect(() => {
    const announcement = `Step ${currentStep + 1} of ${railroadSteps.length}: ${railroadSteps[currentStep]?.title}`;
    const ariaLiveElement = document.getElementById('onboarding-announcer');
    if (ariaLiveElement) {
      ariaLiveElement.textContent = announcement;
    }
  }, [currentStep]);

  const handleNext = async () => {
    if (isTransitioning) return;

    if (currentStep >= railroadSteps.length - 1) {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      onComplete();
      return;
    }

    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    setCurrentStep(prev => prev + 1);
    setIsTransitioning(false);
  };

  const handlePrevious = () => {
    if (currentStep > 0 && !isTransitioning) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      
      switch (e.key) {
        case 'ArrowRight':
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'Escape':
          e.preventDefault();
          onSkip();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isTransitioning]);

  const currentStepData = railroadSteps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gpt5-slate-950 via-gpt5-slate-900 to-gpt5-black text-white relative overflow-hidden">
      {/* Accessibility: Screen reader announcements */}
      <div id="onboarding-announcer" className="sr-only" aria-live="polite" aria-atomic="true" />
      {/* Enhanced GPT-5 Beam Ambient Background */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-radial ${currentStepData.bgGradient} transition-all duration-1000`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gpt5-amber-start/8 via-gpt5-orange/4 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-gpt5-purple/6 via-gpt5-pink/3 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gpt5-purple-end/4 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.015] bg-noise-pattern mix-blend-overlay" />
      </div>

      {/* Enhanced Progress Header */}
      <div className="relative z-20 bg-gradient-to-r from-gpt5-slate-900/60 via-gpt5-zinc-800/50 to-gpt5-slate-900/60 backdrop-blur-xl shadow-2xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className={`w-12 h-12 bg-gradient-to-r ${currentStepData.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                animate={{
                  boxShadow: [
                    "0 10px 15px -3px rgba(245, 158, 11, 0.1)",
                    "0 10px 15px -3px rgba(236, 72, 153, 0.2)",
                    "0 10px 15px -3px rgba(245, 158, 11, 0.1)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-light text-white tracking-wide">Welcome to <span className="bg-gpt5-beam-gradient bg-clip-text text-transparent font-semibold">JAMI-3</span></h1>
                <p className="text-sm text-slate-400">Discover what makes JAMI-3 special</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-slate-400">
                  Step {currentStep + 1} of {railroadSteps.length}
                </div>
                <div className="text-xs text-slate-500">{currentStepData.title}</div>
              </div>

              {/* Enhanced Progress Dots */}
              <div className="flex items-center gap-3">
                {railroadSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`relative ${
                      index <= currentStep
                        ? `bg-gradient-to-r ${currentStepData.gradient} shadow-lg`
                        : 'bg-slate-700/50'
                    } rounded-full transition-all duration-500`}
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: index === currentStep ? 1.2 : 1,
                      width: index === currentStep ? '12px' : '8px',
                      height: index === currentStep ? '12px' : '8px'
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {index <= currentStep && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-white/20"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.5, 0] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.05 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="w-full max-w-5xl"
          >
            <div className="text-center mb-12">
              {/* Floating Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "backOut" }}
                className="relative inline-block mb-8"
              >
                <div className={`w-24 h-24 bg-gradient-to-r ${currentStepData.gradient} rounded-3xl flex items-center justify-center shadow-2xl`}>
                  <IconComponent className="w-12 h-12 text-white" />
                </div>
                {/* Pulsing Ring */}
                <motion.div
                  className={`absolute inset-0 border-2 border-white/20 rounded-3xl`}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-5xl md:text-6xl font-light text-white mb-4 tracking-wide">
                  {currentStepData.title}
                </h2>
                <p className={`text-xl bg-gradient-to-r ${currentStepData.gradient} bg-clip-text text-transparent font-medium mb-6`}>
                  {currentStepData.subtitle}
                </p>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  {currentStepData.description}
                </p>
              </motion.div>
            </div>

            {/* Feature Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12"
            >
              {currentStepData.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/8 transition-all duration-300"
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${currentStepData.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4"
            >
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  aria-label={`Go back to step ${currentStep}`}
                  className="order-2 sm:order-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  Previous
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={isTransitioning}
                aria-label={currentStep >= railroadSteps.length - 1 ? 'Complete onboarding and begin journey with JAMI-3' : `Continue to step ${currentStep + 2}`}
                className={`order-1 sm:order-2 w-full sm:w-auto px-8 sm:px-12 py-4 bg-gradient-to-r ${currentStepData.gradient} hover:scale-105 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-white/40`}
              >
                <span className="text-center">
                  {currentStep >= railroadSteps.length - 1 ? 'Begin Journey with JAMI-3' : 'Continue'}
                </span>
                <ArrowRight className="w-5 h-5 flex-shrink-0" />
              </button>

              <button
                onClick={onSkip}
                aria-label="Skip onboarding introduction"
                className="order-3 px-6 py-3 text-slate-400 hover:text-white font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg"
              >
                Skip intro
              </button>
            </motion.div>

            {/* Keyboard shortcuts hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="mt-8 text-center text-xs text-slate-500"
            >
              <p>Use arrow keys to navigate • Press Escape to skip • Enter or Space to continue</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/40"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-white font-medium">Preparing your experience...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}