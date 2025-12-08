import Redis from 'ioredis';

let redisClient: Redis | null = null;
let isRedisAvailable = true;

export function getRedisClient(): Redis | null {
  // If Redis is explicitly disabled or not configured, return null
  if (!process.env.REDIS_URL && process.env.NODE_ENV === 'production') {
    return null;
  }

  if (!redisClient && isRedisAvailable) {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        enableOfflineQueue: false,
        retryStrategy(times) {
          if (times > 3) {
            isRedisAvailable = false;
            console.warn('Redis unavailable, disabling cache');
            return null;
          }
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError(err) {
          const targetError = 'READONLY';
          if (err.message.includes(targetError)) {
            return true;
          }
          return false;
        },
      });

      redisClient.on('error', (err) => {
        console.error('Redis Client Error:', err);
        isRedisAvailable = false;
      });

      redisClient.on('connect', () => {
        console.log('Redis Client Connected');
        isRedisAvailable = true;
      });

      redisClient.on('close', () => {
        console.warn('Redis Connection Closed');
        isRedisAvailable = false;
      });
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      isRedisAvailable = false;
      return null;
    }
  }

  return isRedisAvailable ? redisClient : null;
}

const redis = getRedisClient();

// Cache helper functions with graceful fallback
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const client = getRedisClient();
    if (!client) return null;
    
    try {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    const client = getRedisClient();
    if (!client) return false;
    
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await client.setex(key, ttlSeconds, serialized);
      } else {
        await client.set(key, serialized);
      }
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  },

  async del(key: string): Promise<boolean> {
    const client = getRedisClient();
    if (!client) return false;
    
    try {
      await client.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  },

  async exists(key: string): Promise<boolean> {
    const client = getRedisClient();
    if (!client) return false;
    
    try {
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  },

  async increment(key: string, ttlSeconds?: number): Promise<number> {
    const client = getRedisClient();
    if (!client) return 0;
    
    try {
      const value = await client.incr(key);
      if (ttlSeconds && value === 1) {
        await client.expire(key, ttlSeconds);
      }
      return value;
    } catch (error) {
      console.error('Redis INCR error:', error);
      return 0;
    }
  },

  async getMany<T>(keys: string[]): Promise<(T | null)[]> {
    const client = getRedisClient();
    if (!client) return keys.map(() => null);
    
    try {
      if (keys.length === 0) return [];
      const values = await client.mget(...keys);
      return values.map(v => v ? JSON.parse(v) : null);
    } catch (error) {
      console.error('Redis MGET error:', error);
      return keys.map(() => null);
    }
  },

  async deletePattern(pattern: string): Promise<number> {
    const client = getRedisClient();
    if (!client) return 0;
    
    try {
      const keys = await client.keys(pattern);
      if (keys.length === 0) return 0;
      return await client.del(...keys);
    } catch (error) {
      console.error('Redis DELETE PATTERN error:', error);
      return 0;
    }
  },

  // Check if Redis is available
  isAvailable(): boolean {
    return getRedisClient() !== null;
  },
};

export { redis };
export default redis;
