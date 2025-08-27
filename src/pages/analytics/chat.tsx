import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, MessageCircle, Clock, Heart, Brain, 
  Activity, Calendar, Filter, Download, RefreshCw, Eye, 
  Users, Target, Zap, AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';

// Dynamic imports for charts
const LineChart = dynamic(() => import('../../components/charts/LineChart'), { ssr: false });
const BarChart = dynamic(() => import('../../components/charts/BarChart'), { ssr: false });
const PieChart = dynamic(() => import('../../components/charts/PieChart'), { ssr: false });
const RadarChart = dynamic(() => import('../../components/charts/RadarChart'), { ssr: false });

interface AnalyticsData {
  totalConversations: number;
  totalMessages: number;
  averageSessionLength: number;
  averageResponseTime: number;
  crisisInterventions: number;
  emotionalTrends: {
    date: string;
    positive: number;
    neutral: number;
    negative: number;
  }[];
  messageVolume: {
    date: string;
    messages: number;
  }[];
  emotionalDistribution: {
    emotion: string;
    count: number;
    percentage: number;
  }[];
  therapeuticTechniques: {
    technique: string;
    usage: number;
    effectiveness: number;
  }[];
  userEngagement: {
    metric: string;
    value: number;
    change: number;
  }[];
  crisisData: {
    level: string;
    count: number;
    trend: number;
  }[];
}

function ChatAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('engagement');
  const { theme } = useTheme();

  const loadAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/chat?range=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange, loadAnalyticsData]);

  const exportAnalytics = () => {
    if (!analyticsData) return;
    
    const csvData = [
      ['Metric', 'Value', 'Change'],
      ...analyticsData.userEngagement.map(item => [
        item.metric,
        item.value.toString(),
        `${item.change > 0 ? '+' : ''}${item.change}%`
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-analytics-${dateRange}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">No analytics data available</h2>
          <p className="text-gray-500">Start conversations to see your analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Chat Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track your therapeutic conversations and emotional progress
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button
              onClick={loadAnalyticsData}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            
            <button
              onClick={exportAnalytics}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Conversations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.totalConversations}
                </p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.totalMessages}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Session Length</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.averageSessionLength}min
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Crisis Interventions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.crisisInterventions}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Emotional Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Heart className="w-5 h-5 text-red-500 mr-2" />
              Emotional Trends
            </h3>
            <div className="h-64">
              <LineChart
                data={analyticsData.emotionalTrends.map(item => ({ x: item.date, y: item.positive }))}
                title="Positive Emotions"
                color="#10B981"
              />
            </div>
          </motion.div>

          {/* Message Volume */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
              Message Volume
            </h3>
            <div className="h-64">
              <BarChart
                data={analyticsData.messageVolume.map(item => ({ label: item.date, value: item.messages }))}
                title="Message Volume"
                color="#3B82F6"
              />
            </div>
          </motion.div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Emotional Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Brain className="w-5 h-5 text-purple-500 mr-2" />
              Emotional Distribution
            </h3>
            <div className="h-64">
              <PieChart
                data={analyticsData.emotionalDistribution.map(item => ({ 
                  label: item.emotion, 
                  value: item.count, 
                  color: undefined
                }))}
                title="Emotional Distribution"
              />
            </div>
          </motion.div>

          {/* Therapeutic Techniques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target className="w-5 h-5 text-green-500 mr-2" />
              Therapeutic Techniques
            </h3>
            <div className="space-y-4">
              {analyticsData.therapeuticTechniques.map((technique, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {technique.technique}
                    </p>
                    <p className="text-xs text-gray-500">
                      {technique.usage} uses • {technique.effectiveness}% effective
                    </p>
                  </div>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${technique.effectiveness}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Crisis Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              Crisis Analysis
            </h3>
            <div className="space-y-4">
              {analyticsData.crisisData.map((crisis, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      crisis.level === 'critical' ? 'bg-red-500' :
                      crisis.level === 'high' ? 'bg-orange-500' :
                      crisis.level === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {crisis.level}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {crisis.count}
                    </p>
                    <p className={`text-xs ${
                      crisis.trend > 0 ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {crisis.trend > 0 ? '+' : ''}{crisis.trend}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* User Engagement Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mt-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Users className="w-5 h-5 text-blue-500 mr-2" />
            User Engagement Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.userEngagement.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {metric.metric}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {metric.value}
                </p>
                <div className={`flex items-center justify-center text-sm ${
                  metric.change > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.change > 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingUp className="w-4 h-4 mr-1 transform rotate-180" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ChatAnalytics;
