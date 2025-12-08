import { NextResponse } from 'next/server';
import { cache } from '@/lib/redis';

export async function GET() {
  try {
    // Test Redis connection
    const testKey = 'test:connection';
    const testValue = { message: 'Redis is working!', timestamp: new Date().toISOString() };
    
    await cache.set(testKey, testValue, 60); // Cache for 60 seconds
    const retrieved = await cache.get(testKey);
    
    return NextResponse.json({
      success: true,
      data: retrieved,
      message: 'Redis connection successful'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
