import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // In production, you would send this to your error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
    
    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Use the ErrorFallback component
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.handleRetry}
          title="Something went wrong"
          message="We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue."
          showRetry={true}
          showHome={true}
          showReport={true}
        />
      );
    }

    return this.props.children;
  }
}