# Epic 1: Foundation & Authentication

**Goal:** Establish core project infrastructure, monorepo setup, and user authentication via Clerk.

**Priority:** P0 (Must-Have)
**Dependencies:** None (foundational work)
**Estimated Effort:** 3-4 weeks

## Story 1.1: Initialize Turborepo Monorepo Structure
**As a** developer
**I want** a Turborepo monorepo with shared configs
**So that** we can share code between frontend and backend efficiently

**Acceptance Criteria:**
- Root `package.json` with Turborepo configuration
- Apps: `apps/web` (Next.js with App Router - includes frontend and API Routes in `app/api/`)
- Packages: `packages/ui`, `packages/types`, `packages/config`
- Shared TypeScript config (`tsconfig.json` base)
- Shared ESLint and Prettier configs
- Turbo pipeline defined for `dev`, `build`, `lint`, `test`

**Technical Notes:**
- Use `pnpm` as package manager (faster than npm/yarn)
- Configure path aliases (`@/` for internal imports)
- Note: This project uses Next.js API Routes (TypeScript) for backend, not a separate FastAPI application

---

## Story 1.2: Set Up Next.js 14 App Router Frontend
**As a** developer
**I want** a Next.js 14 app with App Router and TypeScript
**So that** we have a modern, performant frontend foundation

**Acceptance Criteria:**
- Next.js 14 installed with App Router enabled
- TypeScript strict mode enabled
- Tailwind CSS configured with shadcn/ui setup
- Basic app layout (`app/layout.tsx`) with metadata
- Homepage (`app/page.tsx`) renders successfully
- Development server runs on `localhost:3000`

**Technical Notes:**
- Use `create-next-app` with TypeScript template
- Install shadcn/ui via CLI: `npx shadcn-ui@latest init`

---

## Story 1.3: Integrate Clerk for Authentication
**As a** user
**I want** to sign up and log in with email/password or OAuth
**So that** I can access my account securely

**Acceptance Criteria:**
- Clerk project created and API keys configured
- Clerk SDK installed in Next.js (`@clerk/nextjs`)
- Sign-up page (`/sign-up`) with email/password + Google/GitHub OAuth
- Sign-in page (`/sign-in`) with same options
- Protected routes redirect unauthenticated users to `/sign-in`
- User profile accessible via `useUser()` hook

**Technical Notes:**
- Clerk middleware in `middleware.ts` for route protection
- Sync Clerk user ID to Supabase `users` table via webhook (Story 1.5)

---

## Story 1.4: Set Up Supabase Project and Database Schema
**As a** developer
**I want** a Supabase project with initial database schema
**So that** we can store user data, initiatives, and documents

**Acceptance Criteria:**
- Supabase project created (free tier for development)
- PostgreSQL database accessible via connection string
- Initial schema migration with tables:
  - `users` (id, clerk_user_id, email, created_at, updated_at)
  - `initiatives` (id, user_id, title, status, created_at, updated_at)
  - `documents` (id, initiative_id, type, content, version, created_at)
  - `agent_conversations` (id, initiative_id, user_id, messages, created_at)
- Row-level security (RLS) policies enabled (users can only access their own data)

**Technical Notes:**
- Use Supabase migrations CLI: `supabase migration new init_schema`
- RLS policies: `user_id = auth.uid()` for all tables

---

## Story 1.5: Sync Clerk Users to Supabase via Webhook
**As a** system
**I want** to automatically create Supabase user records when users sign up in Clerk
**So that** user data is synced between auth and database

**Acceptance Criteria:**
- Clerk webhook endpoint created in Next.js API route (`/api/webhooks/clerk`)
- Webhook listens for `user.created` event
- On user creation, insert record into Supabase `users` table
- Webhook verifies Clerk signature for security
- Handle duplicate user creation gracefully (idempotent)

**Technical Notes:**
- Use `svix` library for webhook signature verification
- Store Clerk webhook secret in environment variable

---

## Story 1.6: Install and Configure shadcn/ui Components
**As a** developer
**I want** shadcn/ui components installed and themed
**So that** we have consistent, accessible UI primitives

**Acceptance Criteria:**
- shadcn/ui initialized with Tailwind config
- Core components installed: Button, Card, Dialog, Input, Label, Tabs, Separator
- Custom theme defined in `tailwind.config.ts` (neutral color palette)
- Components accessible in `@/components/ui/` directory
- Storybook configured for component development (optional, can defer)

**Technical Notes:**
- shadcn/ui uses Radix UI primitives (WCAG AA accessible by default)
- Install components individually: `npx shadcn-ui@latest add button card dialog`

---

## Story 1.7: Create Dashboard Layout with Protected Route
**As a** user
**I want** to see a dashboard after logging in
**So that** I can access the main application workspace

**Acceptance Criteria:**
- Dashboard route (`/dashboard`) created with layout
- Route protected via Clerk middleware (redirects if unauthenticated)
- Dashboard displays user's name from Clerk (`user.firstName`)
- Placeholder for Initiative list (to be built in Epic 2)
- Logout button in header (calls `signOut()` from Clerk)

**Technical Notes:**
- Use Next.js App Router layout for shared UI (header, sidebar)
- Dashboard is the primary landing page post-authentication

---
