# APIs That Should Be Cached

Based on your WorkQit platform, here are the APIs that would benefit most from caching:

## 🔥 High Priority (Add caching ASAP)

### 1. Job Listings
**File**: `app/api/jobs/route.ts` (if exists)
**Why**: Frequently accessed, rarely changes
**TTL**: 5-10 minutes
```typescript
const cacheKey = `jobs:page:${page}:filter:${JSON.stringify(filters)}`;
await cache.set(cacheKey, jobs, 600); // 10 minutes
```

### 2. User Profile
**File**: `app/api/profile/route.ts` or similar
**Why**: Accessed on every page load
**TTL**: 5 minutes
```typescript
const cacheKey = `user:profile:${userId}`;
await cache.set(cacheKey, profile, 300); // 5 minutes
```

### 3. Mentor List
**File**: `app/api/mentors/route.ts` (if exists)
**Why**: Popular page, data doesn't change often
**TTL**: 10 minutes
```typescript
const cacheKey = `mentors:list:page:${page}`;
await cache.set(cacheKey, mentors, 600); // 10 minutes
```

### 4. Assessment Questions
**File**: `app/api/assessments/[id]/route.ts`
**Why**: Same questions for all users
**TTL**: 1 hour
```typescript
const cacheKey = `assessment:${assessmentId}:questions`;
await cache.set(cacheKey, questions, 3600); // 1 hour
```

---

## ⚡ Medium Priority

### 5. Webinar List
**Why**: Popular feature, updates infrequently
**TTL**: 15 minutes
```typescript
const cacheKey = `webinars:upcoming`;
await cache.set(cacheKey, webinars, 900); // 15 minutes
```

### 6. Job Seeker Score
**Why**: Similar to mentor score
**TTL**: 5 minutes
```typescript
const cacheKey = `jobseeker:score:${userId}`;
await cache.set(cacheKey, score, 300); // 5 minutes
```

### 7. Employer Verification Status
**Why**: Doesn't change often
**TTL**: 10 minutes
```typescript
const cacheKey = `employer:verification:${userId}`;
await cache.set(cacheKey, status, 600); // 10 minutes
```

### 8. Community Posts
**Why**: High traffic, acceptable slight delay
**TTL**: 2 minutes
```typescript
const cacheKey = `community:posts:page:${page}`;
await cache.set(cacheKey, posts, 120); // 2 minutes
```

---

## 📊 Low Priority (Nice to have)

### 9. Analytics Data
**Why**: Expensive to calculate
**TTL**: 1 hour
```typescript
const cacheKey = `analytics:${type}:${period}`;
await cache.set(cacheKey, data, 3600); // 1 hour
```

### 10. Certificates
**Why**: Static once generated
**TTL**: 24 hours
```typescript
const cacheKey = `certificate:${certificateId}`;
await cache.set(cacheKey, certificate, 86400); // 24 hours
```

---

## ❌ Don't Cache These

### 1. Authentication
- Login/logout
- Token refresh
- Password reset

### 2. Real-time Data
- Chat messages
- Live notifications
- Active sessions

### 3. User Actions
- Form submissions
- File uploads
- Payment processing

### 4. Personalized Data
- Bookmarks
- Applications
- Private messages

---

## Implementation Template

### Basic Caching Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // 1. Verify user (if needed)
    const user = await verifyToken(request);
    
    // 2. Build cache key
    const cacheKey = `resource:${user?.userId}:${params}`;
    
    // 3. Try cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ 
        data: cached, 
        cached: true 
      });
    }
    
    // 4. Fetch from database
    const data = await fetchFromDatabase();
    
    // 5. Cache the result
    await cache.set(cacheKey, data, 300); // 5 minutes
    
    // 6. Return response
    return NextResponse.json({ 
      data, 
      cached: false 
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Cache Invalidation Pattern

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Update database
    await updateDatabase(data);
    
    // 2. Invalidate related caches
    await cache.del(`resource:${userId}`);
    await cache.del(`resource:list`);
    
    // 3. Return response
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Update failed' },
      { status: 500 }
    );
  }
}
```

---

## Cache Key Naming Convention

Use consistent naming:

```typescript
// User-specific data
`user:${userId}:profile`
`user:${userId}:score`
`user:${userId}:applications`

// List data
`jobs:list:page:${page}`
`mentors:list:filter:${filter}`
`webinars:upcoming`

// Specific resources
`job:${jobId}`
`mentor:${mentorId}`
`assessment:${assessmentId}`

// Aggregated data
`analytics:${type}:${period}`
`stats:${category}`
```

---

## TTL Guidelines

| Data Type | TTL | Reason |
|-----------|-----|--------|
| Static content | 24 hours | Rarely changes |
| User profiles | 5 minutes | Balance freshness & performance |
| Lists/feeds | 2-10 minutes | Acceptable delay |
| Scores/stats | 5 minutes | Recalculated periodically |
| Search results | 1 minute | Needs to be fresh |
| Analytics | 1 hour | Expensive to calculate |

---

## Quick Wins

Start with these 3 for immediate impact:

1. **Mentor Score** ✅ (Already done!)
2. **Job Listings** - Add next
3. **User Profile** - Add next

Each will significantly improve your deployment performance!

---

## Testing Cached APIs

```bash
# First request (cache miss)
time curl https://your-app.vercel.app/api/jobs

# Second request (cache hit)
time curl https://your-app.vercel.app/api/jobs

# Should be much faster!
```

---

## Monitoring Cache Effectiveness

Add to your APIs:

```typescript
const startTime = Date.now();
const cached = await cache.get(key);
const duration = Date.now() - startTime;

console.log({
  endpoint: '/api/jobs',
  cacheHit: !!cached,
  duration,
  cacheKey: key,
});
```

---

## Next Steps

1. ✅ Mentor Score cached (done!)
2. 🎯 Add caching to job listings
3. 🎯 Add caching to user profiles
4. 🎯 Add caching to mentor list
5. 📊 Monitor cache hit rates
6. 🚀 Deploy and measure performance

Your app will be significantly faster! 🚀
