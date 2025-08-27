import React from 'react';
import { ErrorFallback, NetworkError, LoadingError } from '../components/errors';

export const isNetworkError = (error: Error): boolean => {
  return error?.message?.includes('fetch') || 
         error?.message?.includes('network') ||
         error?.message?.includes('Failed to fetch') ||
         error?.message?.includes('ERR_NETWORK') ||
         error?.message?.includes('ERR_INTERNET_DISCONNECTED');
};

export const isTimeoutError = (error: Error): boolean => {
  return error?.message?.includes('timeout') ||
         error?.message?.includes('timed out') ||
         error?.message?.includes('ERR_TIMED_OUT');
};

export const isAuthError = (error: Error): boolean => {
  return error?.message?.includes('401') ||
         error?.message?.includes('unauthorized') ||
         error?.message?.includes('authentication');
};

export const getErrorComponent = (error: Error, onRetry?: () => void) => {
  if (isNetworkError(error)) {
    return <NetworkError error={error} onRetry={onRetry} />;
  }
  
  if (isTimeoutError(error)) {
    return <LoadingError error={error} onRetry={onRetry} />;
  }
  
  return <ErrorFallback error={error} resetErrorBoundary={onRetry} />;
};

export const logError = (error: Error, context?: string) => {
  console.error(`[${context || 'Error'}]`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'server',
  });
}; 