import { NextApiRequest, NextApiResponse } from 'next';
import config from '../config';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class AppError extends Error implements ApiError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: ApiError,
  req: NextApiRequest,
  res: NextApiResponse,
  next?: () => void
) => {
  let { statusCode = 500, message } = error;

  // Log error in development
  if (config.app.isDevelopment) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Don't leak error details in production
  if (!config.app.isDevelopment && statusCode === 500) {
    message = 'Internal server error';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(config.app.isDevelopment && { stack: error.stack }),
    },
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: NextApiRequest, res: NextApiResponse, next?: () => void) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      errorHandler(error, req, res, next);
    });
  };
}; 