# 12. Deployment Architecture

## 12.1 Vercel Configuration

**File:** `vercel.json`
```json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

## 12.2 Environment Variables

**Production:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `GOOGLE_CLOUD_PROJECT`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `STRIPE_SECRET_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`

## 12.3 CI/CD Pipeline

**GitHub Actions:**
```yaml
name: CI/CD
on:
  push:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-args: '--prod'
```

## 12.4 Google ADK Deployment

**Separate pipeline for ADK agents:**
```yaml
name: Deploy ADK Agents
on:
  push:
    paths: ['packages/google-adk/**']

jobs:
  deploy-agents:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
      - run: |
          cd packages/google-adk
          pip install -r requirements.txt
          python deploy_agents.py
```

---
