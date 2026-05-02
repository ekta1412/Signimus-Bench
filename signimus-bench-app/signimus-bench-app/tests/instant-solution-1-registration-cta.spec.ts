import { test, expect } from '@playwright/test';

test.describe('Instant Solution 1 Registration CTA', () => {
  test('User can save results and is redirected to registration', async ({ page, baseURL }) => {
    await page.goto((baseURL || '') + '/tools/instant-solution-1', { timeout: 120000 });
    await page.fill('textarea', 'React, Node, Python');
    await page.waitForTimeout(2000);
    await page.click('button:has-text("React")');
    await page.waitForTimeout(1000);
    await Promise.all([
      page.waitForNavigation({ url: /\/register$/, timeout: 120000 }),
      page.click('button:has-text("Save Your Results & Register")'),
    ]);
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/register$/);
    await expect(page.locator('h1')).toHaveText(/Register/);
  });
});
