/**
 * API Core Module
 * 
 * Handles API clients, external services, and API integrations.
 * Provides centralized API management for all features.
 */

// Types
export interface APIConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  enableLogging: boolean;
  rateLimiting: {
    enabled: boolean;
    maxRequests: number;
    windowMs: number;
  };
}

export interface APIClient {
  get: (url: string, config?: any) => Promise<any>;
  post: (url: string, data?: any, config?: any) => Promise<any>;
  put: (url: string, data?: any, config?: any) => Promise<any>;
  delete: (url: string, config?: any) => Promise<any>;
}

// Default configuration
export const defaultAPIConfig: APIConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  retries: 3,
  enableLogging: process.env.NODE_ENV === 'development',
  rateLimiting: {
    enabled: true,
    maxRequests: 100,
    windowMs: 60000 // 1 minute
  }
};

// Module state
let initialized = false;
let config = defaultAPIConfig;
let apiClient: APIClient | null = null;

/**
 * Create API client
 */
function createAPIClient(): APIClient {
  const client: APIClient = {
    async get(url: string, requestConfig?: any) {
      const response = await fetch(`${config.baseUrl}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...requestConfig?.headers
        },
        ...requestConfig
      });
      return response.json();
    },

    async post(url: string, data?: any, requestConfig?: any) {
      const response = await fetch(`${config.baseUrl}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...requestConfig?.headers
        },
        body: data ? JSON.stringify(data) : undefined,
        ...requestConfig
      });
      return response.json();
    },

    async put(url: string, data?: any, requestConfig?: any) {
      const response = await fetch(`${config.baseUrl}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...requestConfig?.headers
        },
        body: data ? JSON.stringify(data) : undefined,
        ...requestConfig
      });
      return response.json();
    },

    async delete(url: string, requestConfig?: any) {
      const response = await fetch(`${config.baseUrl}${url}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...requestConfig?.headers
        },
        ...requestConfig
      });
      return response.json();
    }
  };

  return client;
}

/**
 * Initialize the API module
 */
export async function initializeAPI(): Promise<boolean> {
  try {
    console.log('Initializing API module...');
    
    // Create API client
    apiClient = createAPIClient();
    initialized = true;
    
    console.log('✅ API module initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize API module:', error);
    return false;
  }
}

/**
 * Get API client
 */
export function getAPIClient(): APIClient {
  if (!apiClient) {
    throw new Error('API not initialized. Call initializeAPI() first.');
  }
  return apiClient;
}

/**
 * Get API service wrapper
 */
export function getAPIService() {
  return {
    getClient: getAPIClient,
    isInitialized: () => initialized,
    getConfig: () => config
  };
}

/**
 * Update API configuration
 */
export function updateAPIConfig(newConfig: Partial<APIConfig>) {
  config = { ...config, ...newConfig };
  
  // Recreate client if initialized
  if (initialized) {
    apiClient = createAPIClient();
  }
}

/**
 * Get current API status
 */
export function getAPIStatus() {
  return {
    initialized,
    config: {
      baseUrl: config.baseUrl,
      timeout: config.timeout,
      enableLogging: config.enableLogging
    }
  };
}