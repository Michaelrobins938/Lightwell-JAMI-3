/**
 * Shared Components
 * 
 * Reusable UI components with consistent styling and behavior.
 * These components form the foundation of the application's design system.
 */

// Basic components
export { Button } from './Button';
// TODO: Create missing components when needed:
// export { Input } from './Input';
// export { Modal } from './Modal';
// export { Header } from './Header';
export { AppShell } from './AppShell';

// Component types
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonColor } from './Button/types';
// TODO: Create missing component types when needed:
// export type { InputProps } from './Input/types';
// export type { ModalProps } from './Modal/types';

// Common types used across components
export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';
export type ComponentColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// Theme context and utilities
export interface ComponentTheme {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}

export const defaultTheme: ComponentTheme = {
  colors: {
    primary: '#f59e0b',
    secondary: '#ec4899', 
    accent: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  }
};