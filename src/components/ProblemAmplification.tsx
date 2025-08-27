import React from 'react';
import { motion } from 'framer-motion';
import { NarratorOrbComponent } from './visuals/NarratorOrb';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,

    }
  }
};

export default function ProblemAmplification() {
  return (
    <section className="relative max-w-screen-xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center overflow-hidden">
      {/* Subtle background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7f7fa] via-white/80 to-[#b39ddb]/10 pointer-events-none z-0" />
      
      <motion.div
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Left: Enhanced problem statement */}
        <motion.div 
          className="glass-card glass-panel p-8 flex flex-col items-center justify-center"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 12px 40px rgba(156,99,255,0.15)'
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-soft-midnight mb-8 text-center leading-tight"
            variants={itemVariants}
          >
            We aren't automating therapy because it's better.
            <br />
            <span className="text-luna-violet bg-gradient-to-r from-luna-violet to-[#7e57c2] bg-clip-text text-transparent">
              We're automating it because human care has been{' '}
              <span className="underline decoration-2 underline-offset-4">priced out</span>,{' '}
              <span className="underline decoration-2 underline-offset-4">gatekept</span>, and{' '}
              <span className="underline decoration-2 underline-offset-4">withheld</span>.
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-600 text-center leading-relaxed"
            variants={itemVariants}
          >
            The system has failed too many people. Luna is our response.
          </motion.p>
        </motion.div>
      </motion.div>
      
      {/* Right: Enhanced infographic/visual */}
      <motion.div 
        className="flex items-center justify-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div 
          className="w-64 h-64 rounded-3xl glass-card glass-panel flex items-center justify-center relative overflow-hidden"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 20px 60px rgba(156,99,255,0.2)'
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-luna-violet/10 via-transparent to-[#7e57c2]/10"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          {/* 3D Narrator Orb replaces the question mark SVG */}
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <NarratorOrbComponent
              isVisible={true}
              intensity={1.1}
              audioLevel={0.2}
              className="w-full h-full"
            />
          </div>
          {/* Floating particles */}
          <motion.div
            className="absolute top-4 right-4 w-2 h-2 bg-luna-violet/60 rounded-full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-luna-violet/40 rounded-full"
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
} 