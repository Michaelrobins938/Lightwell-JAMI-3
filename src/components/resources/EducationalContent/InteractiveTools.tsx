import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  Brain, 
  Heart, 
  Shield, 
  User, 
  Clock, 
  Star, 
  Download,
  Play,
  Headphones,
  FileText,
  Award,
  TrendingUp,
  Zap
} from 'lucide-react';
import { comprehensiveContentData } from '../../../data/comprehensiveEducationalContent';

const InteractiveTools: React.FC = () => {
  const interactiveContent = comprehensiveContentData.filter(content => 
    content.type === 'interactive-assessment' || content.type === 'self-help-tool'
  );

  const toolCategories = [
    {
      title: 'Assessment Tools',
      description: 'Validated screening tools for mental health conditions',
      icon: <Brain className="w-8 h-8" />,
      color: 'bg-blue-500',
      tools: ['PHQ-9 Depression', 'GAD-7 Anxiety', 'PCL-5 PTSD', 'MDQ Bipolar', 'AUDIT Alcohol'],
    },
    {
      title: 'Coping Strategies',
      description: 'Interactive exercises and techniques for stress management',
      icon: <Heart className="w-8 h-8" />,
      color: 'bg-green-500',
      tools: ['Breathing Exercises', 'Progressive Relaxation', 'Mindfulness', 'CBT Worksheets', 'Gratitude Journal'],
    },
    {
      title: 'Crisis Resources',
      description: 'Safety planning and crisis intervention tools',
      icon: <Shield className="w-8 h-8" />,
      color: 'bg-red-500',
      tools: ['Safety Planning', 'Crisis Contacts', 'Emergency Resources', 'Support Guidelines', 'Warning Signs'],
    },
    {
      title: 'Personal Development',
      description: 'Tools for personal growth and resilience building',
      icon: <User className="w-8 h-8" />,
      color: 'bg-purple-500',
      tools: ['Goal Setting', 'Resilience Building', 'Self-Compassion', 'Wellness Planning', 'Strength Assessment'],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Interactive Tools Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-4">
          Interactive Tools & Assessments
        </h2>
        <p className="text-luna-600 dark:text-luna-400 mb-6">
          Evidence-based interactive tools, validated assessments, and self-help resources to support your mental health journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {toolCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-luna-700 rounded-lg p-6 shadow-lg border border-luna-200 dark:border-luna-600"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-lg text-white ${category.color}`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-luna-800 dark:text-luna-200">
                    {category.title}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-luna-600 dark:text-luna-400 mb-4">
                {category.description}
              </p>
              <div className="space-y-2">
                {category.tools.map((tool, toolIndex) => (
                  <div key={tool} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-luna-400 rounded-full"></div>
                    <span className="text-sm text-luna-600 dark:text-luna-400">{tool}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Interactive Tools */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-luna-700 dark:text-luna-300 mb-4">
          Featured Interactive Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interactiveContent.slice(0, 6).map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white dark:bg-luna-700 rounded-lg shadow-lg overflow-hidden border border-luna-200 dark:border-luna-600"
            >
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Wrench className="w-5 h-5 text-luna-500" />
                  {content.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  <span className="text-sm text-luna-500 dark:text-luna-400">
                    {content.type.replace('-', ' ')}
                  </span>
                </div>

                <h4 className="font-semibold text-luna-800 dark:text-luna-200 mb-2 line-clamp-2">
                  {content.title}
                </h4>
                <p className="text-sm text-luna-600 dark:text-luna-400 mb-4 line-clamp-3">
                  {content.description}
                </p>

                {content.interactiveElements && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-sm text-luna-500 dark:text-luna-400">
                      <Zap className="w-4 h-4" />
                      <span>Interactive: {content.interactiveElements.join(', ')}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
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

                <div className="flex items-center space-x-2">
                  <button className="flex-1 px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300 text-sm font-medium flex items-center justify-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Start Tool</span>
                  </button>
                  {content.downloadable && (
                    <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  {content.audioUrl && (
                    <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                      <Headphones className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tool Statistics */}
      <div className="bg-gradient-to-r from-luna-500 to-dream-500 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Interactive Tools Impact</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">25+</div>
            <div className="text-sm opacity-90">Interactive Tools</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">10+</div>
            <div className="text-sm opacity-90">Validated Assessments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">15+</div>
            <div className="text-sm opacity-90">Coping Strategies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">5+</div>
            <div className="text-sm opacity-90">Crisis Resources</div>
          </div>
        </div>
      </div>

      {/* Quick Access Tools */}
      <div>
        <h3 className="text-xl font-bold text-luna-700 dark:text-luna-300 mb-4">
          Quick Access Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'PHQ-9 Depression', icon: <Brain className="w-6 h-6" />, color: 'bg-blue-500' },
            { name: 'GAD-7 Anxiety', icon: <Heart className="w-6 h-6" />, color: 'bg-green-500' },
            { name: 'Breathing Exercise', icon: <Shield className="w-6 h-6" />, color: 'bg-purple-500' },
            { name: 'Safety Planning', icon: <User className="w-6 h-6" />, color: 'bg-red-500' },
            { name: 'CBT Worksheet', icon: <FileText className="w-6 h-6" />, color: 'bg-orange-500' },
            { name: 'Mood Tracker', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-pink-500' },
          ].map((tool, index) => (
            <motion.button
              key={tool.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-white dark:bg-luna-700 rounded-lg p-4 shadow-lg border border-luna-200 dark:border-luna-600 hover:shadow-xl transition-all duration-300 flex items-center space-x-3"
            >
              <div className={`p-2 rounded-lg text-white ${tool.color}`}>
                {tool.icon}
              </div>
              <span className="text-sm font-medium text-luna-700 dark:text-luna-300">
                {tool.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveTools; 