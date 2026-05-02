import { test, expect } from '@playwright/test';

test('Job Post Reach Estimator functionality', async ({ page }) => {
  // Navigate to the Job Post Reach Estimator page
  await page.goto('/tools/job-reach-estimator');

  // Fill in the form fields
  await page.selectOption('#industry', 'Technology');
  await page.fill('#role', 'Software Engineer');
  await page.selectOption('#experienceLevel', 'Senior');

  // Submit the form
  await page.click('button[type="submit"]');

  // Expect the estimated reach to be displayed
  const estimatedReachSection = page.locator('div.bg-green-100');
  await expect(estimatedReachSection).toBeVisible();
  await expect(estimatedReachSection).toContainText('Estimated Reach:');
  await expect(estimatedReachSection).toContainText('10,000 candidates'); // Based on dummy logic

  // Test another scenario
  await page.selectOption('#industry', 'Healthcare');
  await page.fill('#role', 'Nurse');
  await page.selectOption('#experienceLevel', 'Mid');
  await page.click('button[type="submit"]');
  await expect(estimatedReachSection).toContainText('7,000 candidates');

  // Test a third scenario
  await page.selectOption('#industry', 'Marketing');
  await page.fill('#role', 'Marketing Manager');
  await page.selectOption('#experienceLevel', 'Junior');
  await page.click('button[type="submit"]');
  await expect(estimatedReachSection).toContainText('5,000 candidates');
});
