import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Section {
  id: string;
  label: string;
  icon: string;
}

const sections: Section[] = [
  { id: 'hero', label: 'Hero', icon: '✦' },
  { id: 'mission', label: 'Mission', icon: '◉' },
  { id: 'principles', label: 'Principles', icon: '◈' },
  { id: 'innovations', label: 'Innovation', icon: '◊' },
  { id: 'impact', label: 'Impact', icon: '◎' },
  { id: 'future', label: 'Future', icon: '★' }
];

const SectionProgressIndicator: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => 
        document.getElementById(section.id)
      ).filter(Boolean) as HTMLElement[];

      let current = 'hero';
      
      for (const element of sectionElements) {
        const rect = element.getBoundingClientRect();
        // Consider section active when it's more than 30% visible
        if (rect.top <= window.innerHeight * 0.3 && rect.bottom >= window.innerHeight * 0.7) {
          current = element.id;
          break;
        }
      }
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      {sections.map((section, index) => (
        <motion.button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className={`
            relative group w-3 h-12 rounded-full transition-all duration-300
            ${activeSection === section.id 
              ? 'bg-gradient-to-b from-blue-400 to-purple-500' 
              : 'bg-slate-600/40 hover:bg-slate-500/60'
            }
          `}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Active indicator */}
          {activeSection === section.id && (
            <motion.div
              className="absolute -left-2 -right-2 -top-2 -bottom-2 rounded-full bg-blue-400/20 border border-blue-400/30"
              layoutId="activeIndicator"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          
          {/* Icon tooltip */}
          <motion.div
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-slate-800/90 backdrop-blur-xl border border-slate-600/30 rounded-lg px-3 py-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            initial={false}
            animate={{ x: activeSection === section.id ? -8 : 0 }}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <span className="text-blue-400">{section.icon}</span>
              {section.label}
            </div>
            {/* Arrow */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-800/90 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
          </motion.div>
          
          {/* Progress dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                activeSection === section.id ? 'bg-white' : 'bg-slate-400'
              }`}
              animate={{ 
                scale: activeSection === section.id ? 1.5 : 1,
                opacity: activeSection === section.id ? 1 : 0.6
              }}
            />
          </div>
        </motion.button>
      ))}
      
      {/* Connection line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-600/40 to-transparent" />
    </motion.div>
  );
};

export default SectionProgressIndicator;