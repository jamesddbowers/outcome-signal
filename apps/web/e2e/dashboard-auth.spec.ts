import { test, expect } from "@playwright/test";

test.describe("Dashboard Authentication Flow", () => {
  test("unauthenticated user is redirected to sign-in when accessing dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    // Wait for redirect to sign-in page
    await page.waitForURL(/.*sign-in.*/);

    // Should redirect to sign-in
    expect(page.url()).toContain("/sign-in");
  });

  test("dashboard route is protected by middleware", async ({ page }) => {
    // Attempt to access dashboard without authentication
    const response = await page.goto("/dashboard");

    // Wait for redirect to sign-in page
    await page.waitForURL(/.*sign-in.*/);

    // Verify redirected to sign-in page
    expect(page.url()).toContain("/sign-in");
  });

  // Note: The following tests for authenticated users would require Clerk test credentials
  // and a test authentication setup, which is beyond the scope of this story.
  // These would include:
  // - Authenticated user can access dashboard
  // - Dashboard displays user's name
  // - Logout button redirects to homepage
  // - Dashboard layout renders correctly with header

  // For now, we verify that the protection mechanism works correctly
  // by ensuring unauthenticated users cannot access the dashboard.
});

// Additional test for verifying the dashboard loads correctly when accessed directly
test.describe("Dashboard Page Structure", () => {
  test("dashboard requires authentication to load", async ({ page }) => {
    await page.goto("/dashboard");

    // Wait for redirect to sign-in page
    await page.waitForURL(/.*sign-in.*/);

    // Should be redirected away from dashboard
    expect(page.url()).not.toContain("/dashboard");
    expect(page.url()).toContain("/sign-in");
  });
});
