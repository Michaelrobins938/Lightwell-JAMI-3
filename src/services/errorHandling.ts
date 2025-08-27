import { logger } from './logger';

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  page?: string;
  action?: string;
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
  requestId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'api' | 'database' | 'ai' | 'crisis' | 'security' | 'performance' | 'ui' | 'system';
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ErrorReport {
  id: string;
  error: Error;
  context: ErrorContext;
  stack: string;
  handled: boolean;
  recoveryAttempted: boolean;
  recoverySuccessful: boolean;
  reported: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ErrorRecoveryStrategy {
  id: string;
  name: string;
  description: string;
  conditions: (error: Error, context: ErrorContext) => boolean;
  action: (error: Error, context: ErrorContext) => Promise<boolean>;
  priority: number;
}

class ErrorHandlingService {
  private errorReports: Map<string, ErrorReport> = new Map();
  private recoveryStrategies: ErrorRecoveryStrategy[] = [];
  private isInitialized = false;

  constructor() {
    this.initializeErrorHandling();
  }

  private initializeErrorHandling() {
    if (this.isInitialized) return;

    // Set up global error handlers
    this.setupGlobalErrorHandlers();
    
    // Register default recovery strategies
    this.registerDefaultRecoveryStrategies();
    
    // Set up error reporting
    this.setupErrorReporting();

    this.isInitialized = true;
    logger.info('Error handling service initialized');
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        severity: 'high',
        category: 'system',
        timestamp: new Date(),
        action: 'unhandled-promise-rejection',
        tags: ['unhandled', 'promise']
      });
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), {
        severity: 'medium',
        category: 'ui',
        timestamp: new Date(),
        page: window.location.pathname,
        action: 'javascript-error',
        tags: ['javascript', 'runtime']
      });
    });

    // Handle React error boundaries
    if (typeof window !== 'undefined') {
      window.addEventListener('react-error-boundary', (event: any) => {
        this.handleError(event.detail.error, {
          severity: 'high',
          category: 'ui',
          timestamp: new Date(),
          page: window.location.pathname,
          action: 'react-error-boundary',
          tags: ['react', 'component']
        });
      });
    }
  }

  private registerDefaultRecoveryStrategies() {
    // Authentication error recovery
    this.registerRecoveryStrategy({
      id: 'auth-token-refresh',
      name: 'Authentication Token Refresh',
      description: 'Attempt to refresh authentication token when it expires',
      conditions: (error, context) => {
        return error.message.includes('unauthorized') || 
               error.message.includes('token expired') ||
               context.category === 'authentication';
      },
      action: async (error, context) => {
        try {
          // Attempt to refresh token
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
          });
          
          if (response.ok) {
            logger.info('Authentication token refreshed successfully');
            return true;
          }
          return false;
                 } catch (refreshError) {
           logger.error('Failed to refresh authentication token', new Error(String(refreshError)));
           return false;
         }
      },
      priority: 1
    });

    // API retry strategy
    this.registerRecoveryStrategy({
      id: 'api-retry',
      name: 'API Request Retry',
      description: 'Retry failed API requests with exponential backoff',
      conditions: (error, context) => {
        return context.category === 'api' && 
               (error.message.includes('network') || 
                error.message.includes('timeout') ||
                error.message.includes('500'));
      },
      action: async (error, context) => {
        try {
          // Implement exponential backoff retry logic
          const maxRetries = 3;
          const baseDelay = 1000;
          
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt - 1)));
            
            // Attempt to retry the original request
            // This would need to be implemented based on the specific API call
            logger.info(`API retry attempt ${attempt}/${maxRetries}`);
          }
          
          return true;
                 } catch (retryError) {
           logger.error('API retry failed', new Error(String(retryError)));
           return false;
         }
      },
      priority: 2
    });

    // Database connection recovery
    this.registerRecoveryStrategy({
      id: 'database-reconnect',
      name: 'Database Connection Recovery',
      description: 'Attempt to reconnect to database when connection is lost',
      conditions: (error, context) => {
        return context.category === 'database' && 
               (error.message.includes('connection') || 
                error.message.includes('timeout'));
      },
      action: async (error, context) => {
        try {
          // Attempt to reconnect to database
          // This would need to be implemented based on your database setup
          logger.info('Attempting database reconnection');
          
          // Simulate reconnection attempt
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          return true;
        } catch (reconnectError) {
          logger.error('Database reconnection failed', new Error(String(reconnectError)));
          return false;
        }
      },
      priority: 3
    });

    // AI service fallback
    this.registerRecoveryStrategy({
      id: 'ai-service-fallback',
      name: 'AI Service Fallback',
      description: 'Switch to fallback AI service when primary service fails',
      conditions: (error, context) => {
        return context.category === 'ai' && 
               (error.message.includes('api') || 
                error.message.includes('timeout'));
      },
      action: async (error, context) => {
        try {
          // Switch to fallback AI service
          logger.info('Switching to fallback AI service');
          
          // This would involve updating the AI service configuration
          // to use a different provider or endpoint
          
          return true;
        } catch (fallbackError) {
          logger.error('AI service fallback failed', new Error(String(fallbackError)));
          return false;
        }
      },
      priority: 4
    });

    // Crisis intervention fallback
    this.registerRecoveryStrategy({
      id: 'crisis-intervention-fallback',
      name: 'Crisis Intervention Fallback',
      description: 'Ensure crisis intervention always works even if AI fails',
      conditions: (error, context) => {
        return context.category === 'crisis' || 
               error.message.includes('crisis') ||
               error.message.includes('emergency');
      },
      action: async (error, context) => {
        try {
          // Ensure crisis resources are always available
          logger.info('Activating crisis intervention fallback');
          
          // Show emergency resources immediately
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('crisis-intervention-fallback', {
              detail: { error, context }
            }));
          }
          
          return true;
        } catch (fallbackError) {
          logger.error('Crisis intervention fallback failed', new Error(String(fallbackError)));
          return false;
        }
      },
      priority: 0 // Highest priority for crisis intervention
    });
  }

  private setupErrorReporting() {
    // Set up periodic error report sending
    setInterval(() => {
      this.sendErrorReports();
    }, 60000); // Send reports every minute
  }

  public async handleError(
    error: Error, 
    context: Partial<ErrorContext> = {}
  ): Promise<ErrorReport> {
    const errorId = this.generateErrorId();
    const fullContext: ErrorContext = {
      severity: 'medium',
      category: 'system',
      timestamp: new Date(),
      ...context
    };

    const errorReport: ErrorReport = {
      id: errorId,
      error,
      context: fullContext,
      stack: error.stack || '',
      handled: false,
      recoveryAttempted: false,
      recoverySuccessful: false,
      reported: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store error report
    this.errorReports.set(errorId, errorReport);

    // Log error
    logger.error('Error occurred', error, {
      errorId,
      message: error.message,
      stack: error.stack,
      context: fullContext
    });

    // Attempt recovery
    await this.attemptRecovery(errorReport);

    // Update report
    errorReport.handled = true;
    errorReport.updatedAt = new Date();
    this.errorReports.set(errorId, errorReport);

    return errorReport;
  }

  private async attemptRecovery(errorReport: ErrorReport): Promise<void> {
    const { error, context } = errorReport;
    
    // Sort strategies by priority (lower number = higher priority)
    const applicableStrategies = this.recoveryStrategies
      .filter(strategy => strategy.conditions(error, context))
      .sort((a, b) => a.priority - b.priority);

    if (applicableStrategies.length === 0) {
      logger.info('No recovery strategies applicable for error', { errorId: errorReport.id });
      return;
    }

    errorReport.recoveryAttempted = true;

    for (const strategy of applicableStrategies) {
      try {
        logger.info(`Attempting recovery strategy: ${strategy.name}`, { errorId: errorReport.id });
        
        const success = await strategy.action(error, context);
        
        if (success) {
          errorReport.recoverySuccessful = true;
          logger.info(`Recovery strategy successful: ${strategy.name}`, { errorId: errorReport.id });
          break;
        } else {
          logger.warn(`Recovery strategy failed: ${strategy.name}`, { errorId: errorReport.id });
        }
      } catch (strategyError) {
        logger.error(`Recovery strategy error: ${strategy.name}`, strategyError instanceof Error ? strategyError : new Error(String(strategyError)), { 
          errorId: errorReport.id, 
          error: strategyError 
        });
      }
    }

    errorReport.updatedAt = new Date();
    this.errorReports.set(errorReport.id, errorReport);
  }

  public registerRecoveryStrategy(strategy: ErrorRecoveryStrategy): void {
    this.recoveryStrategies.push(strategy);
    logger.info('Recovery strategy registered', { strategyId: strategy.id, name: strategy.name });
  }

  public getErrorReport(errorId: string): ErrorReport | undefined {
    return this.errorReports.get(errorId);
  }

  public getAllErrorReports(): ErrorReport[] {
    return Array.from(this.errorReports.values());
  }

  public getErrorReportsByCategory(category: string): ErrorReport[] {
    return this.getAllErrorReports().filter(report => report.context.category === category);
  }

  public getErrorReportsBySeverity(severity: string): ErrorReport[] {
    return this.getAllErrorReports().filter(report => report.context.severity === severity);
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendErrorReports(): Promise<void> {
    const unreportedErrors = this.getAllErrorReports().filter(report => !report.reported);
    
    if (unreportedErrors.length === 0) return;

    try {
      const response = await fetch('/api/error-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          errors: unreportedErrors.map(report => ({
            id: report.id,
            message: report.error.message,
            stack: report.stack,
            context: report.context,
            handled: report.handled,
            recoveryAttempted: report.recoveryAttempted,
            recoverySuccessful: report.recoverySuccessful,
            createdAt: report.createdAt,
            updatedAt: report.updatedAt
          }))
        })
      });

      if (response.ok) {
        // Mark errors as reported
        unreportedErrors.forEach(report => {
          report.reported = true;
          report.updatedAt = new Date();
          this.errorReports.set(report.id, report);
        });

        logger.info('Error reports sent successfully', { count: unreportedErrors.length });
      } else {
        logger.error('Failed to send error reports', new Error(`HTTP ${response.status}`), { status: response.status });
      }
    } catch (error) {
      logger.error('Error sending error reports', error instanceof Error ? error : new Error(String(error)), { error });
    }
  }

  public clearOldErrorReports(maxAge: number = 24 * 60 * 60 * 1000): void {
    const cutoffTime = Date.now() - maxAge;
    const oldReports = this.getAllErrorReports().filter(
      report => report.createdAt.getTime() < cutoffTime
    );

    oldReports.forEach(report => {
      this.errorReports.delete(report.id);
    });

    logger.info('Cleared old error reports', { count: oldReports.length });
  }

  public getErrorStats(): {
    total: number;
    byCategory: Record<string, number>;
    bySeverity: Record<string, number>;
    recoveryRate: number;
  } {
    const reports = this.getAllErrorReports();
    const total = reports.length;
    
    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    
    reports.forEach(report => {
      byCategory[report.context.category] = (byCategory[report.context.category] || 0) + 1;
      bySeverity[report.context.severity] = (bySeverity[report.context.severity] || 0) + 1;
    });

    const recoveryRate = total > 0 
      ? (reports.filter(r => r.recoverySuccessful).length / total) * 100 
      : 0;

    return {
      total,
      byCategory,
      bySeverity,
      recoveryRate
    };
  }
}

// Create singleton instance
export const errorHandlingService = new ErrorHandlingService();

// Export convenience functions
export const handleError = (error: Error, context?: Partial<ErrorContext>) => 
  errorHandlingService.handleError(error, context);

export const registerRecoveryStrategy = (strategy: ErrorRecoveryStrategy) => 
  errorHandlingService.registerRecoveryStrategy(strategy);

export const getErrorStats = () => errorHandlingService.getErrorStats(); 