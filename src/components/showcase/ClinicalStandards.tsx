"use client";
import { motion } from "framer-motion";
import { fadeUp, floatLoop } from "../../utils/animations";
import { Shield, Globe, Activity, CheckCircle } from "lucide-react";

const stats = [
  { 
    num: "99.9%", 
    label: "Uptime", 
    icon: <Shield className="w-8 h-8 text-emerald-400" />,
    color: "from-emerald-500 to-teal-500"
  },
  { 
    number: "60+", 
    label: "Guidance sources", 
    icon: <Globe className="w-8 h-8 text-blue-400" />,
    color: "from-blue-500 to-indigo-500"
  },
  { 
    number: "24/7", 
    label: "Support", 
    icon: <Activity className="w-8 h-8 text-purple-400" />,
    color: "from-purple-500 to-violet-500"
  },
  { 
    number: "HIPAA", 
    label: "Compliant", 
    icon: <CheckCircle className="w-8 h-8 text-amber-400" />,
    color: "from-amber-500 to-orange-500"
  },
];

export default function ClinicalStandards() {
  return (
    <section id="standards" className="h-screen snap-start flex flex-col items-center justify-center bg-gray-950">
      <motion.h2 
        initial="hidden" 
        whileInView="visible" 
        variants={fadeUp} 
        className="text-4xl font-bold mb-12 text-center"
      >
        Clinical Standards
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-8">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            variants={floatLoop}
            animate="animate"
            className="text-center group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${s.color}/20 backdrop-blur-xl border border-slate-600/40 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg`}>
              {s.icon}
            </div>
            
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
              className="text-4xl font-bold text-white mb-2"
            >
              {s.num || s.number}
            </motion.h3>
            
            <p className="text-gray-400 text-sm">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Background floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"
          animate={{ 
            x: [0, 20, 0], 
            y: [0, -20, 0] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, 30, 0] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}


