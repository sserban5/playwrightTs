import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { PetsPage } from '../pages/petsPage';
import { TestPage } from '../pages/testPage';
import { assert } from 'console';


test.describe('Login Tests', () => {

  test('Go through the test page', async ({ page }) => {
      const testPage = new TestPage(page);
      await testPage.goto();
      await testPage.alignmentTesting();
      await testPage.dragDropTesting();
      await testPage.alertInput('Wes');
  });

  test('should login successfully with valid credentials, check the top right menu buttons, click on "Pets", then set the paginator to max, then check the table', async ({ page }) => {
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

  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const petsPage = new PetsPage(page);
    // Login as 'user'
    await loginPage.goto();
    await loginPage.login('demoUser');
    const result = await loginPage.waitForErrorBarOrHomeUrl();
    expect(result.condition).toBe('homeUrl');
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