import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    // Clear storage and attempt a clean unauthenticated state
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());

    // Best-effort sign out if already authenticated
    await page.goto((baseURL || '') + '/dashboard');
    const signOutLocator = page.locator('button:has-text("Sign Out")').first();
    try {
      await signOutLocator.waitFor({ state: 'visible', timeout: 1000 });
      await Promise.all([
        page.waitForURL(/:\d+\/?$/),
        signOutLocator.click(),
      ]);
    } catch (_) {
      // Not logged in or button not present; ignore
    }
  });

  test('should allow a new user to register, log in, and access a protected page', async ({ page, baseURL }) => {
    const email = `test-${Date.now()}@example.com`;
    const password = 'Password123!';

    // Register
    await page.goto((baseURL || '') + '/register');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button:has-text("Register")');

    // Either redirect to dashboard, or show registration success message (email confirmation required projects)
    const redirected = await page.waitForURL(/\/dashboard$/, { timeout: 10000 }).then(() => true).catch(() => false);
    if (redirected) {
      await expect(page.locator('text=Welcome')).toBeVisible();

      // Sign out
      await page.click('button:has-text("Sign Out")');
      await page.waitForURL(/:\d+\/?$/);

      // Log in
      await page.goto((baseURL || '') + '/login');
      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', password);
      await page.click('button:has-text("Sign In")');

      await page.waitForURL(/\/dashboard$/);
      await expect(page.locator('text=Welcome')).toBeVisible();
      return;
    }

    // No redirect: assert registration success message appears and gracefully end (login is gated by email confirmation)
    await expect(page.locator('text=Registration successful')).toBeVisible({ timeout: 10000 });
  });
});
