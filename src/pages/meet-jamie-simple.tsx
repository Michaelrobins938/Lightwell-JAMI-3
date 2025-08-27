import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { ArrowRight, Heart, Brain, Star } from 'lucide-react';

const MeetJamieSimple = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <div className="container mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.h1 
            className="text-6xl font-black mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Meet <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Jamie</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your compassionate AI therapist, available 24/7 for mental health support
          </motion.p>

          <motion.button
            onClick={() => router.push('/test-ai-therapist')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl font-semibold text-white hover:shadow-lg transition-all duration-300 flex items-center gap-3 mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <span>Start Therapy Session</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Jamie Orb */}
        <motion.div 
          className="flex justify-center mb-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-3xl animate-pulse" />
            
            {/* Main orb */}
            <div className="relative w-96 h-96 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-2xl">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-white/20 to-transparent animate-pulse" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/80 animate-pulse" />
            </div>

            {/* Status indicators */}
            <div className="absolute -top-4 -right-4 px-4 py-2 bg-green-500 rounded-full text-white text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Online
              </div>
            </div>
          </div>
        </motion.div>

        {/* Simple features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <motion.div 
            className="text-center p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">AI Intelligence</h3>
            <p className="text-zinc-300">Advanced AI trained in mental health support</p>
          </motion.div>

          <motion.div 
            className="text-center p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Emotional Care</h3>
            <p className="text-zinc-300">Compassionate support when you need it most</p>
          </motion.div>

          <motion.div 
            className="text-center p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">24/7 Available</h3>
            <p className="text-zinc-300">Always here when you need support</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MeetJamieSimple;