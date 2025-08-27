'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import {
  ArrowRight,
  MessageCircle,
  Star,
  Users,
  BookOpen,
  Globe,
  Heart,
  User,
  Sparkles,
  Target,
  Brain,
  Shield,
  Lightbulb,
  CheckCircle,
  ChevronDown
} from 'lucide-react';

// Import existing page components
import MeetJamie from './meet-jamie';
import Showcase from './showcase';
import Features from './features';
import About from './about';
import SupportUs from './support-us';
import LandingPage from './landingpage';

// Import new cinematic components
import OnboardingRailroad from '../components/onboarding/OnboardingRailroad';
import CinematicBuildUp from '../components/onboarding/CinematicBuildUp';
import FirstEncounter from '../components/onboarding/FirstEncounter';
// Import the new UnderTheHood component
import UnderTheHood from '../components/onboarding/UnderTheHood';

// Final Step - Ready to Begin
const ReadyToBegin = () => (
  <div className="min-h-screen bg-black flex items-center justify-center px-8 relative">
    {/* GPT-5 Background */}
    <div className="fixed inset-0 bg-gradient-to-br from-[#ff6b9d] via-[#c44cff] via-[#7c3aed] via-[#3b82f6] to-[#06b6d4] animate-gradient-beam pointer-events-none" />
    <div className="fixed inset-0 bg-gradient-to-tr from-[#fbbf24] via-[#f97316] via-[#dc2626] to-[#be185d] opacity-70 mix-blend-multiply pointer-events-none" />
    <div className="fixed inset-0 bg-gradient-to-br from-pink-500/8 via-purple-500/6 to-orange-500/8 mix-blend-screen pointer-events-none" />
    <div className="fixed inset-0 bg-black/6 backdrop-blur-sm pointer-events-none" />
    
    <div className="max-w-3xl mx-auto text-center relative z-10">
      {/* Completion Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="mb-12"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
          You're <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">All Set</span>!
        </h1>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          You've completed your introduction to JAMI-3. 
          Your personalized therapeutic experience is now ready to begin.
        </p>
      </motion.div>

      {/* Quick Summary */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-12"
      >
        <h3 className="text-white font-semibold mb-4">What happens next:</h3>
        <div className="text-white/80 text-left space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span>Enter your private, secure therapy space</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-pink-400 rounded-full" />
            <span>Meet JAMI-3 and start your first conversation</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span>Begin your personalized therapeutic journey</span>
          </div>
        </div>
      </motion.div>

      {/* Final Encouragement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="text-center"
      >
        <p className="text-white/60 text-sm mb-8">
          Remember: JAMI-3 is here 24/7, whenever you need support
        </p>
      </motion.div>
    </div>
  </div>
);

// Define the enhanced cinematic onboarding sequence
type OnboardingFlow = 'classic' | 'cinematic';
type OnboardingPage = 'railroad' | 'cinematic-buildup' | 'first-encounter' | 'meet-jamie' | 'showcase' | 'features' | 'about' | 'support-us' | 'landing-recap' | 'chat';

interface OnboardingStep {
  id: OnboardingPage;
  title: string;
  description: string;
  ctaText: string;
  component: React.ComponentType<any>;
  isCinematic?: boolean;
}

// New Cinematic Flow (Primary)
const cinematicOnboardingSteps: OnboardingStep[] = [
  {
    id: 'railroad',
    title: 'Welcome to JAMI-3',
    description: 'Discover what makes us special',
    ctaText: 'Continue',
    component: OnboardingRailroad,
    isCinematic: true
  },
  {
    id: 'cinematic-buildup',
    title: 'Preparing JAMI-3',
    description: 'Initializing your experience',
    ctaText: 'Continue',
    component: CinematicBuildUp,
    isCinematic: true
  },
  {
    id: 'first-encounter',
    title: 'Meet JAMI-3',
    description: 'Your first conversation',
    ctaText: 'Begin Journey',
    component: FirstEncounter,
    isCinematic: true
  }
];

// Classic Flow (Fallback)
const classicOnboardingSteps: OnboardingStep[] = [
  {
    id: 'landing-recap',
    title: 'Welcome to Lightwell',
    description: 'Your mental health companion',
    ctaText: 'Begin Your Journey',
    component: LandingPage
  },
  {
    id: 'meet-jamie',
    title: 'Meet JAMI-3',
    description: 'Cinematic introduction to your AI companion',
    ctaText: 'Discover JAMI-3',
    component: FirstEncounter  // Using FirstEncounter as the cinematic intro
  },
  {
    id: 'chat',
    title: 'Watch JAMI-3 Learn',
    description: 'Live memory formation and adaptive intelligence',
    ctaText: 'See Intelligence in Action',
    component: Showcase  // Modify Showcase to focus on learning capabilities
  },
  {
    id: 'showcase',
    title: 'Under the Hood',
    description: 'Explore Lightwell\'s clinical architecture',
    ctaText: 'Explore the System',
    component: UnderTheHood
  },
  {
    id: 'features',
    title: 'Features',
    description: 'Our research institute',
    ctaText: 'Learn About Our Research',
    component: Features
  },
  {
    id: 'about',
    title: 'About Us',
    description: 'Our mission and story',
    ctaText: 'Support Our Mission',
    component: About
  },
  {
    id: 'support-us',
    title: 'Support Us',
    description: 'Ways to contribute',
    ctaText: 'Start Your Journey with JAMI-3',
    component: SupportUs
  },
  {
    id: 'landing-page',
    title: 'You\'re All Set',
    description: 'Ready to begin your journey',
    ctaText: 'Start with JAMI-3',
    component: ReadyToBegin
  }
];

// Placeholder types and services for clinical functionality
type UserProfile = any;
type ClinicalProfile = any;
type ClinicalScores = any;
type RiskAssessment = any;

const ClinicalScoringService = {
  assess: async () => ({ scores: {}, riskLevel: 'low' })
};

const personalizationEngine = {
  generateRecommendations: () => ({ recommendations: [] })
};

const AdaptiveAssessment = () => (
  <div className="text-center p-8">
    <h3 className="text-2xl font-bold mb-4">Assessment Complete</h3>
    <p className="text-gray-600">Your personalized assessment has been completed successfully.</p>
  </div>
);

const assessmentQuestions = [];

export default function PostSignupOnboardingFlow() {
  const router = useRouter();
  const [onboardingFlow, setOnboardingFlow] = useState<OnboardingFlow>('classic');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Placeholder state variables
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [clinicalScores, setClinicalScores] = useState<ClinicalScores>({});
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment>({});
  const [isSaving, setIsSaving] = useState(false);

  // Select the appropriate onboarding steps
  const onboardingSteps = onboardingFlow === 'cinematic' ? cinematicOnboardingSteps : classicOnboardingSteps;

  // Placeholder functions
  const clearProgress = () => {
    localStorage.removeItem('postSignup_onboarding_progress');
    setCurrentStepIndex(0);
  };

  const handleWelcomeComplete = (preferences: any) => {
    setUserProfile(preferences);
    setCurrentStepIndex(1);
  };

  // Development reset method
  const resetOnboardingProgress = () => {
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('postSignup_onboarding_complete');
    localStorage.removeItem('postSignup_onboarding_progress');
    sessionStorage.removeItem('justCompletedOnboarding');
    console.log('🔄 Onboarding progress reset');
    
    // Optional: Reload the page to ensure clean state
    if (process.env.NODE_ENV === 'development') {
      window.location.reload();
    }
  };

  // Modify useEffect to allow more flexible development testing
  useEffect(() => {
    // Development bypass: Allow testing onboarding with ?dev=true
    const isDevelopment = process.env.NODE_ENV === 'development';
    const hasDevBypass = router.query.dev === 'true';
    
    console.log('🔍 Onboarding check:', {
      isDevelopment,
      hasDevBypass,
      query: router.query,
      onboardingCompleted: localStorage.getItem('onboardingCompleted')
    });
    
    // In development, allow more flexible testing
    if (isDevelopment) {
      if (hasDevBypass) {
        console.log('🚀 Development mode: Bypassing onboarding completion check');
        return;
      }
    }

    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (onboardingCompleted === 'true' && !isDevelopment) {
      console.log('⏭️ Onboarding already completed, redirecting to chat');
      // User already completed onboarding, redirect to chat
      router.push('/chat');
      return;
    }
    
    console.log('✅ Staying on onboarding page');
  }, [router]);

  // Handle progression to next step
  const handleNextStep = async () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Save current step progress
    const progressKey = 'postSignup_onboarding_progress';
    const progressData = {
      currentStepIndex,
      completedSteps: currentStepIndex + 1,
      lastCompletedAt: new Date().toISOString(),
      flow: onboardingFlow
    };
    localStorage.setItem(progressKey, JSON.stringify(progressData));

    // If this is the final step, complete onboarding and redirect to chat
    if (currentStepIndex >= onboardingSteps.length - 1) {
      // Mark onboarding as complete
      localStorage.setItem('onboardingCompleted', 'true');
      localStorage.setItem('postSignup_onboarding_complete', 'true');
      
      // Set session flag for first-time chat greeting
      sessionStorage.setItem('justCompletedOnboarding', 'true');

      // Add cinematic transition
      setIsTransitioning(true);
      setTimeout(() => {
        router.push('/chat');
      }, 1200);
      return;
    }

    // For cinematic flow, use component-controlled transitions
    if (onboardingFlow === 'cinematic') {
      setCurrentStepIndex(prev => prev + 1);
      setIsTransitioning(false);
      return;
    }

    // Classic flow transition
    setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
      setIsTransitioning(false);
    }, 500);
  };

  // Handle classic flow to cinematic transition
  const handleSwitchToCinematic = () => {
    setOnboardingFlow('cinematic');
    setCurrentStepIndex(0);
  };

  // Handle skipping to chat (for users who want to bypass)
  const handleSkipToChat = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    router.push('/chat');
  };

  // Get current step data
  const currentStep = onboardingSteps[currentStepIndex];
  const CurrentComponent = currentStep?.component;

  // Progress bar calculation
  const progressPercentage = ((currentStepIndex + 1) / onboardingSteps.length) * 100;

  // For cinematic flow, render components directly
  if (onboardingFlow === 'cinematic' && CurrentComponent) {
    const componentProps: any = {};
    
    if (currentStep.id === 'railroad') {
      componentProps.onComplete = handleNextStep;
      componentProps.onSkip = handleSkipToChat;
    } else if (currentStep.id === 'cinematic-buildup') {
      componentProps.onComplete = handleNextStep;
    } else if (currentStep.id === 'first-encounter') {
      componentProps.onComplete = handleSkipToChat;
    }

    return <CurrentComponent {...componentProps} />;
  }

  // Classic flow UI
  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* GPT-5 Animated Background - Version 2: Colored Glow Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#ff6b9d] via-[#c44cff] via-[#7c3aed] via-[#3b82f6] to-[#06b6d4] animate-gradient-beam pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-tr from-[#fbbf24] via-[#f97316] via-[#dc2626] to-[#be185d] opacity-70 mix-blend-multiply pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-pink-500/8 via-purple-500/6 to-orange-500/8 mix-blend-screen pointer-events-none" />
      <div className="fixed inset-0 bg-black/6 backdrop-blur-sm pointer-events-none" />

      {/* Progress Header */}
      <div className="relative z-20 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Welcome to JAMI-3</h1>
                <p className="text-sm text-white/60">Getting you acquainted with JAMI-3</p>
              </div>
              
              {/* Development Reset Button */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={() => {
                    localStorage.removeItem('onboardingCompleted');
                    localStorage.removeItem('postSignup_onboarding_complete');
                    localStorage.removeItem('postSignup_onboarding_progress');
                    setCurrentStepIndex(0);
                    console.log('🔄 Onboarding reset for development');
                  }}
                  className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 px-2 py-1 rounded border border-red-500/30"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-white/80">
                  Step {currentStepIndex + 1} of {onboardingSteps.length}
                </div>
                <div className="text-xs text-white/50">{currentStep?.title}</div>
              </div>

              {/* Progress Bar */}
              <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="relative"
          >
            {/* Render the current page component */}
            <div className="relative">
              {CurrentComponent && <CurrentComponent />}

            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center"
            >
              {/* Pulsing orb animation */}
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-8 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(168, 85, 247, 0.3)",
                    "0 0 0 20px rgba(168, 85, 247, 0)",
                    "0 0 0 0 rgba(168, 85, 247, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              >
                <div className="w-12 h-12 rounded-full bg-white" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h3 className="text-2xl font-light text-white mb-4 tracking-wide">
                  {currentStepIndex >= onboardingSteps.length - 1 
                    ? "Entering your private space with JAMI-3..." 
                    : "Preparing your experience..."}
                </h3>
                <p className="text-white/60">
                  {currentStepIndex >= onboardingSteps.length - 1
                    ? "Your personalized AI therapy journey begins now"
                    : "Please wait while we load the next section"}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

}