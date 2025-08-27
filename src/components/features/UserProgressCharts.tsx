import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressMetric {
  id: string;
  category: string;
  value: number;
  target: number;
  unit: string;
  trend: 'improving' | 'declining' | 'stable';
  change: number;
  timestamp: Date;
}

interface TherapeuticOutcome {
  id: string;
  measure: string;
  baseline: number;
  current: number;
  improvement: number;
  confidence: number;
  lastUpdated: Date;
}

export default function UserProgressCharts() {
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetric[]>([]);
  const [therapeuticOutcomes, setTherapeuticOutcomes] = useState<TherapeuticOutcome[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isTracking, setIsTracking] = useState(true);

  // Simulate real-time progress tracking
  useEffect(() => {
    if (!isTracking) return;

    const categories = ['anxiety', 'depression', 'stress', 'sleep', 'mood', 'coping'];
    const units = ['score', 'level', 'hours', 'rating', 'frequency', 'effectiveness'];

    const generateProgressMetric = () => {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const currentValue = Math.random() * 100;
      const target = 100;
      const change = (Math.random() - 0.5) * 20; // -10 to +10
      const trend = change > 5 ? 'improving' : change < -5 ? 'declining' : 'stable';
      
      const newMetric: ProgressMetric = {
        id: `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        category,
        value: Math.max(0, Math.min(100, currentValue)),
        target,
        unit: units[Math.floor(Math.random() * units.length)],
        trend,
        change: Math.abs(change),
        timestamp: new Date()
      };

      setProgressMetrics(prev => {
        const existing = prev.find(m => m.category === category);
        if (existing) {
          return prev.map(m => m.category === category ? newMetric : m);
        } else {
          return [...prev, newMetric];
        }
      });
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance of metric update
        generateProgressMetric();
      }
    }, 3000 + Math.random() * 4000); // Random interval 3-7 seconds

    return () => clearInterval(interval);
  }, [isTracking]);

  // Simulate therapeutic outcomes
  useEffect(() => {
    if (!isTracking) return;

    const measures = [
      'Anxiety Symptoms (GAD-7)',
      'Depression Symptoms (PHQ-9)',
      'Stress Level (PSS)',
      'Sleep Quality (PSQI)',
      'Mood Stability',
      'Coping Effectiveness'
    ];

    const generateOutcome = () => {
      const measure = measures[Math.floor(Math.random() * measures.length)];
      const baseline = Math.random() * 50 + 25; // 25-75
      const improvement = Math.random() * 30; // 0-30
      const current = Math.max(0, baseline - improvement);
      
      const newOutcome: TherapeuticOutcome = {
        id: `outcome-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        measure,
        baseline,
        current,
        improvement,
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
        lastUpdated: new Date()
      };

      setTherapeuticOutcomes(prev => {
        const existing = prev.find(o => o.measure === measure);
        if (existing) {
          return prev.map(o => o.measure === measure ? newOutcome : o);
        } else {
          return [...prev, newOutcome];
        }
      });
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of outcome update
        generateOutcome();
      }
    }, 5000 + Math.random() * 5000); // Random interval 5-10 seconds

    return () => clearInterval(interval);
  }, [isTracking]);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '↗️';
      case 'declining': return '↘️';
      default: return '→';
    }
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-blue-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredMetrics = progressMetrics.filter(metric => 
    selectedCategory === 'all' || metric.category === selectedCategory
  );

  const categories = progressMetrics.map(m => m.category).filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          📊 Live Therapeutic Progress Tracking
        </h3>
        <p className="text-gray-600">
          Real-time visualization of therapeutic outcomes and progress metrics
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-gray-700">
              {isTracking ? 'Progress Tracking Active' : 'Tracking Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsTracking(!isTracking)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isTracking 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isTracking ? 'Pause Tracking' : 'Resume Tracking'}
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                selectedCategory === category
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AnimatePresence mode="wait">
          {filteredMetrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold capitalize">{metric.category}</h4>
                  <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                    {getTrendIcon(metric.trend)}
                  </span>
                </div>
                <p className="text-blue-100 text-sm">{metric.unit}</p>
              </div>

              {/* Progress Content */}
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className={`text-3xl font-bold ${getProgressColor(metric.value)} mb-1`}>
                    {metric.value.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Target: {metric.target} {metric.unit}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${getProgressBarColor(metric.value)}`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>

                {/* Trend Information */}
                <div className="text-center">
                  <div className={`text-lg font-semibold ${getTrendColor(metric.trend)}`}>
                    {metric.trend === 'improving' ? '+' : ''}{metric.change.toFixed(1)} {metric.unit}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {metric.trend} trend
                  </div>
                </div>

                {/* Last Updated */}
                <div className="text-center mt-4 text-xs text-gray-500">
                  Updated: {metric.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Therapeutic Outcomes Dashboard */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4">
          <h4 className="text-lg font-semibold">🎯 Evidence-Based Therapeutic Outcomes</h4>
          <p className="text-green-100 text-sm">Clinical measures and improvement tracking</p>
        </div>
        
        <div className="p-6">
          {therapeuticOutcomes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📈</div>
              <p>Collecting therapeutic outcome data</p>
              <p className="text-sm">Outcomes will appear as more data is collected</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {therapeuticOutcomes.map((outcome, index) => (
                <motion.div
                  key={outcome.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200"
                >
                  <h5 className="font-semibold text-gray-800 mb-3">{outcome.measure}</h5>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs text-gray-600">Baseline</div>
                        <div className="text-lg font-bold text-gray-800">{outcome.baseline.toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Current</div>
                        <div className="text-lg font-bold text-blue-600">{outcome.current.toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Improvement</div>
                        <div className="text-lg font-bold text-green-600">+{outcome.improvement.toFixed(1)}</div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Improvement Progress</span>
                        <span className="text-sm font-medium text-green-600">
                          {((outcome.improvement / outcome.baseline) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(outcome.improvement / outcome.baseline) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Confidence:</span>
                      <span className="font-medium text-blue-600">
                        {(outcome.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500 text-center">
                      Last updated: {outcome.lastUpdated.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {progressMetrics.filter(m => m.trend === 'improving').length}
          </div>
          <div className="text-sm text-gray-600">Improving Metrics</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {therapeuticOutcomes.length}
          </div>
          <div className="text-sm text-gray-600">Active Measures</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {progressMetrics.length > 0 
              ? (progressMetrics.reduce((sum, m) => sum + m.value, 0) / progressMetrics.length).toFixed(1)
              : '0'
            }
          </div>
          <div className="text-sm text-gray-600">Avg Progress</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {therapeuticOutcomes.length > 0
              ? (therapeuticOutcomes.reduce((sum, o) => sum + o.improvement, 0) / therapeuticOutcomes.length).toFixed(1)
              : '0'
            }
          </div>
          <div className="text-sm text-gray-600">Avg Improvement</div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 p-4 border-b">
          <h4 className="text-lg font-semibold text-gray-800">📅 Progress Timeline</h4>
          <p className="text-gray-600 text-sm">Recent progress updates and milestones</p>
        </div>
        
        <div className="p-4">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {progressMetrics.slice(0, 10).map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-800 capitalize">{metric.category}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(metric.trend)}`}>
                          {getTrendIcon(metric.trend)} {metric.trend}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          Value: <span className={`font-medium ${getProgressColor(metric.value)}`}>
                            {metric.value.toFixed(1)} {metric.unit}
                          </span>
                        </span>
                        <span className="text-gray-600">
                          Change: <span className={`font-medium ${getTrendColor(metric.trend)}`}>
                            {metric.trend === 'improving' ? '+' : ''}{metric.change.toFixed(1)} {metric.unit}
                          </span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right text-xs text-gray-500 ml-4">
                      {metric.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
