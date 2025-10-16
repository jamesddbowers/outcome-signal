# Architecture Templates Analysis - Section 3: Fullstack Architecture Template

**Document Version**: 1.0
**Created**: 2025-10-14
**Author**: Claude Code (AI Agent)
**Part**: 3 of 5
**Task**: Phase 4, Task 4.2 - Architecture Templates Analysis

---

## Navigation

- [Section 1 - Introduction & Overview](architecture-templates-section1.md)
- [Section 2 - Backend Architecture Template](architecture-templates-section2.md)
- **Current**: Section 3 - Fullstack Architecture Template
- **Next**: [Section 4 - Frontend & Brownfield Architecture](architecture-templates-section4.md)
- [Section 5 - Technical Preferences & Summary](architecture-templates-section5.md)
- [Back to Phase 4 Tasks](../../tasks/PHASE-4-template-analysis.md)

---

## Table of Contents

1. [Template Overview](#template-overview)
2. [Template Metadata](#template-metadata)
3. [Fullstack vs Backend Template Comparison](#fullstack-vs-backend-template-comparison)
4. [Unified Architecture Philosophy](#unified-architecture-philosophy)
5. [Platform-First Decision Making](#platform-first-decision-making)
6. [Monorepo-Centric Design](#monorepo-centric-design)
7. [Frontend-Backend Integration Sections](#frontend-backend-integration-sections)
8. [Key Sections Analysis](#key-sections-analysis)
9. [Template Variables](#template-variables)
10. [ADK Translation Recommendations](#adk-translation-recommendations)

---

## Template Overview

### Purpose

The **Fullstack Architecture Template** (`fullstack-architecture-tmpl.yaml`) is designed for modern **unified fullstack applications** where frontend and backend are tightly integrated. Unlike the backend-only template, this creates a **single comprehensive architecture document** covering both layers.

### When to Use

**Ideal for**:
- ✅ Modern fullstack web applications (Next.js, T3 Stack, MEAN/MERN)
- ✅ Monorepo projects with frontend + backend packages
- ✅ Platform-integrated solutions (Vercel + Supabase, AWS Amplify)
- ✅ Jamstack applications with serverless backends
- ✅ Applications where frontend and backend share code (TypeScript types, utilities)

**NOT ideal for**:
- ❌ Backend-only services (use Backend Architecture template)
- ❌ Projects with separate frontend/backend teams (use separate templates)
- ❌ Existing projects being enhanced (use Brownfield template)
- ❌ Projects where frontend and backend use completely different tech stacks

### Key Characteristics

| Characteristic | Value |
|----------------|-------|
| **Template ID** | `fullstack-architecture-template-v2` |
| **Version** | 2.0 |
| **Size** | 825 lines of YAML (largest architecture template) |
| **Major Sections** | 16 |
| **Subsections** | 60+ |
| **Total Sections** | 76+ |
| **Elicitation Points** | 18 |
| **Conditional Sections** | 6 |
| **Repeatable Sections** | 5 |
| **Diagram Types** | 4 (graph, sequence, flowchart, C4) |
| **Code Block Sections** | 15 |
| **Table Sections** | 5 |

**Size Comparison**:
- **26% larger** than Backend Architecture template (652 lines)
- **275% larger** than Frontend Architecture template (220 lines)
- **72% larger** than Brownfield Architecture template (478 lines)

---

## Template Metadata

### YAML Front Matter

```yaml
# <!-- Powered by BMAD™ Core -->
template:
  id: fullstack-architecture-template-v2
  name: Fullstack Architecture Document
  version: 2.0
  output:
    format: markdown
    filename: docs/architecture.md
    title: "{{project_name}} Fullstack Architecture Document"
```

**Key Insight**: Uses same output filename (`docs/architecture.md`) as Backend template, emphasizing that this is a **replacement**, not a companion document.

### Workflow Configuration

```yaml
workflow:
  mode: interactive
  elicitation: advanced-elicitation
```

**Identical to Backend template**: Both use interactive mode with advanced elicitation strategies.

### Introduction Content

```yaml
- id: intro-content
  content: |
    This document outlines the complete fullstack architecture for
    {{project_name}}, including backend systems, frontend implementation, and
    their integration. It serves as the single source of truth for AI-driven
    development, ensuring consistency across the entire technology stack.

    This unified approach combines what would traditionally be separate backend
    and frontend architecture documents, streamlining the development process
    for modern fullstack applications where these concerns are increasingly
    intertwined.
```

**Key Philosophy**: "Unified approach" for "modern fullstack applications where concerns are increasingly intertwined."

---

## Fullstack vs Backend Template Comparison

### Structural Differences

| Aspect | Backend Template | Fullstack Template | Difference |
|--------|------------------|-------------------|------------|
| **Size** | 652 lines | 825 lines | +173 lines (26% larger) |
| **Sections** | 13 major | 16 major | +3 sections |
| **Total Sections** | 58+ | 76+ | +18 sections |
| **Elicitation Points** | 15 | 18 | +3 validation points |
| **Conditional Sections** | 3 | 6 | +3 conditionals |
| **Tech Stack Table Rows** | 12-15 | 20+ | +5-8 rows |

### Added Sections (Fullstack-Only)

1. **Platform and Infrastructure Choice** (replaces simple cloud infrastructure)
   - Emphasis on integrated platforms (Vercel + Supabase, AWS Amplify)
   - Platform drives all subsequent decisions

2. **Repository Structure** (explicit section vs implicit in Backend)
   - Monorepo tooling selection (Nx, Turborepo, npm workspaces)
   - Package organization strategy

3. **API Specification** (enhanced, multi-style)
   - Support for REST, GraphQL, **and tRPC**
   - Conditional subsections per API style

4. **Frontend Architecture** (entirely new section)
   - Component architecture
   - State management architecture
   - Routing architecture
   - Frontend services layer

5. **Backend Architecture** (entirely new section)
   - Service architecture (serverless vs traditional)
   - Database architecture
   - Authentication architecture

6. **Unified Project Structure** (replaces source tree)
   - Monorepo structure with apps/ and packages/
   - Shared code organization

7. **Development Workflow** (entirely new section)
   - Local development setup
   - Environment configuration
   - Development commands

8. **Deployment Architecture** (enhanced vs infrastructure-deployment)
   - Separate frontend and backend deployment strategies
   - Multi-environment configuration
   - CI/CD pipeline for monorepo

9. **Security and Performance** (split section)
   - Frontend security (CSP, XSS, storage)
   - Backend security (separate from frontend)
   - Frontend performance (bundle size, loading)
   - Backend performance (response time, caching)

10. **Monitoring and Observability** (entirely new section)
    - Frontend monitoring (Core Web Vitals, errors)
    - Backend monitoring (APM, metrics)

### Removed/Merged Sections

From Backend template, these sections are **merged or removed**:

1. **High Level Overview** → Merged into **Platform and Infrastructure Choice**
2. **Cloud Infrastructure** → Merged into **Platform and Infrastructure Choice**
3. **Infrastructure and Deployment** → Split into **Deployment Architecture** and **Security and Performance**
4. **Source Tree** → Replaced by **Unified Project Structure**

---

## Unified Architecture Philosophy

### Core Principle: Platform-First

The Fullstack template emphasizes **platform selection** as the foundational decision:

```yaml
- id: platform-infrastructure
  title: Platform and Infrastructure Choice
  instruction: |
    Based on PRD requirements and technical assumptions, make a platform
    recommendation:

    1. Consider common patterns (not an exhaustive list, use your own best
       judgement and search the web as needed for emerging trends):
    - **Vercel + Supabase**: For rapid development with Next.js, built-in
      auth/storage
    - **AWS Full Stack**: For enterprise scale with Lambda, API Gateway, S3,
      Cognito
    - **Azure**: For .NET ecosystems or enterprise Microsoft environments
    - **Google Cloud**: For ML/AI heavy applications or Google ecosystem
      integration

    2. Present 2-3 viable options with clear pros/cons
    3. Make a recommendation with rationale
    4. Get explicit user confirmation

    Document the choice and key services that will be used.
```

**Impact**: Platform choice cascades to:
- Frontend deployment (Vercel, Netlify, S3 + CloudFront, Azure Static Web Apps)
- Backend deployment (Vercel Functions, AWS Lambda, Azure Functions, Cloud Run)
- Database (Supabase, RDS, Cosmos DB, Cloud SQL)
- Authentication (NextAuth, Cognito, Auth0, Firebase Auth)
- Storage (Vercel Blob, S3, Azure Blob, Cloud Storage)

### Unified vs Separate Documents

**Fullstack Template Rationale** (from introduction):

> "This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined."

**When Unified Makes Sense**:
- ✅ Shared TypeScript codebase (types, utilities, constants)
- ✅ Monorepo with cross-package dependencies
- ✅ Integrated deployment (same platform, coordinated releases)
- ✅ Single team owning frontend + backend
- ✅ API and UI tightly coupled (not a public API)

**When Separate Makes Sense** (use Backend + Frontend templates):
- ✅ Different tech stacks (e.g., Java backend, React frontend)
- ✅ Polyrepo structure
- ✅ Separate teams with different responsibilities
- ✅ Public API serving multiple frontends
- ✅ Microservices backend with independent deployment

---

## Platform-First Decision Making

### Platform Options (Common Patterns)

The template explicitly lists **4 common platform combinations**:

#### 1. Vercel + Supabase

**Use Case**: Rapid development with Next.js, modern Jamstack apps

**Stack**:
- Frontend: Vercel (Next.js deployment, edge functions)
- Backend: Vercel Functions (serverless API routes)
- Database: Supabase (PostgreSQL with realtime, auth, storage)
- Auth: Supabase Auth or NextAuth.js
- Storage: Vercel Blob or Supabase Storage

**Pros**:
- Fastest time-to-market
- Excellent developer experience
- Built-in auth, realtime, storage
- Edge deployment for global performance

**Cons**:
- Vendor lock-in (Vercel + Supabase)
- Limited control over infrastructure
- Cost can scale quickly

#### 2. AWS Full Stack

**Use Case**: Enterprise scale, complete control, AWS ecosystem

**Stack**:
- Frontend: S3 + CloudFront (static hosting with CDN)
- Backend: Lambda + API Gateway (serverless functions)
- Database: RDS (PostgreSQL/MySQL) or DynamoDB
- Auth: Cognito
- Storage: S3

**Pros**:
- Proven at enterprise scale
- Complete control and flexibility
- Wide service ecosystem
- Strong security and compliance

**Cons**:
- Steeper learning curve
- More configuration required
- Complex IAM and networking

#### 3. Azure

**Use Case**: .NET ecosystems, enterprise Microsoft environments

**Stack**:
- Frontend: Azure Static Web Apps
- Backend: Azure Functions
- Database: Cosmos DB or Azure SQL
- Auth: Azure AD B2C
- Storage: Azure Blob Storage

**Pros**:
- Seamless Microsoft integration
- Strong enterprise support
- Excellent for .NET applications
- Hybrid cloud capabilities

**Cons**:
- Less JavaScript/Node.js focused
- Smaller developer community
- Pricing complexity

#### 4. Google Cloud

**Use Case**: ML/AI heavy applications, Google ecosystem

**Stack**:
- Frontend: Cloud Storage + Cloud CDN or Firebase Hosting
- Backend: Cloud Functions or Cloud Run
- Database: Firestore or Cloud SQL
- Auth: Firebase Auth or Identity Platform
- Storage: Cloud Storage

**Pros**:
- Best-in-class ML/AI services
- Firebase integration
- Strong data analytics capabilities
- Kubernetes expertise (GKE)

**Cons**:
- Smaller market share
- Less enterprise adoption
- Documentation can be scattered

### Platform Selection Process

```yaml
instruction: |
  1. Consider common patterns (not exhaustive, use best judgement and search
     web for emerging trends)
  2. Present 2-3 viable options with clear pros/cons
  3. Make a recommendation with rationale
  4. Get explicit user confirmation
```

**Template Variables**:
```yaml
template: |
  **Platform:** {{selected_platform}}
  **Key Services:** {{core_services_list}}
  **Deployment Host and Regions:** {{regions}}
```

---

## Monorepo-Centric Design

### Repository Structure Section

The Fullstack template includes an **explicit repository structure section**:

```yaml
- id: repository-structure
  title: Repository Structure
  instruction: |
    Define the repository approach based on PRD requirements and platform
    choice, explain your rationale or ask questions to the user if unsure:

    1. For modern fullstack apps, monorepo is often preferred
    2. Consider tooling (Nx, Turborepo, Lerna, npm workspaces)
    3. Define package/app boundaries
    4. Plan for shared code between frontend and backend
  template: |
    **Structure:** {{repo_structure_choice}}
    **Monorepo Tool:** {{monorepo_tool_if_applicable}}
    **Package Organization:** {{package_strategy}}
```

**Key Insight**: "For modern fullstack apps, monorepo is often preferred"

### Monorepo Tooling Options

**Recommended Tools**:

1. **Nx** (enterprise-grade)
   - Advanced caching and task orchestration
   - Built-in generators for consistency
   - Strong TypeScript support
   - Plugins for React, Next.js, NestJS

2. **Turborepo** (simple and fast)
   - Minimal configuration
   - Excellent caching
   - Vercel integration
   - Good for Vercel-deployed apps

3. **npm workspaces** (built-in)
   - No additional dependencies
   - Simple setup
   - Good for smaller projects
   - Manual task coordination

4. **Lerna** (legacy, less common now)
   - Package versioning focus
   - Being phased out in favor of Nx/Turborepo

### Package Organization Strategy

**Typical Monorepo Structure**:

```
project-root/
├── apps/                       # Application packages
│   ├── web/                    # Frontend application
│   └── api/                    # Backend application
├── packages/                   # Shared packages
│   ├── shared/                 # Shared types/utilities
│   ├── ui/                     # Shared UI components
│   └── config/                 # Shared configuration
```

**Package Boundaries**:
- **apps/**: Deployable applications (web, mobile, admin, api, worker)
- **packages/shared**: Cross-cutting code (types, constants, utils)
- **packages/ui**: Reusable UI components (if multiple frontends)
- **packages/config**: Shared configs (ESLint, TypeScript, Jest)

---

## Frontend-Backend Integration Sections

### Enhanced Tech Stack Table

The Fullstack template has a **significantly expanded tech stack table**:

```yaml
- id: tech-stack-table
  title: Technology Stack Table
  type: table
  columns: [Category, Technology, Version, Purpose, Rationale]
  rows:
    - ["Frontend Language", "{{fe_language}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["Frontend Framework", "{{fe_framework}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["UI Component Library", "{{ui_library}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["State Management", "{{state_mgmt}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["Backend Language", "{{be_language}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["Backend Framework", "{{be_framework}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["API Style", "{{api_style}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["Database", "{{database}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["Cache", "{{cache}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["File Storage", "{{storage}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["Authentication", "{{auth}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["Frontend Testing", "{{fe_test}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["Backend Testing", "{{be_test}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["E2E Testing", "{{e2e_test}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["Build Tool", "{{build_tool}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["Bundler", "{{bundler}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["IaC Tool", "{{iac_tool}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["CI/CD", "{{cicd}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["Monitoring", "{{monitoring}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["Logging", "{{logging}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
    - ["CSS Framework", "{{css_framework}}", "{{version}}", "{{purpose}}", "{{why_chosen}}"]
```

**20+ predefined rows** vs Backend template's 12-15 rows.

**Frontend-Specific Additions**:
- Frontend Language (often same as backend for TypeScript stacks)
- Frontend Framework (React, Vue, Angular, Svelte)
- UI Component Library (MUI, Chakra UI, shadcn/ui)
- State Management (Redux, Zustand, Jotai, TanStack Query)
- CSS Framework (Tailwind, Styled Components, CSS Modules)
- Bundler (Vite, Webpack, esbuild, Turbopack)

### API Specification (Multi-Style)

The Fullstack template supports **3 API styles** with conditional subsections:

```yaml
- id: api-spec
  title: API Specification
  instruction: |
    Based on the chosen API style from Tech Stack:

    1. If REST API, create an OpenAPI 3.0 specification
    2. If GraphQL, provide the GraphQL schema
    3. If tRPC, show router definitions
    [...]
  elicit: true
  sections:
    - id: rest-api
      title: REST API Specification
      condition: API style is REST
      type: code
      language: yaml
      template: |
        openapi: 3.0.0
        [...]

    - id: graphql-api
      title: GraphQL Schema
      condition: API style is GraphQL
      type: code
      language: graphql
      template: "{{graphql_schema}}"

    - id: trpc-api
      title: tRPC Router Definitions
      condition: API style is tRPC
      type: code
      language: typescript
      template: "{{trpc_routers}}"
```

**Key Innovation**: Explicit support for **tRPC**, a type-safe RPC framework popular in fullstack TypeScript apps.

**tRPC Example**:
```typescript
// packages/api/src/routers/user.ts
import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const userRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      return ctx.prisma.user.findUnique({ where: { id: input.id } });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: { id: input.id },
        data: input,
      });
    }),
});
```

---

## Key Sections Analysis

### Section 7: Frontend Architecture

**Entirely new section**, unique to Fullstack template:

```yaml
- id: frontend-architecture
  title: Frontend Architecture
  instruction: Define frontend-specific architecture details. After each
               subsection, note if user wants to refine before continuing.
  elicit: true
```

#### 7.1 Component Architecture

```yaml
- id: component-architecture
  title: Component Architecture
  instruction: Define component organization and patterns based on chosen framework.
  sections:
    - id: component-organization
      title: Component Organization
      type: code
      language: text
      template: "{{component_structure}}"
    - id: component-template
      title: Component Template
      type: code
      language: typescript
      template: "{{component_template}}"
```

**Example Component Organization**:
```
apps/web/src/
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── features/               # Feature-specific components
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   └── dashboard/
│   │       ├── StatsCard.tsx
│   │       └── RecentActivity.tsx
│   └── layouts/                # Layout components
│       ├── AppLayout.tsx
│       └── AuthLayout.tsx
```

**Example Component Template**:
```typescript
// apps/web/src/components/ui/Button.tsx
import { ButtonHTMLAttributes, FC } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

#### 7.2 State Management Architecture

```yaml
- id: state-management
  title: State Management Architecture
  instruction: Detail state management approach based on chosen solution.
  sections:
    - id: state-structure
      title: State Structure
      type: code
      language: typescript
      template: "{{state_structure}}"
    - id: state-patterns
      title: State Management Patterns
      type: bullet-list
      template: "- {{pattern}}"
```

**Example State Structure (Zustand)**:
```typescript
// packages/shared/src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({ user, accessToken: token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

#### 7.3 Routing Architecture

```yaml
- id: routing-architecture
  title: Routing Architecture
  instruction: Define routing structure based on framework choice.
  sections:
    - id: route-organization
      title: Route Organization
      type: code
      language: text
      template: "{{route_structure}}"
    - id: protected-routes
      title: Protected Route Pattern
      type: code
      language: typescript
      template: "{{protected_route_example}}"
```

**Example Route Organization (Next.js App Router)**:
```
apps/web/app/
├── (auth)/                     # Auth layout group
│   ├── login/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
├── (app)/                      # Main app layout group
│   ├── dashboard/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
├── api/                        # API routes
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts
└── layout.tsx                  # Root layout
```

#### 7.4 Frontend Services Layer

```yaml
- id: frontend-services
  title: Frontend Services Layer
  instruction: Define how frontend communicates with backend.
  sections:
    - id: api-client-setup
      title: API Client Setup
      type: code
      language: typescript
      template: "{{api_client_setup}}"
    - id: service-example
      title: Service Example
      type: code
      language: typescript
      template: "{{service_example}}"
```

**Example API Client Setup**:
```typescript
// packages/shared/src/lib/apiClient.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Section 8: Backend Architecture

**Entirely new section**, unique to Fullstack template:

```yaml
- id: backend-architecture
  title: Backend Architecture
  instruction: Define backend-specific architecture details. Consider serverless
               vs traditional server approaches.
  elicit: true
```

#### 8.1 Service Architecture (Conditional)

Supports **2 architectural styles** with conditional subsections:

**Serverless Architecture**:
```yaml
- id: serverless-architecture
  condition: Serverless architecture chosen
  sections:
    - id: function-organization
      title: Function Organization
      type: code
      language: text
      template: "{{function_structure}}"
    - id: function-template
      title: Function Template
      type: code
      language: typescript
      template: "{{function_template}}"
```

**Traditional Server Architecture**:
```yaml
- id: traditional-server
  condition: Traditional server architecture chosen
  sections:
    - id: controller-organization
      title: Controller/Route Organization
      type: code
      language: text
      template: "{{controller_structure}}"
    - id: controller-template
      title: Controller Template
      type: code
      language: typescript
      template: "{{controller_template}}"
```

#### 8.2 Database Architecture

```yaml
- id: database-architecture
  title: Database Architecture
  instruction: Define database schema and access patterns.
  sections:
    - id: schema-design
      title: Schema Design
      type: code
      language: sql
      template: "{{database_schema}}"
    - id: data-access-layer
      title: Data Access Layer
      type: code
      language: typescript
      template: "{{repository_pattern}}"
```

#### 8.3 Auth Architecture

```yaml
- id: auth-architecture
  title: Authentication and Authorization
  instruction: Define auth implementation details.
  sections:
    - id: auth-flow
      title: Auth Flow
      type: mermaid
      mermaid_type: sequence
      template: "{{auth_flow_diagram}}"
    - id: auth-middleware
      title: Middleware/Guards
      type: code
      language: typescript
      template: "{{auth_middleware}}"
```

**Example Auth Flow (Mermaid)**:
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant DB

    User->>Frontend: Enter credentials
    Frontend->>Backend: POST /api/auth/login
    Backend->>DB: Validate credentials
    DB-->>Backend: User found
    Backend->>Backend: Generate JWT
    Backend-->>Frontend: { accessToken, refreshToken, user }
    Frontend->>Frontend: Store tokens in state
    Frontend-->>User: Redirect to dashboard

    Note over Frontend,Backend: Subsequent requests

    User->>Frontend: Click protected resource
    Frontend->>Backend: GET /api/protected (with Bearer token)
    Backend->>Backend: Validate JWT
    Backend->>DB: Fetch resource
    DB-->>Backend: Resource data
    Backend-->>Frontend: Resource response
    Frontend-->>User: Display resource
```

### Section 9: Unified Project Structure

Replaces Backend template's "Source Tree" section with **monorepo-specific structure**:

```yaml
- id: unified-project-structure
  title: Unified Project Structure
  instruction: Create a monorepo structure that accommodates both frontend and
               backend. Adapt based on chosen tools and frameworks.
  elicit: true
  type: code
  language: plaintext
  examples:
    - |
      {{project-name}}/
      ├── .github/                    # CI/CD workflows
      │   └── workflows/
      │       ├── ci.yaml
      │       └── deploy.yaml
      ├── apps/                       # Application packages
      │   ├── web/                    # Frontend application
      │   │   ├── src/
      │   │   │   ├── components/     # UI components
      │   │   │   ├── pages/          # Page components/routes
      │   │   │   ├── hooks/          # Custom React hooks
      │   │   │   ├── services/       # API client services
      │   │   │   ├── stores/         # State management
      │   │   │   ├── styles/         # Global styles/themes
      │   │   │   └── utils/          # Frontend utilities
      │   │   ├── public/             # Static assets
      │   │   ├── tests/              # Frontend tests
      │   │   └── package.json
      │   └── api/                    # Backend application
      │       ├── src/
      │       │   ├── routes/         # API routes/controllers
      │       │   ├── services/       # Business logic
      │       │   ├── models/         # Data models
      │       │   ├── middleware/     # Express/API middleware
      │       │   ├── utils/          # Backend utilities
      │       │   └── {{serverless_or_server_entry}}
      │       ├── tests/              # Backend tests
      │       └── package.json
      ├── packages/                   # Shared packages
      │   ├── shared/                 # Shared types/utilities
      │   │   ├── src/
      │   │   │   ├── types/          # TypeScript interfaces
      │   │   │   ├── constants/      # Shared constants
      │   │   │   └── utils/          # Shared utilities
      │   │   └── package.json
      │   ├── ui/                     # Shared UI components
      │   │   ├── src/
      │   │   └── package.json
      │   └── config/                 # Shared configuration
      │       ├── eslint/
      │       ├── typescript/
      │       └── jest/
      ├── infrastructure/             # IaC definitions
      │   └── {{iac_structure}}
      ├── scripts/                    # Build/deploy scripts
      ├── docs/                       # Documentation
      │   ├── prd.md
      │   ├── front-end-spec.md
      │   └── fullstack-architecture.md
      ├── .env.example                # Environment template
      ├── package.json                # Root package.json
      ├── {{monorepo_config}}         # Monorepo configuration
      └── README.md
```

**Key Structure Elements**:
- **apps/**: Separate frontend (`web`) and backend (`api`) applications
- **packages/shared**: Shared TypeScript types, constants, utilities
- **packages/ui**: Shared UI components (if multiple frontends)
- **packages/config**: Shared tooling configs (ESLint, TypeScript, Jest)

### Section 11: Development Workflow

**Entirely new section**, critical for local development:

```yaml
- id: development-workflow
  title: Development Workflow
  instruction: Define the development setup and workflow for the fullstack
               application.
  elicit: true
```

#### 11.1 Local Development Setup

```yaml
- id: local-setup
  title: Local Development Setup
  sections:
    - id: prerequisites
      title: Prerequisites
      type: code
      language: bash
      template: "{{prerequisites_commands}}"
    - id: initial-setup
      title: Initial Setup
      type: code
      language: bash
      template: "{{setup_commands}}"
    - id: dev-commands
      title: Development Commands
      type: code
      language: bash
      template: |
        # Start all services
        {{start_all_command}}

        # Start frontend only
        {{start_frontend_command}}

        # Start backend only
        {{start_backend_command}}

        # Run tests
        {{test_commands}}
```

**Example Development Commands (Turborepo)**:
```bash
# Prerequisites
node --version   # v20.11.0 or higher
npm --version    # v10.2.0 or higher
docker --version # For local PostgreSQL

# Initial Setup
git clone <repo>
cd <repo>
npm install
cp .env.example .env.local
docker-compose up -d  # Start PostgreSQL + Redis
npm run db:migrate
npm run db:seed

# Start all services (parallel)
npm run dev
# Runs: turbo dev --parallel

# Start frontend only
npm run dev --filter=web

# Start backend only
npm run dev --filter=api

# Run tests
npm run test        # All tests
npm run test:web    # Frontend tests only
npm run test:api    # Backend tests only
npm run test:e2e    # E2E tests
```

#### 11.2 Environment Configuration

```yaml
- id: environment-config
  title: Environment Configuration
  sections:
    - id: env-vars
      title: Required Environment Variables
      type: code
      language: bash
      template: |
        # Frontend (.env.local)
        {{frontend_env_vars}}

        # Backend (.env)
        {{backend_env_vars}}

        # Shared
        {{shared_env_vars}}
```

**Example Environment Variables**:
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret-here
CORS_ORIGIN=http://localhost:3000

# Shared (both)
NODE_ENV=development
LOG_LEVEL=debug
```

### Section 12: Deployment Architecture

**Enhanced deployment section** with separate frontend/backend strategies:

```yaml
- id: deployment-architecture
  title: Deployment Architecture
  instruction: Define deployment strategy based on platform choice.
  elicit: true
  sections:
    - id: deployment-strategy
      title: Deployment Strategy
      template: |
        **Frontend Deployment:**
        - **Platform:** {{frontend_deploy_platform}}
        - **Build Command:** {{frontend_build_command}}
        - **Output Directory:** {{frontend_output_dir}}
        - **CDN/Edge:** {{cdn_strategy}}

        **Backend Deployment:**
        - **Platform:** {{backend_deploy_platform}}
        - **Build Command:** {{backend_build_command}}
        - **Deployment Method:** {{deployment_method}}
```

**Example Deployment Strategy (Vercel + Railway)**:
```markdown
**Frontend Deployment:**
- **Platform:** Vercel
- **Build Command:** `turbo build --filter=web`
- **Output Directory:** `apps/web/.next`
- **CDN/Edge:** Vercel Edge Network (global CDN)

**Backend Deployment:**
- **Platform:** Railway
- **Build Command:** `turbo build --filter=api`
- **Deployment Method:** Docker container from Dockerfile.api
```

#### 12.2 CI/CD Pipeline

```yaml
- id: cicd-pipeline
  title: CI/CD Pipeline
  type: code
  language: yaml
  template: "{{cicd_pipeline_config}}"
```

**Example CI/CD Pipeline (GitHub Actions with Turborepo)**:
```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build all packages
        run: npx turbo build

      - name: Run all tests
        run: npx turbo test

      - name: Run E2E tests
        run: npm run test:e2e

  deploy-frontend:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./apps/web

  deploy-backend:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: api
```

### Section 13: Security and Performance

**Split section** covering both frontend and backend concerns:

```yaml
- id: security-performance
  title: Security and Performance
  instruction: Define security and performance considerations for the fullstack
               application.
  elicit: true
  sections:
    - id: security-requirements
      title: Security Requirements
      template: |
        **Frontend Security:**
        - CSP Headers: {{csp_policy}}
        - XSS Prevention: {{xss_strategy}}
        - Secure Storage: {{storage_strategy}}

        **Backend Security:**
        - Input Validation: {{validation_approach}}
        - Rate Limiting: {{rate_limit_config}}
        - CORS Policy: {{cors_config}}

        **Authentication Security:**
        - Token Storage: {{token_strategy}}
        - Session Management: {{session_approach}}
        - Password Policy: {{password_requirements}}

    - id: performance-optimization
      title: Performance Optimization
      template: |
        **Frontend Performance:**
        - Bundle Size Target: {{bundle_size}}
        - Loading Strategy: {{loading_approach}}
        - Caching Strategy: {{fe_cache_strategy}}

        **Backend Performance:**
        - Response Time Target: {{response_target}}
        - Database Optimization: {{db_optimization}}
        - Caching Strategy: {{be_cache_strategy}}
```

**Example Security & Performance**:
```markdown
### Security Requirements

**Frontend Security:**
- CSP Headers: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'`
- XSS Prevention: React's built-in escaping + DOMPurify for user-generated HTML
- Secure Storage: HTTP-only cookies for refresh tokens, memory for access tokens (never localStorage)

**Backend Security:**
- Input Validation: Zod schemas at API boundary, whitelist approach
- Rate Limiting: 100 req/min per IP, 1000 req/hour per user
- CORS Policy: Whitelist `https://app.example.com`, no wildcard

**Authentication Security:**
- Token Storage: Refresh tokens in HTTP-only cookies, access tokens in memory
- Session Management: 15-minute access tokens, 7-day refresh tokens, automatic rotation
- Password Policy: Min 8 chars, upper+lower+number+special, bcrypt with 12 rounds

### Performance Optimization

**Frontend Performance:**
- Bundle Size Target: <200KB initial bundle, <500KB total
- Loading Strategy: Route-based code splitting, lazy loading for modals/heavy components
- Caching Strategy: Service worker for static assets, SWR for API data

**Backend Performance:**
- Response Time Target: p50 <100ms, p95 <500ms, p99 <1s
- Database Optimization: Indexed queries, connection pooling (max 20), read replicas for analytics
- Caching Strategy: Redis for session data (TTL 15min), API responses (TTL 5min), rate limit counters
```

### Section 14: Testing Strategy

**Enhanced testing section** with fullstack-specific guidance:

```yaml
- id: testing-strategy
  title: Testing Strategy
  instruction: Define comprehensive testing approach for fullstack application.
  elicit: true
  sections:
    - id: testing-pyramid
      title: Testing Pyramid
      type: code
      language: text
      template: |
        E2E Tests
        /        \
        Integration Tests
        /            \
        Frontend Unit  Backend Unit

    - id: test-organization
      title: Test Organization
      sections:
        - id: frontend-tests
          title: Frontend Tests
          type: code
          language: text
          template: "{{frontend_test_structure}}"
        - id: backend-tests
          title: Backend Tests
          type: code
          language: text
          template: "{{backend_test_structure}}"
        - id: e2e-tests
          title: E2E Tests
          type: code
          language: text
          template: "{{e2e_test_structure}}"
```

**Example Testing Pyramid**:
```
        E2E (10%)
       /         \
      /           \
     / Integration \
    /    (20%)     \
   /________________\
  /                  \
 /  Frontend (35%)    \
/   Backend (35%)      \
```

### Section 15: Coding Standards

**Fullstack-specific coding standards** with unified rules:

```yaml
- id: coding-standards
  title: Coding Standards
  instruction: Define MINIMAL but CRITICAL standards for AI agents. Focus only
               on project-specific rules that prevent common mistakes. These will
               be used by dev agents.
  elicit: true
  sections:
    - id: critical-rules
      title: Critical Fullstack Rules
      repeatable: true
      template: "- **{{rule_name}}:** {{rule_description}}"
      examples:
        - "**Type Sharing:** Always define types in packages/shared and import
           from there"
        - "**API Calls:** Never make direct HTTP calls - use the service layer"
        - "**Environment Variables:** Access only through config objects, never
           process.env directly"
        - "**Error Handling:** All API routes must use the standard error handler"
        - "**State Updates:** Never mutate state directly - use proper state
           management patterns"

    - id: naming-conventions
      title: Naming Conventions
      type: table
      columns: [Element, Frontend, Backend, Example]
      rows:
        - ["Components", "PascalCase", "-", "`UserProfile.tsx`"]
        - ["Hooks", "camelCase with 'use'", "-", "`useAuth.ts`"]
        - ["API Routes", "-", "kebab-case", "`/api/user-profile`"]
        - ["Database Tables", "-", "snake_case", "`user_profiles`"]
```

### Section 16: Monitoring and Observability

**Entirely new section**, unique to Fullstack template:

```yaml
- id: monitoring
  title: Monitoring and Observability
  instruction: Define monitoring strategy for fullstack application.
  elicit: true
  sections:
    - id: monitoring-stack
      title: Monitoring Stack
      template: |
        - **Frontend Monitoring:** {{frontend_monitoring}}
        - **Backend Monitoring:** {{backend_monitoring}}
        - **Error Tracking:** {{error_tracking}}
        - **Performance Monitoring:** {{perf_monitoring}}

    - id: key-metrics
      title: Key Metrics
      template: |
        **Frontend Metrics:**
        - Core Web Vitals
        - JavaScript errors
        - API response times
        - User interactions

        **Backend Metrics:**
        - Request rate
        - Error rate
        - Response time
        - Database query performance
```

**Example Monitoring Stack**:
```markdown
### Monitoring Stack

- **Frontend Monitoring:** Vercel Analytics + Sentry (errors)
- **Backend Monitoring:** Railway Metrics + DataDog (APM)
- **Error Tracking:** Sentry (unified for frontend + backend)
- **Performance Monitoring:** Lighthouse CI (frontend), DataDog APM (backend)

### Key Metrics

**Frontend Metrics:**
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1
- JavaScript errors: <0.1% error rate
- API response times: p95 <1s
- User interactions: Button clicks, form submissions, page views

**Backend Metrics:**
- Request rate: Requests per second per endpoint
- Error rate: HTTP 5xx responses <0.1%
- Response time: p50 <100ms, p95 <500ms, p99 <1s
- Database query performance: Slow queries (>100ms), connection pool usage
```

---

## Template Variables

The Fullstack Architecture Template uses **120+ template variables** (vs Backend's 70+):

### Platform & Infrastructure Variables
- `{{selected_platform}}` - Platform choice (Vercel, AWS, Azure, GCP)
- `{{core_services_list}}` - Key services used
- `{{regions}}` - Deployment regions
- `{{repo_structure_choice}}` - Monorepo or Polyrepo
- `{{monorepo_tool_if_applicable}}` - Nx, Turborepo, npm workspaces
- `{{package_strategy}}` - Package organization approach

### Tech Stack Variables (Extended)
All Backend template variables plus:
- `{{fe_language}}`, `{{fe_framework}}`, `{{ui_library}}` - Frontend stack
- `{{state_mgmt}}` - State management library
- `{{css_framework}}` - CSS framework (Tailwind, etc.)
- `{{bundler}}` - Build tool (Vite, Webpack, etc.)
- `{{frontend_deploy_platform}}`, `{{backend_deploy_platform}}` - Deployment platforms
- `{{frontend_monitoring}}`, `{{backend_monitoring}}` - Monitoring tools

### Frontend Architecture Variables
- `{{component_structure}}` - Component organization
- `{{component_template}}` - Component code template
- `{{state_structure}}` - State management structure
- `{{route_structure}}` - Routing organization
- `{{protected_route_example}}` - Protected route pattern
- `{{api_client_setup}}` - API client configuration
- `{{service_example}}` - API service example

### Backend Architecture Variables
- `{{function_structure}}` - Serverless function organization
- `{{function_template}}` - Function code template
- `{{controller_structure}}` - Controller organization (traditional)
- `{{controller_template}}` - Controller code template
- `{{database_schema}}` - Database schema
- `{{repository_pattern}}` - Data access layer pattern
- `{{auth_flow_diagram}}` - Auth flow Mermaid diagram
- `{{auth_middleware}}` - Auth middleware code

### Deployment Variables (Extended)
- `{{frontend_build_command}}`, `{{backend_build_command}}` - Build commands
- `{{frontend_output_dir}}` - Frontend build output
- `{{cdn_strategy}}` - CDN configuration
- `{{deployment_method}}` - Backend deployment method
- `{{cicd_pipeline_config}}` - CI/CD YAML configuration
- `{{dev_fe_url}}`, `{{dev_be_url}}` - Development URLs
- `{{staging_fe_url}}`, `{{staging_be_url}}` - Staging URLs
- `{{prod_fe_url}}`, `{{prod_be_url}}` - Production URLs

### Development Workflow Variables
- `{{prerequisites_commands}}` - Setup prerequisites
- `{{setup_commands}}` - Initial setup steps
- `{{start_all_command}}` - Start all services
- `{{start_frontend_command}}` - Start frontend only
- `{{start_backend_command}}` - Start backend only
- `{{test_commands}}` - Test commands
- `{{frontend_env_vars}}`, `{{backend_env_vars}}`, `{{shared_env_vars}}` - Environment variables

### Security & Performance Variables
- `{{csp_policy}}` - Content Security Policy
- `{{xss_strategy}}` - XSS prevention approach
- `{{storage_strategy}}` - Secure storage strategy
- `{{token_strategy}}` - Token storage approach
- `{{bundle_size}}` - Frontend bundle size target
- `{{loading_approach}}` - Frontend loading strategy
- `{{fe_cache_strategy}}`, `{{be_cache_strategy}}` - Caching strategies
- `{{response_target}}` - Backend response time target
- `{{db_optimization}}` - Database optimization approach

### Testing Variables (Extended)
- `{{frontend_test_structure}}` - Frontend test organization
- `{{backend_test_structure}}` - Backend test organization
- `{{e2e_test_structure}}` - E2E test organization
- `{{frontend_test_example}}` - Frontend test code
- `{{backend_test_example}}` - Backend test code
- `{{e2e_test_example}}` - E2E test code

---

## ADK Translation Recommendations

### Template Selection Logic (Enhanced)

```python
def select_architecture_template(
    project_type: str,
    has_ui: bool,
    has_backend: bool,
    ui_backend_coupling: str = "tight"
) -> str:
    """
    Select appropriate architecture template.

    Args:
        project_type: "greenfield" or "brownfield"
        has_ui: Whether project includes frontend
        has_backend: Whether project includes backend
        ui_backend_coupling: "tight" (same repo/stack) or "loose" (separate)

    Returns:
        Template ID
    """
    if project_type == "brownfield":
        return "brownfield-architecture-template-v2"

    if has_ui and has_backend:
        if ui_backend_coupling == "tight":
            # Monorepo, shared TypeScript, integrated deployment
            return "fullstack-architecture-template-v2"
        else:
            # Separate repos/teams, different stacks, independent deployment
            # Return both templates (orchestrate separately)
            return ["architecture-template-v2", "frontend-architecture-template-v2"]
    elif has_ui:
        return "frontend-architecture-template-v2"
    else:
        return "architecture-template-v2"
```

### Platform Detection

```python
def detect_platform_from_prd(prd_content: str) -> str:
    """
    Analyze PRD to suggest platform.

    Returns: "vercel", "aws", "azure", "gcp", or "unknown"
    """
    keywords = {
        "vercel": ["next.js", "vercel", "serverless functions", "edge"],
        "aws": ["aws", "lambda", "s3", "amplify", "cloudfront"],
        "azure": ["azure", ".net", "microsoft", "cosmos"],
        "gcp": ["google cloud", "firebase", "cloud run", "vertex ai"]
    }

    scores = {platform: 0 for platform in keywords}

    for platform, terms in keywords.items():
        for term in terms:
            if term.lower() in prd_content.lower():
                scores[platform] += 1

    if max(scores.values()) == 0:
        return "unknown"

    return max(scores, key=scores.get)
```

### Monorepo Tool Recommendation

```python
def recommend_monorepo_tool(
    team_size: int,
    project_complexity: str,  # "simple", "medium", "complex"
    platform: str
) -> str:
    """
    Recommend monorepo tool based on project characteristics.

    Returns: "nx", "turborepo", "npm-workspaces", or "lerna"
    """
    if platform == "vercel":
        # Vercel optimizes for Turborepo
        return "turborepo"

    if project_complexity == "complex" or team_size > 10:
        # Nx for large, complex projects
        return "nx"

    if project_complexity == "simple" and team_size < 5:
        # npm workspaces for simple projects
        return "npm-workspaces"

    # Default to Turborepo (good balance)
    return "turborepo"
```

### Fullstack-Specific Agent Tools

```python
fullstack_architect_tools = [
    {
        "name": "select_platform",
        "description": "Select fullstack platform (Vercel, AWS, Azure, GCP)",
        "parameters": {
            "platform": "vercel | aws | azure | gcp",
            "services": "array of service names",
            "rationale": "string"
        }
    },
    {
        "name": "configure_monorepo",
        "description": "Configure monorepo structure and tooling",
        "parameters": {
            "tool": "nx | turborepo | npm-workspaces",
            "apps": "array of app names (web, api, mobile, admin)",
            "packages": "array of package names (shared, ui, config)"
        }
    },
    {
        "name": "define_api_style",
        "description": "Define API communication pattern",
        "parameters": {
            "style": "rest | graphql | trpc",
            "rationale": "string"
        }
    },
    {
        "name": "configure_shared_types",
        "description": "Set up shared TypeScript types between frontend/backend",
        "parameters": {
            "location": "packages/shared/src/types",
            "generation_strategy": "manual | prisma | graphql-codegen"
        }
    }
]
```

---

## Summary

The **Fullstack Architecture Template** is the **most comprehensive template** in the BMad framework:

- **825 lines** of YAML (26% larger than Backend template)
- **76+ sections** covering frontend, backend, and integration
- **18 elicitation points** for thorough user validation
- **6 conditional sections** for architectural variations
- **120+ template variables** for dynamic content
- **Platform-first decision making** with 4 common platform patterns
- **Monorepo-centric design** with explicit tooling guidance
- **Unified approach** for tightly-coupled fullstack applications
- **Enhanced deployment** with separate frontend/backend strategies
- **Comprehensive monitoring** for both frontend and backend

**Key Innovations**:
1. **Unified Architecture**: Single document for frontend + backend
2. **Platform-First**: Platform selection drives all decisions
3. **Monorepo Tooling**: Explicit guidance on Nx, Turborepo, npm workspaces
4. **API Style Flexibility**: REST, GraphQL, and tRPC support
5. **Development Workflow**: Complete local dev setup guidance
6. **Split Security/Performance**: Separate frontend and backend concerns
7. **Fullstack Testing**: Integrated testing pyramid with E2E focus

**Next**: [Section 4 - Frontend & Brownfield Architecture](architecture-templates-section4.md) analyzes the specialized frontend and brownfield enhancement templates.

---

[← Section 2](architecture-templates-section2.md) | **Current**: Section 3 | **Next**: [Section 4 →](architecture-templates-section4.md)
