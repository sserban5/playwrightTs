import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { PetsPage } from '../pages/petsPage';
import { assert } from 'console';




test.describe('Login Tests', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const petsPage = new PetsPage(page);
    // Login as 'user'
    await loginPage.goto();
    await loginPage.login('demoUser');
    const result = await loginPage.waitForErrorBarOrHomeUrl();
    expect(result.condition).toBe('homeUrl');
    await loginPage.checkButtonVisibility();

    await petsPage.petsTableCheck();
  });

  test('should login successfully with valid credentials, with params and parents', async ({ page }) => {
    const loginPage = new LoginPage(page);
    // Login as 'user'
    await loginPage.goto();
    await loginPage.loginWithParentAndParams('demoUser');
    const result = await loginPage.waitForErrorBarOrHomeUrl();
    expect(result.condition).toBe('homeUrl');
    await loginPage.checkButtonVisibility();
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