// Unified cache interface that uses Redis when available, falls back to memory cache
import { cache as redisCache } from './redis';
import memoryCache from './memoryCache';

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    // Try Redis first
    const redisValue = await redisCache.get<T>(key);
    if (redisValue !== null) {
      return redisValue;
    }

    // Fallback to memory cache
    return memoryCache.get<T>(key);
  },

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<boolean> {
    // Try to set in both Redis and memory cache
    const redisSet = await redisCache.set(key, value, ttlSeconds);
    const memorySet = memoryCache.set(key, value, ttlSeconds);

    // Return true if at least one succeeded
    return redisSet || memorySet;
  },

  async del(key: string): Promise<boolean> {
    const redisDeleted = await redisCache.del(key);
    const memoryDeleted = memoryCache.del(key);
    return redisDeleted || memoryDeleted;
  },

  async exists(key: string): Promise<boolean> {
    const redisExists = await redisCache.exists(key);
    if (redisExists) return true;
    return memoryCache.exists(key);
  },

  async increment(key: string, ttlSeconds?: number): Promise<number> {
    // Only use Redis for increment (memory cache doesn't support atomic increment)
    return await redisCache.increment(key, ttlSeconds);
  },

  async getMany<T>(keys: string[]): Promise<(T | null)[]> {
    // Try Redis first
    const redisValues = await redisCache.getMany<T>(keys);
    
    // Check if all values were found in Redis
    const allFound = redisValues.every(v => v !== null);
    if (allFound) return redisValues;

    // Fill in missing values from memory cache
    return redisValues.map((value, index) => {
      if (value !== null) return value;
      return memoryCache.get<T>(keys[index]);
    });
  },

  async deletePattern(pattern: string): Promise<number> {
    // Only Redis supports pattern deletion
    return await redisCache.deletePattern(pattern);
  },

  isRedisAvailable(): boolean {
    return redisCache.isAvailable();
  },

  clearMemoryCache() {
    memoryCache.clear();
  },

  getMemoryCacheSize(): number {
    return memoryCache.size();
  },
};

export default cache;
