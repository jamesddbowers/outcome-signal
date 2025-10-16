# 3. Tech Stack

## 3.1 Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Monorepo** | Turborepo | Latest | Monorepo build system | Faster builds, shared configs |
| **Package Manager** | pnpm | 8.x | Fast package manager | 3x faster than npm, single package manager for entire app |
| **Language** | TypeScript | 5.3+ | Type-safe JavaScript for full-stack | **Single language for frontend + backend API** (except separate ADK deployments) |
| **Frontend Framework** | Next.js | 14 (App Router) | React framework with SSR/SSG | App Router with React Server Components |
| **Backend Framework** | Next.js API Routes | 14 (App Router) | **TypeScript serverless API endpoints** | Unified deployment, zero cold-start |
| **API Style** | REST + WebSocket | OpenAPI 3.0 | RESTful API + Realtime WebSocket | REST for CRUD, WebSocket via Supabase Realtime |
| **UI Component Library** | shadcn/ui | Latest (Scaled theme) | Accessible React components | Radix UI primitives, Scaled theme |
| **CSS Framework** | Tailwind CSS | 3.4+ | Utility-first CSS | Rapid styling, JIT compiler |
| **State Management** | Zustand | 4.x | Lightweight client state | Simple API, <1KB bundle |
| **Server State** | React Query (TanStack Query) | 5.x | Server state caching | Background refetching, optimistic updates |
| **Forms** | React Hook Form | 7.x | Form validation | Minimal re-renders, Zod integration |
| **Validation** | Zod | 3.x | TypeScript-first schema validation | **Shared between frontend and API Routes** |
| **Rich Text Editor** | TipTap | 2.x | Prosemirror-based editor | Read-only markdown rendering MVP |
| **Icons** | Lucide React | Latest | Icon library | Consistent with shadcn/ui |
| **Database** | Supabase (PostgreSQL) | 15+ | Managed Postgres | pgvector, RLS, Realtime |
| **ORM/Query Builder** | Supabase JS Client | Latest | Type-safe database queries | Auto-generated from schema |
| **File Storage** | Supabase Storage | N/A | User uploads and exports | S3-compatible, CDN |
| **Authentication** | Clerk | Latest | User authentication | Pre-built UI, social OAuth |
| **Payment Processing** | Stripe | API 2024-01-01 | Subscription billing | Stripe Checkout, webhooks |
| **Email** | Resend | Latest | Transactional email | Developer-friendly API |
| **AI Orchestration** | Google Vertex AI ADK | Latest (google-adk) | **Agent development (Python - deployed separately)** | Official Google framework |
| **AI SDK (Node.js)** | @google-cloud/aiplatform | Latest | **Vertex AI SDK for Next.js API Routes** | **Invoke ADK agents from TypeScript** |
| **AI Agents** | Vertex AI Agent Engine | N/A | Managed agent execution | Hosts google-adk agents |
| **AI Workflows** | Vertex AI Reasoning Engine | N/A | Complex multi-step workflows | State persistence, resumable |
| **LLM Providers** | Gemini 2.5 Pro, Claude Sonnet 4.5 | Via Vertex AI | A/B testing | Unified API |
| **Frontend Testing** | Vitest + React Testing Library | Latest | Unit and component tests | Fast, Jest-compatible |
| **Backend Testing** | Vitest | Latest | **API Route testing** | **Same test framework** |
| **E2E Testing** | Playwright | Latest | End-to-end browser tests | Cross-browser, auto-wait |
| **Build Tool** | Turbo (Turborepo) | Latest | Incremental builds | Parallel execution |
| **CI/CD** | GitHub Actions + Vercel | N/A | Continuous deployment | GitHub Actions for tests |
| **Monitoring** | Vercel Analytics + Sentry | Latest | Web vitals and errors | Unified error tracking |
| **Logging** | Vercel logs + Google Cloud Logging | Built-in | Application logging | Structured JSON logs |

## 3.2 Package Management Strategy

**Application (TypeScript):**
- **Manager:** pnpm
- **Scope:** Entire Next.js app (`/apps/web`), shared packages
- **Root file:** `pnpm-workspace.yaml`, `package.json`

**Google ADK Agents (Python):**
- **Manager:** pip (requirements.txt)
- **Scope:** `/packages/google-adk/` only
- **Deployment:** Separate from Next.js app - deployed directly to Vertex AI via CI/CD
- **Not part of Vercel deployment**

---
