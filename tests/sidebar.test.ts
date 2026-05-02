import { test, expect } from '@playwright/test';

test('sidebar navigation works correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check that the sidebar is visible
  await expect(page.locator('aside')).toBeVisible();
  
  // Check that the Signimus heading is present
  await expect(page.getByText('Signimus')).toBeVisible();
  
  // Check that main navigation sections are present
  await expect(page.getByText('Main')).toBeVisible();
  await expect(page.getByText('Tools')).toBeVisible();
  await expect(page.getByText('Resources')).toBeVisible();
  
  // Check that specific navigation items are present
  await expect(page.getByText('Home')).toBeVisible();
  await expect(page.getByText('Talent Bench')).toBeVisible();
  await expect(page.getByText('Salary Calculator')).toBeVisible();
  await expect(page.getByText('React Guide')).toBeVisible();
  await expect(page.getByText('Help Center')).toBeVisible();
  await expect(page.getByText('Community')).toBeVisible();
  
  // Check that the "Check out our latest tools" section is present
  await expect(page.getByText('Check out our latest tools')).toBeVisible();
});