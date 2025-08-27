import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Shield, 
  Database, 
  Layers, 
  ArrowRight, 
  SkipForward 
} from 'lucide-react';
import Link from 'next/link';

const UnderTheHood: React.FC<{ 
  onExploreSystem: () => void; 
  onSkipToJAMI: () => void; 
}> = ({ onExploreSystem, onSkipToJAMI }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-8 relative">
      {/* GPT-5 Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#ff6b9d] via-[#c44cff] via-[#7c3aed] via-[#3b82f6] to-[#06b6d4] animate-gradient-beam pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-tr from-[#fbbf24] via-[#f97316] via-[#dc2626] to-[#be185d] opacity-70 mix-blend-multiply pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-pink-500/8 via-purple-500/6 to-orange-500/8 mix-blend-screen pointer-events-none" />
      <div className="fixed inset-0 bg-black/6 backdrop-blur-sm pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-wide">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold">Under the Hood</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Go behind the scenes and see how JAMI-3 and Lightwell's architecture work together to deliver therapy at clinical scale.
          </p>
        </motion.div>

        {/* System Architecture Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-3 text-lg">Adaptive AI Architecture</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Machine learning models dynamically adjust to individual therapeutic needs
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-3 text-lg">Clinical-Grade Security</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              End-to-end encryption with HIPAA-compliant data handling
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col md:flex-row justify-center gap-4"
        >
          <button
            onClick={onExploreSystem}
            className="flex items-center justify-center gap-2 px-10 py-4 bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/20 text-white rounded-full transition-all duration-300 font-semibold"
            style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}
          >
            Explore the System
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          <button
            onClick={onSkipToJAMI}
            className="flex items-center justify-center gap-2 px-10 py-4 bg-transparent border border-white/30 text-white hover:bg-white/10 rounded-full transition-all duration-300 backdrop-blur-md font-medium"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
          >
            Skip to JAMI-3
            <SkipForward className="w-5 h-5 ml-2" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default UnderTheHood;

