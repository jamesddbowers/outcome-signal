# Outcome Signal

An AI-powered product planning and development platform that helps teams move from idea to shipped product.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Monorepo**: Turborepo with pnpm workspaces

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Supabase CLI (for database migrations)

### Environment Variables

Create `apps/web/.env.local` with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_CLI_PASSWORD=your-database-password
```

### Installation

```bash
# Install dependencies
pnpm install

# Run database migrations
supabase link --project-ref <your-project-ref> -p <your-db-password>
supabase db push -p <your-db-password>

# Generate TypeScript types from database
supabase gen types typescript --linked > apps/web/lib/supabase/database.types.ts

# Start development server
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Database Setup

### Supabase Configuration

1. **Create a Supabase project**: Visit [supabase.com](https://supabase.com) and create a new project
2. **Set region**: Use `us-east-1` for optimal performance with Vercel
3. **Get credentials**: Navigate to Project Settings > API to get:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - Anon/public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Service role key (`SUPABASE_SERVICE_ROLE_KEY`)

### Running Migrations

Database migrations are managed using Supabase CLI:

```bash
# Link to your Supabase project (one-time setup)
supabase link --project-ref <project-ref> -p <db-password>

# Apply migrations to remote database
supabase db push -p <db-password>

# Generate TypeScript types after schema changes
supabase gen types typescript --linked > apps/web/lib/supabase/database.types.ts
```

### Database Schema

The database includes the following tables:
- `users` - User profiles synced from Clerk
- `subscriptions` - Subscription tiers and billing
- `initiatives` - User projects/products being planned
- `documents` - AI-generated planning documents (PRD, architecture, etc.)
- `workflow_executions` - Long-running AI workflow tracking

All tables have Row-Level Security (RLS) enabled for multi-tenant data isolation.

### Accessing Supabase Dashboard

- **SQL Editor**: [https://supabase.com/dashboard/project/<project-ref>/sql](https://supabase.com/dashboard/project/<project-ref>/sql)
- **Table Editor**: [https://supabase.com/dashboard/project/<project-ref>/editor](https://supabase.com/dashboard/project/<project-ref>/editor)
- **Database Policies**: [https://supabase.com/dashboard/project/<project-ref>/auth/policies](https://supabase.com/dashboard/project/<project-ref>/auth/policies)

## Development

### Available Commands

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Run linting
pnpm lint
```

### Project Structure

```
apps/
  web/                      # Next.js application
    app/                    # App Router pages
    lib/
      supabase/            # Supabase client utilities
        client.ts          # Browser client
        server.ts          # Server-side client
        database.types.ts  # Auto-generated types
packages/
  config/                  # Shared configuration
  ui/                      # Shared UI components
supabase/
  migrations/              # Database migrations
```

## Troubleshooting

### Common Issues

#### "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL"
Ensure `.env.local` exists in `apps/web/` with all required Supabase variables.

#### "Password authentication failed" during migrations
Verify your database password in `SUPABASE_CLI_PASSWORD` and use the `-p` flag with `supabase db push`.

#### TypeScript errors with database types
Regenerate types after schema changes:
```bash
supabase gen types typescript --linked > apps/web/lib/supabase/database.types.ts
```

#### RLS policy errors
Ensure Clerk JWT is being passed to Supabase. RLS policies extract `clerk_user_id` from `auth.jwt() ->> 'sub'`.
