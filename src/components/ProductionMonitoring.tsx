import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ClientOnly from './ClientOnly';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Cpu, 
  Database, 
  Heart, 
  MessageCircle, 
  Monitor, 
  Server, 
  Shield, 
  TrendingUp, 
  Users, 
  Zap,
  Wifi,
  WifiOff,
  BarChart3,
  Gauge,
  Thermometer,
  Target
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  threshold: {
    warning: number;
    critical: number;
  };
}

interface TherapeuticMetric {
  name: string;
  value: number;
  target: number;
  status: 'excellent' | 'good' | 'needs_improvement' | 'critical';
  description: string;
}

interface ProductionMonitoringProps {
  className?: string;
}

const ProductionMonitoring: React.FC<ProductionMonitoringProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(true); // default to visible
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      name: 'Response Time',
      value: 245,
      unit: 'ms',
      status: 'healthy',
      trend: 'stable',
      threshold: { warning: 500, critical: 1000 }
    },
    {
      name: 'CPU Usage',
      value: 23,
      unit: '%',
      status: 'healthy',
      trend: 'down',
      threshold: { warning: 70, critical: 90 }
    },
    {
      name: 'Memory Usage',
      value: 45,
      unit: '%',
      status: 'healthy',
      trend: 'stable',
      threshold: { warning: 80, critical: 95 }
    },
    {
      name: 'Database Connections',
      value: 12,
      unit: 'active',
      status: 'healthy',
      trend: 'up',
      threshold: { warning: 50, critical: 100 }
    },
    {
      name: 'Error Rate',
      value: 0.02,
      unit: '%',
      status: 'healthy',
      trend: 'down',
      threshold: { warning: 1, critical: 5 }
    },
    {
      name: 'Uptime',
      value: 99.98,
      unit: '%',
      status: 'healthy',
      trend: 'stable',
      threshold: { warning: 99.5, critical: 99.0 }
    }
  ]);

  const [therapeuticMetrics, setTherapeuticMetrics] = useState<TherapeuticMetric[]>([
    {
      name: 'Crisis Response Time',
      value: 180,
      target: 200,
      status: 'excellent',
      description: 'Average time to detect and respond to crisis indicators'
    },
    {
      name: 'User Satisfaction',
      value: 4.7,
      target: 4.5,
      status: 'excellent',
      description: 'Average user satisfaction score (1-5 scale)'
    },
    {
      name: 'Therapeutic Effectiveness',
      value: 87,
      target: 80,
      status: 'excellent',
      description: 'Percentage of users reporting improved mental health'
    },
    {
      name: 'Accessibility Compliance',
      value: 98.5,
      target: 95,
      status: 'excellent',
      description: 'WCAG 2.2 AA compliance score'
    },
    {
      name: 'Professional Handoff Success',
      value: 94,
      target: 90,
      status: 'excellent',
      description: 'Successful handoffs to human professionals'
    },
    {
      name: 'Data Security Score',
      value: 99.9,
      target: 99.5,
      status: 'excellent',
      description: 'Security audit compliance score'
    }
  ]);

  const [alerts, setAlerts] = useState<Array<{
    id: string;
    type: 'info' | 'warning' | 'critical';
    message: string;
    timestamp: Date;
  }>>([]);

  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const getStatus = (value: number, threshold: { warning: number; critical: number }) => {
    if (value >= threshold.critical) return 'critical';
    if (value >= threshold.warning) return 'warning';
    return 'healthy';
  };

  const getTrend = (value: number) => {
    const change = Math.random() - 0.5;
    if (change > 0.1) return 'up';
    if (change < -0.1) return 'down';
    return 'stable';
  };

  const checkForAlerts = useCallback(() => {
    const newAlerts: Array<{
      id: string;
      type: 'info' | 'warning' | 'critical';
      message: string;
      timestamp: Date;
    }> = [];

    systemMetrics.forEach(metric => {
      if (metric.status === 'critical') {
        newAlerts.push({
          id: `critical-${metric.name}`,
          type: 'critical',
          message: `${metric.name} is at critical level: ${metric.value}${metric.unit}`,
          timestamp: new Date()
        });
      } else if (metric.status === 'warning') {
        newAlerts.push({
          id: `warning-${metric.name}`,
          type: 'warning',
          message: `${metric.name} is approaching critical level: ${metric.value}${metric.unit}`,
          timestamp: new Date()
        });
      }
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev.slice(0, 4)]);
    }
  }, [systemMetrics]);

  useEffect(() => {
    // Simulate real-time monitoring
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Simulate metric updates
      setSystemMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 10,
        status: getStatus(metric.value, metric.threshold),
        trend: getTrend(metric.value)
      })));

      // Check for alerts
      checkForAlerts();
    }, 5000);

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkForAlerts]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'excellent':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'warning':
      case 'good':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'critical':
      case 'needs_improvement':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'excellent':
        return <CheckCircle size={16} />;
      case 'warning':
      case 'good':
        return <AlertTriangle size={16} />;
      case 'critical':
      case 'needs_improvement':
        return <AlertTriangle size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={12} className="text-green-500" />;
      case 'down':
        return <TrendingUp size={12} className="text-red-500 transform rotate-180" />;
      default:
        return <Activity size={12} className="text-gray-500" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`bg-white dark:bg-luna-800 rounded-lg shadow-lg p-6 relative ${className}`}>
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-luna-violet"
        aria-label="Close Production Monitoring"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <Monitor className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-luna-900 dark:text-luna-100">
              Production Monitoring
            </h2>
            <p className="text-sm text-luna-600 dark:text-luna-400">
              Real-time system health and therapeutic effectiveness
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
            isOnline 
              ? 'text-green-600 bg-green-100 dark:bg-green-900/20' 
              : 'text-red-600 bg-red-100 dark:bg-red-900/20'
          }`}>
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <div className="text-xs text-luna-500">
            Last update: <ClientOnly>{lastUpdate.toLocaleTimeString()}</ClientOnly>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          <h3 className="text-sm font-semibold text-luna-700 dark:text-luna-300">
            Active Alerts
          </h3>
          {alerts.slice(0, 3).map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'critical' 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-400' 
                  : alert.type === 'warning'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {alert.message}
                </span>
                <span className="text-xs text-luna-500">
                  <ClientOnly>{alert.timestamp.toLocaleTimeString()}</ClientOnly>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* System Metrics */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-luna-900 dark:text-luna-100 mb-4 flex items-center space-x-2">
          <Server size={20} />
          <span>System Health</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemMetrics.map((metric) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                metric.status === 'healthy' 
                  ? 'border-green-200 dark:border-green-800' 
                  : metric.status === 'warning'
                  ? 'border-yellow-200 dark:border-yellow-800'
                  : 'border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-luna-700 dark:text-luna-300">
                  {metric.name}
                </span>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(metric.status)}`}>
                  {getStatusIcon(metric.status)}
                  <span className="capitalize">{metric.status}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-luna-900 dark:text-luna-100">
                  {metric.value.toFixed(metric.name === 'Uptime' ? 2 : 0)}{metric.unit}
                </span>
                {getTrendIcon(metric.trend)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Therapeutic Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-luna-900 dark:text-luna-100 mb-4 flex items-center space-x-2">
          <Heart size={20} />
          <span>Therapeutic Effectiveness</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {therapeuticMetrics.map((metric) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg border border-luna-200 dark:border-luna-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-luna-700 dark:text-luna-300">
                  {metric.name}
                </span>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(metric.status)}`}>
                  {getStatusIcon(metric.status)}
                  <span className="capitalize">{metric.status.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl font-bold text-luna-900 dark:text-luna-100">
                    {metric.value.toFixed(metric.name.includes('Time') ? 0 : 1)}
                    {metric.name.includes('Time') ? 'ms' : metric.name.includes('Rate') ? '%' : ''}
                  </span>
                  <span className="text-sm text-luna-500">
                    Target: {metric.target}
                    {metric.name.includes('Time') ? 'ms' : metric.name.includes('Rate') ? '%' : ''}
                  </span>
                </div>
                <div className="w-full bg-luna-200 dark:bg-luna-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metric.value >= metric.target 
                        ? 'bg-green-500' 
                        : metric.value >= metric.target * 0.8
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-luna-600 dark:text-luna-400">
                {metric.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="mt-6 pt-6 border-t border-luna-200 dark:border-luna-700">
        <h3 className="text-lg font-semibold text-luna-900 dark:text-luna-100 mb-4 flex items-center space-x-2">
          <Gauge size={20} />
          <span>Performance Indicators</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {systemMetrics.find(m => m.name === 'Uptime')?.value.toFixed(2)}%
            </div>
            <div className="text-xs text-luna-600 dark:text-luna-400">Uptime</div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {systemMetrics.find(m => m.name === 'Response Time')?.value}ms
            </div>
            <div className="text-xs text-luna-600 dark:text-luna-400">Avg Response</div>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {therapeuticMetrics.find(m => m.name === 'User Satisfaction')?.value.toFixed(1)}/5
            </div>
            <div className="text-xs text-luna-600 dark:text-luna-400">Satisfaction</div>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {therapeuticMetrics.find(m => m.name === 'Crisis Response Time')?.value}ms
            </div>
            <div className="text-xs text-luna-600 dark:text-luna-400">Crisis Response</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionMonitoring; 