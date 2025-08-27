import React from 'react';
import { motion } from 'framer-motion';
import { 
  BrainIcon, 
  CloudIcon, 
  HandshakeIcon, 
  LockIcon, 
  ChartIcon, 
  GlobeIcon 
} from './CustomIcons';
import { useRouter } from 'next/router';

const features = [
  {
    icon: BrainIcon,
    title: 'Jamie Sessions',
    description: 'Shame-free emotional processing with clinically-trained AI',
    gradient: 'from-[#9C63FF] to-[#5e35b1]'
  },
  {
    icon: CloudIcon,
    title: 'Mood Forecasting',
    description: 'Predictive emotional intelligence and pattern recognition',
    gradient: 'from-[#b39ddb] to-[#7e57c2]'
  },
  {
    icon: HandshakeIcon,
    title: 'Hybrid Care',
    description: 'Seamless AI-to-human therapeutic handoffs',
    gradient: 'from-[#34d399] to-[#10b981]'
  },
  {
    icon: LockIcon,
    title: 'Privacy First',
    description: 'HIPAA/GDPR compliant, always secure and confidential',
    gradient: 'from-[#f472b6] to-[#ec4899]'
  },
  {
    icon: ChartIcon,
    title: 'Progress Tracking',
    description: 'Personalized insights and measurable growth',
    gradient: 'from-[#4facfe] to-[#00f2fe]'
  },
  {
    icon: GlobeIcon,
    title: 'Global Access',
    description: 'Support in 60+ countries, available 24/7',
    gradient: 'from-[#667eea] to-[#764ba2]'
  },
];

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

const cardVariants = {
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
      duration: 0.6
    }
  }
};

export default function FeatureStack() {
  const router = useRouter();
  return (
    <section className="relative max-w-screen-xl mx-auto px-6 py-24 overflow-hidden">
      {/* Subtle background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7f7fa] via-white/80 to-[#b39ddb]/10 pointer-events-none z-0" />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="relative z-10"
      >
        <motion.h2 
          variants={cardVariants}
          className="text-4xl md:text-5xl font-display font-bold text-center mb-4 text-soft-midnight"
        >
          The Luna Ecosystem
        </motion.h2>
        <motion.p 
          variants={cardVariants}
          className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto"
        >
          Comprehensive mental health support powered by clinically-trained AI
        </motion.p>
        
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="group relative"
            >
              <div className="glass-card glass-panel p-8 h-full flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-luna-violet/20">
                {/* Icon container with gradient background */}
                <div className={`relative w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-6 group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <feature.icon 
                    size={32} 
                    className="text-white drop-shadow-sm" 
                  />
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <h3 className="text-xl font-heading font-semibold text-soft-midnight mb-3 group-hover:text-luna-violet transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-base text-gray-600 leading-relaxed flex-grow">
                  {feature.description}
                </p>
                
                {/* Subtle bottom accent */}
                <div className="w-12 h-1 bg-gradient-to-r from-luna-violet/60 to-transparent rounded-full mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Call to action section */}
        <motion.div 
          variants={cardVariants}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(156,99,255,0.18)' }}
            whileTap={{ scale: 0.97 }}
            className="neuro-button neuro-button--primary px-10 py-4 text-lg rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-luna-violet transition-all duration-200"
            aria-label="Explore Luna Features"
            onClick={() => router.push('/about')}
          >
            Explore Luna Features
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
} 