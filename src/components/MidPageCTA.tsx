import React from 'react';
import { motion } from 'framer-motion';

const ctas = [
  { label: 'Start with Luna', aria: 'Start with Luna', variant: 'primary' },
  { label: 'I\'m Done Being Alone', aria: 'I\'m Done Being Alone', variant: 'secondary' },
  { label: 'Enter the Quiet Space', aria: 'Enter the Quiet Space', variant: 'tertiary' },
];

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
      duration: 0.6,

    }
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.05, 
    boxShadow: '0 8px 32px 0 rgba(156,99,255,0.25)',
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.97,
    transition: { duration: 0.1 }
  }
};

export default function MidPageCTA() {
  return (
    <section className="relative max-w-screen-md mx-auto px-6 py-24 flex flex-col items-center overflow-hidden">
      {/* Subtle background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7f7fa] via-white/80 to-[#b39ddb]/10 pointer-events-none z-0" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-1 h-1 bg-luna-violet/30 rounded-full"
          animate={{
            y: [0, -40, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-luna-violet/20 rounded-full"
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <motion.div 
        className="w-full flex flex-col md:flex-row gap-6 items-center justify-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {ctas.map((cta, i) => (
          <motion.button
            key={cta.label}
            className={`neuro-button neuro-button--${cta.variant} min-h-[48px] px-8 py-4 text-lg font-semibold rounded-full focus:outline-none focus:ring-4 focus:ring-luna-violet transition-all duration-200 shadow-lg hover:shadow-xl`}
            aria-label={cta.aria}
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => {
              if (typeof window !== "undefined" && Array.isArray((window as any).dataLayer)) {
                (window as any).dataLayer.push({ event: 'cta_click', label: cta.label });
              }
            }}
          >
            {cta.label}
          </motion.button>
        ))}
      </motion.div>
      
      {/* Trust indicators */}
      <motion.div 
        className="mt-8 flex flex-wrap justify-center gap-6 text-soft-midnight/60 text-sm"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <motion.div 
          className="flex items-center gap-2"
          variants={itemVariants}
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>Free to start</span>
        </motion.div>
        <motion.div 
          className="flex items-center gap-2"
          variants={itemVariants}
        >
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span>No commitment</span>
        </motion.div>
        <motion.div 
          className="flex items-center gap-2"
          variants={itemVariants}
        >
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span>Always confidential</span>
        </motion.div>
      </motion.div>
    </section>
  );
} 