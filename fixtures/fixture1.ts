import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

// Export types for use in test file
export type TestOptions = {
  role: string;
  checkIf: string;
};

export type TestFixtures = {
  loginPage: LoginPage;
  homePageCheck: { condition: string; value: boolean };
};

export const test = base.extend<TestFixtures & TestOptions>({
  role: ['demoUser', { option: true }],
  checkIf: ['', { option: true }],
  
  loginPage: async ({ page, role }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(role);
    await use(loginPage);
  },
  
  homePageCheck: async ({ page, checkIf }, use) => {
    const loginPage = new LoginPage(page);
    const result = await loginPage.waitForErrorBarOrHomeUrl();
    await use(result);
    expect(result.condition).toBe(checkIf);
  }

});