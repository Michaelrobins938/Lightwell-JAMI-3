import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Activity, Zap, UserCheck, Shield, Smile, BookOpen, TrendingUp, Cpu } from 'lucide-react';

interface TestResult {
  success: boolean;
  testType: string;
  jamieResponse?: any;
  cognitivePattern?: any;
  behavioralPredictions?: any[];
  behavioralInterventions?: any[];
  optimalIntervention?: any;
  behavioralInsights?: any;
  mockMetrics?: any;
  scalingActions?: any[];
  costOptimizations?: any[];
  performancePredictions?: any[];
  incidentPredictions?: any[];
  multiCloudActions?: any[];
  edgeComputingActions?: any[];
  systemStatus?: any;
  optimizationActions?: any[];
  systemMetrics?: any;
  processingTime?: number;
}

export default function AdvancedAITest() {
  const [userId, setUserId] = useState('test-user-123');
  const [message, setMessage] = useState('I\'m feeling anxious about my upcoming presentation at work.');
  const [testType, setTestType] = useState<'behavior_prediction' | 'system_orchestration' | 'integrated_test'>('integrated_test');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/advanced-ai-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          message,
          testType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Test failed');
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderBehaviorPredictionResults = () => {
    if (!results) return null;

    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Target className="mr-2" />
            Cognitive Pattern Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p><strong>Decision Style:</strong> {results.cognitivePattern?.decisionMakingStyle}</p>
              <p><strong>Attention Span:</strong> {results.cognitivePattern?.attentionSpan}/10</p>
              <p><strong>Memory Retention:</strong> {results.cognitivePattern?.memoryRetention}/10</p>
            </div>
            <div className="space-y-2">
              <p><strong>Emotional Regulation:</strong> {results.cognitivePattern?.emotionalRegulation}/10</p>
              <p><strong>Risk Tolerance:</strong> {results.cognitivePattern?.riskTolerance}/10</p>
              <p><strong>Social Influence:</strong> {results.cognitivePattern?.socialInfluence}/10</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="mr-2" />
            Behavioral Predictions
          </h3>
          <div className="space-y-3">
            {results.behavioralPredictions?.map((prediction, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <p><strong>Next Action:</strong> {prediction.nextAction}</p>
                <p><strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(1)}%</p>
                <p><strong>Timeframe:</strong> {prediction.timeframe}</p>
                <p><strong>Risk Level:</strong> {prediction.riskLevel}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="mr-2" />
            Behavioral Interventions
          </h3>
          <div className="space-y-3">
            {results.behavioralInterventions?.map((intervention, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                <p><strong>Type:</strong> {intervention.type}</p>
                <p><strong>Content:</strong> {intervention.content}</p>
                <p><strong>Timing:</strong> {intervention.timing}</p>
                <p><strong>Delivery:</strong> {intervention.deliveryMethod}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderSystemOrchestrationResults = () => {
    if (!results) return null;

    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Cpu className="mr-2" />
            System Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p><strong>Latency:</strong> {results.mockMetrics?.latency?.toFixed(0)}ms</p>
              <p><strong>Throughput:</strong> {results.mockMetrics?.throughput?.toFixed(0)} req/s</p>
              <p><strong>Error Rate:</strong> {(results.mockMetrics?.errorRate * 100).toFixed(2)}%</p>
            </div>
            <div className="space-y-2">
              <p><strong>CPU Usage:</strong> {(results.mockMetrics?.resourceUtilization?.cpu * 100).toFixed(1)}%</p>
              <p><strong>Memory Usage:</strong> {(results.mockMetrics?.resourceUtilization?.memory * 100).toFixed(1)}%</p>
              <p><strong>User Satisfaction:</strong> {(results.mockMetrics?.userSatisfaction * 100).toFixed(1)}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Zap className="mr-2" />
            Optimization Actions
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Scaling Actions ({results.scalingActions?.length || 0})</h4>
              {results.scalingActions?.map((action, index) => (
                <div key={index} className="border-l-4 border-orange-500 pl-4 py-2 mb-2">
                  <p><strong>{action.type}:</strong> {action.description}</p>
                  <p><strong>Priority:</strong> {action.priority}</p>
                  <p><strong>Impact:</strong> Latency {action.expectedImpact.latency > 0 ? '+' : ''}{action.expectedImpact.latency * 100}%, Cost {action.expectedImpact.cost > 0 ? '+' : ''}{action.expectedImpact.cost * 100}%</p>
                </div>
              ))}
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Cost Optimizations ({results.costOptimizations?.length || 0})</h4>
              {results.costOptimizations?.map((action, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2 mb-2">
                  <p><strong>{action.type}:</strong> {action.description}</p>
                  <p><strong>Priority:</strong> {action.priority}</p>
                  <p><strong>Cost Impact:</strong> {action.expectedImpact.cost > 0 ? '+' : ''}{action.expectedImpact.cost * 100}%</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="mr-2" />
            Performance Predictions
          </h3>
          <div className="space-y-3">
            {results.performancePredictions?.map((prediction, index) => (
              <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                <p><strong>Type:</strong> {prediction.type}</p>
                <p><strong>Severity:</strong> {prediction.severity}</p>
                <p><strong>Message:</strong> {prediction.message}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderIntegratedResults = () => {
    if (!results) return null;

    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Target className="mr-2" />
            Jamie's Therapeutic Response
          </h3>
          <div className="space-y-3">
            <p className="text-gray-700">{results.jamieResponse?.response}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Primary Emotion:</strong> {results.jamieResponse?.emotionalAssessment?.primaryEmotion}</p>
                <p><strong>Intensity:</strong> {results.jamieResponse?.emotionalAssessment?.intensity}/10</p>
                <p><strong>Crisis Level:</strong> {results.jamieResponse?.crisisLevel}</p>
              </div>
              <div>
                <p><strong>Intervention Type:</strong> {results.jamieResponse?.therapeuticIntervention?.type}</p>
                <p><strong>Expected Outcome:</strong> {results.jamieResponse?.therapeuticIntervention?.expectedOutcome}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {renderBehaviorPredictionResults()}
        {renderSystemOrchestrationResults()}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="mr-2" />
            Processing Performance
          </h3>
          <div className="space-y-2">
            <p><strong>Processing Time:</strong> {results.processingTime}ms</p>
            <p><strong>System Latency:</strong> {results.systemMetrics?.latency}ms</p>
            <p><strong>Cost per Request:</strong> ${results.systemMetrics?.costPerRequest?.toFixed(4)}</p>
            <p><strong>User Satisfaction:</strong> {(results.systemMetrics?.userSatisfaction * 100).toFixed(1)}%</p>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced AI Capabilities Test
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test the Advanced Human Behavior Prediction Engine and Live System Orchestration capabilities
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Type
              </label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="behavior_prediction">Behavior Prediction</option>
                <option value="system_orchestration">System Orchestration</option>
                <option value="integrated_test">Integrated Test</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a message to test the AI capabilities..."
            />
          </div>

          <div className="mt-6">
            <button
              onClick={runTest}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Running Test...' : 'Run Advanced AI Test'}
            </button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8"
          >
            <p className="text-red-800">{error}</p>
          </motion.div>
        )}

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {testType === 'behavior_prediction' && renderBehaviorPredictionResults()}
            {testType === 'system_orchestration' && renderSystemOrchestrationResults()}
            {testType === 'integrated_test' && renderIntegratedResults()}
          </motion.div>
        )}
      </div>
    </div>
  );
} 