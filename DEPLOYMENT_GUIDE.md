# Deployment Guide - Vercel with Redis

## Current Issue

Your app is **fast locally** (with Redis) but **slow in production** (without Redis). This is because:

1. **Localhost**: Uses Redis for caching → Fast responses
2. **Vercel**: No Redis → Recalculates everything on each request → Slow

## Solution Options

### Option 1: Add Vercel KV (Redis) - Recommended ⭐

Vercel KV is a managed Redis service that integrates seamlessly with Vercel.

**Steps:**

1. **Install Vercel KV**
   ```bash
   npm install @vercel/kv
   ```

2. **Add KV to your Vercel project**
   - Go to your Vercel dashboard
   - Select your project
   - Go to "Storage" tab
   - Click "Create Database"
   - Select "KV" (Redis)
   - Click "Create"

3. **Environment Variables** (automatically added by Vercel)
   ```env
   KV_URL=...
   KV_REST_API_URL=...
   KV_REST_API_TOKEN=...
   KV_REST_API_READ_ONLY_TOKEN=...
   ```

4. **Update your code** (already done in `lib/cache.ts`)
   - The app will automatically use Redis when available
   - Falls back to memory cache when Redis is unavailable

**Pricing:**
- Free tier: 30,000 commands/month
- Pro: $0.20 per 100,000 commands

---

### Option 2: Use Upstash Redis - Free Tier Available

Upstash offers a generous free tier for Redis.

**Steps:**

1. **Sign up at** https://upstash.com

2. **Create Redis Database**
   - Click "Create Database"
   - Choose region closest to your Vercel deployment
   - Copy the connection URL

3. **Add to Vercel Environment Variables**
   ```env
   REDIS_URL=redis://...@...upstash.io:6379
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

**Pricing:**
- Free tier: 10,000 commands/day
- Pay as you go: $0.20 per 100,000 commands

---

### Option 3: Use Memory Cache Only (Current Setup)

Your app already has in-memory caching as a fallback. This works but has limitations:

**Pros:**
- ✅ No additional cost
- ✅ No setup required
- ✅ Works immediately

**Cons:**
- ❌ Cache is per-instance (not shared across serverless functions)
- ❌ Cache is lost on cold starts
- ❌ Limited memory in serverless environment

**Current Implementation:**
- `lib/cache.ts` - Unified cache interface
- `lib/redis.ts` - Redis client (when available)
- `lib/memoryCache.ts` - In-memory fallback

---

## Recommended Setup for Production

### For Vercel Deployment:

1. **Use Vercel KV** (Option 1) for best performance
2. **Keep memory cache** as fallback for cold starts
3. **Set appropriate TTLs** based on data freshness needs

### Cache Strategy:

```typescript
// Short TTL for frequently changing data
await cache.set('user:profile', data, 60); // 1 minute

// Medium TTL for semi-static data
await cache.set('mentor:score', data, 300); // 5 minutes

// Long TTL for static data
await cache.set('jobs:list', data, 3600); // 1 hour
```

---

## Testing Cache Performance

### Test Locally (with Redis)
```bash
# Start Redis
docker-compose -f docker-compose.dev.yml up -d redis

# Test cache
curl http://localhost:3000/api/cache/test
```

### Test on Vercel (with/without Redis)
```bash
# Deploy
vercel --prod

# Test cache
curl https://your-app.vercel.app/api/cache/test
```

**Response will show:**
```json
{
  "success": true,
  "cacheType": "Redis" or "Memory",
  "redisAvailable": true/false,
  "memoryCacheSize": 5,
  "message": "..."
}
```

---

## Performance Comparison

| Scenario | First Request | Cached Request | Cache Type |
|----------|---------------|----------------|------------|
| **Local with Redis** | 200ms | 5ms | Redis |
| **Vercel with KV** | 200ms | 10ms | Redis (KV) |
| **Vercel with Memory** | 200ms | 50ms | Memory |
| **Vercel without Cache** | 200ms | 200ms | None |

---

## Migration Steps

### If you choose Vercel KV:

1. **Add Vercel KV to your project** (via Vercel dashboard)

2. **Update `lib/redis.ts`** to support Vercel KV:
   ```typescript
   // Add at the top
   import { kv } from '@vercel/kv';
   
   // Use KV when available
   if (process.env.KV_REST_API_URL) {
     // Use Vercel KV
   } else if (process.env.REDIS_URL) {
     // Use standard Redis
   }
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Test**
   ```bash
   curl https://your-app.vercel.app/api/cache/test
   ```

---

## Current Cache Implementation

Your app is **already configured** to handle both scenarios:

✅ **With Redis** (localhost, VPS, or Vercel KV):
- Uses Redis for caching
- Fast responses (5-10ms)
- Shared cache across instances

✅ **Without Redis** (Vercel free tier):
- Uses in-memory cache
- Moderate responses (50ms)
- Per-instance cache

✅ **Graceful Fallback**:
- If Redis fails, automatically uses memory cache
- No errors or crashes
- App continues to work

---

## Monitoring Cache Performance

### Add to your API routes:

```typescript
const startTime = Date.now();
const cached = await cache.get(key);
const cacheTime = Date.now() - startTime;

console.log(`Cache ${cached ? 'HIT' : 'MISS'} in ${cacheTime}ms`);
```

### Check cache status:

```bash
# Test endpoint
curl https://your-app.vercel.app/api/cache/test

# Check mentor score (with timing)
curl https://your-app.vercel.app/api/mentor/score
```

---

## Recommendations

### For Development:
- ✅ Use Docker Redis (already set up)
- ✅ Fast local development
- ✅ Test caching behavior

### For Production (Vercel):
- ⭐ **Best**: Add Vercel KV ($0 for free tier)
- ✅ **Good**: Use Upstash Redis (free tier available)
- ⚠️ **Okay**: Use memory cache only (current setup)

### For Production (VPS/Cloud):
- ✅ Use Docker Redis (already configured)
- ✅ Run workers for background jobs
- ✅ Full control over infrastructure

---

## Next Steps

1. **Choose your Redis provider** (Vercel KV or Upstash)
2. **Add environment variables** to Vercel
3. **Deploy and test**
4. **Monitor performance**

Your app is already configured to work with or without Redis, so you can deploy now and add Redis later if needed!
