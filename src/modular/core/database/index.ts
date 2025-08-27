/**
 * Database Core Module
 * 
 * Handles database connections, ORM setup, and data persistence.
 * Integrates with existing Prisma setup.
 */

import { PrismaClient } from '@prisma/client';

// Types
export interface DatabaseConfig {
  provider: 'postgresql' | 'mysql' | 'sqlite';
  url: string;
  poolSize: number;
  timeout: number;
}

// Default configuration
export const defaultDatabaseConfig: DatabaseConfig = {
  provider: 'postgresql',
  url: process.env.DATABASE_URL || '',
  poolSize: 10,
  timeout: 30000
};

// Module state
let initialized = false;
let config = defaultDatabaseConfig;
let prismaClient: PrismaClient | null = null;

/**
 * Initialize the database module
 */
export async function initializeDatabase(): Promise<boolean> {
  try {
    console.log('Initializing Database module...');
    
    // Create Prisma client if not exists
    if (!prismaClient) {
      prismaClient = new PrismaClient({
        datasources: {
          db: {
            url: config.url
          }
        }
      });
    }

    // Test connection
    await prismaClient.$connect();
    initialized = true;
    
    console.log('✅ Database module initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize Database module:', error);
    return false;
  }
}

/**
 * Get database client
 */
export function getDatabaseClient(): PrismaClient {
  if (!prismaClient) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return prismaClient;
}

/**
 * Get database service wrapper
 */
export function getDatabaseService() {
  return {
    getClient: getDatabaseClient,
    isInitialized: () => initialized,
    getConfig: () => config
  };
}

/**
 * Update database configuration
 */
export function updateDatabaseConfig(newConfig: Partial<DatabaseConfig>) {
  config = { ...config, ...newConfig };
}

/**
 * Get current database status
 */
export function getDatabaseStatus() {
  return {
    initialized,
    config: {
      provider: config.provider,
      connected: !!prismaClient
    }
  };
}

// Cleanup function
export async function closeDatabaseConnection() {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
    initialized = false;
  }
}