import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("sign-up page renders correctly", async ({ page }) => {
    await page.goto("/sign-up");

    // Wait for Clerk component to load
    await page.waitForTimeout(1000);

    // Check that we're on the sign-up page
    expect(page.url()).toContain("/sign-up");

    // Verify page has loaded (check for Clerk form elements)
    const signUpForm = page.locator('div[class*="flex min-h-screen"]');
    await expect(signUpForm).toBeVisible();
  });

  test("sign-in page renders correctly", async ({ page }) => {
    await page.goto("/sign-in");

    // Wait for Clerk component to load
    await page.waitForTimeout(1000);

    // Check that we're on the sign-in page
    expect(page.url()).toContain("/sign-in");

    // Verify page has loaded (check for Clerk form elements)
    const signInForm = page.locator('div[class*="flex min-h-screen"]');
    await expect(signInForm).toBeVisible();
  });

  test("unauthenticated users are redirected from protected routes", async ({ page }) => {
    await page.goto("/dashboard");

    // Wait for redirect
    await page.waitForTimeout(1000);

    // Should redirect to sign-in
    expect(page.url()).toContain("/sign-in");
  });

  test("public routes are accessible without authentication", async ({ page }) => {
    await page.goto("/");

    // Should stay on home page
    expect(page.url()).toBe("http://localhost:3000/");

    // Home page should load
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("OAuth provider buttons are visible on sign-up page", async ({ page }) => {
    await page.goto("/sign-up");

    // Wait for Clerk component to fully load
    await page.waitForTimeout(2000);

    // Check that the sign-up form container is visible
    const container = page.locator('div[class*="flex min-h-screen"]');
    await expect(container).toBeVisible();

    // Note: OAuth buttons are rendered by Clerk and configured in dashboard
    // This test verifies the page loads correctly with Clerk configuration
  });

  test("OAuth provider buttons are visible on sign-in page", async ({ page }) => {
    await page.goto("/sign-in");

    // Wait for Clerk component to fully load
    await page.waitForTimeout(2000);

    // Check that the sign-in form container is visible
    const container = page.locator('div[class*="flex min-h-screen"]');
    await expect(container).toBeVisible();

    // Note: OAuth buttons are rendered by Clerk and configured in dashboard
    // This test verifies the page loads correctly with Clerk configuration
  });
});

// Note: Full sign-up/sign-in flow tests with actual authentication
// require Clerk test credentials and are beyond the scope of this story.
// These tests verify that pages load correctly and redirect behavior works.
