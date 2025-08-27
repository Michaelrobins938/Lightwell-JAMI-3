
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap, Shield } from 'lucide-react';

const LightwellHero = () => {
  return (
    <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-purple-500/8 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-600/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.015] bg-noise-pattern mix-blend-overlay" />
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
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
            <Lightbulb className="w-4 h-4" />
            <span>A new era in mental wellness</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="bg-gradient-to-r from-amber-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Lightwell
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            A light in the darkness. Your compassionate AI companion for mental and emotional well-being.
          </motion.p>

          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-3 text-lg font-semibold shadow-xl backdrop-blur-sm group">
              <span>Get Started</span>
              <Zap className="w-5 h-5" />
            </button>
            <button className="bg-gradient-to-r from-slate-800/30 to-slate-700/30 backdrop-blur-xl px-8 py-4 rounded-xl border border-slate-600/40 shadow-2xl text-white hover:bg-slate-700/50 transition-colors duration-300">
              Learn More
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LightwellHero;
