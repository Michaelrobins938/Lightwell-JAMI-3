import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface LoadingErrorProps {
  error?: Error;
  onRetry?: () => void;
  timeout?: number;
  title?: string;
  message?: string;
  showOfflineCheck?: boolean;
}

export const LoadingError: React.FC<LoadingErrorProps> = ({
  error,
  onRetry,
  timeout = 30000, // 30 seconds default
  title = "Loading Timeout",
  message = "The request is taking longer than expected. This might be due to a slow connection or server issues.",
  showOfflineCheck = true,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      setIsOnline(navigator.onLine);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      setTimeElapsed(0);
      try {
        await onRetry();
      } catch (err) {
        console.error('Retry failed:', err);
      } finally {
        setIsRetrying(false);
      }
    } else {
      window.location.reload();
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  };

  const isTimeoutError = timeElapsed >= timeout || 
                        error?.message?.includes('timeout') ||
                        error?.message?.includes('timed out');

  if (!isTimeoutError && !error) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f7fa] to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card glass-panel p-8 rounded-3xl shadow-2xl max-w-md w-full text-center"
      >
        <motion.div
          className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Clock className="w-8 h-8 text-yellow-500" />
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-display font-bold text-soft-midnight mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {title}
        </motion.h1>
        
        <motion.p 
          className="text-gray-600 mb-4 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {message}
        </motion.p>

        {timeElapsed > 0 && (
          <motion.p 
            className="text-sm text-gray-500 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Time elapsed: {formatTime(timeElapsed)}
          </motion.p>
        )}
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex-1 bg-luna-violet text-white px-6 py-3 rounded-full font-semibold hover:bg-[#7e57c2] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: isRetrying ? 1 : 1.02 }}
            whileTap={{ scale: isRetrying ? 1 : 0.98 }}
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Try Again
              </>
            )}
          </motion.button>
          
          <Link href="/">
            <motion.button
              className="flex-1 border-2 border-luna-violet text-luna-violet px-6 py-3 rounded-full font-semibold hover:bg-luna-violet hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go Home
            </motion.button>
          </Link>
        </motion.div>
        
        {showOfflineCheck && !isOnline && (
          <motion.div
            className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-semibold text-red-800">
                You're Offline
              </h3>
            </div>
            <p className="text-xs text-red-600">
              Please check your internet connection. Some features require an active connection.
            </p>
          </motion.div>
        )}
        
        {process.env.NODE_ENV === 'development' && error && (
          <motion.details 
            className="mt-6 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-luna-violet">
              Error Details (Development)
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs overflow-auto">
              {error.toString()}
            </pre>
          </motion.details>
        )}
      </motion.div>
    </div>
  );
}; 