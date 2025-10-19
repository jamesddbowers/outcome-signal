import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Agent Chat Interface
 *
 * Note: These tests verify the basic chat UI functionality.
 * Agent response functionality will be tested in future stories
 * when Google ADK integration is complete.
 */

test.describe('Agent Chat Interface', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Add authentication setup when available
    // For now, assume user is authenticated or mock auth
  });

  test('displays chat interface in right panel', async ({ page }) => {
    // Navigate to a workspace with an initiative
    // TODO: Update with actual route when available
    await page.goto('/dashboard');

    // Verify chat input is present
    const chatInput = page.getByTestId('chat-input');
    await expect(chatInput).toBeVisible();

    const sendButton = page.getByTestId('send-button');
    await expect(sendButton).toBeVisible();
  });

  test('sends a message successfully', async ({ page }) => {
    await page.goto('/dashboard');

    const chatInput = page.getByTestId('chat-input');
    const sendButton = page.getByTestId('send-button');

    // Type a message
    await chatInput.fill('Hello, this is a test message');

    // Send button should be enabled
    await expect(sendButton).toBeEnabled();

    // Click send
    await sendButton.click();

    // Input should be cleared
    await expect(chatInput).toHaveValue('');

    // TODO: Verify message appears in chat (requires database setup)
  });

  test('Enter key sends message', async ({ page }) => {
    await page.goto('/dashboard');

    const chatInput = page.getByTestId('chat-input');

    await chatInput.fill('Test message via Enter key');
    await chatInput.press('Enter');

    // Input should be cleared
    await expect(chatInput).toHaveValue('');
  });

  test('Shift+Enter creates newline without sending', async ({ page }) => {
    await page.goto('/dashboard');

    const chatInput = page.getByTestId('chat-input');

    await chatInput.fill('Line 1');
    await chatInput.press('Shift+Enter');
    await chatInput.type('Line 2');

    const value = await chatInput.inputValue();
    expect(value).toContain('\n');
  });

  test('send button is disabled when input is empty', async ({ page }) => {
    await page.goto('/dashboard');

    const sendButton = page.getByTestId('send-button');

    // Button should be disabled initially
    await expect(sendButton).toBeDisabled();
  });

  test('send button is disabled for whitespace-only input', async ({ page }) => {
    await page.goto('/dashboard');

    const chatInput = page.getByTestId('chat-input');
    const sendButton = page.getByTestId('send-button');

    await chatInput.fill('   ');

    await expect(sendButton).toBeDisabled();
  });

  test('displays empty state when no messages', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for empty state message
    const emptyState = page.getByText('No messages yet. Start a conversation!');
    await expect(emptyState).toBeVisible();
  });

  test('accessibility: keyboard navigation works', async ({ page }) => {
    await page.goto('/dashboard');

    // Tab to chat input
    await page.keyboard.press('Tab');

    const chatInput = page.getByTestId('chat-input');
    await expect(chatInput).toBeFocused();

    // Tab to send button
    await page.keyboard.press('Tab');

    const sendButton = page.getByTestId('send-button');
    await expect(sendButton).toBeFocused();
  });

  test('accessibility: has proper ARIA labels', async ({ page }) => {
    await page.goto('/dashboard');

    // Check send button has aria-label
    const sendButton = page.getByLabel('Send message');
    await expect(sendButton).toBeVisible();

    // Check chat messages container has proper role
    // (will be visible once messages exist)
  });

  test('accessibility: screen reader announcements present', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for live region for screen reader announcements
    const liveRegion = page.locator('[role="status"][aria-live="polite"]');
    await expect(liveRegion).toBeAttached();
  });
});

/**
 * Future E2E Tests (to be implemented when agent responses are available):
 * - test('receives agent response after sending message')
 * - test('typing indicator shows when agent is responding')
 * - test('realtime updates work across browser tabs')
 * - test('scroll behavior with multiple messages')
 * - test('message persistence across page refresh')
 */
