import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Zap, GitBranch, FileCode, Terminal, Users } from 'lucide-react';
import { fadeIn, scaleIn, slideDown } from '../utils/animations';

interface CodexPageProps {
  onGetStarted?: () => void;
  className?: string;
}

const CodexPage: React.FC<CodexPageProps> = ({ onGetStarted, className = '' }) => {
  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Code Analysis',
      description: 'Understand complex codebases instantly',
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: 'Code Execution',
      description: 'Run and test code in secure environments',
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: 'Pull Requests',
      description: 'Draft comprehensive pull requests automatically',
    },
  ];

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-950 p-8 ${className}`}>
      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="relative mb-8"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-full mx-auto flex items-center justify-center shadow-2xl">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Code className="w-12 h-12 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-200 mb-4"
          variants={slideDown}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          Move faster with{' '}
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Codex
          </span>
        </motion.h1>

        <motion.p
          className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
          variants={slideDown}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          A cloud-based software engineering agent that answers codebase questions, 
          executes code, and drafts pull requests.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors"
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <div className="text-blue-400">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={onGetStarted}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Get Started</span>
            <motion.div
              className="flex items-center"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CodexPage;