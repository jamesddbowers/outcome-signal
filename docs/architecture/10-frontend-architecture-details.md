# 10. Frontend Architecture Details

## 10.1 Next.js App Router Structure

```
apps/web/app/
├── layout.tsx                      # Root layout (providers)
├── (auth)/                         # Auth route group
│   ├── sign-in/[[...sign-in]]/
│   └── sign-up/[[...sign-up]]/
├── (dashboard)/                    # Dashboard route group
│   ├── layout.tsx                  # Dashboard layout
│   ├── initiatives/
│   │   └── [initiativeId]/
│   │       └── page.tsx            # Three-column workspace
│   └── settings/
└── api/                            # API Routes
```

## 10.2 React Server Components vs Client Components

**Server Components (default):**
- Layouts, static pages
- Data fetching shells

**Client Components (`'use client'`):**
- Three-column workspace
- Forms, interactive UI
- Real-time components

## 10.3 Data Fetching Patterns

**React Query Hooks:**
```typescript
export function useInitiative(initiativeId: string) {
  return useQuery({
    queryKey: ['initiative', initiativeId],
    queryFn: () => fetchInitiative(initiativeId),
  });
}
```

**Supabase Realtime:**
```typescript
useEffect(() => {
  const channel = supabase
    .channel(`workflow:${workflowId}`)
    .on('postgres_changes', { ... }, (payload) => {
      queryClient.invalidateQueries(['workflow', workflowId]);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [workflowId]);
```

---
