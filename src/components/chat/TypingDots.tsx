import { motion } from 'framer-motion';

export default function TypingDots() {
  return (
    <div className="flex items-center space-x-1" style={{ padding: '4px 0' }}>
      <motion.div
        className="w-2 h-2 bg-gray-600 rounded-full"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ 
          duration: 1.2, 
          repeat: Infinity, 
          delay: 0, 
          ease: "easeInOut",
          times: [0, 0.33, 1]
        }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-600 rounded-full"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ 
          duration: 1.2, 
          repeat: Infinity, 
          delay: 0.2, 
          ease: "easeInOut",
          times: [0, 0.33, 1]
        }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-600 rounded-full"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ 
          duration: 1.2, 
          repeat: Infinity, 
          delay: 0.4, 
          ease: "easeInOut",
          times: [0, 0.33, 1]
        }}
      />
    </div>
  );
}


