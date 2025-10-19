import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Responsive Workspace Behavior
 *
 * Tests all three responsive breakpoints:
 * - Mobile (<768px): Single-column tabs layout
 * - Tablet (768px-1023px): Drawer + side-by-side panels
 * - Desktop (≥1024px): Three-column resizable layout
 */

test.describe('Responsive Workspace - Mobile (<768px)', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test.beforeEach(async ({ page }) => {
    // TODO: Add proper authentication when available
    // For now, navigate directly to workspace
    await page.goto('/dashboard/initiatives/test-id');
  });

  test('shows tabs navigation on mobile', async ({ page }) => {
    // Verify all three tabs are visible
    await expect(page.getByRole('tab', { name: 'Hierarchy' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Document' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Chat' })).toBeVisible();

    // Verify default tab (Document) is active
    const documentTab = page.getByRole('tab', { name: 'Document' });
    await expect(documentTab).toHaveAttribute('data-state', 'active');
  });

  test('switches between tabs on mobile', async ({ page }) => {
    // Click Chat tab
    await page.click('button[role="tab"]:has-text("Chat")');

    // Verify Chat tab is active
    const chatTab = page.getByRole('tab', { name: 'Chat' });
    await expect(chatTab).toHaveAttribute('data-state', 'active');

    // Click Hierarchy tab
    await page.click('button[role="tab"]:has-text("Hierarchy")');

    // Verify Hierarchy tab is active
    const hierarchyTab = page.getByRole('tab', { name: 'Hierarchy' });
    await expect(hierarchyTab).toHaveAttribute('data-state', 'active');

    // Return to Document tab
    await page.click('button[role="tab"]:has-text("Document")');
    const documentTab = page.getByRole('tab', { name: 'Document' });
    await expect(documentTab).toHaveAttribute('data-state', 'active');
  });

  test('tab content is visible when selected', async ({ page }) => {
    // Document tab should show TipTap editor
    await page.click('button[role="tab"]:has-text("Document")');
    const documentPanel = page.getByRole('tabpanel').first();
    await expect(documentPanel).toBeVisible();

    // Chat tab should show chat interface
    await page.click('button[role="tab"]:has-text("Chat")');
    const chatInput = page.getByTestId('chat-input');
    await expect(chatInput).toBeVisible();

    // Hierarchy tab should show AppSidebar
    await page.click('button[role="tab"]:has-text("Hierarchy")');
    // AppSidebar should be in the visible tabpanel
    const hierarchyPanel = page.getByRole('tabpanel').first();
    await expect(hierarchyPanel).toBeVisible();
  });

  test('touch targets are at least 44px', async ({ page }) => {
    // Get tab button bounding boxes
    const hierarchyTab = page.getByRole('tab', { name: 'Hierarchy' });
    const documentTab = page.getByRole('tab', { name: 'Document' });
    const chatTab = page.getByRole('tab', { name: 'Chat' });

    const hierarchyBox = await hierarchyTab.boundingBox();
    const documentBox = await documentTab.boundingBox();
    const chatBox = await chatTab.boundingBox();

    // Verify all tabs meet 44px height requirement
    expect(hierarchyBox?.height).toBeGreaterThanOrEqual(44);
    expect(documentBox?.height).toBeGreaterThanOrEqual(44);
    expect(chatBox?.height).toBeGreaterThanOrEqual(44);

    // Verify tabs are wide enough (should span grid)
    expect(hierarchyBox?.width).toBeGreaterThanOrEqual(44);
    expect(documentBox?.width).toBeGreaterThanOrEqual(44);
    expect(chatBox?.width).toBeGreaterThanOrEqual(44);
  });

  test('PhaseIndicator is visible on mobile', async ({ page }) => {
    // PhaseIndicator should be at top of mobile layout
    const phaseIndicator = page.locator('div').filter({ hasText: /Phase/i }).first();
    await expect(phaseIndicator).toBeVisible();
  });

  test('desktop panels are hidden on mobile', async ({ page }) => {
    // Verify PanelGroup is not visible
    const panelGroup = page.locator('[data-panel-group]');
    await expect(panelGroup).not.toBeVisible();

    // Verify Sheet drawer trigger is not visible
    const hamburgerButton = page.getByLabel('Open hierarchy menu');
    await expect(hamburgerButton).not.toBeVisible();
  });
});

