import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { PetsPage } from '../pages/petsPage';


test.describe('Pets page table Tests', () => {

  test('Should login successfully with valid credentials, check the top right menu buttons, click on "Pets", then set the paginator to max, then check the table', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const petsPage = new PetsPage(page);

    await loginPage.goto();
    await loginPage.login('demoUser');
    const result = await loginPage.waitForErrorBarOrHomeUrl();
    expect(result.condition).toBe('homeUrl');
    await loginPage.checkButtonVisibility();

    await petsPage.petsTableCheck();
  });

});