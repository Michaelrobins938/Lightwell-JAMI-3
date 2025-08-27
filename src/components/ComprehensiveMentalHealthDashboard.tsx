import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Heart, Shield, TrendingUp, Users, BookOpen, 
  Calendar, Activity, Target, Lightbulb, Zap, Crown,
  Clock, MessageSquare, CheckCircle, AlertTriangle,
  BarChart3, PieChart, LineChart, Star, Gift, Lock
} from 'lucide-react';
import comprehensiveAssessmentService from '../services/comprehensiveAssessmentService';
import wellnessEcosystemService from '../services/wellnessEcosystemService';
import progressAnalyticsService from '../services/progressAnalyticsService';
import communitySupportService from '../services/communitySupportService';
import integrationConnectivityService from '../services/integrationConnectivityService';
import freemiumTierService from '../services/freemiumTierService';

interface ComprehensiveMentalHealthDashboardProps {
  userId: string;
  isVisible: boolean;
  onClose: () => void;
}

export const ComprehensiveMentalHealthDashboard: React.FC<ComprehensiveMentalHealthDashboardProps> = ({
  userId,
  isVisible,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'assessment' | 'wellness' | 'progress' | 'community' | 'integration' | 'tier'>('overview');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Load all dashboard data
      const [
        assessment,
        wellnessPlan,
        progress,
        community,
        integration,
        tierStatus
      ] = await Promise.all([
        comprehensiveAssessmentService.generateComprehensiveAssessment(userId),
        wellnessEcosystemService.generateDailyPlan(userId, {} as any, {} as any),
        progressAnalyticsService.generateTherapeuticJourney(userId, {} as any, []),
        communitySupportService.getSupportGroups(userId, []),
        integrationConnectivityService.syncWearableData(userId, 'generic'),
        freemiumTierService.getUserTierStatus(userId)
      ]);

      setData({
        assessment,
        wellnessPlan,
        progress,
        community,
        integration,
        tierStatus
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isVisible) {
      loadDashboardData();
    }
  }, [isVisible, loadDashboardData]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'assessment', label: 'Assessment', icon: Brain },
    { id: 'wellness', label: 'Wellness', icon: Heart },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'integration', label: 'Integration', icon: Calendar },
    { id: 'tier', label: 'Tier', icon: Crown }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Comprehensive Mental Health Dashboard
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your complete mental wellness ecosystem
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <AlertTriangle className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <OverviewTab data={data} />
                  )}
                  {activeTab === 'assessment' && (
                    <AssessmentTab data={data.assessment} />
                  )}
                  {activeTab === 'wellness' && (
                    <WellnessTab data={data.wellnessPlan} />
                  )}
                  {activeTab === 'progress' && (
                    <ProgressTab data={data.progress} />
                  )}
                  {activeTab === 'community' && (
                    <CommunityTab data={data.community} />
                  )}
                  {activeTab === 'integration' && (
                    <IntegrationTab data={data.integration} />
                  )}
                  {activeTab === 'tier' && (
                    <TierTab data={data.tierStatus} />
                  )}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ data: any }> = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Assessment Score</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.assessment?.psychologicalProfile?.readinessScore ? 
                Math.round(data.assessment.psychologicalProfile.readinessScore * 100) : 75}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Wellness Plan</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.wellnessPlan?.therapeuticExercises?.length || 3} Activities
            </p>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.progress?.progressMetrics?.overallProgress ? 
                Math.round(data.progress.progressMetrics.overallProgress * 100) : 65}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Tier</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.tierStatus?.currentTier?.toUpperCase() || 'FREE'}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Recent Insights
        </h3>
        <div className="space-y-3">
          {data.progress?.insights?.slice(0, 3).map((insight: any, index: number) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{insight.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-500" />
          Today's Goals
        </h3>
        <div className="space-y-3">
          {data.wellnessPlan?.therapeuticExercises?.slice(0, 3).map((exercise: any, index: number) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">{exercise.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

// Assessment Tab Component
const AssessmentTab: React.FC<{ data: any }> = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">PHQ-9 Score</h4>
        <p className="text-2xl font-bold">{data?.psychologicalProfile?.phq9Score || 5}</p>
        <p className="text-sm text-gray-500">Depression Assessment</p>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">GAD-7 Score</h4>
        <p className="text-2xl font-bold">{data?.psychologicalProfile?.gad7Score || 4}</p>
        <p className="text-sm text-gray-500">Anxiety Assessment</p>
      </div>
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Readiness Score</h4>
        <p className="text-2xl font-bold">{Math.round((data?.therapeuticReadiness?.readinessScore || 0.7) * 100)}%</p>
        <p className="text-sm text-gray-500">Therapeutic Readiness</p>
      </div>
    </div>

    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Risk Level</h4>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            data?.riskAssessment?.overallRisk === 'low' ? 'bg-green-100 text-green-800' :
            data?.riskAssessment?.overallRisk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {data?.riskAssessment?.overallRisk?.toUpperCase() || 'LOW'}
          </span>
        </div>
        <div>
          <h4 className="font-medium mb-2">Protective Factors</h4>
          <div className="flex flex-wrap gap-1">
            {data?.riskAssessment?.protectiveFactors?.reasonsForLiving?.slice(0, 3).map((factor: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded">
                {factor}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Wellness Tab Component
const WellnessTab: React.FC<{ data: any }> = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Today's Wellness Plan</h3>
        <div className="space-y-3">
          {data?.therapeuticExercises?.slice(0, 3).map((exercise: any, index: number) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <Target className="w-4 h-4 text-blue-500" />
              <div>
                <p className="font-medium">{exercise.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{exercise.duration} minutes</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Mindfulness Sessions</h3>
        <div className="space-y-3">
          {data?.mindfulness?.slice(0, 3).map((session: any, index: number) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded">
              <Heart className="w-4 h-4 text-green-500" />
              <div>
                <p className="font-medium">{session.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{session.duration} minutes</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

// Progress Tab Component
const ProgressTab: React.FC<{ data: any }> = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Progress Metrics</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Overall Progress</span>
              <span className="text-sm font-medium">{Math.round((data?.progressMetrics?.overallProgress || 0.65) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(data?.progressMetrics?.overallProgress || 0.65) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Therapeutic Alliance</span>
              <span className="text-sm font-medium">{Math.round((data?.progressMetrics?.therapeuticAlliance || 0.7) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(data?.progressMetrics?.therapeuticAlliance || 0.7) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          {data?.achievements?.slice(0, 3).map((achievement: any, index: number) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <Star className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="font-medium">{achievement.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

// Community Tab Component
const CommunityTab: React.FC<{ data: any }> = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Support Groups</h3>
        <div className="space-y-3">
          {data?.slice(0, 3).map((group: any, index: number) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <p className="font-medium">{group.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{group.currentMembers}/{group.maxMembers} members</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Educational Content</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded">
            <BookOpen className="w-4 h-4 text-green-500" />
            <div>
              <p className="font-medium">Understanding Anxiety</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">45 min video</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
            <BookOpen className="w-4 h-4 text-purple-500" />
            <div>
              <p className="font-medium">CBT Techniques</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">90 min workshop</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Integration Tab Component
const IntegrationTab: React.FC<{ data: any }> = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Wearable Data</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Heart Rate</span>
            <span className="font-medium">{data?.heartRate?.current || 72} bpm</span>
          </div>
          <div className="flex justify-between">
            <span>Sleep Duration</span>
            <span className="font-medium">{data?.sleep?.duration || 7.5} hours</span>
          </div>
          <div className="flex justify-between">
            <span>Steps Today</span>
            <span className="font-medium">{data?.activity?.steps || 8500}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Calendar Integration</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
            <Calendar className="w-4 h-4 text-blue-500" />
            <div>
              <p className="font-medium">Therapy Session</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tomorrow 2:00 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded">
            <Calendar className="w-4 h-4 text-green-500" />
            <div>
              <p className="font-medium">Mood Check-in</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Daily reminder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Tier Tab Component
const TierTab: React.FC<{ data: any }> = ({ data }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Current Tier: {data?.currentTier?.toUpperCase()}</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Daily Sessions</span>
            <span className="font-medium">{data?.usage?.dailySessions || 1}/1</span>
          </div>
          <div className="flex justify-between">
            <span>Session Length</span>
            <span className="font-medium">{data?.usage?.sessionLength || 15}/20 min</span>
          </div>
          <div className="flex justify-between">
            <span>Active Goals</span>
            <span className="font-medium">{data?.usage?.activeGoalsCount || 2}/3</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Upgrade Benefits</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Unlimited sessions</span>
          </div>
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Advanced analytics</span>
          </div>
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Community access</span>
          </div>
          <div className="flex items-center gap-3">
            <Gift className="w-4 h-4 text-green-500" />
            <span className="text-sm">Family integration</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default ComprehensiveMentalHealthDashboard; 