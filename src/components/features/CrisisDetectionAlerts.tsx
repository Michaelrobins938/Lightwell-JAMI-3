import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CrisisAlert {
  id: string;
  type: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  userId: string;
  intervention: string;
  status: 'active' | 'resolved' | 'escalated';
  confidence: number;
  emotionalIndicators: string[];
}

export default function CrisisDetectionAlerts() {
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  // Simulate real-time crisis detection
  useEffect(() => {
    if (!isMonitoring) return;

    const generateAlert = () => {
      const alertTypes: CrisisAlert['type'][] = ['low', 'medium', 'high', 'critical'];
      const alertMessages = [
        'User expressing feelings of hopelessness',
        'Mention of self-harm thoughts',
        'Severe anxiety with panic symptoms',
        'Depression with isolation behavior',
        'Relationship conflict with emotional distress',
        'Work stress with burnout indicators',
        'Trauma-related flashbacks mentioned',
        'Substance use concerns detected'
      ];
      
      const interventions = [
        'Safety planning and coping strategies',
        'Crisis hotline information provided',
        'Professional therapist referral',
        'Emergency contact notification',
        'Grounding techniques demonstrated',
        'Validation and emotional support',
        'Risk assessment completed',
        'Safety protocol activated'
      ];

      const emotionalIndicators = [
        'Sadness', 'Anxiety', 'Anger', 'Fear', 'Shame', 'Guilt', 'Hopelessness', 'Isolation'
      ];

      const newAlert: CrisisAlert = {
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        message: alertMessages[Math.floor(Math.random() * alertMessages.length)],
        timestamp: new Date(),
        userId: `user-${Math.floor(Math.random() * 1000)}`,
        intervention: interventions[Math.floor(Math.random() * interventions.length)],
        status: 'active',
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
        emotionalIndicators: emotionalIndicators
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 4) + 1)
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of alert
        generateAlert();
      }
    }, 3000 + Math.random() * 4000); // Random interval 3-7 seconds

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getAlertColor = (type: CrisisAlert['type']) => {
    switch (type) {
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'critical': return 'bg-red-600 text-white border-red-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: CrisisAlert['status']) => {
    switch (status) {
      case 'active': return 'bg-red-500';
      case 'resolved': return 'bg-green-500';
      case 'escalated': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.8) return 'text-blue-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' as const } : alert
    ));
  };

  const escalateAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'escalated' as const } : alert
    ));
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved');
  const escalatedAlerts = alerts.filter(alert => alert.status === 'escalated');

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          🚨 Crisis Detection & Safety Protocols
        </h3>
        <p className="text-gray-600">
          Real-time monitoring with immediate intervention capabilities
        </p>
      </div>

      {/* Monitoring Controls */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-gray-700">
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isMonitoring 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isMonitoring ? 'Pause Monitoring' : 'Resume Monitoring'}
          </button>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">{activeAlerts.length}</div>
          <div className="text-sm text-gray-600">Active Alerts</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{resolvedAlerts.length}</div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">{escalatedAlerts.length}</div>
          <div className="text-sm text-gray-600">Escalated</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">{alerts.length}</div>
          <div className="text-sm text-gray-600">Total Detected</div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4">
          <h4 className="text-lg font-semibold">🚨 Active Crisis Alerts</h4>
          <p className="text-red-100 text-sm">Real-time safety monitoring in progress</p>
        </div>

        <div className="p-6">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">✅</div>
              <p>No active crisis alerts</p>
              <p className="text-sm">Safety monitoring continues in background</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {activeAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAlertColor(alert.type)}`}>
                            {alert.type.toUpperCase()} RISK
                          </span>
                          <span className="text-xs text-gray-600">
                            {alert.timestamp.toLocaleTimeString()}
                          </span>
                          <span className="text-xs text-gray-600">
                            User: {alert.userId}
                          </span>
                        </div>
                        
                        <h5 className="font-semibold mb-2">{alert.message}</h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs font-medium text-gray-600">Intervention:</span>
                            <p className="text-sm">{alert.intervention}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-600">Confidence:</span>
                            <span className={`ml-2 font-semibold ${getConfidenceColor(alert.confidence)}`}>
                              {(alert.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <span className="text-xs font-medium text-gray-600">Emotional Indicators:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {alert.emotionalIndicators.map(indicator => (
                              <span
                                key={indicator}
                                className="px-2 py-1 bg-white/50 rounded-full text-xs"
                              >
                                {indicator}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => escalateAlert(alert.id)}
                          className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
                        >
                          Escalate
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Safety Protocol Status */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h4 className="text-xl font-bold text-gray-800 mb-4">🛡️ Safety Protocol Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-gray-700 mb-3">Active Safety Measures</h5>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Real-time emotional monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Automated crisis detection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Immediate intervention protocols</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Professional escalation system</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold text-gray-700 mb-3">Response Times</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Crisis Detection:</span>
                <span className="text-sm font-medium text-green-600">&lt; 2 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Intervention Initiation:</span>
                <span className="text-sm font-medium text-green-600">&lt; 5 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Professional Handoff:</span>
                <span className="text-sm font-medium text-green-600">&lt; 30 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Emergency Response:</span>
                <span className="text-sm font-medium text-green-600">&lt; 1 minute</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {alerts.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <h4 className="text-lg font-semibold text-gray-800">📊 Recent Activity</h4>
          </div>
          <div className="p-4">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {alerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="flex items-center gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(alert.status)}`} />
                  <span className="text-gray-600">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getAlertColor(alert.type)}`}>
                    {alert.type}
                  </span>
                  <span className="text-gray-800 flex-1">{alert.message}</span>
                  <span className="text-gray-500">{alert.userId}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
