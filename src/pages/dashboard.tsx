import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Activity, TrendingUp, Calendar, Target, Heart, Brain, Zap, Users, BookOpen, MessageCircle } from 'lucide-react';

interface AssessmentResult {
  anxiety: number;
  stress: number;
  depression: number;
  sleep: number;
  emotional_regulation: number;
  attention: number;
  anger_management: number;
  self_esteem: number;
}

export default function Dashboard() {
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAssessmentResult = async () => {
      try {
        const response = await fetch('/api/submit-assessment');
        if (response.ok) {
          const data = await response.json();
          setAssessmentResult(data);
        }
      } catch (error) {
        console.error('Error fetching assessment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessmentResult();
  }, []);

  const stats = [
    { name: 'Mood Score', value: '8.5', icon: Heart, color: 'text-green-500' },
    { name: 'Sessions', value: '12', icon: MessageCircle, color: 'text-blue-500' },
    { name: 'Goals Set', value: '5', icon: Target, color: 'text-purple-500' },
    { name: 'Resources Used', value: '8', icon: BookOpen, color: 'text-orange-500' },
  ];

  const quickActions = [
    { name: 'Start Chat', href: '/chat', icon: MessageCircle, color: 'bg-blue-500' },
    { name: 'Track Mood', href: '/progress', icon: Heart, color: 'bg-green-500' },
    { name: 'Set Goals', href: '/goals', icon: Target, color: 'bg-purple-500' },
    { name: 'Meditation', href: '/meditation', icon: Brain, color: 'bg-indigo-500' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back to Luna
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your mental wellness overview
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                onClick={() => router.push(action.href)}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 text-left"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {action.name}
                </h3>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Assessment Results */}
        {assessmentResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Your Assessment Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(assessmentResult).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {value}/10
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {key.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}