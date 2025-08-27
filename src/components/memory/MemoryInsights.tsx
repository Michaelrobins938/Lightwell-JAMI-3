import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, TrendingUp, AlertTriangle, Target, CheckCircle, 
  Lightbulb, Clock, BarChart3, Heart, Zap, ArrowRight
} from 'lucide-react';
// import { MemoryInsight } from '../../services/memoryService'; // Remove this import

interface MemoryInsight {
  title: string;
  description: string;
  type: 'trend' | 'progress' | 'trigger' | 'pattern' | 'concern';
  confidence: number;
  createdAt: string;
  recommendations: string[];
}

interface MemoryInsightsProps {
  userId: string;
  className?: string;
}

export const MemoryInsights: React.FC<MemoryInsightsProps> = ({
  userId,
  className = ''
}) => {
  const [insights, setInsights] = useState<MemoryInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, [userId]);

  const loadInsights = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/memory/insights');
      if (!response.ok) {
        throw new Error('Failed to load insights');
      }

      const data = await response.json();
      setInsights(data.insights || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load insights');
      console.error('Failed to load insights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-5 h-5" />;
      case 'progress':
        return <CheckCircle className="w-5 h-5" />;
      case 'trigger':
        return <AlertTriangle className="w-5 h-5" />;
      case 'pattern':
        return <BarChart3 className="w-5 h-5" />;
      case 'concern':
        return <Heart className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'progress':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'trigger':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'pattern':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'concern':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className={`${className} p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700`}>
        <div className="text-center py-8">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={loadInsights}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className={`${className} p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700`}>
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Insights Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Continue your conversations to generate therapeutic insights and patterns.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-4`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Therapeutic Insights
        </h3>
        <button
          onClick={loadInsights}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <Zap className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                {getInsightIcon(insight.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {insight.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {new Date(insight.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {insight.description}
                </p>

                {insight.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      Recommendations:
                    </h5>
                    <ul className="space-y-1">
                      {insight.recommendations.map((recommendation: string, recIndex: number) => (
                        <li key={recIndex} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <ArrowRight className="w-3 h-3 mt-1 flex-shrink-0" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};