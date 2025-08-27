"use client";
import { motion } from "framer-motion";
import { fadeUp, staggerParent, scaleIn } from "../../utils/animations";
import { Brain, Heart, Shield, Zap } from "lucide-react";

const features = [
  { 
    title: "Clinical Intelligence", 
    desc: "Advanced clinical models with CBT, DBT, ACT foundations.",
    icon: <Brain className="w-8 h-8 text-blue-400" />,
    color: "from-blue-500 to-indigo-500"
  },
  { 
    title: "Emotional Intelligence", 
    desc: "Empathy-first dialogue, tone matching, non-judgmental.",
    icon: <Heart className="w-8 h-8 text-pink-400" />,
    color: "from-pink-500 to-rose-500"
  },
  { 
    title: "Crisis Detection", 
    desc: "Real-time detection of crisis signals, escalating when needed.",
    icon: <Shield className="w-8 h-8 text-emerald-400" />,
    color: "from-emerald-500 to-teal-500"
  },
  { 
    title: "Persistent Memory", 
    desc: "Session-to-session recall of user context with safety filters.",
    icon: <Zap className="w-8 h-8 text-amber-400" />,
    color: "from-amber-500 to-orange-500"
  },
];

export default function ClinicalExcellence() {
  return (
    <section id="excellence" className="h-screen snap-start flex flex-col items-center justify-center bg-gray-950">
      <motion.h2 
        initial="hidden" 
        whileInView="visible" 
        variants={fadeUp} 
        className="text-4xl font-bold mb-12 text-center"
      >
        Clinical Excellence
      </motion.h2>

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-8"
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            variants={scaleIn}
            className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-800/40 backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-slate-900/30 relative overflow-hidden h-full group"
          >
            {/* Ambient glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 via-blue-500/50 to-purple-500/50 opacity-60" />
            
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color}/20 backdrop-blur-xl border border-slate-600/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
              {f.icon}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors duration-300">
              {f.title}
            </h3>
            
            <p className="text-slate-300 leading-relaxed mb-6 text-sm">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}


