import { PrismaClient } from '@prisma/client';
import config from '../config';
import logger from '../services/logger';

class DatabaseService {
  private prisma: PrismaClient;
  private static instance: DatabaseService;

  private constructor() {
    this.prisma = new PrismaClient({
      log: config.app.isDevelopment ? ['error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: config.database.url,
        },
      },
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Failed to connect to database', error as Error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Failed to disconnect from database', error as Error);
      throw error;
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database health check failed', error as Error);
      return false;
    }
  }

  // Transaction helper
  public async transaction<T>(
    fn: (prisma: any) => Promise<T>
  ): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  // Graceful shutdown
  public async gracefulShutdown(): Promise<void> {
    logger.info('Starting graceful database shutdown...');
    await this.disconnect();
  }
}

// Export singleton instance
export const database = DatabaseService.getInstance();
export const prisma = database.getClient();

// Handle process termination
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  await database.gracefulShutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  await database.gracefulShutdown();
  process.exit(0);
});

export default database; 