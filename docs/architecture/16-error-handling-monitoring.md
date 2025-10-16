# 16. Error Handling & Monitoring

## 16.1 Error Handling

**Error Boundary:**
```tsx
export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

**API Error Classes:**
```typescript
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) { }
}
```

## 16.2 Sentry Integration

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

## 16.3 Logging

```typescript
export function log(level: LogLevel, message: string, context?: LogContext) {
  const logEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
  console.log(JSON.stringify(logEntry));
}
```

## 16.4 Monitoring

- **Vercel Analytics:** Web Vitals, Real User Monitoring
- **Sentry:** Error tracking, performance monitoring
- **Custom Metrics:** Track document generation, subscription upgrades
- **Health Check:** `/api/health` endpoint

---
