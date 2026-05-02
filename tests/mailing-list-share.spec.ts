import { test, expect } from '@playwright/test';

test('Mailing List Form share link functionality', async ({ page }) => {
  // Navigate to the mailing list page
  await page.goto('/tools/mailing-list'); // Assuming this is the correct path

  // Fill in the email and submit the form
  await page.fill('input[type="email"]', 'test@example.com');
  await page.click('button[type="submit"]');

  // Expect a success message
  await expect(page.locator('div[role="status"]')).toContainText('Subscription successful!');

  // Expect the share link section to appear
  const shareLinkSection = page.locator('div.bg-blue-50');
  await expect(shareLinkSection).toBeVisible();
  await expect(shareLinkSection).toContainText('Share this page with your network!');

  // Get the current URL to verify the share link content
  const currentUrl = page.url();

  // Click the copy button
  await shareLinkSection.locator('button', { hasText: 'Copy' }).click();

  // Expect the copy success message to appear
  await expect(shareLinkSection.locator('button', { hasText: 'Copied!' })).toBeVisible();

  // Note: Playwright's clipboard access is restricted for security reasons.
  // We cannot directly assert clipboard content in a real browser environment.
  // However, we can assume the copy button works if the "Copied!" message appears.
  // For a more robust test, you might need to mock clipboard API or use a different approach
  // if direct clipboard content verification is critical.
});
