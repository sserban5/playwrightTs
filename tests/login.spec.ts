import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

/*
Login tests with in file / in test.describe hooks
*/

test.describe('Login Tests, with valid credentials', () => {

  test('Should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('demoUser');

    const result = await loginPage.waitForErrorBarOrHomeUrl();
    expect(result.condition).toBe('homeUrl');
  });

  test('Should login successfully with valid credentials, with params and parents', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginWithParentAndParams('demoUser');

    const result = await loginPage.waitForErrorBarOrHomeUrl();
    expect(result.condition).toBe('homeUrl');

    await loginPage.checkButtonVisibility();
  });

  //should appear only for this test.describe
  test.beforeAll(async () => {
    const timestampStart = new Date().toISOString();
    console.log(`[from beforeAll, in test.describe hook] Tests started at: ${timestampStart}`);
  });

  test.afterAll(async () => {
    const timestampEnd = new Date().toISOString();
    console.log(`[from afterAll, in test.describe hook] Tests ended at: ${timestampEnd}`);
  });

  test.beforeEach(async ({ page }, testInfo,) => {
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Europe/Bucharest' });
    console.log(`[from beforeEach, in test.describe hook] Test '${testInfo.title}' started at ${timestamp}`);
  });

  test.afterEach(async ({ }, testInfo) => {
    const timestamp = new Date().toLocaleString('en-Gb', { timeZone: 'Europe/Bucharest' });
    console.log(`[from afterEach, in test.describe hook] Test '${testInfo.title}' ended at ${timestamp}`);
  });

});

test.beforeAll(async () => {
  const timestampStart = new Date().toISOString();
  console.log(`[from beforeAll, in file hook] Execution started at: ${timestampStart}`);
});

test.describe('Login Tests, with invalid credentials', () => {
  test('Should show error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('wrongUser');

    const result = await loginPage.waitForErrorBarOrHomeUrl();
    expect(result.condition).toBe('errorBarVisible');
  });

  test.beforeEach(async ({ }, testInfo) => {
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Europe/Bucharest' });
    console.log(`[from beforeEach, in test.describe2 hook] Test '${testInfo.title}' started at ${timestamp}`);
  });
});