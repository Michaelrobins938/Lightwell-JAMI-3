import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Moon, 
  Heart, 
  Brain, 
  BarChart3, 
  Settings, 
  Download, 
  Crown, 
  Target, 
  Clock, 
  Award, 
  Activity,
  Edit,
  Save,
  X,
  Shield,
  Bell,
  Palette,
  FileText,
  Eye,
  Lock,
  CreditCard,
  Zap,
  CheckCircle,
  AlertCircle,
  Star,
  Bookmark,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

interface UserStats {
  moodEntries: number;
  sleepTracking: number;
  assessmentsCompleted: number;
  therapySessions: number;
  streakDays: number;
  totalDaysActive: number;
  lastActivity: string;
  improvementScore: number;
}

interface SubscriptionPlan {
  name: string;
  price: number;
  features: string[];
  isActive: boolean;
  renewalDate?: string;
  status: 'active' | 'cancelled' | 'expired';
}

export default function Profile() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionPlan | null>(null);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    timezone: '',
    notifications: {
      email: true,
      push: true,
      reminders: true,
      weekly_summary: true
    },
    privacy: {
      profile_visibility: 'private',
      data_sharing: false,
      analytics: true
    },
    preferences: {
      theme: 'dark',
      language: 'en',
      assessment_frequency: 'weekly',
      goal_reminders: true
    }
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
              router.push('/login?redirect=/profile');
      return;
    }

    if (user) {
      setEditData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
      loadUserStats();
      loadSubscription();
    }
  }, [user, isAuthenticated, isLoading, router]);

  const loadUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/user/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats);
      } else {
        // Mock data if API doesn't exist yet
        setUserStats({
          moodEntries: 23,
          sleepTracking: 18,
          assessmentsCompleted: 5,
          therapySessions: 42,
          streakDays: 7,
          totalDaysActive: 23,
          lastActivity: '2 hours ago',
          improvementScore: 72
        });
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
      // Mock data fallback
      setUserStats({
        moodEntries: 23,
        sleepTracking: 18,
        assessmentsCompleted: 5,
        therapySessions: 42,
        streakDays: 7,
        totalDaysActive: 23,
        lastActivity: '2 hours ago',
        improvementScore: 72
      });
    }
  };

  const loadSubscription = async () => {
    // Mock subscription data - in real app, fetch from API
    setSubscription({
      name: 'Luna Pro',
      price: 19.99,
      features: [
        'Unlimited AI Therapy Sessions',
        'Advanced Analytics',
        'Priority Support',
        'Custom Goals & Tracking',
        'Data Export',
        'Family Sharing'
      ],
      isActive: true,
      renewalDate: '2025-09-14',
      status: 'active'
    });
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        setIsEditing(false);
        // Update local user data if needed
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleDataExport = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/user/export', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `luna-health-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      // Create mock export for now
      const mockData = {
        user: user,
        stats: userStats,
        subscription: subscription,
        exportDate: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `luna-health-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <User className="w-5 h-5" /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'subscription', name: 'Subscription', icon: <Crown className="w-5 h-5" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { id: 'privacy', name: 'Privacy', icon: <Shield className="w-5 h-5" /> }
  ];

  return (
    <>
      <Head>
        <title>Profile - Luna Mental Health</title>
        <meta name="description" content="Manage your Luna Mental Health profile, view analytics, and track your wellness journey." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <motion.div
            className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                  <p className="text-slate-300 mt-1">{user.email}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-2 text-sm text-purple-400">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {userStats?.lastActivity ? new Date(userStats.lastActivity).toLocaleDateString() : 'Recently'}</span>
                    </div>
                    {userStats && (
                      <div className="flex items-center space-x-2 text-sm text-green-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>{userStats.streakDays} day streak</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 lg:mt-0 flex items-center space-x-3">
                <motion.button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit className="w-4 h-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </motion.button>
                
                <motion.button
                  onClick={handleDataExport}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-200 flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Stats */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-purple-400" />
                      <span>Activity Overview</span>
                    </h3>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                        <Moon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{userStats?.sleepTracking || 0}</div>
                        <div className="text-blue-300 text-sm">Sleep Logs</div>
                      </div>
                      
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                        <Heart className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{userStats?.moodEntries || 0}</div>
                        <div className="text-purple-300 text-sm">Mood Entries</div>
                      </div>
                      
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                        <BarChart3 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{userStats?.assessmentsCompleted || 0}</div>
                        <div className="text-green-300 text-sm">Assessments</div>
                      </div>
                      
                      <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4 text-center">
                        <Brain className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{userStats?.therapySessions || 0}</div>
                        <div className="text-pink-300 text-sm">AI Sessions</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <span>Recent Activity</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-white text-sm">Completed GAD-7 Assessment</span>
                        <span className="text-slate-400 text-xs ml-auto">2 hours ago</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-white text-sm">Logged sleep (8.5 hours)</span>
                        <span className="text-slate-400 text-xs ml-auto">Yesterday</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-white text-sm">Added mood entry</span>
                        <span className="text-slate-400 text-xs ml-auto">2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Goals & Achievements */}
                  <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <Target className="w-5 h-5 text-purple-400" />
                      <span>Current Goals</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-sm">Daily Mood Check</span>
                          <span className="text-green-400 text-xs">7/7 days</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="bg-green-400 h-2 rounded-full w-full"></div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-sm">Sleep 8+ hours</span>
                          <span className="text-blue-400 text-xs">5/7 days</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div className="bg-blue-400 h-2 rounded-full w-4/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span>Achievements</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">First Week</div>
                          <div className="text-slate-400 text-xs">Completed 7 days of tracking</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">Mood Master</div>
                          <div className="text-slate-400 text-xs">Logged 50 mood entries</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Mood Analytics */}
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-purple-400" />
                    <span>Mood Analytics</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                      <div className="text-lg font-semibold text-white">Average Mood</div>
                      <div className="text-3xl font-bold text-purple-400">7.2/10</div>
                      <div className="text-sm text-purple-300">+0.8 from last week</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">23</div>
                        <div className="text-sm text-slate-400">Total Entries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">85%</div>
                        <div className="text-sm text-slate-400">Positive Days</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sleep Analytics */}
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                    <Moon className="w-5 h-5 text-blue-400" />
                    <span>Sleep Analytics</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <div className="text-lg font-semibold text-white">Average Sleep</div>
                      <div className="text-3xl font-bold text-blue-400">7.8 hrs</div>
                      <div className="text-sm text-blue-300">+0.5 hrs from last week</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">18</div>
                        <div className="text-sm text-slate-400">Sleep Logs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">Good</div>
                        <div className="text-sm text-slate-400">Avg Quality</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assessment Analytics */}
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    <span>Assessment Progress</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-sm">PHQ-9 (Depression)</span>
                        <span className="text-green-400 text-sm">Improving</span>
                      </div>
                      <div className="text-lg font-semibold text-white">Score: 8</div>
                      <div className="text-xs text-slate-400">Down from 12 (last month)</div>
                    </div>
                    
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-sm">GAD-7 (Anxiety)</span>
                        <span className="text-blue-400 text-sm">Stable</span>
                      </div>
                      <div className="text-lg font-semibold text-white">Score: 6</div>
                      <div className="text-xs text-slate-400">Same as last month</div>
                    </div>
                  </div>
                </div>

                {/* Therapy Sessions */}
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-pink-400" />
                    <span>AI Therapy Usage</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl">
                      <div className="text-lg font-semibold text-white">Total Sessions</div>
                      <div className="text-3xl font-bold text-pink-400">42</div>
                      <div className="text-sm text-pink-300">12.5 hours total</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">3.2</div>
                        <div className="text-sm text-slate-400">Avg/Week</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">18min</div>
                        <div className="text-sm text-slate-400">Avg Length</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && subscription && (
              <div className="space-y-8">
                {/* Current Subscription */}
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Crown className="w-8 h-8 text-yellow-400" />
                      <div>
                        <h3 className="text-2xl font-bold text-white">{subscription.name}</h3>
                        <p className="text-slate-300">Premium mental health platform</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">${subscription.price}</div>
                      <div className="text-slate-400 text-sm">per month</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-6">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Active Subscription</span>
                    <span className="text-slate-400">• Renews on {subscription.renewalDate}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {subscription.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-white text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-200 flex items-center space-x-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Update Payment</span>
                    </button>
                    <button className="px-6 py-3 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 flex items-center space-x-2">
                      <X className="w-4 h-4" />
                      <span>Cancel Subscription</span>
                    </button>
                  </div>
                </div>

                {/* Usage & Limits */}
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Usage This Month</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">∞</div>
                      <div className="text-slate-400 text-sm">AI Therapy Sessions</div>
                      <div className="text-xs text-green-400 mt-1">Unlimited</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">∞</div>
                      <div className="text-slate-400 text-sm">Analytics Access</div>
                      <div className="text-xs text-green-400 mt-1">Full Access</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">✓</div>
                      <div className="text-slate-400 text-sm">Priority Support</div>
                      <div className="text-xs text-green-400 mt-1">Included</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                {/* Personal Information */}
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                    <User className="w-5 h-5 text-purple-400" />
                    <span>Personal Information</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Optional"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
                      <select
                        value={editData.timezone}
                        onChange={(e) => setEditData(prev => ({ ...prev, timezone: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      >
                        <option value="">Select timezone...</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-6 flex space-x-4">
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Preferences */}
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                    <Palette className="w-5 h-5 text-purple-400" />
                    <span>Preferences</span>
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">Theme</label>
                      <div className="flex space-x-4">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">Dark</button>
                        <button className="px-4 py-2 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-lg text-sm">Light</button>
                        <button className="px-4 py-2 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-lg text-sm">Auto</button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">Assessment Frequency</label>
                      <select className="w-full md:w-64 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="daily">Daily</option>
                        <option value="weekly" selected>Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-purple-400" />
                    <span>Notifications</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Email Notifications', description: 'Receive important updates via email' },
                      { key: 'push', label: 'Push Notifications', description: 'Get real-time notifications' },
                      { key: 'reminders', label: 'Daily Reminders', description: 'Mood check and wellness reminders' },
                      { key: 'weekly_summary', label: 'Weekly Summary', description: 'Your weekly progress report' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                        <div>
                          <div className="text-white font-medium">{item.label}</div>
                          <div className="text-slate-400 text-sm">{item.description}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editData.notifications[item.key as keyof typeof editData.notifications]}
                            onChange={(e) => setEditData(prev => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                [item.key]: e.target.checked
                              }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-8">
                {/* Privacy Settings */}
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <span>Privacy & Security</span>
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-slate-700/30 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-white font-medium">Profile Visibility</div>
                          <div className="text-slate-400 text-sm">Control who can see your profile information</div>
                        </div>
                        <select className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm">
                          <option value="private">Private</option>
                          <option value="friends">Friends Only</option>
                          <option value="public">Public</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-700/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Data Sharing</div>
                          <div className="text-slate-400 text-sm">Allow anonymous data sharing for research</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-700/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Analytics Tracking</div>
                          <div className="text-slate-400 text-sm">Help improve Luna with usage analytics</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Management */}
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <span>Data Management</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <button
                      onClick={handleDataExport}
                      className="w-full flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-blue-400" />
                        <div className="text-left">
                          <div className="text-white font-medium">Export Your Data</div>
                          <div className="text-slate-400 text-sm">Download all your data in JSON format</div>
                        </div>
                      </div>
                      <div className="text-blue-400">→</div>
                    </button>
                    
                    <button className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <Trash2 className="w-5 h-5 text-red-400" />
                        <div className="text-left">
                          <div className="text-red-400 font-medium">Delete Account</div>
                          <div className="text-red-300/70 text-sm">Permanently delete your account and all data</div>
                        </div>
                      </div>
                      <div className="text-red-400">→</div>
                    </button>
                  </div>
                </div>

                {/* Security */}
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-purple-400" />
                    <span>Security</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <Lock className="w-5 h-5 text-purple-400" />
                        <div className="text-left">
                          <div className="text-white font-medium">Change Password</div>
                          <div className="text-slate-400 text-sm">Update your account password</div>
                        </div>
                      </div>
                      <div className="text-purple-400">→</div>
                    </button>
                    
                    <div className="p-4 bg-slate-700/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Two-Factor Authentication</div>
                          <div className="text-slate-400 text-sm">Add extra security to your account</div>
                        </div>
                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-all duration-200">
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}