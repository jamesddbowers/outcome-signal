# 11. Backend Architecture Details

## 11.1 Next.js API Routes Pattern

**File Structure:**
```
app/api/
├── initiatives/
│   ├── route.ts                    # GET, POST /api/initiatives
│   └── [initiativeId]/
│       └── route.ts                # GET, PATCH /api/initiatives/:id
├── workflows/
│   ├── generate-document/
│   │   └── route.ts                # POST trigger workflow
│   └── [workflowId]/
│       └── status/
│           └── route.ts            # GET workflow status
```

## 11.2 Authentication Middleware

```typescript
import { auth } from '@clerk/nextjs';

export async function GET(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  // Proceed with authenticated request
}
```

## 11.3 Validation with Zod

```typescript
const createInitiativeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
});

const validation = createInitiativeSchema.safeParse(body);
if (!validation.success) {
  return NextResponse.json({ error: validation.error }, { status: 400 });
}
```

---
