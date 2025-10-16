# 7. External APIs & Third-Party Integrations

## 7.1 Clerk - Authentication

- **Purpose:** User authentication and session management
- **Integration:** SDK + Webhooks
- **Webhooks:** `user.created`, `user.updated`, `user.deleted` → Sync to Supabase

## 7.2 Stripe - Payment Processing

- **Purpose:** Subscription billing
- **Integration:** SDK + Webhooks
- **Webhooks:** `customer.subscription.*`, `invoice.*` → Update Supabase subscriptions

**Subscription Tiers:**
| Tier | Price | Credits/Month | Initiatives |
|------|-------|---------------|-------------|
| Trial | $0 | 5 | 1 |
| Starter | $19/mo | 25 | 3 |
| Professional | $49/mo | 100 | Unlimited |
| Enterprise | Custom | Unlimited | Unlimited |

## 7.3 Google Vertex AI

- **Purpose:** AI agent deployment and LLM access
- **Integration:** `@google-cloud/aiplatform` Node.js SDK
- **Services:** Agent Engine (7 ADK agents), Reasoning Engine (workflows), Model Garden (Gemini, Claude)

## 7.4 Supabase

- **Purpose:** Database, storage, real-time subscriptions
- **Integration:** `@supabase/supabase-js` SDK
- **Features:** PostgreSQL 15, Realtime WebSocket, Row-Level Security, Storage

## 7.5 Resend - Email

- **Purpose:** Transactional email delivery
- **Email Types:** Welcome, trial expiring, subscription receipts, payment failed

## 7.6 Sentry - Error Tracking

- **Purpose:** Error tracking and performance monitoring
- **Integration:** `@sentry/nextjs` SDK
- **Features:** Error tracking, performance monitoring, session replay

## 7.7 Monthly Cost Estimate

| Service | Monthly Cost |
|---------|--------------|
| Clerk | $25-50 |
| Stripe | 2.9% + $0.30/transaction |
| Vertex AI | $300-500 |
| Supabase | $25 |
| Resend | $20 |
| Sentry | $26 |
| Vercel | $20 |
| **TOTAL** | **~$436-641/mo** |

---
