import React from 'react';
import { motion } from 'framer-motion';
import { 
  Microscope, 
  TrendingUp, 
  Award, 
  Clock, 
  Star, 
  FileText, 
  Users, 
  Zap,
  Brain,
  Heart,
  Shield,
  Globe
} from 'lucide-react';
import { comprehensiveContentData } from '../../../data/comprehensiveEducationalContent';

const ResearchUpdates: React.FC = () => {
  const researchContent = comprehensiveContentData.filter(content => 
    content.type === 'research-study'
  );

  const researchHighlights = [
    {
      title: 'Digital Therapeutics Efficacy',
      description: 'FDA-approved digital therapeutics showing 40-60% improvement rates',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-blue-500',
      year: 2025,
    },
    {
      title: 'Precision Psychiatry',
      description: 'Genetic testing improving medication selection outcomes by 35%',
      icon: <Brain className="w-6 h-6" />,
      color: 'bg-purple-500',
      year: 2025,
    },
    {
      title: 'Psychedelic-Assisted Therapy',
      description: 'MDMA and psilocybin showing breakthrough results for PTSD and depression',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-green-500',
      year: 2025,
    },
    {
      title: 'AI Therapy Validation',
      description: 'AI therapy achieving F1 scores of 0.929 for mental health screening',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-orange-500',
      year: 2025,
    },
    {
      title: 'VR Therapy Breakthrough',
      description: 'Virtual reality therapy creating measurable brain changes in 8-12 sessions',
      icon: <Globe className="w-6 h-6" />,
      color: 'bg-pink-500',
      year: 2025,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Research Highlights */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-4">
          Latest Research Highlights (2024-2025)
        </h2>
        <p className="text-luna-600 dark:text-luna-400 mb-6">
          Cutting-edge developments in mental health research, digital therapeutics, and innovative treatment approaches.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchHighlights.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-luna-700 rounded-lg p-6 shadow-lg border border-luna-200 dark:border-luna-600"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-lg text-white ${highlight.color}`}>
                  {highlight.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-luna-800 dark:text-luna-200">
                    {highlight.title}
                  </h3>
                  <span className="text-sm text-luna-500 dark:text-luna-400">
                    {highlight.year}
                  </span>
                </div>
              </div>
              <p className="text-sm text-luna-600 dark:text-luna-400">
                {highlight.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Research Categories */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-luna-700 dark:text-luna-300 mb-4">
          Research Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            'Digital Therapeutics',
            'Precision Psychiatry',
            'Psychedelic Therapy',
            'AI in Mental Health',
            'Virtual Reality Therapy',
            'Biomarker Development',
            'Neuroplasticity Research',
            'Microinterventions',
          ].map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-luna-100 dark:bg-luna-600 rounded-lg p-4 text-center hover:bg-luna-200 dark:hover:bg-luna-500 transition duration-300 cursor-pointer"
            >
              <Microscope className="w-6 h-6 mx-auto mb-2 text-luna-500 dark:text-luna-300" />
              <span className="text-sm font-medium text-luna-700 dark:text-luna-300">
                {category}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Latest Research Articles */}
      <div>
        <h3 className="text-xl font-bold text-luna-700 dark:text-luna-300 mb-4">
          Latest Research Articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchContent.slice(0, 6).map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-luna-700 rounded-lg shadow-lg overflow-hidden border border-luna-200 dark:border-luna-600"
            >
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Microscope className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-luna-500 dark:text-luna-400">
                    {content.researchYear}
                  </span>
                  {content.evidenceLevel && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                      {content.evidenceLevel.replace('level-', 'Level ')}
                    </span>
                  )}
                </div>

                <h4 className="font-semibold text-luna-800 dark:text-luna-200 mb-2 line-clamp-2">
                  {content.title}
                </h4>
                <p className="text-sm text-luna-600 dark:text-luna-400 mb-4 line-clamp-3">
                  {content.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-luna-500 dark:text-luna-400">
                    {content.author}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-luna-400" />
                    <span className="text-sm text-luna-500 dark:text-luna-400">
                      {content.readTime} min
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <button className="w-full px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300 text-sm font-medium">
                    Read Research
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Research Statistics */}
      <div className="bg-gradient-to-r from-luna-500 to-dream-500 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Research Impact</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">150+</div>
            <div className="text-sm opacity-90">Research Studies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">25+</div>
            <div className="text-sm opacity-90">Clinical Trials</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">50+</div>
            <div className="text-sm opacity-90">Expert Authors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">2025</div>
            <div className="text-sm opacity-90">Latest Updates</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchUpdates; 