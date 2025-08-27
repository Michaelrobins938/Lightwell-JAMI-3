import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { 
  Lightbulb, 
  Heart, 
  Brain, 
  Shield, 
  Clock, 
  Star,
  CheckCircle,
  TrendingUp,
  Zap,
  BookOpen
} from 'lucide-react';

const WellnessTips: React.FC = () => {
  const tips = [
    {
      id: 1,
      title: '5-Minute Morning Mindfulness',
      description: 'Start your day with a simple mindfulness practice to set a positive tone.',
      category: 'Mindfulness',
      difficulty: 'Beginner',
      time: '5 minutes',
      icon: <Brain className="w-6 h-6" />,
      color: 'bg-blue-500',
      steps: [
        'Find a comfortable seated position',
        'Close your eyes and take 3 deep breaths',
        'Focus on your breath for 5 minutes',
        'Notice thoughts without judgment',
        'End with gratitude for the new day'
      ],
      benefits: ['Reduced stress', 'Improved focus', 'Better mood', 'Increased awareness']
    },
    {
      id: 2,
      title: 'Progressive Muscle Relaxation',
      description: 'A systematic technique to release physical tension and promote relaxation.',
      category: 'Relaxation',
      difficulty: 'Beginner',
      time: '10 minutes',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-green-500',
      steps: [
        'Lie down in a comfortable position',
        'Start with your toes, tense for 5 seconds',
        'Release and feel the relaxation',
        'Move up through each muscle group',
        'End with full body relaxation'
      ],
      benefits: ['Reduced muscle tension', 'Better sleep', 'Lower anxiety', 'Improved circulation']
    },
    {
      id: 3,
      title: 'Gratitude Journal Practice',
      description: 'Cultivate a positive mindset through daily gratitude practice.',
      category: 'Positive Psychology',
      difficulty: 'Beginner',
      time: '5 minutes',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-purple-500',
      steps: [
        'Write down 3 things you\'re grateful for',
        'Be specific about why you appreciate them',
        'Reflect on how they make you feel',
        'Practice daily for best results',
        'Review your entries weekly'
      ],
      benefits: ['Increased happiness', 'Better relationships', 'Reduced stress', 'Improved sleep']
    },
    {
      id: 4,
      title: 'Digital Detox Hour',
      description: 'Take a break from technology to reconnect with yourself and others.',
      category: 'Digital Wellness',
      difficulty: 'Intermediate',
      time: '60 minutes',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-orange-500',
      steps: [
        'Set aside one hour without devices',
        'Choose an engaging offline activity',
        'Spend time in nature if possible',
        'Connect with loved ones face-to-face',
        'Reflect on how you feel afterward'
      ],
      benefits: ['Reduced anxiety', 'Better sleep', 'Improved relationships', 'Increased creativity']
    },
    {
      id: 5,
      title: 'Mindful Walking',
      description: 'Transform your daily walk into a mindfulness practice.',
      category: 'Mindfulness',
      difficulty: 'Beginner',
      time: '15 minutes',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-pink-500',
      steps: [
        'Walk at a natural, comfortable pace',
        'Focus on the sensation of your feet',
        'Notice your breathing rhythm',
        'Observe your surroundings mindfully',
        'Return to walking when mind wanders'
      ],
      benefits: ['Reduced stress', 'Improved mood', 'Better cardiovascular health', 'Increased awareness']
    },
    {
      id: 6,
      title: 'Evening Reflection Ritual',
      description: 'End your day with intention and self-reflection.',
      category: 'Self-Care',
      difficulty: 'Beginner',
      time: '10 minutes',
      icon: <Star className="w-6 h-6" />,
      color: 'bg-indigo-500',
      steps: [
        'Find a quiet, comfortable space',
        'Reflect on one positive moment today',
        'Acknowledge one challenge you faced',
        'Set an intention for tomorrow',
        'Express gratitude for the day'
      ],
      benefits: ['Better sleep', 'Reduced anxiety', 'Increased self-awareness', 'Improved planning']
    }
  ];

  const categories = [
    { name: 'Mindfulness', count: 8, color: 'bg-blue-500' },
    { name: 'Relaxation', count: 6, color: 'bg-green-500' },
    { name: 'Positive Psychology', count: 5, color: 'bg-purple-500' },
    { name: 'Digital Wellness', count: 4, color: 'bg-orange-500' },
    { name: 'Self-Care', count: 7, color: 'bg-pink-500' },
    { name: 'Physical Health', count: 6, color: 'bg-indigo-500' },
  ];

  return (
    <Layout>
      <Head>
        <title>Wellness Tips | Luna</title>
        <meta name="description" content="Practical wellness tips and strategies for mental health and emotional well-being." />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-luna-50 to-luna-100 dark:from-luna-900 dark:to-luna-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-luna-500 rounded-full">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-luna-800 dark:text-luna-200 mb-6">
              Wellness Tips
            </h1>
            <p className="text-xl text-luna-600 dark:text-luna-400 max-w-3xl mx-auto">
              Practical strategies and techniques to support your mental health and emotional well-being.
            </p>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-6">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="bg-white dark:bg-luna-700 rounded-lg p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-4 h-4 rounded-full ${category.color} mx-auto mb-2`}></div>
                  <h3 className="font-semibold text-luna-700 dark:text-luna-300 text-sm">
                    {category.name}
                  </h3>
                  <p className="text-xs text-luna-500 dark:text-luna-400">
                    {category.count} tips
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Wellness Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-6">Featured Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tips.map((tip, index) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-luna-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-3 rounded-lg text-white ${tip.color}`}>
                        {tip.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-luna-800 dark:text-luna-200 line-clamp-2">
                          {tip.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-luna-500 dark:text-luna-400">{tip.category}</span>
                          <span className="text-xs text-luna-500 dark:text-luna-400">•</span>
                          <span className="text-xs text-luna-500 dark:text-luna-400">{tip.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-luna-600 dark:text-luna-400 mb-4">
                      {tip.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-luna-500 dark:text-luna-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{tip.time}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-luna-700 dark:text-luna-300 mb-2">Steps:</h4>
                      <div className="space-y-1">
                        {tip.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-start space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-luna-600 dark:text-luna-400">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-luna-700 dark:text-luna-300 mb-2">Benefits:</h4>
                      <div className="flex flex-wrap gap-1">
                        {tip.benefits.map((benefit, benefitIndex) => (
                          <span key={benefitIndex} className="px-2 py-1 bg-luna-100 dark:bg-luna-600 text-luna-600 dark:text-luna-300 rounded-full text-xs">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button className="w-full px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300 text-sm font-medium">
                      Try This Tip
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-luna-500 to-dream-500 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Start Your Wellness Journey</h3>
              <p className="text-lg opacity-90 mb-6">
                Discover more personalized tips and strategies in our comprehensive wellness library.
              </p>
              <button className="px-6 py-3 bg-white text-luna-500 rounded-lg hover:bg-luna-50 transition duration-300 font-medium">
                Explore More Tips
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default WellnessTips; 