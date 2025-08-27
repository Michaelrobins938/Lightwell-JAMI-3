"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    quote: "Jamie helped me name what I was feeling without judgment.",
    attribution: "Lena R., Crisis Recovery",
    type: "user"
  },
  {
    quote: "Luna isn't pretending to be therapy—it's holding space for it.",
    attribution: "Dr. Kelvin A., Licensed Therapist",
    type: "professional"
  },
  {
    quote: "I never thought an AI could make me feel so understood.",
    attribution: "Sam P., First Responder",
    type: "user"
  },
  {
    quote: "Luna is the only digital tool I recommend to my patients.",
    attribution: "Dr. Maya Chen, Clinical Psychologist",
    type: "professional"
  }
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

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7 } }
};

export default function SocialProofSystem() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative max-w-screen-xl mx-auto px-6 py-28 flex flex-col items-center overflow-hidden">
      {/* Subtle background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7f7fa] via-white/80 to-[#b39ddb]/10 pointer-events-none z-0" />
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-1 h-1 bg-luna-violet/30 rounded-full"
          animate={{ y: [0, -40, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-luna-violet/20 rounded-full"
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
      <motion.div
        className="relative z-10 w-full flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Featured quote */}
        <motion.div
          key={current}
          className="glass-card glass-testimonial p-12 mb-14 max-w-2xl w-full text-center shadow-2xl"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -30, scale: 0.97, transition: { duration: 0.4 } }}
          transition={{ duration: 0.7 }}
          aria-live="polite"
        >
          <motion.p className="text-2xl md:text-3xl text-soft-midnight italic mb-6">
            “{testimonials[current].quote}”
          </motion.p>
          <motion.span className="font-quote text-lg text-luna-violet">
            {testimonials[current].attribution}
          </motion.span>
        </motion.div>
        {/* Grid of secondary testimonials */}
        <motion.div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8" variants={containerVariants}>
          {testimonials.filter((_, i) => i !== current).map((t, i) => (
            <motion.div
              key={t.attribution}
              className="glass-card glass-testimonial p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300"
              variants={cardVariants}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 32px 0 rgba(156,99,255,0.10)' }}
            >
              <p className="text-lg text-soft-midnight italic mb-4">“{t.quote}”</p>
              <span className="font-quote text-base text-luna-violet">{t.attribution}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
} 