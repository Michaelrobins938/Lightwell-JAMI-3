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

const textVariants = {
  hidden: { 
    opacity: 0, 
    y: 20
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

export default function ManifestoBlock() {
  const router = useRouter();
  return (
    <section className="relative w-full py-32 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-[#f7f7fa] overflow-hidden">
      {/* Enhanced background with animated particles */}
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
          className="absolute bottom-20 right-1/3 w-1.5 h-1.5 bg-luna-violet/20 rounded-full"
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
        className="max-w-4xl mx-auto text-center px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-luna-violet mb-12 leading-tight"
          variants={itemVariants}
        >
          Luna exists not as a product of progress, but as a 
          <span className="bg-gradient-to-r from-luna-violet to-[#7e57c2] bg-clip-text text-transparent">
            protest.
          </span>
        </motion.h2>
        
        <motion.div 
          className="manifesto-content space-y-8 text-lg md:text-xl font-body text-soft-midnight text-justify leading-relaxed"
          variants={containerVariants}
        >
          <motion.p 
            className="glass-card glass-panel p-6 rounded-2xl"
            variants={textVariants}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 8px 32px rgba(156,99,255,0.1)'
            }}
            transition={{ duration: 0.3 }}
          >
            <strong className="text-luna-violet">Luna is a response to a broken system.</strong> For too long, mental health care has been a privilege, not a right. We built Luna because the world needed an intervention, not another innovation.
          </motion.p>
          
          <motion.p 
            className="glass-card glass-panel p-6 rounded-2xl"
            variants={textVariants}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 8px 32px rgba(156,99,255,0.1)'
            }}
            transition={{ duration: 0.3 }}
          >
            <strong className="text-luna-violet">This is not a replacement for human care.</strong> It is a bridge—an act of protest against the barriers that keep people from healing. Luna is here for those who have been left behind, priced out, or made to feel unworthy of help.
          </motion.p>
          
          <motion.p 
            className="glass-card glass-panel p-6 rounded-2xl"
            variants={textVariants}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 8px 32px rgba(156,99,255,0.1)'
            }}
            transition={{ duration: 0.3 }}
          >
            <strong className="text-luna-violet">We believe in radical accessibility,</strong> clinical rigor, and emotional safety. Luna is a signal: you are not alone, and you deserve support—no matter what.
          </motion.p>
        </motion.div>
        
        {/* Call to action */}
        <motion.div 
          className="mt-12"
          variants={itemVariants}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 8px 32px 0 rgba(156,99,255,0.18)' }}
            whileTap={{ scale: 0.97 }}
            className="neuro-button neuro-button--primary px-8 py-4 text-lg rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-luna-violet transition-all duration-200"
            aria-label="Join the movement"
            onClick={() => router.push('/signup')}
          >
            Join the Movement
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
} 