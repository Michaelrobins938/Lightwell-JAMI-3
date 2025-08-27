import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Check, 
  X, 
  Target, 
  Star, 
  BarChart3, 
  TrendingUp, 
  Award, 
  Calendar, 
  Heart, 
  Brain, 
  Zap, 
  Trophy, 
  Lightbulb, 
  ArrowUpRight,
  Activity,
  Target as TargetIcon,
  Users,
  BookOpen,
  MessageCircle,
  Moon,
  Info,
  Contact,
  Home,
  Lock,
  AlertCircle,
  Loader2,
  Save,
  RefreshCw
} from 'lucide-react';
import Header from '../components/layout/Header';

interface Goal {
  id: number;
  text: string;
  completed: boolean;
  category: 'daily' | 'weekly' | 'long-term';
  createdAt: Date;
  completedAt?: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'streak' | 'milestone' | 'special';
}

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'progress' | 'pattern' | 'recommendation';
  icon: React.ReactNode;
  priority: 'low' | 'medium' | 'high';
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  achieved: boolean;
  achievedAt?: Date;
  target: number;
  current: number;
  icon: React.ReactNode;
}

interface ErrorState {
  hasError: boolean;
  message: string;
}

const AnalyticsCard: React.FC<{ 
  title: string; 
  value: string; 
  subtitle?: string;
  icon: React.ReactNode; 
  trend?: { value: number; isPositive: boolean };
  children?: React.ReactNode;
  loading?: boolean;
}> = ({ title, value, subtitle, icon, trend, children, loading = false }) => (
  <motion.div
    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
    whileHover={{ scale: 1.02, y: -2 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-gray-300 mt-1">{subtitle}</p>}
      </div>
      <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
        {loading ? <Loader2 className="w-6 h-6 animate-spin text-blue-400" /> : icon}
      </div>
    </div>
    <div className="flex items-end justify-between">
      <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
        {loading ? '...' : value}
      </p>
      {trend && !loading && (
        <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
          <ArrowUpRight className={`w-4 h-4 mr-1 ${trend.isPositive ? '' : 'rotate-180'}`} />
          {trend.value}%
        </div>
      )}
    </div>
    {children}
  </motion.div>
);

const AchievementBadge: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
  <motion.div
    className={`relative p-4 rounded-xl border-2 ${
      achievement.unlocked 
        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50' 
        : 'bg-gray-800/50 border-gray-600'
    }`}
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-lg ${
        achievement.unlocked 
          ? 'bg-gradient-to-br from-yellow-500 to-orange-500' 
          : 'bg-gray-700'
      }`}>
        {achievement.icon}
      </div>
      <div>
        <h4 className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
          {achievement.name}
        </h4>
        <p className={`text-sm ${achievement.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
          {achievement.description}
        </p>
        {achievement.unlockedAt && (
          <p className="text-xs text-gray-400 mt-1">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
    {!achievement.unlocked && (
      <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
        <Lock className="w-6 h-6 text-gray-400" />
      </div>
    )}
  </motion.div>
);

const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => (
  <motion.div
    className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
    whileHover={{ scale: 1.02 }}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
  >
    <div className="flex items-start space-x-3">
      <div className={`p-2 rounded-lg ${
        insight.priority === 'high' ? 'bg-red-500/20' :
        insight.priority === 'medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'
      }`}>
        {insight.icon}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
        <p className="text-sm text-gray-300">{insight.description}</p>
      </div>
    </div>
  </motion.div>
);

const MilestoneCard: React.FC<{ milestone: Milestone }> = ({ milestone }) => {
  const progress = (milestone.current / milestone.target) * 100;
  
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className={`p-2 rounded-lg ${
          milestone.achieved 
            ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
            : 'bg-gray-700'
        }`}>
          {milestone.icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold ${milestone.achieved ? 'text-white' : 'text-gray-300'}`}>
            {milestone.name}
          </h4>
          <p className="text-sm text-gray-400">{milestone.description}</p>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-300 mb-1">
          <span>Progress</span>
          <span>{milestone.current}/{milestone.target}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className={`h-2 rounded-full ${
              milestone.achieved ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-blue-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
      
      {milestone.achieved && milestone.achievedAt && (
        <p className="text-xs text-green-400">
          Achieved {new Date(milestone.achievedAt).toLocaleDateString()}
        </p>
      )}
    </motion.div>
  );
};

const ErrorBoundary: React.FC<{ error: ErrorState; onRetry: () => void }> = ({ error, onRetry }) => (
  <motion.div
    className="bg-red-500/10 backdrop-blur-md rounded-xl p-6 border border-red-500/20"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center space-x-3 mb-4">
      <AlertCircle className="w-6 h-6 text-red-400" />
      <h3 className="text-lg font-semibold text-white">Error Loading Goals</h3>
    </div>
    <p className="text-gray-300 mb-4">{error.message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center space-x-2 hover:bg-red-600 transition-colors"
    >
      <RefreshCw className="w-4 h-4" />
      <span>Retry</span>
    </button>
  </motion.div>
);

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: 'daily' as Goal['category'],
    difficulty: 'medium' as Goal['difficulty'],
    priority: 'medium' as Goal['priority'],
    tags: [] as string[]
  });
  const [newGoalCategory, setNewGoalCategory] = useState<Goal['category']>('daily');
  const [newGoalDifficulty, setNewGoalDifficulty] = useState<Goal['difficulty']>('medium');
  const [newGoalPriority, setNewGoalPriority] = useState<Goal['priority']>('medium');
  const [filter, setFilter] = useState<'all' | Goal['category']>('all');
  const [error, setError] = useState<ErrorState>({ hasError: false, message: '' });
  const [saving, setSaving] = useState(false);
  const [totalGoals, setTotalGoals] = useState(0);
  const [streak, setStreak] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [completedGoals, setCompletedGoals] = useState(0);

  // Load goals from API
  const loadGoals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/progress-tracking/goals', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGoals(data.goals || []);
      } else if (response.status === 401) {
        // Handle unauthorized - redirect to login or show message
        console.log('User not authenticated');
      }
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new goal
  const handleCreateGoal = async () => {
    if (!newGoal.title.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/progress-tracking/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newGoal.title,
          description: newGoal.description,
          targetDate: newGoal.targetDate ? new Date(newGoal.targetDate) : undefined,
          category: newGoal.category,
          difficulty: newGoal.difficulty,
          priority: newGoal.priority,
          tags: newGoal.tags
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGoals([...goals, data.goal]);
        setNewGoal({
          title: '',
          description: '',
          targetDate: '',
          category: 'daily',
          difficulty: 'medium',
          priority: 'medium',
          tags: []
        });
        setShowAddGoal(false);
      }
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  // Update goal completion status
  const handleToggleGoal = async (goalId: number) => {
    try {
      const token = localStorage.getItem('token');
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const response = await fetch(`/api/progress-tracking/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          completed: !goal.completed,
          completedAt: !goal.completed ? new Date().toISOString() : null
        }),
      });

      if (response.ok) {
        setGoals(goals.map(g => 
          g.id === goalId 
            ? { ...g, completed: !g.completed, completedAt: !g.completed ? new Date() : undefined }
            : g
        ));
      }
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  // Load goals on mount
  useEffect(() => {
    loadGoals();
  }, []);

  // Save data to localStorage with error handling
  const saveData = useCallback(async (goalsToSave: Goal[]) => {
    try {
      setSaving(true);
      localStorage.setItem('lunaGoals', JSON.stringify(goalsToSave));
      setSaving(false);
    } catch (err) {
      setError({ 
        hasError: true, 
        message: err instanceof Error ? err.message : 'Failed to save goals data' 
      });
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    if (goals.length > 0) {
      saveData(goals);
    }
  }, [goals, saveData]);

  useEffect(() => {
    if (loading) return;
    
    // Calculate analytics
    const total = goals.length;
    const completed = goals.filter(goal => goal.completed).length;
    setTotalGoals(total);
    setCompletedGoals(completed);
    
    // Calculate streak
    let currentStreak = 0;
    const sortedGoals = [...goals].sort((a, b) => {
      if (!a.completedAt || !b.completedAt) return 0;
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedGoals.length; i++) {
      const goal = sortedGoals[i];
      if (goal.completed && goal.completedAt) {
        const completedDate = new Date(goal.completedAt);
        completedDate.setHours(0, 0, 0, 0);
        if (completedDate.getTime() === today.getTime() - i * 86400000) {
          currentStreak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    setStreak(currentStreak);
    
    // Generate insights
    generateInsights(total, completed, currentStreak);
    
    // Check achievements
    checkAchievements(total, completed, currentStreak);
    
    // Update milestones
    updateMilestones(total, completed, currentStreak);
  }, [goals, loading]);

  const generateInsights = (total: number, completed: number, currentStreak: number) => {
    const newInsights: Insight[] = [];
    
    if (completed > 0 && total > 0) {
      const completionRate = (completed / total) * 100;
      
      if (completionRate < 50) {
        newInsights.push({
          id: 'low_completion',
          title: 'Focus on Completion',
          description: 'Your completion rate is below 50%. Try breaking down larger goals into smaller, more manageable tasks.',
          type: 'recommendation',
          icon: <Target className="w-5 h-5" />,
          priority: 'high'
        });
      }
      
      if (currentStreak === 0) {
        newInsights.push({
          id: 'no_streak',
          title: 'Start Your Streak',
          description: 'You haven\'t completed any goals recently. Start with a simple daily goal to build momentum.',
          type: 'recommendation',
          icon: <Zap className="w-5 h-5" />,
          priority: 'medium'
        });
      }
      
      if (currentStreak >= 7) {
        newInsights.push({
          id: 'strong_streak',
          title: 'Amazing Streak!',
          description: `You've maintained a ${currentStreak}-day streak. Keep up the excellent work!`,
          type: 'progress',
          icon: <Star className="w-5 h-5" />,
          priority: 'low'
        });
      }
    }
    
    setInsights(newInsights);
  };

  const checkAchievements = (total: number, completed: number, currentStreak: number) => {
    setAchievements(prev => prev.map(achievement => {
      let unlocked = achievement.unlocked;
      let unlockedAt = achievement.unlockedAt;
      
      switch (achievement.id) {
        case 'first_goal':
          if (completed >= 1 && !unlocked) {
            unlocked = true;
            unlockedAt = new Date();
          }
          break;
        case 'streak_7':
          if (currentStreak >= 7 && !unlocked) {
            unlocked = true;
            unlockedAt = new Date();
          }
          break;
        case 'streak_30':
          if (currentStreak >= 30 && !unlocked) {
            unlocked = true;
            unlockedAt = new Date();
          }
          break;
        case 'completion_50':
          if (completed >= 50 && !unlocked) {
            unlocked = true;
            unlockedAt = new Date();
          }
          break;
      }
      
      return { ...achievement, unlocked, unlockedAt };
    }));
  };

  const updateMilestones = (total: number, completed: number, currentStreak: number) => {
    setMilestones(prev => prev.map(milestone => {
      let current = milestone.current;
      let achieved = milestone.achieved;
      let achievedAt = milestone.achievedAt;
      
      switch (milestone.id) {
        case 'goals_10':
          current = total;
          if (total >= 10 && !achieved) {
            achieved = true;
            achievedAt = new Date();
          }
          break;
        case 'completion_25':
          current = completed;
          if (completed >= 25 && !achieved) {
            achieved = true;
            achievedAt = new Date();
          }
          break;
        case 'streak_14':
          current = currentStreak;
          if (currentStreak >= 14 && !achieved) {
            achieved = true;
            achievedAt = new Date();
          }
          break;
      }
      
      return { ...milestone, current, achieved, achievedAt };
    }));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.title.trim()) {
      const newGoalObject: Goal = { 
        id: Date.now(), 
        text: newGoal.title, 
        completed: false, 
        category: newGoalCategory,
        difficulty: newGoalDifficulty,
        priority: newGoalPriority,
        tags: newGoal.tags,
        createdAt: new Date()
      };
      setGoals([...goals, newGoalObject]);
      setNewGoal({
        title: '',
        description: '',
        targetDate: '',
        category: 'daily',
        difficulty: 'medium',
        priority: 'medium',
        tags: []
      });
    }
  };

  const toggleGoalCompletion = (id: number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { 
        ...goal, 
        completed: !goal.completed, 
        completedAt: goal.completed ? undefined : new Date() 
      } : goal
    ));
  };

  const removeGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const handleRetry = () => {
    loadGoals();
  };

  const filteredGoals = filter === 'all' ? goals : goals.filter(goal => goal.category === filter);
  const progressPercentage = goals.length > 0 ? (goals.filter(goal => goal.completed).length / goals.length) * 100 : 0;

  if (error.hasError) {
    return (
      <div className="min-h-screen">
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <ErrorBoundary error={error} onRetry={handleRetry} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Progress Tracking
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Wellness Journey Analytics
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Monitor your mental health progress with detailed analytics, goal tracking, and personalized recommendations for continued growth.
            </p>
          </motion.div>

          {/* Analytics Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AnalyticsCard 
              title="Progress Analytics" 
              value={`${progressPercentage.toFixed(0)}%`}
              subtitle="Overall completion rate"
              icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
              trend={{ value: 12, isPositive: true }}
              loading={loading}
            >
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </AnalyticsCard>
            
            <AnalyticsCard 
              title="Goal Tracking" 
              value={totalGoals.toString()}
              subtitle="Total goals set"
              icon={<Target className="w-6 h-6 text-green-400" />}
              loading={loading}
            />
            
            <AnalyticsCard 
              title="Current Streak" 
              value={`${streak} days`}
              subtitle="Consecutive completions"
              icon={<Star className="w-6 h-6 text-yellow-400" />}
              loading={loading}
            />
            
            <AnalyticsCard 
              title="Accuracy" 
              value={`${accuracy}%`}
              subtitle="Prediction accuracy"
              icon={<TrendingUp className="w-6 h-6 text-purple-400" />}
              loading={loading}
            />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Goals Management */}
            <div className="lg:col-span-2 space-y-8">
              {/* Add Goal Form */}
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-white">Add New Goal</h2>
                  {saving && (
                    <div className="flex items-center space-x-2 text-blue-400">
                      <Save className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">Saving...</span>
                    </div>
                  )}
                </div>
                <form onSubmit={handleAddGoal} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your goal..."
                      disabled={loading}
                    />
                    <select
                      value={newGoalCategory}
                      onChange={(e) => setNewGoalCategory(e.target.value as 'daily' | 'weekly' | 'long-term')}
                      className="p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="long-term">Long-term</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      value={newGoalDifficulty}
                      onChange={(e) => setNewGoalDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                      className="p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <select
                      value={newGoalPriority}
                      onChange={(e) => setNewGoalPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                  <motion.button 
                    type="submit" 
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading || !newGoal.title.trim()}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5 mr-2" />
                    )}
                    {loading ? 'Loading...' : 'Add Goal'}
                  </motion.button>
                </form>
              </motion.div>

              {/* Filter Buttons */}
              <motion.div 
                className="flex flex-wrap justify-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {(['all', 'daily', 'weekly', 'long-term'] as const).map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      filter === category 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </motion.button>
                ))}
              </motion.div>

              {/* Goals List */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                    <span className="ml-3 text-gray-300">Loading goals...</span>
                  </div>
                ) : filteredGoals.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No goals yet</h3>
                    <p className="text-gray-400">Add your first goal to get started on your wellness journey!</p>
                  </div>
                ) : (
                  filteredGoals.map((goal, index) => (
                    <motion.div
                      key={goal.id}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <motion.button
                          onClick={() => toggleGoalCompletion(goal.id)}
                          className={`p-2 rounded-lg ${
                            goal.completed ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-gray-700'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={loading}
                        >
                          <Check className="w-5 h-5 text-white" />
                        </motion.button>
                        <div className="flex-1">
                          <p className={`font-medium ${goal.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                            {goal.text}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                            <span className="capitalize">{goal.category}</span>
                            <span className="capitalize">{goal.difficulty}</span>
                            <span className="capitalize">{goal.priority} priority</span>
                            <span>Created: {new Date(goal.createdAt).toLocaleDateString()}</span>
                            {goal.completedAt && (
                              <span>Completed: {new Date(goal.completedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <motion.button 
                          onClick={() => removeGoal(goal.id)} 
                          className="text-red-400 hover:text-red-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={loading}
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </div>

            {/* Right Column - Insights & Achievements */}
            <div className="space-y-8">
              {/* Personalized Insights */}
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">Daily Insights</h3>
                <div className="space-y-3">
                  {insights.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                  {insights.length === 0 && (
                    <p className="text-gray-400 text-sm">No insights available yet. Complete some goals to get personalized recommendations!</p>
                  )}
                </div>
              </motion.div>

              {/* Achievement Badges */}
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">Achievement Badges</h3>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <AchievementBadge key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </motion.div>

              {/* Milestone Celebrations */}
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">Milestone Celebrations</h3>
                <div className="space-y-3">
                  {milestones.map((milestone) => (
                    <MilestoneCard key={milestone.id} milestone={milestone} />
                  ))}
                </div>
              </motion.div>

              {/* Growth Recommendations */}
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">Growth Recommendations</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                    <Brain className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Mental Wellness</h4>
                      <p className="text-sm text-gray-300">Try meditation or journaling to enhance your mental clarity.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                    <Activity className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Physical Activity</h4>
                      <p className="text-sm text-gray-300">Incorporate daily exercise to boost your mood and energy.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Social Connection</h4>
                      <p className="text-sm text-gray-300">Connect with others in our community for support and motivation.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Stats */}
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  99.5%
                </div>
                <div className="text-gray-300">Accuracy</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  Daily
                </div>
                <div className="text-gray-300">Insights</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  {streak}
                </div>
                <div className="text-gray-300">Day Streak</div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};