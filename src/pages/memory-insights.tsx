import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, Heart, Lightbulb } from 'lucide-react';
import { MemoryInsights } from '../components/memory/MemoryInsights';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';

const MemoryInsightsPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Sign in Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please sign in to view your therapeutic insights.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Therapeutic Insights
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  AI-powered analysis of your therapeutic journey and patterns
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Insights Panel */}
            <div className="lg:col-span-2">
              <MemoryInsights userId={user.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* How It Works */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  How It Works
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Memory Collection</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your conversations are analyzed to identify patterns and themes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Pattern Analysis</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        AI identifies trends in your emotional state and progress.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Insight Generation</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Personalized recommendations based on your therapeutic journey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insight Types */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Insight Types
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Trends</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Concerns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Triggers</span>
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Privacy & Security
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  All insights are generated from your conversation data and are stored securely. 
                  Your privacy is our top priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MemoryInsightsPage;