test.describe('Responsive Workspace - Tablet (768px-1023px)', () => {
  test.use({ viewport: { width: 768, height: 1024 } }); // iPad

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/initiatives/test-id');
  });

  test('shows hamburger menu for hierarchy on tablet', async ({ page }) => {
    // Verify hamburger button is visible
    const hamburger = page.getByLabel('Open hierarchy menu');
    await expect(hamburger).toBeVisible();

    // Click to open drawer
    await hamburger.click();

    // Verify Sheet dialog appears
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Verify AppSidebar is in drawer (Sheet has width class)
    const sheetContent = page.locator('[role="dialog"] > div');
    await expect(sheetContent).toHaveClass(/w-\[300px\]|w-\[400px\]/);
  });

  test('hamburger button meets 44px touch target size', async ({ page }) => {
    const hamburger = page.getByLabel('Open hierarchy menu');
    const box = await hamburger.boundingBox();

    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  });

  test('middle and right panels are side-by-side on tablet', async ({ page }) => {
    // Verify PanelGroup is visible
    const panelGroup = page.locator('[data-panel-group]');
    await expect(panelGroup).toBeVisible();

    // Middle panel should be visible
    const middlePanel = page.locator('[data-panel-id="middle"]');
    await expect(middlePanel).toBeVisible();

    // Right panel should be visible
    const rightPanel = page.locator('[data-panel-id="right"]');
    await expect(rightPanel).toBeVisible();
  });

  test('left panel is hidden on tablet', async ({ page }) => {
    // Desktop left panel should not be visible
    const leftPanel = page.locator('[data-panel-id="left"]');
    await expect(leftPanel).not.toBeVisible();
  });

  test('drawer can be opened and closed on tablet', async ({ page }) => {
    const hamburger = page.getByLabel('Open hierarchy menu');

    // Open drawer
    await hamburger.click();
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Close drawer using ESC
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    // Open again
    await hamburger.click();
    await expect(dialog).toBeVisible();

    // Close using overlay click (if overlay exists)
    const overlay = page.locator('[data-radix-dialog-overlay]');
    if (await overlay.isVisible()) {
      await overlay.click({ position: { x: 5, y: 5 } });
      await expect(dialog).not.toBeVisible();
    }
  });

  test('mobile tabs are hidden on tablet', async ({ page }) => {
    // Tabs component should not be visible
    const tabsList = page.locator('[role="tablist"]');
    await expect(tabsList).not.toBeVisible();
  });

  test('PhaseIndicator is visible on tablet', async ({ page }) => {
    const phaseIndicator = page.locator('div').filter({ hasText: /Phase/i }).first();
    await expect(phaseIndicator).toBeVisible();
  });
});

