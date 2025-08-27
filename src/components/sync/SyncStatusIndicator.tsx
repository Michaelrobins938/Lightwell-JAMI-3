import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, WifiOff, Smartphone, Monitor, Tablet, 
  CheckCircle, AlertCircle, Clock, Users, 
  RefreshCw, Settings, ChevronDown, ChevronUp 
} from 'lucide-react';
import { useSyncClient } from '../../hooks/useSyncClient';

interface SyncStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  className = '',
  showDetails = false
}) => {
  const syncClient = useSyncClient();
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [status, setStatus] = useState(syncClient.getStatus());

  // Update status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(syncClient.getStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, [syncClient]);

  const getConnectionIcon = () => {
    if (!status.isConnected) return <WifiOff className="w-4 h-4 text-red-500" />;
    if (!status.isAuthenticated) return <Wifi className="w-4 h-4 text-yellow-500" />;
    if (!status.isDeviceRegistered) return <Wifi className="w-4 h-4 text-blue-500" />;
    return <Wifi className="w-4 h-4 text-green-500" />;
  };

  const getConnectionText = () => {
    if (!status.isConnected) return 'Disconnected';
    if (!status.isAuthenticated) return 'Authenticating...';
    if (!status.isDeviceRegistered) return 'Registering...';
    return 'Synced';
  };

  const getConnectionColor = () => {
    if (!status.isConnected) return 'text-red-500';
    if (!status.isAuthenticated) return 'text-yellow-500';
    if (!status.isDeviceRegistered) return 'text-blue-500';
    return 'text-green-500';
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-3 h-3" />;
      case 'tablet':
        return <Tablet className="w-3 h-3" />;
      case 'desktop':
        return <Monitor className="w-3 h-3" />;
      default:
        return <Monitor className="w-3 h-3" />;
    }
  };

  const formatLastSyncTime = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleManualSync = async () => {
    try {
      await syncClient.requestSync();
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Status Indicator */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200
          ${status.isConnected && status.isAuthenticated && status.isDeviceRegistered
            ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
            : status.isConnected
            ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
            : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {getConnectionIcon()}
        <span className={`text-sm font-medium ${getConnectionColor()}`}>
          {getConnectionText()}
        </span>
        
        {/* Active devices count */}
        {status.activeDevices.length > 0 && (
          <div className="flex items-center gap-1 ml-2">
            <Users className="w-3 h-3" />
            <span className="text-xs font-medium">
              {status.activeDevices.length}
            </span>
          </div>
        )}

        {/* Pending events indicator */}
        {status.pendingEvents.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 ml-2"
          >
            <Clock className="w-3 h-3 text-orange-500" />
            <span className="text-xs font-medium text-orange-600">
              {status.pendingEvents.length}
            </span>
          </motion.div>
        )}

        {/* Conflicts indicator */}
        {status.conflicts.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 ml-2"
          >
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span className="text-xs font-medium text-red-600">
              {status.conflicts.length}
            </span>
          </motion.div>
        )}

        {/* Expand/collapse icon */}
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 ml-1" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-1" />
        )}
      </motion.button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Connection Status */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Connection Status
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    WebSocket
                  </span>
                  <div className="flex items-center gap-2">
                    {getConnectionIcon()}
                    <span className={`text-sm ${getConnectionColor()}`}>
                      {getConnectionText()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Authentication
                  </span>
                  <div className="flex items-center gap-2">
                    {status.isAuthenticated ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className={`text-sm ${status.isAuthenticated ? 'text-green-600' : 'text-yellow-600'}`}>
                      {status.isAuthenticated ? 'Authenticated' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Device Registration
                  </span>
                  <div className="flex items-center gap-2">
                    {status.isDeviceRegistered ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-blue-500" />
                    )}
                    <span className={`text-sm ${status.isDeviceRegistered ? 'text-green-600' : 'text-blue-600'}`}>
                      {status.isDeviceRegistered ? 'Registered' : 'Registering...'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Last Sync Time */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Last Sync
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatLastSyncTime(status.lastSyncTime)}
                  </span>
                  <button
                    onClick={handleManualSync}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Sync Now
                  </button>
                </div>
              </div>

              {/* Active Devices */}
              {status.activeDevices.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Active Devices ({status.activeDevices.length})
                  </h4>
                  <div className="space-y-1">
                    {status.activeDevices.map((device, index) => (
                      <div key={device.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(device.deviceType)}
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {device.deviceName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs text-gray-500">
                            {formatLastSyncTime(new Date(device.lastSeen))}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Events */}
              {status.pendingEvents.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Pending Events ({status.pendingEvents.length})
                  </h4>
                  <div className="space-y-1">
                    {status.pendingEvents.slice(0, 3).map((event, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {event.eventType.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatLastSyncTime(event.timestamp)}
                        </span>
                      </div>
                    ))}
                    {status.pendingEvents.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{status.pendingEvents.length - 3} more events
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Conflicts */}
              {status.conflicts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-red-600">
                    Conflicts ({status.conflicts.length})
                  </h4>
                  <div className="space-y-1">
                    {status.conflicts.slice(0, 3).map((conflict, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-red-600">
                          {conflict.resourceType} conflict
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatLastSyncTime(new Date(conflict.createdAt))}
                        </span>
                      </div>
                    ))}
                    {status.conflicts.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{status.conflicts.length - 3} more conflicts
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Settings Link */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <button className="flex items-center gap-2 w-full px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                  Sync Settings
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


