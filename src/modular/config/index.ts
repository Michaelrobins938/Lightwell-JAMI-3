/**
 * Configuration Management
 * 
 * Centralized configuration for the modular system
 */

// Re-export from core config
export * from '../core/config';

// Modular system specific config
export interface ModularConfig {
  enabledFeatures: string[];
  theme: 'gpt5' | 'custom';
  devMode: boolean;
}

export const defaultModularConfig: ModularConfig = {
  enabledFeatures: ['chat', 'ai-therapy', 'voice', 'assessment', 'community', 'progress'],
  theme: 'gpt5',
  devMode: process.env.NODE_ENV === 'development'
};