test.describe('Responsive Workspace - Desktop (≥1024px)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/initiatives/test-id');
  });

  test('shows all three columns on desktop', async ({ page }) => {
    // Verify all three panels are visible
    const leftPanel = page.locator('[data-panel-id="left"]');
    const middlePanel = page.locator('[data-panel-id="middle"]');
    const rightPanel = page.locator('[data-panel-id="right"]');

    await expect(leftPanel).toBeVisible();
    await expect(middlePanel).toBeVisible();
    await expect(rightPanel).toBeVisible();
  });

  test('can collapse and expand left panel', async ({ page }) => {
    const collapseButton = page.getByLabel('Collapse left panel');
    await expect(collapseButton).toBeVisible();

    // Collapse panel
    await collapseButton.click();

    // Verify panel is collapsed (expand button should appear)
    const expandButton = page.getByLabel('Expand left panel');
    await expect(expandButton).toBeVisible();

    // Verify vertical "Hierarchy" text is visible when collapsed
    const verticalText = page.locator('div').filter({ hasText: 'Hierarchy' }).first();
    await expect(verticalText).toBeVisible();

    // Expand again
    await expandButton.click();
    await expect(collapseButton).toBeVisible();
  });

  test('can collapse and expand right panel', async ({ page }) => {
    const collapseButton = page.getByLabel('Collapse right panel');
    await expect(collapseButton).toBeVisible();

    // Collapse panel
    await collapseButton.click();

    // Verify panel is collapsed (expand button should appear)
    const expandButton = page.getByLabel('Expand right panel');
    await expect(expandButton).toBeVisible();

    // Verify vertical "Agent Chat" text is visible when collapsed
    const verticalText = page.locator('div').filter({ hasText: 'Agent Chat' }).first();
    await expect(verticalText).toBeVisible();

    // Expand again
    await expandButton.click();
    await expect(collapseButton).toBeVisible();
  });

  test('collapse/expand buttons meet 44px touch target size', async ({ page }) => {
    // Left panel collapse button
    const leftCollapseButton = page.getByLabel('Collapse left panel');
    const leftBox = await leftCollapseButton.boundingBox();
    expect(leftBox?.height).toBeGreaterThanOrEqual(44);
    expect(leftBox?.width).toBeGreaterThanOrEqual(44);

    // Right panel collapse button
    const rightCollapseButton = page.getByLabel('Collapse right panel');
    const rightBox = await rightCollapseButton.boundingBox();
    expect(rightBox?.height).toBeGreaterThanOrEqual(44);
    expect(rightBox?.width).toBeGreaterThanOrEqual(44);
  });

  test('resize handles are present', async ({ page }) => {
    // Verify panel resize handles exist
    const panelGroup = page.locator('[data-panel-group]');
    await expect(panelGroup).toBeVisible();

    // Resize handles should be present (react-resizable-panels creates them)
    const resizeHandles = page.locator('[data-panel-resize-handle-id]');
    const handleCount = await resizeHandles.count();

    // Should have at least 2 resize handles (left-middle, middle-right)
    expect(handleCount).toBeGreaterThanOrEqual(2);
  });

  test('mobile tabs and tablet drawer are hidden on desktop', async ({ page }) => {
    // Tabs should not be visible
    const tabsList = page.locator('[role="tablist"]');
    await expect(tabsList).not.toBeVisible();

    // Hamburger menu should not be visible
    const hamburger = page.getByLabel('Open hierarchy menu');
    await expect(hamburger).not.toBeVisible();
  });

  test('PhaseIndicator is visible on desktop', async ({ page }) => {
    const phaseIndicator = page.locator('div').filter({ hasText: /Phase/i }).first();
    await expect(phaseIndicator).toBeVisible();
  });

  test('all panels have content', async ({ page }) => {
    // Left panel: AppSidebar should be present
    const leftPanel = page.locator('[data-panel-id="left"]');
    const leftContent = leftPanel.locator('*').first();
    await expect(leftContent).toBeVisible();

    // Middle panel: TipTap editor should be present
    const middlePanel = page.locator('[data-panel-id="middle"]');
    const middleContent = middlePanel.locator('*').first();
    await expect(middleContent).toBeVisible();

    // Right panel: Chat interface should be present
    const rightPanel = page.locator('[data-panel-id="right"]');
    const chatInput = rightPanel.getByTestId('chat-input');
    await expect(chatInput).toBeVisible();
  });
});

