import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

interface ContextItem {
  type: 'user_input' | 'jamie_response';
  content: string;
  timestamp: number;
}

class ContextAwareSystem {
  private redis: Redis;
  private readonly CONTEXT_EXPIRY = 60 * 60; // 1 hour

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL is not defined');
    }
    this.redis = new Redis(redisUrl);
  }

  public async addToContext(userId: string, item: ContextItem): Promise<void> {
    const contextKey = `user:${userId}:context`;
    const serializedItem = JSON.stringify(item);

    await this.redis
      .multi()
      .lpush(contextKey, serializedItem)
      .ltrim(contextKey, 0, 19) // Keep only the last 20 items
      .expire(contextKey, this.CONTEXT_EXPIRY)
      .exec();
  }

  public async getContext(userId: string): Promise<ContextItem[]> {
    const contextKey = `user:${userId}:context`;
    const contextData = await this.redis.lrange(contextKey, 0, -1);

    return contextData.map((item) => JSON.parse(item));
  }

  public async createSession(userId: string): Promise<string> {
    const sessionId = uuidv4();
    const sessionKey = `user:${userId}:session`;

    await this.redis
      .multi()
      .set(sessionKey, sessionId)
      .expire(sessionKey, this.CONTEXT_EXPIRY)
      .exec();

    return sessionId;
  }

  public async getSession(userId: string): Promise<string | null> {
    const sessionKey = `user:${userId}:session`;
    return this.redis.get(sessionKey);
  }
}

export default ContextAwareSystem;
