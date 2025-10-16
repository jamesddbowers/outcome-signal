# 13. Security & Performance

## 13.1 Security Architecture

**Multi-Layer Security:**
1. Clerk JWT verification (Next.js Middleware)
2. API Route authorization (userId validation)
3. Supabase Row-Level Security (database enforcement)
4. Resource ownership validation (business logic)

**Content Security Policy:**
```javascript
// next.config.js
headers: [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval'..."
  }
]
```

**Rate Limiting:**
```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

const { success } = await ratelimit.limit(userId);
if (!success) {
  return NextResponse.json({ error: 'rate_limit_exceeded' }, { status: 429 });
}
```

## 13.2 Performance Optimization

**Performance Budgets:**
| Metric | Target | NFR |
|--------|--------|-----|
| First Contentful Paint | <1.8s | NFR1 |
| Largest Contentful Paint | <2.5s | NFR1 |
| Time to Interactive | <3.5s | NFR1 |
| API Response (p95) | <500ms | NFR1 |
| Document Generation (p95) | <30s | NFR1 |

**Optimization Techniques:**
- React Server Components (reduce bundle size)
- Code splitting with dynamic imports
- Image optimization with Next.js Image
- Font optimization with next/font
- React Query caching (1 min stale time)

---
