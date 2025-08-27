import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

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
    y: 40,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8
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

export default function FinalCTA() {
  const router = useRouter();
  return (
    <section className="relative max-w-screen-xl mx-auto px-6 py-32 flex flex-col items-center justify-center glass-card overflow-hidden shadow-2xl">
      {/* Enhanced gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#b39ddb]/40 via-white/60 to-[#18122B]/10 pointer-events-none z-0" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-1/4 w-1 h-1 bg-luna-violet/30 rounded-full"
          animate={{
            y: [0, -50, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-1.5 h-1.5 bg-luna-violet/20 rounded-full"
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-1 h-1 bg-luna-violet/25 rounded-full"
          animate={{
            y: [0, -30, 0],
            opacity: [0.25, 0.7, 0.25]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-center mb-8 text-soft-midnight drop-shadow-lg leading-tight"
        >
          You weren't meant to do this alone. <span className="text-luna-violet bg-gradient-to-r from-luna-violet to-[#7e57c2] bg-clip-text text-transparent">But you've been carrying it anyway.</span>
        </motion.h2>
        
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-soft-midnight text-center mb-12 font-body leading-relaxed max-w-3xl mx-auto"
        >
          Luna can't be everything. But it can be{' '}
          <span className="font-semibold text-luna-violet bg-gradient-to-r from-luna-violet to-[#7e57c2] bg-clip-text text-transparent">
            something
          </span>
          .
        </motion.p>
        
        <motion.div 
          className="flex flex-col md:flex-row gap-6 items-center justify-center w-full"
          variants={itemVariants}
        >
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="neuro-button neuro-button--primary px-12 py-5 text-xl rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-luna-violet transition-all duration-200 font-semibold"
            aria-label="Start Healing Now"
            onClick={() => router.push('/onboarding')}
          >
            Start Healing Now
          </motion.button>
          
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="neuro-button neuro-button--secondary px-12 py-5 text-xl rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-luna-violet transition-all duration-200 font-semibold border-2 border-luna-violet text-luna-violet bg-white hover:bg-luna-violet hover:text-white hover:border-luna-violet"
            aria-label="Learn Our Story"
            onClick={() => router.push('/about')}
          >
            Learn Our Story
          </motion.button>
        </motion.div>
        
        {/* Trust indicators */}
        <motion.div 
          className="mt-12 flex flex-wrap justify-center gap-8 text-soft-midnight/70 text-sm"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Free to start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span>No commitment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span>Always confidential</span>
          </div>
        </motion.div>
        
        {/* Subtle call to action */}
        <motion.p 
          className="mt-8 text-sm text-soft-midnight/60 text-center max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Join thousands who have found support through Luna. Your journey to better mental health starts with a single conversation.
        </motion.p>
      </motion.div>
    </section>
  );
} 