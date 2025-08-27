"use client";
import { motion } from "framer-motion";
import { ParallaxSection } from "../../hooks/useParallax";
import { fadeUp, scaleIn, staggerParent, orbBreathing } from "../../utils/animations";
import { Shield } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="h-screen snap-start relative flex items-center justify-center overflow-hidden">
      {/* 🌌 Background layers */}
      <ParallaxSection speed={-0.1}>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-transparent blur-3xl" />
      </ParallaxSection>

      <ParallaxSection speed={-0.3}>
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-2xl opacity-50"
          variants={orbBreathing}
          animate="animate"
        />
      </ParallaxSection>

      {/* Foreground */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={staggerParent} 
        className="text-center relative z-10"
      >
        <motion.div 
          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-emerald-400/40 rounded-2xl text-emerald-300 text-sm font-semibold mb-8 shadow-2xl shadow-emerald-500/20"
          variants={scaleIn}
        >
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Clinical Grade</span>
          </div>
          <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
          <span>DSM-5 Trained</span>
          <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
          <span>Crisis Detection</span>
          <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
          <span>HIPAA Compliant</span>
        </motion.div>

        <motion.h1 
          variants={fadeUp} 
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight"
        >
          Meet{' '}
          <div className="relative inline-block">
            <span className="bg-gradient-to-r from-amber-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Jamie
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-blue-400/20 to-purple-500/20 blur-lg rounded-lg -z-10"></div>
          </div>
        </motion.h1>
        
        <motion.div 
          variants={fadeUp} 
          className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light mb-12"
        >
          Your therapeutic AI companion powered by Lightwell's breakthrough research in{' '}
          <span className="relative inline-block text-blue-400 font-semibold">
            emotional intelligence
            <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"></div>
          </span>{' '}
          and{' '}
          <span className="relative inline-block text-purple-400 font-semibold">
            persistent memory systems
            <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent"></div>
          </span>
        </motion.div>

        <motion.div 
          variants={scaleIn} 
          className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
        >
          <button
            className="bg-gradient-to-r from-amber-500 to-blue-500 text-white px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-3 group"
          >
            Start Therapy Session →
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}


