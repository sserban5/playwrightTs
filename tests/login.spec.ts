import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { assert } from 'console';




test.describe('Login Tests', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    // Login as 'user'
    await loginPage.goto();
    await loginPage.login('demoUser');
    const result = await loginPage.waitForErrorBarOrHomeUrl();
    expect(result.condition).toBe('homeUrl');
    
  });

  test('Should show error for invalid credentials', async ({ page }) => {
   const loginPage = new LoginPage(page);
    // Login as 'user'
    await loginPage.goto();
    await loginPage.login('wrongUser');
    
    const result = await loginPage.waitForErrorBarOrHomeUrl();
    expect(result.condition).toBe('errorBarVisible');

  });
});