test.describe('Responsive Edge Cases', () => {
  test('handles landscape orientation on mobile', async ({ page }) => {
    // Landscape iPhone SE
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('/dashboard/initiatives/test-id');

    // Verify tabs still work
    await expect(page.getByRole('tab', { name: 'Document' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Chat' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Hierarchy' })).toBeVisible();

    // Verify tab switching still works
    await page.click('button[role="tab"]:has-text("Chat")');
    const chatTab = page.getByRole('tab', { name: 'Chat' });
    await expect(chatTab).toHaveAttribute('data-state', 'active');
  });

  test('handles very small viewport (320px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/dashboard/initiatives/test-id');

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow 1px tolerance

    // Verify tabs are still visible and functional
    await expect(page.getByRole('tab', { name: 'Document' })).toBeVisible();
  });

  test('handles transition between breakpoints', async ({ page }) => {
    // Start at desktop size
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/dashboard/initiatives/test-id');

    // Verify desktop layout
    const leftPanel = page.locator('[data-panel-id="left"]');
    await expect(leftPanel).toBeVisible();

    // Resize to tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(300); // Allow for transition

    // Verify tablet layout
    await expect(leftPanel).not.toBeVisible();
    const hamburger = page.getByLabel('Open hierarchy menu');
    await expect(hamburger).toBeVisible();

    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300); // Allow for transition

    // Verify mobile layout
    await expect(hamburger).not.toBeVisible();
    await expect(page.getByRole('tab', { name: 'Document' })).toBeVisible();
  });

  test('viewport rotation maintains functionality', async ({ page }) => {
    // Portrait mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard/initiatives/test-id');

    // Verify tabs work in portrait
    await page.click('button[role="tab"]:has-text("Chat")');
    let chatTab = page.getByRole('tab', { name: 'Chat' });
    await expect(chatTab).toHaveAttribute('data-state', 'active');

    // Rotate to landscape
    await page.setViewportSize({ width: 667, height: 375 });

    // Verify Chat tab is still active after rotation
    chatTab = page.getByRole('tab', { name: 'Chat' });
    await expect(chatTab).toHaveAttribute('data-state', 'active');

    // Verify can still switch tabs
    await page.click('button[role="tab"]:has-text("Document")');
    const documentTab = page.getByRole('tab', { name: 'Document' });
    await expect(documentTab).toHaveAttribute('data-state', 'active');
  });

  test('handles tablet in landscape', async ({ page }) => {
    // iPad in landscape
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/dashboard/initiatives/test-id');

    // Should show tablet drawer layout (not desktop panels)
    const hamburger = page.getByLabel('Open hierarchy menu');
    await expect(hamburger).toBeVisible();

    // Middle and right panels should be visible
    const middlePanel = page.locator('[data-panel-id="middle"]');
    const rightPanel = page.locator('[data-panel-id="right"]');
    await expect(middlePanel).toBeVisible();
    await expect(rightPanel).toBeVisible();
  });
});

test.describe('Responsive Keyboard Navigation', () => {
  test('mobile tabs keyboard navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard/initiatives/test-id');

    // Focus first tab
    const firstTab = page.getByRole('tab', { name: 'Hierarchy' });
    await firstTab.focus();

    // Use arrow keys to navigate
    await page.keyboard.press('ArrowRight');
    const documentTab = page.getByRole('tab', { name: 'Document' });
    await expect(documentTab).toBeFocused();

    await page.keyboard.press('ArrowRight');
    const chatTab = page.getByRole('tab', { name: 'Chat' });
    await expect(chatTab).toBeFocused();

    // Arrow left should wrap
    await page.keyboard.press('ArrowLeft');
    await expect(documentTab).toBeFocused();
  });

  test('tablet drawer focus management works', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/dashboard/initiatives/test-id');

    const hamburger = page.getByLabel('Open hierarchy menu');

    // Focus and open drawer with Enter
    await hamburger.focus();
    await page.keyboard.press('Enter');

    // Dialog should be open
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Close drawer with ESC
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    // Focus should return to hamburger button
    await expect(hamburger).toBeFocused();
  });

  test('desktop panel collapse keyboard navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/dashboard/initiatives/test-id');

    const collapseButton = page.getByLabel('Collapse left panel');

    // Focus and activate with keyboard
    await collapseButton.focus();
    await page.keyboard.press('Enter');

    // Verify panel collapsed
    const expandButton = page.getByLabel('Expand left panel');
    await expect(expandButton).toBeVisible();

    // Expand with keyboard
    await expandButton.focus();
    await page.keyboard.press('Enter');

    // Verify panel expanded
    await expect(collapseButton).toBeVisible();
  });
});

