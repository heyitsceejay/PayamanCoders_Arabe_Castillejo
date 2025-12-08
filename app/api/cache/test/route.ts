import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';

export async function GET() {
  try {
    // Test cache connection
    const testKey = 'test:connection';
    const testValue = { 
      message: 'Cache is working!', 
      timestamp: new Date().toISOString(),
      cacheType: cache.isRedisAvailable() ? 'Redis' : 'Memory'
    };
    
    await cache.set(testKey, testValue, 60); // Cache for 60 seconds
    const retrieved = await cache.get(testKey);
    
    return NextResponse.json({
      success: true,
      data: retrieved,
      cacheType: cache.isRedisAvailable() ? 'Redis' : 'Memory',
      redisAvailable: cache.isRedisAvailable(),
      memoryCacheSize: cache.getMemoryCacheSize(),
      message: cache.isRedisAvailable() 
        ? 'Redis connection successful' 
        : 'Using in-memory cache (Redis unavailable)'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
