# 8. Core Workflows

## 8.1 User Onboarding & First Initiative

```
User signs up → Clerk creates account → Webhook to API
→ Create user in Supabase → Create Trial subscription
→ User creates first initiative → Navigate to workspace
```

## 8.2 Generate PRD Document (Core Flow)

```
User: "Help me create a PRD"
→ API invokes Primary Agent
→ Agent asks 3-5 questions
→ User provides answers
→ API checks credits, triggers Reasoning Engine
→ Workflow executes 6 steps (15-25s)
→ Supabase Realtime broadcasts progress
→ Document saved, rendered in TipTap preview
```

**Timing:** 3-7 minutes total (including Q&A)

## 8.3 Document Approval & Next Steps

```
User reviews PRD → Clicks "Approve"
→ API updates status to "approved"
→ Initiative phase_progress updated
→ Agent suggests next documents (Architecture, UX)
```

## 8.4 Subscription Upgrade

```
User tries to create 2nd initiative (Trial limit: 1)
→ API returns 402 Payment Required
→ User clicks "Upgrade to Starter"
→ API creates Stripe Checkout Session
→ User completes payment
→ Stripe webhook updates Supabase
→ Credits and limits increased
```

## 8.5 Workflow Timing Summary

| Workflow | Time | Credits | NFR |
|----------|------|---------|-----|
| Document Generation | 15-25s (p95 <30s) | 1 credit | NFR1 |
| Document Revision | 8-15s | 0.5 credits | NFR1 |
| Chat Interaction | <2s | 0 credits | NFR4 |

---
