"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { scaleIn, fadeUp } from "../../utils/animations";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  const router = useRouter();

  return (
    <section id="cta" className="h-screen snap-start flex flex-col items-center justify-center bg-gradient-to-t from-gray-950 to-gray-900 relative overflow-hidden">
      {/* Background shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Floating sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-amber-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        className="text-center relative z-10 max-w-4xl mx-auto px-8"
      >
        <motion.h2 
          variants={fadeUp}
          className="text-5xl md:text-7xl font-black mb-6"
        >
          Ready to Meet{' '}
          <span className="bg-gradient-to-r from-amber-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            Jamie
          </span>
          ?
        </motion.h2>
        
        <motion.p 
          variants={fadeUp}
          className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed"
        >
          Experience the future of AI-powered therapeutic support with clinical-grade intelligence, 
          emotional understanding, and persistent memory that grows with you.
        </motion.p>

        <motion.div
          variants={scaleIn}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <button 
            onClick={() => router.push('/chat')}
            className="group bg-gradient-to-r from-amber-500 to-blue-500 text-white px-12 py-5 rounded-2xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-amber-500/25 flex items-center justify-center gap-3"
          >
            Start Your Session
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <button 
            onClick={() => router.push('/research')}
            className="group px-12 py-5 rounded-2xl text-xl font-semibold transition-all duration-300 border-2 border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white flex items-center justify-center gap-3"
          >
            Learn More
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 text-sm text-slate-400"
        >
          <p>Free 30-day trial • No credit card required • HIPAA compliant</p>
        </motion.div>
      </motion.div>
    </section>
  );
}