test.describe('Visual Regression Tests', () => {
  test('mobile 320px layout matches baseline screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/dashboard/initiatives/test-id');

    // Wait for content to load
    await page.waitForSelector('[role="tab"]');

    await expect(page).toHaveScreenshot('mobile-320px-workspace.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('mobile 375px layout matches baseline screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard/initiatives/test-id');

    // Wait for content to load
    await page.waitForSelector('[role="tab"]');

    await expect(page).toHaveScreenshot('mobile-375px-workspace.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('tablet 768px layout matches baseline screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/dashboard/initiatives/test-id');

    // Wait for hamburger menu to load
    await page.waitForSelector('[aria-label="Open hierarchy menu"]');

    await expect(page).toHaveScreenshot('tablet-768px-workspace.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('desktop 1024px layout matches baseline screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/dashboard/initiatives/test-id');

    // Wait for panels to load
    await page.waitForSelector('[data-panel-id="left"]');

    await expect(page).toHaveScreenshot('desktop-1024px-workspace.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('desktop 1440px layout matches baseline screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/dashboard/initiatives/test-id');

    // Wait for panels to load
    await page.waitForSelector('[data-panel-id="left"]');

    await expect(page).toHaveScreenshot('desktop-1440px-workspace.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('mobile tabs layout remains consistent', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard/initiatives/test-id');

    // Wait for tabs to load
    await page.waitForSelector('[role="tab"]');

    // Screenshot default Document tab
    await expect(page).toHaveScreenshot('mobile-document-tab.png', {
      animations: 'disabled',
    });

    // Switch to Chat tab
    await page.click('button[role="tab"]:has-text("Chat")');
    await expect(page).toHaveScreenshot('mobile-chat-tab.png', {
      animations: 'disabled',
    });

    // Switch to Hierarchy tab
    await page.click('button[role="tab"]:has-text("Hierarchy")');
    await expect(page).toHaveScreenshot('mobile-hierarchy-tab.png', {
      animations: 'disabled',
    });
  });

  test('tablet drawer layout remains consistent', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/dashboard/initiatives/test-id');

    // Wait for hamburger menu
    const hamburger = page.getByLabel('Open hierarchy menu');
    await hamburger.waitFor();

    // Screenshot closed state
    await expect(page).toHaveScreenshot('tablet-drawer-closed.png', {
      animations: 'disabled',
    });

    // Open drawer
    await hamburger.click();
    await page.waitForSelector('[role="dialog"]');

    // Screenshot open state
    await expect(page).toHaveScreenshot('tablet-drawer-open.png', {
      animations: 'disabled',
    });
  });

  test('desktop panel collapse layout remains consistent', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/dashboard/initiatives/test-id');

    // Wait for panels
    await page.waitForSelector('[data-panel-id="left"]');

    // Screenshot expanded state
    await expect(page).toHaveScreenshot('desktop-panels-expanded.png', {
      animations: 'disabled',
    });

    // Collapse left panel
    const collapseLeft = page.getByLabel('Collapse left panel');
    await collapseLeft.click();
    await page.waitForTimeout(300); // Wait for collapse animation

    await expect(page).toHaveScreenshot('desktop-left-collapsed.png', {
      animations: 'disabled',
    });

    // Collapse right panel
    const collapseRight = page.getByLabel('Collapse right panel');
    await collapseRight.click();
    await page.waitForTimeout(300); // Wait for collapse animation

    await expect(page).toHaveScreenshot('desktop-both-collapsed.png', {
      animations: 'disabled',
    });
  });
});
