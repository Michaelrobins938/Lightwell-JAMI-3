import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { 
  ArrowRight, 
  Star, 
  Shield, 
  Brain, 
  Heart, 
  Users,
  Sparkles,
  Play
} from 'lucide-react';

export default function PreOnboarding() {
  const router = useRouter();

  const handleStartSession = () => {
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
    if (token) {
      // User is logged in, go to onboarding
      router.push('/onboarding');
    } else {
      // User needs to login/signup first
      router.push('/login');
    }
  };

  const handleLearnMore = () => {
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gpt5-slate-950 via-gpt5-slate-900 to-gpt5-black text-white relative overflow-hidden">
      {/* Enhanced GPT-5 Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-gpt5-amber-start/10 via-gpt5-pink/8 to-gpt5-purple/6" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gpt5-amber-start/8 via-gpt5-orange/4 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-gpt5-purple/6 via-gpt5-pink/3 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gpt5-purple-end/4 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.015] bg-noise-pattern mix-blend-overlay" />
      </div>

      {/* Floating Orbs Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-1/4 w-32 h-32 bg-gpt5-amber-start/10 rounded-full blur-3xl"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-48 h-48 bg-gpt5-pink/8 rounded-full blur-3xl"
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/6 w-24 h-24 bg-gpt5-purple/12 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        {/* Hero Orb */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="mb-12"
        >
          <motion.div
            className="w-32 h-32 bg-gradient-to-r from-gpt5-amber-start via-gpt5-pink to-gpt5-purple rounded-full flex items-center justify-center shadow-2xl mx-auto"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(245, 158, 11, 0.3)",
                "0 0 0 30px rgba(245, 158, 11, 0)",
                "0 0 0 0 rgba(245, 158, 11, 0.3)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut"
            }}
          >
            <Brain className="w-16 h-16 text-white" />
          </motion.div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-wide mb-6">
            Ready to Meet{' '}
            <span className="bg-gpt5-beam-gradient bg-clip-text text-transparent font-semibold">
              JAMI-3
            </span>
            ?
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            Experience the future of mental healthcare. JAMI-3 is ready to begin your therapeutic 
            journey with personalized, evidence-based support available 24/7.
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mb-12 text-slate-400 text-sm"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gpt5-amber-start" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gpt5-pink" />
            <span>50,000+ Users</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-gpt5-purple fill-current" />
            <span>Clinical-Grade AI</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 w-full max-w-lg"
        >
          {/* Primary CTA - Start Session */}
          <motion.button
            onClick={handleStartSession}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-gpt5-amber-start to-gpt5-pink hover:from-gpt5-orange hover:to-gpt5-purple text-white font-semibold rounded-2xl shadow-xl shadow-gpt5-amber-start/25 flex items-center justify-center gap-3 transition-all duration-300"
          >
            <span>Start Your Session</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {/* Secondary CTA - Learn More */}
          <motion.button
            onClick={handleLearnMore}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 font-medium rounded-2xl backdrop-blur-sm flex items-center justify-center gap-3 transition-all duration-300"
          >
            <Play className="w-4 h-4" />
            <span>See How JAMI-3 Works</span>
          </motion.button>
        </motion.div>

        {/* Bottom Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="mt-12 text-center text-sm text-slate-500"
        >
          <p>Your journey to better mental health starts here</p>
        </motion.div>
      </div>

      {/* Subtle Animation Elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-1 h-8 bg-gradient-to-b from-gpt5-amber-start/50 to-transparent rounded-full"
        />
      </div>
    </div>
  );
}