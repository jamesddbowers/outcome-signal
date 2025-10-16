# 6. Components Architecture

## 6.1 Component Hierarchy

```
apps/web/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth routes
│   ├── (dashboard)/              # Authenticated routes
│   │   └── initiatives/[id]/     # Three-column workspace
│   └── api/                      # API Routes
│
├── components/
│   ├── workspace/                # Three-column workspace
│   │   ├── WorkspaceShell.tsx
│   │   ├── LeftPanel.tsx         # Hierarchy tree
│   │   ├── MiddlePanel.tsx       # Document preview
│   │   └── RightPanel.tsx        # Agent chat
│   │
│   ├── hierarchy/                # Left panel components
│   ├── preview/                  # Middle panel components
│   │   └── TipTapEditor.tsx
│   ├── chat/                     # Right panel components
│   │   └── WorkflowProgress.tsx
│   └── ui/                       # shadcn/ui primitives
```

## 6.2 Key Components

**WorkspaceShell** - Main three-column layout:
```tsx
<div className="grid grid-cols-[300px_1fr_400px] h-screen">
  <LeftPanel initiativeId={initiativeId} />
  <MiddlePanel initiativeId={initiativeId} />
  <RightPanel initiativeId={initiativeId} />
</div>
```

**Responsive Behavior:**
- Desktop (≥1440px): Three columns visible
- Tablet (768px-1439px): Middle + Right, Left collapses
- Mobile (<768px): Single column, swipe navigation

---
