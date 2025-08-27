import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const features = [
  { label: 'Clinical-grade interventions', jamie: true, typical: false },
  { label: 'Crisis escalation', jamie: true, typical: false },
  { label: 'Data privacy (HIPAA/GDPR)', jamie: true, typical: false },
  { label: 'Integration with EHR/HR', jamie: true, typical: false },
  { label: 'Real-time monitoring', jamie: true, typical: false },
  { label: 'Human-AI collaboration', jamie: true, typical: false },
  { label: 'Customizable for orgs', jamie: true, typical: false },
  { label: 'Multimodal input', jamie: true, typical: false },
  { label: 'Outcome analytics', jamie: true, typical: false },
  { label: 'Accessibility', jamie: true, typical: false },
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

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6 }
  }
};

export default function ComparisonMatrix() {
  const router = useRouter();
  return (
    <section className="relative max-w-screen-xl mx-auto px-6 py-28 overflow-hidden">
      {/* Subtle background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7f7fa] via-white/80 to-[#b39ddb]/10 pointer-events-none z-0" />
      
      <motion.div
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-display font-bold text-luna-violet mb-12 text-center"
          variants={itemVariants}
        >
          How Jamie Compares
        </motion.h2>
        
        {/* Desktop: Enhanced table */}
        <motion.div 
          className="hidden md:block"
          variants={itemVariants}
        >
          <div className="glass-card glass-panel rounded-3xl overflow-hidden shadow-2xl">
            <table className="comparison-table w-full text-left" role="table" aria-label="Feature comparison between Jamie and typical AI assistants">
              <thead>
                <tr className="bg-gradient-to-r from-luna-violet/10 to-[#7e57c2]/10">
                  <th className="py-6 px-8 text-xl font-heading font-semibold text-soft-midnight">Feature</th>
                  <th className="py-6 px-8 text-xl font-heading font-semibold text-luna-violet">Jamie (Luna)</th>
                  <th className="py-6 px-8 text-xl font-heading font-semibold text-gray-500">Typical AI Assistant</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, index) => (
                  <motion.tr 
                    key={f.label} 
                    className="border-t border-gray-200/50 hover:bg-white/30 transition-colors duration-200"
                    variants={itemVariants}
                    whileHover={{ backgroundColor: 'rgba(156,99,255,0.05)' }}
                  >
                    <td className="py-4 px-8 text-base text-soft-midnight font-medium">{f.label}</td>
                    <td className="py-4 px-8 text-center">
                      {f.jamie ? (
                        <motion.span 
                          className="inline-flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-lg font-bold"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                        >
                          ✓
                        </motion.span>
                      ) : (
                        <span className="text-gray-400 text-2xl">—</span>
                      )}
                    </td>
                    <td className="py-4 px-8 text-center">
                      {f.typical ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-lg font-bold">✓</span>
                      ) : (
                        <span className="text-gray-400 text-2xl">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* Mobile: Enhanced card-based layout */}
        <motion.div 
          className="md:hidden flex flex-col gap-6"
          variants={containerVariants}
        >
          {features.map((f, index) => (
            <motion.div 
              key={f.label} 
              className="glass-card glass-panel p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 32px 0 rgba(156,99,255,0.10)' }}
            >
              <div className="text-lg font-heading font-semibold text-soft-midnight mb-4">{f.label}</div>
              <div className="space-y-3">
                <div className="flex flex-row justify-between items-center">
                  <span className="font-semibold text-luna-violet">Jamie</span>
                  {f.jamie ? (
                    <motion.span 
                      className="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-sm font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    >
                      ✓
                    </motion.span>
                  ) : (
                    <span className="text-gray-400 text-xl">—</span>
                  )}
                </div>
                <div className="flex flex-row justify-between items-center">
                  <span className="font-semibold text-gray-500">Typical AI</span>
                  {f.typical ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-sm font-bold">✓</span>
                  ) : (
                    <span className="text-gray-400 text-xl">—</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Call to action */}
        <motion.div 
          className="mt-12 text-center"
          variants={itemVariants}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 8px 32px 0 rgba(156,99,255,0.18)' }}
            whileTap={{ scale: 0.97 }}
            className="neuro-button neuro-button--primary px-8 py-4 text-lg rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-luna-violet transition-all duration-200"
            aria-label="Learn more about Jamie's capabilities"
            onClick={() => router.push('/meet-jamie')}
          >
            Learn More About Jamie
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
} 