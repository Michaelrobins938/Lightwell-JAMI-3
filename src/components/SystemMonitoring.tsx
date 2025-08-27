import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientOnly from './ClientOnly';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap,
  Server,
  Database,
  Cpu,
  HardDrive,
  Network,
  Wifi,
  Shield,
  Eye,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  BellOff,
  RefreshCw,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Globe,
  Lock,
  Unlock,
  Users,
  MessageSquare,
  Heart,
  Brain,
  AlertCircle,
  Info,
  HelpCircle
} from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  trend: 'up' | 'down' | 'stable';
  threshold: {
    warning: number;
    critical: number;
  };
  timestamp: Date;
}

interface SystemAlert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  system: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface PerformanceData {
  timestamp: Date;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  crisisInterventions: number;
}

export default function SystemMonitoring() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [alertLevel, setAlertLevel] = useState<'all' | 'warning' | 'critical'>('all');

  // Initialize system metrics
  useEffect(() => {
    const initialMetrics: SystemMetric[] = [
      {
        id: 'cpu-usage',
        name: 'CPU Usage',
        value: 45,
        unit: '%',
        status: 'healthy',
        trend: 'stable',
        threshold: { warning: 70, critical: 90 },
        timestamp: new Date()
      },
      {
        id: 'memory-usage',
        name: 'Memory Usage',
        value: 62,
        unit: '%',
        status: 'warning',
        trend: 'up',
        threshold: { warning: 75, critical: 90 },
        timestamp: new Date()
      },
      {
        id: 'disk-usage',
        name: 'Disk Usage',
        value: 38,
        unit: '%',
        status: 'healthy',
        trend: 'stable',
        threshold: { warning: 80, critical: 95 },
        timestamp: new Date()
      },
      {
        id: 'network-throughput',
        name: 'Network Throughput',
        value: 125,
        unit: 'Mbps',
        status: 'healthy',
        trend: 'up',
        threshold: { warning: 500, critical: 800 },
        timestamp: new Date()
      },
      {
        id: 'api-response-time',
        name: 'API Response Time',
        value: 180,
        unit: 'ms',
        status: 'healthy',
        trend: 'stable',
        threshold: { warning: 500, critical: 1000 },
        timestamp: new Date()
      },
      {
        id: 'database-connections',
        name: 'Database Connections',
        value: 24,
        unit: 'active',
        status: 'healthy',
        trend: 'stable',
        threshold: { warning: 80, critical: 100 },
        timestamp: new Date()
      },
      {
        id: 'active-users',
        name: 'Active Users',
        value: 156,
        unit: 'users',
        status: 'healthy',
        trend: 'up',
        threshold: { warning: 1000, critical: 2000 },
        timestamp: new Date()
      },
      {
        id: 'crisis-interventions',
        name: 'Crisis Interventions',
        value: 3,
        unit: 'today',
        status: 'healthy',
        trend: 'stable',
        threshold: { warning: 10, critical: 20 },
        timestamp: new Date()
      }
    ];

    setMetrics(initialMetrics);
  }, []);

  // Initialize alerts
  useEffect(() => {
    const initialAlerts: SystemAlert[] = [
      {
        id: 'mem-warning-1',
        level: 'warning',
        message: 'Memory usage approaching threshold (62%)',
        system: 'memory-usage',
        timestamp: new Date(Date.now() - 300000),
        acknowledged: false
      },
      {
        id: 'cpu-info-1',
        level: 'info',
        message: 'CPU usage within normal range (45%)',
        system: 'cpu-usage',
        timestamp: new Date(Date.now() - 600000),
        acknowledged: true
      }
    ];

    setAlerts(initialAlerts);
  }, []);

  // Simulate real-time monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Update metrics with simulated real-time data
      setMetrics(prev => prev.map(metric => {
        const variation = (Math.random() - 0.5) * 10;
        const newValue = Math.max(0, Math.min(100, metric.value + variation));
        
        let newStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
        if (newValue >= metric.threshold.critical) newStatus = 'critical';
        else if (newValue >= metric.threshold.warning) newStatus = 'warning';

        let newTrend: 'up' | 'down' | 'stable' = 'stable';
        if (newValue > metric.value + 2) newTrend = 'up';
        else if (newValue < metric.value - 2) newTrend = 'down';

        return {
          ...metric,
          value: Math.round(newValue * 10) / 10,
          status: newStatus,
          trend: newTrend,
          timestamp: new Date()
        };
      }));

      // Generate new alerts based on metric changes
      const newAlerts: SystemAlert[] = [];
      metrics.forEach(metric => {
        if (metric.status === 'critical' && Math.random() < 0.1) {
          newAlerts.push({
            id: `alert-${Date.now()}-${Math.random()}`,
            level: 'critical',
            message: `${metric.name} is at critical level (${metric.value}${metric.unit})`,
            system: metric.id,
            timestamp: new Date(),
            acknowledged: false
          });
        } else if (metric.status === 'warning' && Math.random() < 0.05) {
          newAlerts.push({
            id: `alert-${Date.now()}-${Math.random()}`,
            level: 'warning',
            message: `${metric.name} is approaching threshold (${metric.value}${metric.unit})`,
            system: metric.id,
            timestamp: new Date(),
            acknowledged: false
          });
        }
      });

      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev.slice(0, 19)]);
      }

      // Update performance data
      const newPerformanceData: PerformanceData = {
        timestamp: new Date(),
        cpu: metrics.find(m => m.id === 'cpu-usage')?.value || 0,
        memory: metrics.find(m => m.id === 'memory-usage')?.value || 0,
        disk: metrics.find(m => m.id === 'disk-usage')?.value || 0,
        network: metrics.find(m => m.id === 'network-throughput')?.value || 0,
        responseTime: metrics.find(m => m.id === 'api-response-time')?.value || 0,
        errorRate: Math.random() * 2,
        activeUsers: metrics.find(m => m.id === 'active-users')?.value || 0,
        crisisInterventions: metrics.find(m => m.id === 'crisis-interventions')?.value || 0
      };

      setPerformanceData(prev => [...prev.slice(-29), newPerformanceData]);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isMonitoring, refreshInterval, metrics]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'offline': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMetricIcon = (metricId: string) => {
    switch (metricId) {
      case 'cpu-usage': return <Cpu className="w-5 h-5" />;
      case 'memory-usage': return <Activity className="w-5 h-5" />;
      case 'disk-usage': return <HardDrive className="w-5 h-5" />;
      case 'network-throughput': return <Network className="w-5 h-5" />;
      case 'api-response-time': return <Zap className="w-5 h-5" />;
      case 'database-connections': return <Database className="w-5 h-5" />;
      case 'active-users': return <Users className="w-5 h-5" />;
      case 'crisis-interventions': return <Heart className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (alertLevel !== 'all' && alert.level !== alertLevel) return false;
    if (selectedSystem !== 'all' && alert.system !== selectedSystem) return false;
    return true;
  });

  const systemHealth = {
    overall: metrics.filter(m => m.status === 'healthy').length / metrics.length * 100,
    critical: metrics.filter(m => m.status === 'critical').length,
    warning: metrics.filter(m => m.status === 'warning').length,
    healthy: metrics.filter(m => m.status === 'healthy').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gradient mb-4">🔍 System Monitoring</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Real-time monitoring and alerting for Luna platform
          </p>
        </motion.div>

        {/* Monitoring Controls */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-500" />
              <h2 className="text-2xl font-bold">Monitoring Controls</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Refresh:</span>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value={1000}>1s</option>
                  <option value={5000}>5s</option>
                  <option value={10000}>10s</option>
                  <option value={30000}>30s</option>
                </select>
              </div>
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isMonitoring 
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isMonitoring ? 'Pause' : 'Start'} Monitoring
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* System Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Overall Health</span>
              </div>
              <span className="text-2xl font-bold">{Math.round(systemHealth.overall)}%</span>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Healthy</span>
              </div>
              <span className="text-2xl font-bold">{systemHealth.healthy}</span>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">Warnings</span>
              </div>
              <span className="text-2xl font-bold">{systemHealth.warning}</span>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Critical</span>
              </div>
              <span className="text-2xl font-bold">{systemHealth.critical}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-bold mb-6">System Metrics</h3>
            <div className="space-y-4">
              {metrics.map((metric) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border transition-colors ${
                    metric.status === 'critical' ? 'border-red-200 bg-red-50 dark:bg-red-900/20' :
                    metric.status === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20' :
                    'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getMetricIcon(metric.id)}
                      <div>
                        <h4 className="font-semibold">{metric.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">{metric.value}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{metric.unit}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(metric.trend)}
                      {getStatusIcon(metric.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        metric.status === 'critical' ? 'bg-red-100 text-red-600' :
                        metric.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {metric.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Last updated: <ClientOnly>{metric.timestamp.toLocaleTimeString()}</ClientOnly>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Alerts & Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Alerts & Notifications</h3>
              <div className="flex items-center gap-2">
                <select
                  value={alertLevel}
                  onChange={(e) => setAlertLevel(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="warning">Warnings</option>
                  <option value="critical">Critical</option>
                </select>
                <select
                  value={selectedSystem}
                  onChange={(e) => setSelectedSystem(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Systems</option>
                  {metrics.map(metric => (
                    <option key={metric.id} value={metric.id}>{metric.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border ${
                      alert.level === 'critical' ? 'border-red-200 bg-red-50 dark:bg-red-900/20' :
                      alert.level === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20' :
                      'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.level)}
                        <div className="flex-1">
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            <ClientOnly>{alert.timestamp.toLocaleString()}</ClientOnly>
                          </p>
                        </div>
                      </div>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <BellOff className="w-8 h-8 mx-auto mb-2" />
                  <p>No alerts to display</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Performance Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl mt-8"
        >
          <h3 className="text-xl font-bold mb-6">Performance Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceData.slice(-4).map((data, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-semibold">Performance Data</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>CPU:</span>
                    <span className="font-medium">{data.cpu}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory:</span>
                    <span className="font-medium">{data.memory}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response:</span>
                    <span className="font-medium">{data.responseTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Users:</span>
                    <span className="font-medium">{data.activeUsers}</span>
                  </div>
                </div>
                                 <div className="mt-2 text-xs text-gray-500">
                   <ClientOnly>{data.timestamp.toLocaleTimeString()}</ClientOnly>
                 </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 