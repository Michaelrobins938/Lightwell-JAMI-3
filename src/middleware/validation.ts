import { NextApiRequest, NextApiResponse } from 'next';
import { AppError } from './error-handler';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'boolean';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

export const validateRequest = (rules: ValidationRule[]) => {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const errors: string[] = [];

    rules.forEach((rule) => {
      const value = req.body[rule.field] || req.query[rule.field];

      // Check if required
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.field} is required`);
        return;
      }

      // Skip validation if value is not provided and not required
      if (value === undefined || value === null) {
        return;
      }

      // Type validation
      if (rule.type) {
        switch (rule.type) {
          case 'string':
            if (typeof value !== 'string') {
              errors.push(`${rule.field} must be a string`);
            }
            break;
          case 'number':
            if (isNaN(Number(value))) {
              errors.push(`${rule.field} must be a number`);
            }
            break;
          case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
              errors.push(`${rule.field} must be a valid email`);
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
              errors.push(`${rule.field} must be a boolean`);
            }
            break;
        }
      }

      // Length validation
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push(`${rule.field} must be no more than ${rule.maxLength} characters`);
        }
      }

      // Pattern validation
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        errors.push(`${rule.field} format is invalid`);
      }

      // Custom validation
      if (rule.custom && !rule.custom(value)) {
        errors.push(`${rule.field} validation failed`);
      }
    });

    if (errors.length > 0) {
      throw new AppError(`Validation failed: ${errors.join(', ')}`, 400);
    }

    next();
  };
};

// Common validation rules
export const commonValidations = {
  email: (field: string = 'email'): ValidationRule => ({
    field,
    required: true,
    type: 'email',
  }),
  password: (field: string = 'password'): ValidationRule => ({
    field,
    required: true,
    type: 'string',
    minLength: 6,
  }),
  name: (field: string = 'name'): ValidationRule => ({
    field,
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 50,
  }),
}; 