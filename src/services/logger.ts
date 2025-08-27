import config from '../config';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = config.app.isDevelopment;

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    
    // In production, only log errors and warnings
    return level === LogLevel.ERROR || level === LogLevel.WARN;
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const logEntry: LogEntry = {
      level: LogLevel.ERROR,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    console.error(this.formatMessage(LogLevel.ERROR, message, context));
    
    if (error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    // TODO: Send to external logging service in production
    // await this.sendToLoggingService(logEntry);
  }

  warn(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.WARN)) return;

    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  info(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    console.info(this.formatMessage(LogLevel.INFO, message, context));
  }

  debug(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
  }

  // API-specific logging
  logApiRequest(req: any, res: any, duration: number): void {
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    };

    if (res.statusCode >= 400) {
      this.error(`API Request Failed`, undefined, logData);
    } else {
      this.info(`API Request`, logData);
    }
  }

  // User activity logging
  logUserActivity(userId: string, action: string, details?: Record<string, any>): void {
    this.info(`User Activity: ${action}`, {
      userId,
      action,
      ...details,
    });
  }

  // Security event logging
  logSecurityEvent(event: string, details: Record<string, any>): void {
    this.warn(`Security Event: ${event}`, details);
  }
}

export const logger = new Logger();
export default logger; 