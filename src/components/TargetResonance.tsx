import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
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
      duration: 1,

    }
  }
};

const textVariants = {
  hidden: { 
    opacity: 0, 
    y: 20
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8
    }
  }
};

export default function TargetResonance() {
  return (
    <section className="relative w-full py-32 flex flex-col items-center justify-center bg-gradient-to-b from-[#f7f7fa] to-transparent overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-1 h-1 bg-luna-violet/30 rounded-full"
          animate={{
            y: [0, -60, 0],
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
            y: [0, -50, 0],
            opacity: [0.2, 0.7, 0.2]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-1 h-1 bg-luna-violet/25 rounded-full"
          animate={{
            y: [0, -40, 0],
            opacity: [0.25, 0.6, 0.25]
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
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.blockquote 
          className="max-w-4xl mx-auto text-center px-6"
          variants={itemVariants}
        >
          <motion.div 
            className="p-12 rounded-4xl relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl"
            variants={textVariants}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 12px 40px rgba(156,99,255,0.15)'
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative quote marks */}
            <motion.div
              className="absolute top-4 left-6 text-6xl text-luna-violet/20 font-serif"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              "
            </motion.div>
            <motion.div
              className="absolute bottom-4 right-6 text-6xl text-luna-violet/20 font-serif"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              "
            </motion.div>
            
            <motion.div
              className="text-2xl md:text-3xl lg:text-4xl font-wisdom font-light italic tracking-wide text-soft-midnight leading-relaxed space-y-6"
              variants={containerVariants}
            >
              <motion.p 
                variants={textVariants}
                className="mb-6"
              >
                If therapy has ever felt too expensive, too judgmental, too distant, too broken—
              </motion.p>
              
              <motion.p 
                variants={textVariants}
                className="font-bold text-luna-violet bg-gradient-to-r from-luna-violet to-[#7e57c2] bg-clip-text text-transparent text-3xl md:text-4xl"
              >
                Luna was built for you.
              </motion.p>
              
              <motion.p 
                variants={textVariants}
                className="mt-8 mb-6"
              >
                If you've ever needed someone and no one came—
              </motion.p>
              
              <motion.p 
                variants={textVariants}
                className="font-bold text-luna-violet bg-gradient-to-r from-luna-violet to-[#7e57c2] bg-clip-text text-transparent text-3xl md:text-4xl"
              >
                Luna is what came next.
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.blockquote>
        
        {/* Attribution */}
        <motion.div 
          className="mt-8 text-center"
          variants={itemVariants}
        >
          <p className="text-lg text-soft-midnight/70 font-body">
            — The Luna Team
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
} 