import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface NetworkErrorProps {
  error?: Error;
  onRetry?: () => void;
  showOfflineMode?: boolean;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({
  error,
  onRetry,
  showOfflineMode = true,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Check initial online status
      setIsOnline(navigator.onLine);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
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

  const isNetworkError = error?.message?.includes('fetch') || 
                        error?.message?.includes('network') ||
                        error?.message?.includes('Failed to fetch') ||
                        !isOnline;

  if (!isNetworkError) {
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
          className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {isOnline ? (
            <Wifi className="w-8 h-8 text-orange-500" />
          ) : (
            <WifiOff className="w-8 h-8 text-orange-500" />
          )}
        </motion.div>
        
        <motion.h1 
          className="text-2xl font-display font-bold text-soft-midnight mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isOnline ? 'Connection Error' : 'You\'re Offline'}
        </motion.h1>
        
        <motion.p 
          className="text-gray-600 mb-6 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {isOnline 
            ? "We're having trouble connecting to our servers. This might be a temporary issue."
            : "Please check your internet connection and try again."
          }
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
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
        
        {showOfflineMode && !isOnline && (
          <motion.div
            className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-sm font-semibold text-blue-800 mb-2">
              Offline Mode Available
            </h3>
            <p className="text-xs text-blue-600">
              Some features may be limited while offline. Your data will sync when you're back online.
            </p>
          </motion.div>
        )}
        
        {process.env.NODE_ENV === 'development' && error && (
          <motion.details 
            className="mt-6 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
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