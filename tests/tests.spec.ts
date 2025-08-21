import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { PetsPage } from '../pages/petsPage';
import { TestPage } from '../pages/testPage';
import { assert } from 'console';


test.describe('Pets page Tests', () => {

  test('Go through the test page', async ({ page }) => {
      const testPage = new TestPage(page);
      await testPage.goto();
      await testPage.alignmentTesting();
      await testPage.dragDropTesting();
      await testPage.alertInput('Wes');
  });
});