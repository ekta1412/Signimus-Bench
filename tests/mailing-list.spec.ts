import { test, expect } from '@playwright/test';

test.describe('Mailing List API', () => {
  test('should subscribe a new email successfully', async ({ request }) => {
    const email = `test-${Date.now()}@example.com`;
    const response = await request.post('/api/mailing-list', {
      data: { email },
    });

    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Subscription successful');
    expect(responseBody.data[0].email).toBe(email);
  });

  test('should return 400 if email is missing', async ({ request }) => {
    const response = await request.post('/api/mailing-list', {
      data: {},
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.error).toBe('Email is required');
  });
});
