import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { 
  Heart, 
  Brain, 
  Shield, 
  Clock, 
  Star,
  CheckCircle,
  TrendingUp,
  Zap,
  BookOpen,
  User,
  Lightbulb,
  Moon
} from 'lucide-react';

const SelfCareTools: React.FC = () => {
  const selfCareCategories = [
    {
      id: 1,
      title: 'Physical Self-Care',
      description: 'Taking care of your body through movement, nutrition, and rest.',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-red-500',
      tools: [
        'Regular exercise routine',
        'Balanced nutrition',
        'Adequate sleep hygiene',
        'Hydration tracking',
        'Stress-relieving activities'
      ]
    },
    {
      id: 2,
      title: 'Emotional Self-Care',
      description: 'Nurturing your emotional well-being and mental health.',
      icon: <Brain className="w-6 h-6" />,
      color: 'bg-blue-500',
      tools: [
        'Journaling practice',
        'Emotional awareness exercises',
        'Positive affirmations',
        'Therapy or counseling',
        'Creative expression'
      ]
    },
    {
      id: 3,
      title: 'Social Self-Care',
      description: 'Building and maintaining healthy relationships and connections.',
      icon: <User className="w-6 h-6" />,
      color: 'bg-green-500',
      tools: [
        'Quality time with loved ones',
        'Setting healthy boundaries',
        'Joining support groups',
        'Volunteering activities',
        'Social media boundaries'
      ]
    },
    {
      id: 4,
      title: 'Spiritual Self-Care',
      description: 'Connecting with your values, beliefs, and sense of purpose.',
      icon: <Moon className="w-6 h-6" />,
      color: 'bg-purple-500',
      tools: [
        'Meditation and prayer',
        'Nature connection',
        'Reading inspirational content',
        'Practicing gratitude',
        'Reflection and contemplation'
      ]
    },
    {
      id: 5,
      title: 'Practical Self-Care',
      description: 'Managing daily responsibilities and life tasks effectively.',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-orange-500',
      tools: [
        'Time management skills',
        'Financial planning',
        'Home organization',
        'Skill development',
        'Goal setting and tracking'
      ]
    },
    {
      id: 6,
      title: 'Mental Self-Care',
      description: 'Stimulating your mind and maintaining cognitive health.',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'bg-indigo-500',
      tools: [
        'Learning new skills',
        'Reading and education',
        'Puzzle solving',
        'Creative hobbies',
        'Mental health breaks'
      ]
    }
  ];

  const selfCareActivities = [
    {
      id: 1,
      title: '5-Minute Self-Care Ritual',
      description: 'Quick daily practices to nurture your well-being.',
      duration: '5 minutes',
      difficulty: 'Beginner',
      category: 'Daily Practice',
      steps: [
        'Take 3 deep breaths',
        'Express gratitude for one thing',
        'Stretch your body gently',
        'Drink a glass of water',
        'Set a positive intention'
      ]
    },
    {
      id: 2,
      title: 'Digital Detox Day',
      description: 'Unplug from technology to reconnect with yourself.',
      duration: '24 hours',
      difficulty: 'Intermediate',
      category: 'Digital Wellness',
      steps: [
        'Turn off all notifications',
        'Plan offline activities',
        'Spend time in nature',
        'Connect with loved ones',
        'Reflect on your experience'
      ]
    },
    {
      id: 3,
      title: 'Self-Compassion Practice',
      description: 'Develop kindness and understanding toward yourself.',
      duration: '15 minutes',
      difficulty: 'Beginner',
      category: 'Emotional Wellness',
      steps: [
        'Acknowledge your feelings',
        'Practice self-kindness',
        'Recognize common humanity',
        'Use compassionate language',
        'Offer yourself comfort'
      ]
    },
    {
      id: 4,
      title: 'Creative Expression Session',
      description: 'Express yourself through art, writing, or music.',
      duration: '30 minutes',
      difficulty: 'Beginner',
      category: 'Creative Wellness',
      steps: [
        'Choose your creative medium',
        'Set up your space',
        'Let go of perfectionism',
        'Express freely',
        'Reflect on your creation'
      ]
    },
    {
      id: 5,
      title: 'Nature Connection Walk',
      description: 'Connect with nature to reduce stress and improve mood.',
      duration: '20 minutes',
      difficulty: 'Beginner',
      category: 'Physical Wellness',
      steps: [
        'Find a natural setting',
        'Walk mindfully',
        'Notice your surroundings',
        'Engage your senses',
        'Express gratitude for nature'
      ]
    },
    {
      id: 6,
      title: 'Boundary Setting Workshop',
      description: 'Learn to set and maintain healthy boundaries.',
      duration: '45 minutes',
      difficulty: 'Intermediate',
      category: 'Social Wellness',
      steps: [
        'Identify your values',
        'Recognize boundary violations',
        'Practice assertive communication',
        'Set clear expectations',
        'Maintain consistency'
      ]
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Self-Care Tools | Luna</title>
        <meta name="description" content="Comprehensive self-care tools and strategies for mental wellness and personal well-being." />
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
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-luna-800 dark:text-luna-200 mb-6">
              Self-Care Tools
            </h1>
            <p className="text-xl text-luna-600 dark:text-luna-400 max-w-3xl mx-auto">
              Comprehensive tools and strategies to nurture your physical, emotional, and mental well-being.
            </p>
          </motion.div>

          {/* Self-Care Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-6">Self-Care Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selfCareCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-luna-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-3 rounded-lg text-white ${category.color}`}>
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-luna-800 dark:text-luna-200 line-clamp-2">
                          {category.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-sm text-luna-600 dark:text-luna-400 mb-4">
                      {category.description}
                    </p>
                    
                    <div className="space-y-2">
                      {category.tools.map((tool, toolIndex) => (
                        <div key={toolIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-luna-600 dark:text-luna-400">{tool}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Self-Care Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-6">Self-Care Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selfCareActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-luna-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 py-1 bg-luna-100 dark:bg-luna-600 text-luna-600 dark:text-luna-300 rounded-full text-xs font-medium">
                        {activity.category}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-luna-500 dark:text-luna-400">
                        <Clock className="w-3 h-3" />
                        <span>{activity.duration}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-luna-800 dark:text-luna-200 mb-2 line-clamp-2">
                      {activity.title}
                    </h3>
                    
                    <p className="text-sm text-luna-600 dark:text-luna-400 mb-4">
                      {activity.description}
                    </p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-luna-700 dark:text-luna-300 mb-2">Steps:</h4>
                      <div className="space-y-1">
                        {activity.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-luna-400 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="text-xs text-luna-600 dark:text-luna-400">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-luna-500 dark:text-luna-400">{activity.difficulty}</span>
                      <button className="px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300 text-sm font-medium">
                        Start Activity
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Self-Care Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-6">Self-Care Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-luna-700 rounded-lg p-6 shadow-lg">
                <h3 className="font-semibold text-luna-800 dark:text-luna-200 mb-4">Daily Self-Care Checklist</h3>
                <div className="space-y-3">
                  {[
                    'Drink 8 glasses of water',
                    'Get 7-9 hours of sleep',
                    'Move your body for 30 minutes',
                    'Practice gratitude',
                    'Connect with a loved one',
                    'Take breaks from screens',
                    'Do something you enjoy'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded border-luna-300 text-luna-500 focus:ring-luna-500" />
                      <span className="text-sm text-luna-600 dark:text-luna-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white dark:bg-luna-700 rounded-lg p-6 shadow-lg">
                <h3 className="font-semibold text-luna-800 dark:text-luna-200 mb-4">Weekly Self-Care Goals</h3>
                <div className="space-y-3">
                  {[
                    'Try a new hobby or activity',
                    'Spend time in nature',
                    'Learn something new',
                    'Practice self-compassion',
                    'Set healthy boundaries',
                    'Express creativity',
                    'Reflect and journal'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded border-luna-300 text-luna-500 focus:ring-luna-500" />
                      <span className="text-sm text-luna-600 dark:text-luna-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-luna-500 to-dream-500 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Prioritize Your Well-Being</h3>
              <p className="text-lg opacity-90 mb-6">
                Remember, self-care is not selfish—it's essential. Start with small, manageable practices and build your self-care routine over time.
              </p>
              <button className="px-6 py-3 bg-white text-luna-500 rounded-lg hover:bg-luna-50 transition duration-300 font-medium">
                Start Your Self-Care Journey
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SelfCareTools; 