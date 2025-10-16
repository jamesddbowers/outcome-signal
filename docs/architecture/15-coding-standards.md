# 15. Coding Standards

## 15.1 TypeScript Standards

**tsconfig.json (Strict Mode):**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Type Safety Rules:**
```typescript
// ✅ DO: Explicit return types
export function checkLimits(): Promise<{ allowed: boolean }> { }

// ❌ DON'T: Use any
const data: any = await fetch();

// ✅ DO: Use unknown and type guards
const data: unknown = await fetch();
if (isValidData(data)) { }
```

## 15.2 File Naming Conventions

- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Hooks: `useHookName.ts`
- Constants: `SCREAMING_SNAKE_CASE.ts`

## 15.3 Component Structure

```tsx
// 1. Imports
// 2. Props interface
// 3. Component
// 4. Hooks (state, effects, queries)
// 5. Event handlers
// 6. Render guards
// 7. Main render
```

---
