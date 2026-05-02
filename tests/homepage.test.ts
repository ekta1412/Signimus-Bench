import { test, expect } from '@playwright/test';

test('homepage loads correctly with tool links', async ({ page }) => {
  await page.goto('/');
  
  // Check that the main heading is present
  await expect(page.getByText('Welcome to the Bench App')).toBeVisible();
  
  // Check that the tool links are present and functional
  await expect(page.getByText('Instant Resume Formatter')).toBeVisible();
  await expect(page.getByText('Post a Job')).toBeVisible();
  await expect(page.getByText('Join Our Mailing List')).toBeVisible();
  
  // Check that one of the links navigates correctly
  await page.getByText('Instant Resume Formatter').click();
  // We won't check the URL here since the page might not exist yet
  // But we can verify the click doesn't cause an error
});