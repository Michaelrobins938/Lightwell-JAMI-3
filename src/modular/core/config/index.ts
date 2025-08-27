/**
 * Configuration Core Module
 * 
 * Handles application configuration, environment variables,
 * and configuration validation.
 */

// Types
export interface AppConfig {
  env: 'development' | 'production' | 'test';
  app: {
    name: string;
    version: string;
    baseUrl: string;
  };
  features: {
    [key: string]: any;
  };
  ui: {
    theme: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
}

// Default configuration
export const defaultConfig: AppConfig = {
  env: (process.env.NODE_ENV as any) || 'development',
  app: {
    name: 'Luna Web 2025',
    version: '1.0.0',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  },
  features: {
    chat: { enabled: true },
    'ai-therapy': { enabled: true },
    voice: { enabled: true },
    assessment: { enabled: true },
    community: { enabled: true },
    progress: { enabled: true }
  },
  ui: {
    theme: {
      primary: '#f59e0b', // GPT-5 amber
      secondary: '#ec4899', // GPT-5 pink  
      accent: '#8b5cf6' // GPT-5 purple
    }
  }
};

// Module state
let initialized = false;
let config = defaultConfig;

/**
 * Initialize the configuration module
 */
export async function initializeConfig(): Promise<boolean> {
  try {
    console.log('Initializing Config module...');
    
    // Load environment-specific configuration
    if (typeof window === 'undefined') {
      // Server-side: can access all env vars
      // Configuration is already set from defaults and env vars
    } else {
      // Client-side: only access NEXT_PUBLIC_ vars
      config.app.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || config.app.baseUrl;
    }
    
    initialized = true;
    console.log('✅ Config module initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize Config module:', error);
    return false;
  }
}

/**
 * Get current configuration
 */
export function getConfig(): AppConfig {
  return { ...config };
}

/**
 * Update configuration
 */
export function updateConfig(newConfig: Partial<AppConfig>) {
  config = { ...config, ...newConfig };
}

/**
 * Validate configuration
 */
export function validateConfig(): boolean {
  try {
    // Check required fields
    if (!config.app.name) return false;
    if (!config.app.version) return false;
    if (!config.app.baseUrl) return false;
    
    // Check environment
    if (!['development', 'production', 'test'].includes(config.env)) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Config validation failed:', error);
    return false;
  }
}

/**
 * Get feature configuration
 */
export function getFeatureConfig(featureName: string): any {
  return config.features[featureName] || {};
}

/**
 * Update feature configuration
 */
export function updateFeatureConfig(featureName: string, featureConfig: any) {
  config.features[featureName] = { ...config.features[featureName], ...featureConfig };
}

/**
 * Get current config status
 */
export function getConfigStatus() {
  return {
    initialized,
    env: config.env,
    valid: validateConfig()
  };
}

// Export for external use
export const configObject = {
  get: getConfig,
  update: updateConfig,
  validate: validateConfig,
  getFeature: getFeatureConfig,
  updateFeature: updateFeatureConfig
};