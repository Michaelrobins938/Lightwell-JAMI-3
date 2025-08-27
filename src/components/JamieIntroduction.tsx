import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NarratorOrbComponent } from './visuals/NarratorOrb';

const panels = [
  {
    title: 'Clinical Rigor & Evidence-Based Practice',
    content: 'Jamie is trained on DSM-5, CBT, DBT, trauma-informed care, and more. Every response is grounded in clinical best practices and reviewed by mental health professionals.',
    icon: '🧠',
    gradient: 'from-[#9C63FF] to-[#5e35b1]'
  },
  {
    title: 'Security, Privacy, and Compliance',
    content: 'HIPAA/GDPR compliant, SOC2-ready infrastructure, encrypted data, and strict access controls. Your privacy and safety are always our top priority.',
    icon: '🔒',
    gradient: 'from-[#f472b6] to-[#ec4899]'
  },
  {
    title: 'Advanced AI Capabilities',
    content: 'Real-time emotional intelligence, crisis detection, contextual memory, and multimodal input. Jamie adapts to your needs and context.',
    icon: '⚡',
    gradient: 'from-[#4facfe] to-[#00f2fe]'
  },
  {
    title: 'Human-AI Collaboration',
    content: 'Seamless handoff to human therapists, hybrid sessions, and transparent AI reasoning. Jamie augments—not replaces—human care.',
    icon: '🤝',
    gradient: 'from-[#34d399] to-[#10b981]'
  },
  {
    title: 'Integration & Interoperability',
    content: 'API-first design, SSO, EHR/HR integration, and customizable workflows for organizations and clinics.',
    icon: '🔗',
    gradient: 'from-[#667eea] to-[#764ba2]'
  }
];

function JamieOrb() {
  return (
    <div className="w-full h-full relative">
      <NarratorOrbComponent
        isVisible={true}
        intensity={1.2}
        audioLevel={0.3}
        className="w-full h-full"
      />
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6
    }
  }
};

export default function JamieIntroduction() {
  const [open, setOpen] = useState(0);
  
  return (
    <section className="relative max-w-screen-xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-16 overflow-hidden">
      {/* Enhanced background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7f7fa] via-white/80 to-[#b39ddb]/10 pointer-events-none z-0" />
      
      {/* Left: Enhanced glass avatar housing */}
      <motion.div 
        className="flex flex-col items-center justify-center w-full md:w-1/2 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div 
          className="glass-card glass-avatar-housing w-64 h-64 rounded-full flex items-center justify-center mb-6 relative shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 25px 50px rgba(156,99,255,0.2)'
          }}
        >
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <JamieOrb />
          </div>
          <motion.div
            className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-green-400 border-4 border-white shadow-lg z-10"
            title="Status: Online"
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ 
              scale: [0.8, 1.1, 0.9, 1], 
              opacity: [0.7, 1, 0.8, 1],
              boxShadow: [
                '0 0 10px rgba(34,197,94,0.5)',
                '0 0 20px rgba(34,197,94,0.8)',
                '0 0 10px rgba(34,197,94,0.5)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          />
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-display font-bold text-luna-violet mb-2"
          variants={itemVariants}
        >
          Meet Jamie
        </motion.h2>
        <motion.p 
          className="text-lg text-soft-midnight text-center mb-4 max-w-md"
          variants={itemVariants}
        >
          Enterprise-grade AI companion engineered for emotional intelligence
        </motion.p>
      </motion.div>
      
      {/* Right: Enhanced accordion/tabs */}
      <motion.div 
        className="w-full md:w-1/2 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="space-y-4">
          {panels.map((panel, i) => (
            <motion.div
              key={panel.title}
              variants={itemVariants}
              className={`glass-card glass-panel p-6 transition-all duration-300 ${
                open === i 
                  ? 'shadow-2xl ring-2 ring-luna-violet/30 bg-white/10' 
                  : 'shadow-lg hover:shadow-xl hover:bg-white/5'
              }`}
              whileHover={{ 
                scale: 1.01, 
                boxShadow: '0 8px 32px 0 rgba(156,99,255,0.10)' 
              }}
            >
              <button
                className="w-full text-left text-lg font-heading font-semibold text-luna-violet focus:outline-none focus:ring-2 focus:ring-luna-violet/50 rounded-lg p-2 flex justify-between items-center transition-all duration-200 hover:text-luna-violet/80"
                aria-expanded={open === i}
                aria-controls={`panel-content-${i}`}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${panel.gradient} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                    {panel.icon}
                  </div>
                  {panel.title}
                </div>
                <motion.span
                  className="ml-2 text-2xl font-light"
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {open === i ? '−' : '+'}
                </motion.span>
              </button>
              
              {open === i && (
                <motion.div
                  id={`panel-content-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden mt-4 text-soft-midnight text-base leading-relaxed"
                >
                  {panel.content}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-8 flex justify-center"
          variants={itemVariants}
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(156,99,255,0.18)' }}
            whileTap={{ scale: 0.97 }}
            className="neuro-button neuro-button--primary px-8 py-4 text-lg rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-luna-violet transition-all duration-200"
            aria-label="Learn how Jamie integrates with your team"
          >
            Learn how Jamie integrates with your team
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
} 