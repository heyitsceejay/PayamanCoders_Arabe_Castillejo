import { NextRequest, NextResponse } from 'next/server';
import { cache } from '@/lib/redis';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export async function rateLimit(
  req: NextRequest,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 10 }
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const key = `ratelimit:${ip}:${req.nextUrl.pathname}`;
  
  const windowSeconds = Math.floor(config.windowMs / 1000);
  const current = await cache.increment(key, windowSeconds);
  
  const remaining = Math.max(0, config.maxRequests - current);
  const resetTime = Date.now() + config.windowMs;
  
  return {
    success: current <= config.maxRequests,
    remaining,
    resetTime,
  };
}

export function rateLimitResponse(remaining: number, resetTime: number) {
  return NextResponse.json(
    { error: 'Too many requests', retryAfter: new Date(resetTime).toISOString() },
    {
      status: 429,
      headers: {
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': resetTime.toString(),
        'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
      },
    }
  );
}
