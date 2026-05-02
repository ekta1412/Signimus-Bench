import { test, expect } from '@playwright/test';

test.describe('Instant Solution 1 Button Responsiveness & Interaction', () => {
  test('All skill buttons are visible and responsive', async ({ page, baseURL }) => {
    await page.goto((baseURL || '') + '/tools/instant-solution-1');
    // Simulate JD input to generate skill buttons
    await page.fill('textarea', 'React, Node, Python, AWS, Docker, Kubernetes');
    await page.waitForTimeout(500); // Wait for skills to be extracted
    const skillButtons = await page.locator('button:has-text("React")').count();
    expect(skillButtons).toBeGreaterThan(0);
    // Check responsive classes by resizing viewport
    await page.setViewportSize({ width: 375, height: 812 }); // Mobile
    await expect(page.locator('button').first()).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 800 }); // Desktop
    await expect(page.locator('button').first()).toBeVisible();
  });

  test('Copy Selected button enables/disables correctly', async ({ page, baseURL }) => {
    await page.goto((baseURL || '') + '/tools/instant-solution-1');
    await page.fill('textarea', 'React, Node');
    await page.waitForTimeout(500);
    // Initially disabled
    await expect(page.locator('button:has-text("Copy Selected")')).toBeDisabled();
    // Select a skill
    await page.click('button:has-text("React")');
    await expect(page.locator('button:has-text("Copy Selected")')).toBeEnabled();
  });

  test('Open in Bench link works', async ({ page, baseURL }) => {
    await page.goto((baseURL || '') + '/tools/instant-solution-1');
    await page.fill('textarea', 'React, Node');
    await page.waitForTimeout(500);
    await page.click('button:has-text("React")');
    await Promise.all([
      page.waitForNavigation({ url: /\/bench(\/|\?|$)/, timeout: 10000 }),
      page.click('a:has-text("Open in Bench")'),
    ]);
    await expect(page).toHaveURL(/\/bench/);
  });

  test('Save Your Results button is visible and clickable', async ({ page, baseURL }) => {
    await page.goto((baseURL || '') + '/tools/instant-solution-1');
    await expect(page.locator('button:has-text("Save Your Results")')).toBeVisible();
    await page.click('button:has-text("Save Your Results")');
    // Add further assertions if save logic is implemented
  });
});
