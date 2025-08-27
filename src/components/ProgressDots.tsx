"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useScrollSpy } from "../hooks/useScrollSpy";

const sections = [
  { id: "hero", label: "Hero", icon: "✦" },
  { id: "mission", label: "Mission", icon: "◉" },
  { id: "principles", label: "Principles", icon: "◈" },
  { id: "innovations", label: "Innovation", icon: "◊" },
  { id: "impact", label: "Impact", icon: "◎" },
  { id: "future", label: "Future", icon: "★" },
];

export default function ProgressDots() {
  const activeId = useScrollSpy(sections.map((s) => s.id), 100);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      className={`
        fixed top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3
        ${isMobile ? 'right-2 scale-75' : 'right-6'}
        progress-dots
      `}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      {/* Mobile: Thin rail design */}
      {isMobile && (
        <div className="absolute inset-0 w-1 bg-slate-700/30 rounded-full left-1/2 -translate-x-1/2" />
      )}
      
      {sections.map((s, index) => (
        <motion.a 
          key={s.id} 
          href={`#${s.id}`} 
          className="group relative flex items-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className={`
              ${isMobile 
                ? 'w-2 h-2 rounded-full bg-slate-500 group-hover:bg-blue-400' 
                : 'w-4 h-4 rounded-full bg-slate-500 group-hover:bg-blue-400 border-2 border-slate-700'
              }
              relative z-10
            `}
            animate={{
              scale: activeId === s.id ? (isMobile ? 1.5 : 1.3) : 1,
              backgroundColor: activeId === s.id ? "#3B82F6" : "#64748b",
              boxShadow: activeId === s.id 
                ? "0 0 20px rgba(59, 130, 246, 0.6)" 
                : "none"
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Active indicator glow */}
            {activeId === s.id && (
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 0.2, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
          
          {/* Desktop: Enhanced tooltip with icon */}
          <motion.div 
            className="hidden lg:flex absolute right-8 items-center gap-2 px-3 py-2 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-xl text-sm text-slate-300 shadow-xl"
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            whileHover={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-blue-400">{s.icon}</span>
            <span>{s.label}</span>
          </motion.div>
          
          {/* Mobile: Mini label on active */}
          {isMobile && activeId === s.id && (
            <motion.div
              className="absolute right-6 px-2 py-1 bg-blue-500/90 rounded text-xs text-white whitespace-nowrap"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {s.label}
            </motion.div>
          )}
        </motion.a>
      ))}
      
      {/* Progress indicator line for mobile */}
      {isMobile && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-blue-400/60 rounded-full"
          style={{
            height: `${(sections.findIndex(s => s.id === activeId) + 1) * (100 / sections.length)}%`,
            top: 0
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      )}
    </motion.div>
  );
}