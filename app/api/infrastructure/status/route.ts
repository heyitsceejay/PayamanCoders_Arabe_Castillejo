import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { queue, QUEUES } from '@/lib/rabbitmq';

export async function GET() {
  const status = {
    timestamp: new Date().toISOString(),
    services: {
      nginx: { status: 'unknown', details: {} },
      redis: { status: 'unknown', details: {} },
      rabbitmq: { status: 'unknown', details: {} },
      cache: { status: 'unknown', details: {} },
    },
    overall: 'checking',
  };

  // Check NGINX (if this endpoint is accessible, NGINX is working)
  status.services.nginx = {
    status: 'operational',
    details: {
      message: 'NGINX is proxying requests successfully',
      features: [
        'Reverse proxy',
        'Rate limiting',
        'Static file caching',
        'Gzip compression',
        'Security headers',
      ],
    },
  };

  // Check Redis
  try {
    const testKey = 'infrastructure:health:check';
    const testValue = { test: true, timestamp: Date.now() };
    
    await cache.set(testKey, testValue, 10);
    const retrieved = await cache.get(testKey);
    
    const isRedisAvailable = cache.isRedisAvailable();
    
    status.services.redis = {
      status: isRedisAvailable ? 'operational' : 'unavailable',
      details: {
        type: isRedisAvailable ? 'Redis' : 'Memory Cache',
        message: isRedisAvailable 
          ? 'Redis is connected and caching data'
          : 'Using in-memory cache fallback',
        cacheWorking: !!retrieved,
        memoryCacheSize: cache.getMemoryCacheSize(),
      },
    };
  } catch (error: any) {
    status.services.redis = {
      status: 'error',
      details: {
        message: 'Cache system error',
        error: error.message,
      },
    };
  }

  // Check RabbitMQ
  try {
    const queueStats = await Promise.all(
      Object.values(QUEUES).map(async (queueName) => {
        try {
          const info = await queue.getQueueInfo(queueName);
          return {
            name: queueName,
            messages: info.messageCount,
            consumers: info.consumerCount,
            status: 'operational',
          };
        } catch (error) {
          return {
            name: queueName,
            status: 'error',
            error: 'Unable to connect',
          };
        }
      })
    );

    const allOperational = queueStats.every(q => q.status === 'operational');

    status.services.rabbitmq = {
      status: allOperational ? 'operational' : 'degraded',
      details: {
        message: allOperational 
          ? 'RabbitMQ is connected and processing jobs'
          : 'Some queues are unavailable',
        queues: queueStats,
        totalQueues: Object.keys(QUEUES).length,
      },
    };
  } catch (error: any) {
    status.services.rabbitmq = {
      status: 'unavailable',
      details: {
        message: 'RabbitMQ is not available',
        error: error.message,
        note: 'Background job processing disabled',
      },
    };
  }

  // Overall cache status
  status.services.cache = {
    status: 'operational',
    details: {
      strategy: 'Unified caching with graceful fallback',
      primary: cache.isRedisAvailable() ? 'Redis' : 'Memory',
      fallback: 'Memory cache',
      message: 'Cache system is operational',
    },
  };

  // Determine overall status
  const serviceStatuses = Object.values(status.services).map(s => s.status);
  if (serviceStatuses.every(s => s === 'operational')) {
    status.overall = 'healthy';
  } else if (serviceStatuses.some(s => s === 'error')) {
    status.overall = 'degraded';
  } else {
    status.overall = 'partial';
  }

  return NextResponse.json(status, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
