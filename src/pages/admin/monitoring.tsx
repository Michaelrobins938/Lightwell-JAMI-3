//
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Database, 
  Brain, 
  Shield, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  BarChart3,
  Settings,
  RefreshCw
} from 'lucide-react';
import ClientOnly from '../../components/ClientOnly';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  services: {
    database: ServiceStatus;
    ai: ServiceStatus;
    authentication: ServiceStatus;
    cache: ServiceStatus;
  };
  metrics: {
    uptime: number;
    memory: NodeJS.MemoryUsage;
    cpu: number;
    activeConnections: number;
  };
  ai: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    crisisInterventions: number;
    cacheSize: number;
    activeSessions: number;
  };
}

interface ServiceStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  error?: string;
}

export default function MonitoringDashboard() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchHealthStatus = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealthStatus(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch health status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // TEMPORARILY DISABLE HEALTH CHECKS IN DEVELOPMENT TO STOP SPAM
    if (process.env.NODE_ENV === 'development') {
      console.log('🚫 Monitoring health checks disabled in development mode to prevent spam');
      return;
    }
    
    fetchHealthStatus();
    
    if (autoRefresh) {
      const interval = setInterval(fetchHealthStatus, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'unhealthy': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'unhealthy': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatMemory = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              System Monitoring Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Real-time health monitoring for Luna AI Platform
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchHealthStatus}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Auto-refresh</span>
            </label>
          </div>
        </motion.div>

        {healthStatus && (
          <>
            {/* Overall Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Overall Status</p>
                    <p className={`text-2xl font-bold ${getStatusColor(healthStatus.status)}`}>
                      {healthStatus.status.toUpperCase()}
                    </p>
                  </div>
                  {getStatusIcon(healthStatus.status)}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatUptime(healthStatus.metrics.uptime)}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatMemory(healthStatus.metrics.memory.heapUsed)}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {healthStatus.ai.activeSessions}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </motion.div>

            {/* Services Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Database className="w-6 h-6 text-blue-500" />
                  Services Health
                </h2>
                <div className="space-y-4">
                  {Object.entries(healthStatus.services).map(([service, status]) => (
                    <div key={service} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status.status)}
                        <div>
                          <p className="font-medium capitalize">{service}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {status.responseTime}ms response time
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        status.status === 'healthy' ? 'bg-green-100 text-green-800' :
                        status.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {status.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-500" />
                  AI Performance
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {healthStatus.ai.totalRequests}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Requests</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {healthStatus.ai.successfulRequests}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Successful</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {healthStatus.ai.failedRequests}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {healthStatus.ai.crisisInterventions}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Crisis Interventions</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cache Size</p>
                    <p className="text-lg font-semibold">{healthStatus.ai.cacheSize} entries</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* System Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Settings className="w-6 h-6 text-gray-500" />
                System Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Version</p>
                  <p className="font-semibold">{healthStatus.version}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Environment</p>
                  <p className="font-semibold capitalize">{healthStatus.environment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                  <p className="font-semibold"><ClientOnly>{lastUpdate.toLocaleTimeString()}</ClientOnly></p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
} 