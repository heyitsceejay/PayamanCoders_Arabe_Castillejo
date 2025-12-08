# Redis Setup Guide

## Overview
Redis is configured as an in-memory cache for the WorkQit platform with the following features:
- API response caching
- Rate limiting
- Session storage
- Real-time data caching

## Quick Start

### Start Redis with Docker
```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose up -d
```

Redis will be available at:
- **Inside containers**: `redis://redis:6379`
- **From host machine**: `redis://localhost:6379`

## Test Redis Connection

Visit: http://localhost/api/cache/test

Or use curl:
```bash
curl http://localhost/api/cache/test
```

## Usage Examples

### Basic Caching
```typescript
import { cache } from '@/lib/redis';

// Set cache (with 60 second TTL)
await cache.set('user:123', userData, 60);

// Get cache
const data = await cache.get('user:123');

// Delete cache
await cache.del('user:123');

// Check if exists
const exists = await cache.exists('user:123');
```

### Rate Limiting
```typescript
import { rateLimit, rateLimitResponse } from '@/middleware/rateLimit';

export async function POST(request: NextRequest) {
  // 10 requests per minute
  const limit = await rateLimit(request, {
    windowMs: 60000,
    maxRequests: 10
  });

  if (!limit.success) {
    return rateLimitResponse(limit.remaining, limit.resetTime);
  }

  // Process request...
}
```

### Increment Counter
```typescript
// Increment view count
const views = await cache.increment('post:123:views');

// With expiry (24 hours)
const dailyViews = await cache.increment('post:123:views:daily', 86400);
```

### Batch Operations
```typescript
// Get multiple keys
const users = await cache.getMany(['user:1', 'user:2', 'user:3']);

// Delete by pattern
await cache.deletePattern('user:*');
```

## Implemented Caching

### Mentor Score API
- **Endpoint**: `/api/mentor/score`
- **Cache Duration**: 5 minutes
- **Cache Key**: `mentor:score:{userId}`
- **Refresh**: POST to same endpoint clears cache

## Redis Commands

### Access Redis CLI
```bash
# Development
docker exec -it workqit-redis-dev redis-cli

# Production
docker exec -it workqit-redis redis-cli
```

### Useful Commands
```bash
# Check connection
PING

# Get all keys
KEYS *

# Get value
GET mentor:score:123

# Delete key
DEL mentor:score:123

# Check memory usage
INFO memory

# Flush all data (careful!)
FLUSHALL
```

## Configuration

### Memory Limits
- **Development**: No limit
- **Production**: 256MB with LRU eviction

### Persistence
- **AOF (Append Only File)**: Enabled
- Data persists in Docker volume `redis-data`

### Environment Variables
```env
REDIS_URL=redis://redis:6379
```

## Monitoring

### Check Redis Status
```bash
docker-compose ps redis
```

### View Redis Logs
```bash
# Development
docker-compose -f docker-compose.dev.yml logs -f redis

# Production
docker-compose logs -f redis
```

### Memory Usage
```bash
docker exec -it workqit-redis-dev redis-cli INFO memory
```

## Common Use Cases

### 1. Cache API Responses
```typescript
const cacheKey = `api:jobs:${page}`;
let jobs = await cache.get(cacheKey);

if (!jobs) {
  jobs = await fetchJobsFromDB(page);
  await cache.set(cacheKey, jobs, 300); // 5 minutes
}
```

### 2. Rate Limiting
```typescript
const key = `ratelimit:${userId}:api`;
const count = await cache.increment(key, 60); // 60 second window

if (count > 100) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
}
```

### 3. Session Storage
```typescript
const sessionKey = `session:${sessionId}`;
await cache.set(sessionKey, sessionData, 3600); // 1 hour
```

### 4. Leaderboard
```typescript
// Increment mentor score
await cache.increment(`mentor:${mentorId}:score`);

// Get top mentors (would use Redis ZSET in production)
```

## Best Practices

1. **Always set TTL**: Prevent memory bloat
2. **Use namespaced keys**: `user:123`, `mentor:score:456`
3. **Handle cache misses**: Always have fallback to database
4. **Don't cache sensitive data**: Passwords, tokens, etc.
5. **Clear cache on updates**: When data changes, invalidate cache

## Troubleshooting

### Redis not connecting
```bash
# Check if Redis is running
docker-compose ps

# Restart Redis
docker-compose restart redis
```

### Clear all cache
```bash
docker exec -it workqit-redis-dev redis-cli FLUSHALL
```

### Check Redis logs
```bash
docker-compose logs redis
```

## Next Steps
- Add Redis for session management
- Implement job search result caching
- Add mentor availability caching
- Set up RabbitMQ for background jobs
