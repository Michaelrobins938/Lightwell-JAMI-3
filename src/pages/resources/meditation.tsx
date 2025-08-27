import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { 
  Moon, 
  Heart, 
  Brain, 
  Shield, 
  Clock, 
  Play,
  Headphones,
  Download,
  Star,
  Zap,
  TrendingUp,
  Lightbulb
} from 'lucide-react';

const MeditationGuides: React.FC = () => {
  const meditationTypes = [
    {
      id: 1,
      title: 'Mindfulness Meditation',
      description: 'Focus on the present moment and observe thoughts without judgment.',
      duration: '10-20 minutes',
      difficulty: 'Beginner',
      benefits: ['Reduced stress', 'Improved focus', 'Better emotional regulation', 'Increased self-awareness'],
      icon: <Brain className="w-6 h-6" />,
      color: 'bg-blue-500',
      instructions: [
        'Find a comfortable seated position',
        'Close your eyes and take deep breaths',
        'Focus on your breath or a chosen object',
        'When thoughts arise, gently return to focus',
        'Practice daily for best results'
      ]
    },
    {
      id: 2,
      title: 'Loving-Kindness Meditation',
      description: 'Cultivate compassion and love for yourself and others.',
      duration: '15-30 minutes',
      difficulty: 'Intermediate',
      benefits: ['Increased compassion', 'Better relationships', 'Reduced anxiety', 'Improved mood'],
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-pink-500',
      instructions: [
        'Sit comfortably and close your eyes',
        'Start with loving-kindness for yourself',
        'Extend to loved ones, then acquaintances',
        'Finally, extend to all beings',
        'Repeat phrases like "May you be happy"'
      ]
    },
    {
      id: 3,
      title: 'Body Scan Meditation',
      description: 'Systematically focus attention on different parts of the body.',
      duration: '20-45 minutes',
      difficulty: 'Beginner',
      benefits: ['Reduced tension', 'Better body awareness', 'Improved sleep', 'Stress relief'],
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-green-500',
      instructions: [
        'Lie down in a comfortable position',
        'Start with your toes and work upward',
        'Notice sensations in each body part',
        'Release tension as you go',
        'End with full body awareness'
      ]
    },
    {
      id: 4,
      title: 'Transcendental Meditation',
      description: 'Use a mantra to transcend ordinary thinking and reach deep relaxation.',
      duration: '20 minutes',
      difficulty: 'Intermediate',
      benefits: ['Deep relaxation', 'Reduced stress', 'Improved creativity', 'Better sleep'],
      icon: <Moon className="w-6 h-6" />,
      color: 'bg-purple-500',
      instructions: [
        'Sit comfortably with eyes closed',
        'Use your personal mantra',
        'Allow thoughts to come and go',
        'Return to mantra when distracted',
        'Practice twice daily'
      ]
    },
    {
      id: 5,
      title: 'Walking Meditation',
      description: 'Practice mindfulness while walking slowly and deliberately.',
      duration: '15-30 minutes',
      difficulty: 'Beginner',
      benefits: ['Physical activity', 'Mindfulness practice', 'Stress reduction', 'Improved balance'],
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-orange-500',
      instructions: [
        'Walk slowly and deliberately',
        'Focus on each step and movement',
        'Notice your surroundings mindfully',
        'Maintain awareness of breathing',
        'Choose a quiet, safe path'
      ]
    },
    {
      id: 6,
      title: 'Zen Meditation (Zazen)',
      description: 'Traditional Zen practice focusing on posture and breath.',
      duration: '20-40 minutes',
      difficulty: 'Advanced',
      benefits: ['Deep concentration', 'Insight development', 'Emotional stability', 'Spiritual growth'],
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'bg-indigo-500',
      instructions: [
        'Sit in lotus or half-lotus position',
        'Keep spine straight and chin tucked',
        'Focus on breath at the lower abdomen',
        'Count breaths or just observe',
        'Maintain alert attention'
      ]
    }
  ];

  const guidedSessions = [
    {
      id: 1,
      title: 'Morning Mindfulness',
      duration: '10 minutes',
      instructor: 'Dr. Sarah Johnson',
      level: 'Beginner',
      audioUrl: '/meditation/morning-mindfulness.mp3',
      description: 'Start your day with clarity and intention.'
    },
    {
      id: 2,
      title: 'Stress Relief Session',
      duration: '15 minutes',
      instructor: 'Dr. Michael Chen',
      level: 'Beginner',
      audioUrl: '/meditation/stress-relief.mp3',
      description: 'Release tension and find inner peace.'
    },
    {
      id: 3,
      title: 'Deep Sleep Meditation',
      duration: '20 minutes',
      instructor: 'Dr. Emily Rodriguez',
      level: 'Intermediate',
      audioUrl: '/meditation/deep-sleep.mp3',
      description: 'Prepare your mind and body for restful sleep.'
    },
    {
      id: 4,
      title: 'Anxiety Relief',
      duration: '12 minutes',
      instructor: 'Dr. Lisa Park',
      level: 'Beginner',
      audioUrl: '/meditation/anxiety-relief.mp3',
      description: 'Calm your nervous system and reduce anxiety.'
    },
    {
      id: 5,
      title: 'Self-Compassion Practice',
      duration: '18 minutes',
      instructor: 'Dr. James Wilson',
      level: 'Intermediate',
      audioUrl: '/meditation/self-compassion.mp3',
      description: 'Develop kindness and understanding toward yourself.'
    },
    {
      id: 6,
      title: 'Focus and Concentration',
      duration: '15 minutes',
      instructor: 'Dr. Alex Thompson',
      level: 'Intermediate',
      audioUrl: '/meditation/focus-concentration.mp3',
      description: 'Sharpen your mind and improve concentration.'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Meditation Guides | Luna</title>
        <meta name="description" content="Comprehensive meditation guides and guided sessions for mental wellness and mindfulness practice." />
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
                <Moon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-luna-800 dark:text-luna-200 mb-6">
              Meditation Guides
            </h1>
            <p className="text-xl text-luna-600 dark:text-luna-400 max-w-3xl mx-auto">
              Discover various meditation techniques and guided sessions to support your mindfulness journey.
            </p>
          </motion.div>

          {/* Meditation Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-6">Meditation Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meditationTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-luna-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-3 rounded-lg text-white ${type.color}`}>
                        {type.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-luna-800 dark:text-luna-200 line-clamp-2">
                          {type.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-luna-500 dark:text-luna-400">{type.difficulty}</span>
                          <span className="text-xs text-luna-500 dark:text-luna-400">•</span>
                          <span className="text-xs text-luna-500 dark:text-luna-400">{type.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-luna-600 dark:text-luna-400 mb-4">
                      {type.description}
                    </p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-luna-700 dark:text-luna-300 mb-2">Benefits:</h4>
                      <div className="flex flex-wrap gap-1">
                        {type.benefits.map((benefit, benefitIndex) => (
                          <span key={benefitIndex} className="px-2 py-1 bg-luna-100 dark:bg-luna-600 text-luna-600 dark:text-luna-300 rounded-full text-xs">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-luna-700 dark:text-luna-300 mb-2">Instructions:</h4>
                      <div className="space-y-1">
                        {type.instructions.map((instruction, instructionIndex) => (
                          <div key={instructionIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-luna-400 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="text-xs text-luna-600 dark:text-luna-400">{instruction}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <button className="w-full px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300 text-sm font-medium">
                      Learn More
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Guided Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-luna-700 dark:text-luna-300 mb-6">Guided Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guidedSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-luna-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Play className="w-5 h-5 text-luna-500" />
                        <span className="text-sm text-luna-500 dark:text-luna-400">{session.level}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-luna-500 dark:text-luna-400">
                        <Clock className="w-3 h-3" />
                        <span>{session.duration}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-luna-800 dark:text-luna-200 mb-2 line-clamp-2">
                      {session.title}
                    </h3>
                    
                    <p className="text-sm text-luna-600 dark:text-luna-400 mb-4">
                      {session.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-luna-500 dark:text-luna-400 mb-4">
                      <span>Instructor: {session.instructor}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="flex-1 px-4 py-2 bg-luna-500 text-white rounded-lg hover:bg-luna-600 transition duration-300 text-sm font-medium flex items-center justify-center space-x-2">
                        <Play className="w-4 h-4" />
                        <span>Play</span>
                      </button>
                      <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                        <Headphones className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-luna-500 hover:text-luna-700 dark:text-luna-400 dark:hover:text-luna-200 transition duration-300">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
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
            className="text-center"
          >
            <div className="bg-gradient-to-r from-luna-500 to-dream-500 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Begin Your Meditation Journey</h3>
              <p className="text-lg opacity-90 mb-6">
                Start with just 5 minutes a day and gradually build your practice. Consistency is key to experiencing the benefits of meditation.
              </p>
              <button className="px-6 py-3 bg-white text-luna-500 rounded-lg hover:bg-luna-50 transition duration-300 font-medium">
                Start Meditating
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default MeditationGuides; 