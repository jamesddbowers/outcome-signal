# 14. Testing Strategy

## 14.1 Testing Pyramid

```
     /\      E2E Tests (10 critical flows)
    /  \     Integration Tests (50+ API routes)
   /____\    Unit Tests (200+ components/utils)
```

## 14.2 Unit Testing (Vitest)

```typescript
describe('LeftPanel', () => {
  it('renders initiative hierarchy', async () => {
    render(<LeftPanel initiativeId="test-id" />, {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      expect(screen.getByText('Customer Portal MVP')).toBeInTheDocument();
    });
  });
});
```

## 14.3 API Route Testing

```typescript
describe('POST /api/initiatives', () => {
  it('creates initiative successfully', async () => {
    vi.mocked(auth).mockReturnValue({ userId: 'user-123' });

    const request = new Request('http://localhost/api/initiatives', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

## 14.4 E2E Testing (Playwright)

```typescript
test('user can create initiative', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('button:has-text("Create Initiative")');
  await page.fill('input[name="title"]', 'E2E Test');
  await page.click('button:has-text("Create")');
  await page.waitForURL(/\/initiatives\/.+/);
});
```

## 14.5 Coverage Targets

- Unit Tests: >80%
- Integration Tests: >70%
- E2E Tests: 10 critical flows

---
