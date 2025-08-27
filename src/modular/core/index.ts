/**
 * Core System Modules
 * 
 * Essential system-level functionality that all features depend on.
 * These modules handle authentication, database connections, API services,
 * and configuration management.
 */

// Re-export all core modules
export * from './auth';
export * from './database';
export * from './api';
export * from './config';

// Core module types
export interface CoreModule {
  name: string;
  version: string;
  initialized: boolean;
  dependencies: string[];
}

// Core system status
export interface SystemStatus {
  auth: boolean;
  database: boolean;
  api: boolean;
  config: boolean;
}

// Core module registry
export const coreModules: Record<string, CoreModule> = {
  auth: {
    name: 'Authentication',
    version: '1.0.0',
    initialized: false,
    dependencies: ['config', 'database']
  },
  database: {
    name: 'Database',
    version: '1.0.0', 
    initialized: false,
    dependencies: ['config']
  },
  api: {
    name: 'API Services',
    version: '1.0.0',
    initialized: false,
    dependencies: ['config', 'auth']
  },
  config: {
    name: 'Configuration',
    version: '1.0.0',
    initialized: false,
    dependencies: []
  }
};

/**
 * Initialize all core modules in dependency order
 */
export async function initializeCoreModules(): Promise<SystemStatus> {
  const status: SystemStatus = {
    auth: false,
    database: false,
    api: false,
    config: false
  };

  try {
    // Initialize in dependency order
    const { initializeConfig } = await import('./config');
    status.config = await initializeConfig();
    
    const { initializeDatabase } = await import('./database');
    status.database = await initializeDatabase();
    
    const { initializeAuth } = await import('./auth');
    status.auth = await initializeAuth();
    
    const { initializeAPI } = await import('./api');
    status.api = await initializeAPI();

    return status;
  } catch (error) {
    console.error('Failed to initialize core modules:', error);
    return status;
  }
}