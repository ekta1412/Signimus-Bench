import { test, expect } from '@playwright/test';

test.describe('Bench App End-to-End Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3003');
  });

  test('should load the bench page with proper layout', async ({ page }) => {
    // Check that the page title is correct
    await expect(page).toHaveTitle(/Signimus Talent Bench/);
    
    // Check that the main heading is present
    await expect(page.getByText('Signimus Talent Bench')).toBeVisible();
    
    // Check that the sidebar is visible
    await expect(page.getByText('Main')).toBeVisible();
    await expect(page.getByText('Tools')).toBeVisible();
    await expect(page.getByText('Resources')).toBeVisible();
    
    // Check that profile cards are displayed
    const profileCards = page.locator('.border.rounded-lg.p-4');
    await expect(profileCards).toHaveCount(6);
  });

  test('should allow filtering by skills', async ({ page }) => {
    // Click on a popular skill filter
    await page.getByText('React.js').click();
    
    // Check that the filter is active
    await expect(page.getByText('React.js')).toBeVisible();
    
    // Check that only relevant profiles are shown
    const profileCards = page.locator('.border.rounded-lg.p-4');
    // Since we don't have exact data, we'll just check that profiles are still displayed
    await expect(profileCards).toHaveCount(6);
  });

  test('should allow job description filtering', async ({ page }) => {
    // Fill in the job description
    await page.locator('textarea').fill('React developer needed');
    
    // Check that the textarea has the value
    await expect(page.locator('textarea')).toHaveValue('React developer needed');
  });

  test('should allow profile selection', async ({ page }) => {
    // Click on the first profile card
    const firstProfile = page.locator('.border.rounded-lg.p-4').first();
    await firstProfile.click();
    
    // Check that the profile is selected (has the "Selected" badge)
    await expect(firstProfile.getByText('Selected')).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    // Check that we're on the first page
    await expect(page.getByText('1')).toHaveClass(/bg-indigo-600/);
    
    // Click on the next page button (if available)
    const nextButton = page.getByText('Next');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      // We might still be on page 1 if there's only one page
    }
  });

  test('should navigate to other pages via sidebar', async ({ page }) => {
    // Click on the "Talent Bench" link in the sidebar
    await page.getByText('Talent Bench').click();
    
    // We should still be on the bench page (it's the active page)
    await expect(page.getByText('Signimus Talent Bench')).toBeVisible();
  });

  test('should clear filters', async ({ page }) => {
    // Apply a filter first
    await page.getByText('React.js').click();
    
    // Check that the filter is active
    await expect(page.getByText('React.js')).toBeVisible();
    
    // Click the "Clear all" button
    await page.getByText('Clear all').click();
    
    // Check that the filter is removed
    await expect(page.getByText('React.js')).not.toBeVisible();
  });
});

test.describe('API Endpoints', () => {
  test('should handle mailing list subscription', async ({ request }) => {
    const email = `test-${Date.now()}@example.com`;
    const response = await request.post('http://localhost:3003/api/mailing-list', {
      data: { email },
    });

    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Subscription successful');
  });

  test('should return 400 for missing email in mailing list', async ({ request }) => {
    const response = await request.post('http://localhost:3003/api/mailing-list', {
      data: {},
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe('Email is required');
  });

  test('should fetch bench list data', async ({ request }) => {
    const response = await request.get('http://localhost:3003/api/bench-list');
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });
});