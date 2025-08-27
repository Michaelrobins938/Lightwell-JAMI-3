"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { counterTransition, fadeUp } from "../../utils/animations";
import { Activity, TrendingUp, Users, Clock, Brain } from "lucide-react";

export default function LearningSystem() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ width: "100%", transition: { duration: 2, ease: "easeInOut" } });
  }, [controls]);

  const metrics = [
    { num: 5, label: "Learning Models", icon: <Brain className="w-6 h-6 text-blue-400" /> },
    { num: 6, label: "Adaptive Layers", icon: <TrendingUp className="w-6 h-6 text-emerald-400" /> },
    { num: 4, label: "Memory Systems", icon: <Users className="w-6 h-6 text-purple-400" /> },
    { num: 253, label: "Response Time (ms)", icon: <Clock className="w-6 h-6 text-amber-400" /> },
  ];

  const AnimatedNumber = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      let start: number | null = null;
      const duration = 1000; // 1 second animation

      const animate = (currentTime: number) => {
        if (!start) start = currentTime;
        const progress = (currentTime - start) / duration;
        const animatedValue = Math.min(progress, 1) * value;
        setDisplayValue(Math.floor(animatedValue));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [value]);

    return <span className="text-3xl font-bold text-white">{displayValue}</span>;
  };

  return (
    <section id="learning" className="h-screen snap-start flex flex-col items-center justify-center bg-gray-950">
      <motion.h2 
        initial="hidden" 
        whileInView="visible" 
        variants={fadeUp} 
        className="text-4xl font-bold mb-12 text-center"
      >
        Watch Jamie Learn
      </motion.h2>

      <div className="bg-gradient-to-br from-slate-800/40 via-slate-700/40 to-slate-800/40 backdrop-blur-xl border border-slate-700/40 p-8 rounded-3xl shadow-2xl max-w-4xl w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-8">
          {metrics.map((metric, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-2 text-gray-400">
                {metric.icon}
                <span className="text-sm">{metric.label}</span>
              </div>
              <AnimatedNumber value={metric.num} />
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Learning Progress</span>
            <span>100%</span>
          </div>
          <motion.div
            initial={{ width: "0%" }}
            whileInView={controls}
            className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"
          />
        </div>

        {/* Live activity indicator */}
        <motion.div 
          className="mt-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Jamie is actively learning from this session...</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}