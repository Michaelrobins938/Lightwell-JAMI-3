import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import Link from 'next/link';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
  showReport?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
  message = "We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.",
  showRetry = true,
  showHome = true,
  showReport = true,
}) => {
  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleReportError = () => {
    // In production, this would open a support ticket or error reporting form
    const subject = encodeURIComponent(`Error Report - ${title}`);
    const body = encodeURIComponent(`
Error Details:
${error?.message || 'Unknown error'}

Stack Trace:
${error?.stack || 'No stack trace available'}

Page: ${typeof window !== 'undefined' ? window.location.href : 'Server'}
User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'Server'}
    `);
    window.open(`mailto:support@luna.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f7fa] to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card glass-panel p-8 rounded-3xl shadow-2xl max-w-md w-full text-center"
      >
        <motion.div
          className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
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
          className="text-gray-600 mb-6 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {message}
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {showRetry && (
            <motion.button
              onClick={handleRetry}
              className="flex-1 bg-luna-violet text-white px-6 py-3 rounded-full font-semibold hover:bg-[#7e57c2] transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Again
            </motion.button>
          )}
          
          {showHome && (
            <Link href="/">
              <motion.button
                className="flex-1 border-2 border-luna-violet text-luna-violet px-6 py-3 rounded-full font-semibold hover:bg-luna-violet hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Go Home
              </motion.button>
            </Link>
          )}
          
          {showReport && (
            <motion.button
              onClick={handleReportError}
              className="flex-1 border-2 border-luna-violet text-luna-violet px-6 py-3 rounded-full font-semibold hover:bg-luna-violet hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Report Issue
            </motion.button>
          )}
        </motion.div>
        
        {process.env.NODE_ENV === 'development' && error && (
          <motion.details 
            className="mt-6 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
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