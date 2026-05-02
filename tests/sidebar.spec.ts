import { test, expect } from '@playwright/test';

test.describe('Sidebar Visibility', () => {
  const pagesToTest = [
    '/',
    '/blog',
    '/tools/mailing-list',
    '/tools/job-posting',
    '/articles/for-loop-vs-foreach', // Test a pSEO page
  ];

  for (const pagePath of pagesToTest) {
    test(`Sidebar should be visible on ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath);
      // Updated selector for the white sidebar
      const sidebar = page.locator('aside.w-64.bg-white');
      await expect(sidebar).toBeVisible();
    });
  }
});